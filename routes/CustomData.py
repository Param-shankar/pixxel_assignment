from flask import Flask, send_from_directory, request, jsonify, Blueprint
import os
from werkzeug.utils import secure_filename
import pandas as pd
import numpy as np
from scipy.spatial.transform import Rotation as R

#create a blueprint for the CustomData API
CustomData_api_endpoint = Blueprint("CustomData_api_endpoint_blueprint", __name__)

# setting up the folder path of the user local storage
FOLDER_PATH = (
    os.path.join(os.path.expanduser("~"), "Documents", "Satellite_VISUALiZER") + "/"
)

# setting up the folder path of the master file
FOLDER_PATH_Master_File = os.path.join(FOLDER_PATH, "Master")
master_file_path = os.path.join(FOLDER_PATH_Master_File, "master.csv")


# API endpoint for custom data viewer
@CustomData_api_endpoint.route("/customeviwer", methods=["POST"])
def Data_for_custom_Dates():
    # checking if the date exists or not
    data = request.get_json()
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    
    # Check if the master file exists before proceeding
    if not os.path.exists(master_file_path):
        return (
            jsonify(
                {
                    "error": "Master file does not exist.",
                    "data": "Master file does not exist.",
                }
            ),
            400,
        )
    # loding the dataframe in of the master file
    Dataframe = pd.read_csv(master_file_path)

    # Check if start_date and end_date exist in the "Date" column of the Dataframe
    start_exists = start_date in Dataframe["Date"].values
    end_exists = end_date in Dataframe["Date"].values
    
    # If both start and end dates exist, get all rows between their indices (inclusive)
    if start_exists or end_exists:
        # Find the first occurrence index of start_date
        start_idx = Dataframe[Dataframe["Date"] == start_date].index[0]
        # Find the last occurrence index of end_date
        end_idx = Dataframe[Dataframe["Date"] == end_date].index[-1]
        # Slice the DataFrame to get all rows between start_idx and end_idx (inclusive)
        result_df = Dataframe.iloc[start_idx : end_idx + 1]
        # Convert the result to a list of lists for JSON serialization
        result_data = result_df.values.tolist()

        # calculating the angle
        # Fixed original unit vectors for X, Y, Z
        response_arr = []
        for row in result_data:
            try:
                # Extract quaternion components from the row
                q = np.array([row[2], row[3], row[4], row[5]])  # [qx, qy, qz, qw]
                if np.linalg.norm(q) != 1:  # Normalize if needed
                    q /= np.linalg.norm(q)
            except (IndexError, ValueError):
                print("Invalid quaternion, skipping:", row)
                continue

            # Convert quaternion to rotation matrix and then to Euler angles
            # Using scipy's Rotation class to convert quaternion to Euler angles
            rotation = R.from_quat(q)
            euler_angles = rotation.as_euler(
                "xyz", degrees=True
            )  # [roll, pitch, yaw] in degrees

            # Build response: [Predicited, date, time, [roll, pitch, yaw]]
            sub_arr = [row[6], row[0], row[1], euler_angles.tolist()]
            response_arr.append(sub_arr)
            
        return (jsonify(
            {"data": response_arr},
            200,
        ))
    else:
        print("they don't exist")
        return (
            jsonify(
                {
                    "data": f"no Data found for the given date (data ranges from {Dataframe['Date'].iloc[0]} to {Dataframe['Date'].iloc[-1]})"
                }
            ),
            400,
        )
