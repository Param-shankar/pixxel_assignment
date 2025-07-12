import pandas as pd
import os
from datetime import datetime
import csv
import numpy as np

FOLDER_PATH = (
    os.path.join(os.path.expanduser("~"), "Documents", "Satellite_VISUALiZER") + "/"
)

#folder path to master file
FOLDER_PATH_Master_File= os.path.join(FOLDER_PATH, "Master", "Master.csv");

print(FOLDER_PATH_Master_File);
if os.path.exists(FOLDER_PATH_Master_File):
    print("it does ")
else:
    os.makedirs(FOLDER_PATH_Master_File)
    print("the folder has been created...")


# function to handle overlap data of file with master file
def merge_with_masterfile(filepath):
    DataFrame = pd.read_csv(filepath);
    #opening the localsaved csv file
    with open(FOLDER_PATH_Master_File,'w', newline="") as Master_file:
        master_csv_writer = csv.writer(Master_file)
        master_csv_writer.writerow(["Date", "Time", "q1" ,"q2","q3","q4", "Predicted"])


merge_with_masterfile(os.path.join(FOLDER_PATH, ""))

            



