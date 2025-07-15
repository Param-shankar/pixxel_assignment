import pandas as pd
import os
from datetime import datetime
import csv
import numpy as np
import time
from utils.pathutils import get_data_path

FOLDER_PATH = get_data_path()

# folder path to master file
FOLDER_PATH_Master_File = os.path.join(FOLDER_PATH, "Master")
master_file_path = os.path.join(FOLDER_PATH_Master_File, "master.csv")


# function to handle overlap data of file with master file
def merge_with_masterfile(filepath):
    # loding the dropped file dataframe
    DataFrame = pd.read_csv(filepath)


    if not os.path.exists(master_file_path):
        # Ensure the directory exists before creating the file
        if not os.path.exists(FOLDER_PATH_Master_File):
            os.makedirs(FOLDER_PATH_Master_File)
        # Create an empty master.csv file with headers
        with open(master_file_path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["Date", "Time", "Q0", "Q1", "Q2", "Q3", "Predicted"])
        f.close()
    else:
        pass

    # loding the master file dataframe
    MasterFile_dataframe = pd.read_csv(master_file_path)

    # Check if master file is empty (only has headers)
    is_master_empty = len(MasterFile_dataframe) == 0

    # DataFrame
    # final row list to add for newly added day
    new_row_list = []
    # Counter for updates to matching rows becz 1/7 of data is actual (while file empty)
    row_count = 0
    # Counter for updates to matching rows becz 1/7 of data is actual
    update_count = 0  

    for idx, row in DataFrame.iterrows():
        update_row = []

        try:
            dt = pd.to_datetime(row["Timestamp"]).to_pydatetime()
            extracted_date = dt.date().isoformat()
            extracted_time = dt.time().isoformat()[0:5]

            # print("the data is givne is ",extracted_date, extracted_time)
            Q0 = row.get("Q0", "")
            Q1 = row.get("Q1", "")
            Q2 = row.get("Q2", "")
            Q3 = row.get("Q3", "")

            # Determine predicted value based on master file status
            if is_master_empty:
                # If master is empty: first 24 values = False, rest = True
                predicted_value = False if row_count < 24 else True
            else:
                # If master is not empty: all new rows = False
                predicted_value = True

            # finding the matching date and time from the dropped csv file and getting the index
            index_to_update = MasterFile_dataframe.loc[
                (MasterFile_dataframe["Date"] == extracted_date)
                & (MasterFile_dataframe["Time"] == extracted_time)
            ].index

            if not index_to_update.empty:
                # For matching rows: first 24 updates False, then True
                predicted_value = False if update_count < 24 else True
                update_count += 1
                update_row.extend(
                    [extracted_date, extracted_time, Q0, Q1, Q2, Q3, predicted_value]
                )
                MasterFile_dataframe.loc[index_to_update, :] = update_row
            else:
                # For new rows: always False
                predicted_value = False
                new_row_dict = {
                    "Date": extracted_date,
                    "Time": extracted_time,
                    "Q0": Q0,
                    "Q1": Q1,
                    "Q2": Q2,
                    "Q3": Q3,
                    "Predicted": predicted_value,
                }
                new_row_list.append(new_row_dict)
            row_count += 1
        except Exception as e:
            print(f"Error processing row {idx}: {e}")
            row_count += 1

    # updated dataframe withe new day data
    new_df = pd.DataFrame(new_row_list)

    # mergering the new datafram wiht the master dataframe
    MasterFile_dataframe = pd.concat([MasterFile_dataframe, new_df], ignore_index=True)

    # update the master file with the new dataframe
    MasterFile_dataframe.to_csv(master_file_path, index=False)
