from flask import Flask, send_from_directory, request, jsonify, Blueprint
import os
from utils.handlecsv import formatting_csv, file_rename
from werkzeug.utils import secure_filename
from utils.mergermaster import merge_with_masterfile

fileupload_api_endpoint = Blueprint("fileupload", __name__)

# setting up the folder path of the user local storage
FOLDER_PATH = (
    os.path.join(os.path.expanduser("~"), "Documents", "Satellite_VISUALiZER") + "/"
)


@fileupload_api_endpoint.route("/fileUpload", methods=["POST"])
def file_handling():
    # checking if the file exists or not
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    # extracting the file from request
    file = request.files["file"]
    print(file)

    # renaming the file for better accessaiblity
    new_filename = file_rename()
    safe_filename = secure_filename(new_filename + ".csv")  # Ensure .csv extension

    # file location according to folder structure
    # file name format ex (JUL_10_2025)

    # filename: MONTH_DAY_DAYNAME_YEAR
    filename_parts = new_filename.split('_')

    month = filename_parts[0]  # JUL
    day = filename_parts[1]    # 10
    year = filename_parts[3]   # 2025

    # Create folder structure: YEAR/MONTH/DAY/
    folder_path_specific_folder = os.path.join(
        FOLDER_PATH,
        year,
        month,
        day
    )

    # Create file path: YEAR/MONTH/DAY/filename.csv
    file_path = os.path.join(
        folder_path_specific_folder,
        safe_filename
    )

    # Ensure the folder exists
    if not os.path.exists(folder_path_specific_folder):
        os.makedirs(folder_path_specific_folder)

    # saving file in the local file system
    file.save(file_path)

    # reformatting the file using the function in the utlis folder
    formtted_data = formatting_csv(file_path)
    
    #mergering the given csv to the master csv for custom viewer
    merge_with_masterfile(file_path)

    return (
        jsonify(
            {
                "message": "File uploaded successfully",
                "filename": new_filename,
                "angle_time_date_array": formtted_data,
            }
        ),
        200,
    )
