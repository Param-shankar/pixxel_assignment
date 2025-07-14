import pandas as pd
import os
from datetime import datetime
import csv
from scipy.spatial.transform import Rotation as R
import numpy as np

# folder path for the
FOLDER_PATH = (
    os.path.join(os.path.expanduser("~"), "Documents", "Satellite_VISUALiZER") + "/"
)


def formatting_csv(filepath):

    # Fixed original unit vectors for X, Y, Z
    fixed_vectors = {
        "X": np.array([1, 0, 0]),
        "Y": np.array([0, 1, 0]),
        "Z": np.array([0, 0, 1]),
    }

    # gloabl variable to store the prev queataion vector
    prev_rotated_vectors = {"X": None, "Y": None, "Z": None}

    with open(filepath, "r", newline="") as csvfile:
        csv_reader = csv.reader(csvfile)

        # reponse format [date,time, [x, y, z](degree)]
        reponse_arr = []
        for row in csv_reader:
            # subarray of the response array
            reponse_subarray_arr= []

            try:
                q1 = float(row[0])
                q2 = float(row[1])
                q3 = float(row[2])
                q4 = float(row[3])
                date = row[4]
                # generating the quant vector
                q = np.array([q1, q2, q3,q4])
            except (IndexError, ValueError):
                print("Row does not contain valid quaternion values, skipping:", row)
                continue

            # slicing the utc to get date and tiem
            date_part, time_part_with_z = date.split("T")
            time_part = time_part_with_z.rstrip("Z")  # Remove the 'Z'
            reponse_subarray_arr.append(date_part)
            reponse_subarray_arr.append(time_part)

            # scipy_quat = np.array([q1, q2, q3, q4])
            # current_rotation = R.from_quat(scipy_quat)

            if np.linalg.norm(q) != 1:  # Normalize if needed
                q /= np.linalg.norm(q)

            # Convert quaternion to rotation matrix and then to Euler angles
            # Using scipy's Rotation class to convert quaternion to Euler angles
            rotation = R.from_quat(q)
            euler_angles = rotation.as_euler(
                "xyz", degrees=True
            )  # [roll, pitch, yaw] in degrees

            # calculating the new rotated vector and using the dot product i am finding the angle by which the vector is rotated
            angle_arr_reponse = euler_angles.tolist()
            # for axis, base_vector in fixed_vectors.items():
            #     rotated_vector = current_rotation.apply(base_vector)

            #     # Check if previous vector exists to compute angle
            #     if prev_rotated_vectors[axis] is not None:
            #         prev_vector = prev_rotated_vectors[axis]
            #         dot = np.dot(rotated_vector, prev_vector)
            #         norms = np.linalg.norm(rotated_vector) * np.linalg.norm(prev_vector)
            #         angle_rad = np.arccos(np.clip(dot / norms, -1.0, 1.0))
            #         angle_deg = np.degrees(angle_rad)

            #         # print(f"{axis}' rotated angle since last step: {angle_deg:.2f}°")
            #         angle_arr_reponse.append(float(angle_deg));

            #     else:
            #         print(f"{axis}' first rotation, no previous vector.")
            #         angle_arr_reponse.append(0)
            #     # Update previous vector
            #     prev_rotated_vectors[axis] = rotated_vector
            #     # print("the angle arr", angle_arr_reponse)

            reponse_subarray_arr.append(angle_arr_reponse)
            reponse_arr.append(reponse_subarray_arr)
            angle_arr_reponse= []
            reponse_subarray_arr=[]
    csvfile.close()
    return reponse_arr


def file_rename():
    current_datetime = datetime.now()
    # File_name = "";
    Month_arr= ["","JAN","FEB", "MAR", "APR","MAY","JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"]
    Day= ["MON", "TUE", "WED", "THRUS", "FRI", "SAT", "SUN"]
    # print("the day ",current_datetime.weekday())
    # format of the file name ex(JUL_10_2025)
    File_name = (Month_arr[current_datetime.month])+ "_"+ str(current_datetime.day)+ "_"+str(Day[current_datetime.weekday()]) +"_"+str(current_datetime.year)

    return File_name

print(file_rename())
