import os

def get_data_path():
    data_path = os.environ.get("DATA_PATH")
    if data_path:
        return os.path.abspath(os.path.expanduser(data_path)) + os.sep
    # Detect Docker by presence of /.dockerenv
    if os.path.exists("/.dockerenv"):
        return "/data/"
    # Default: ~/Documents/Satellite_VISUALLZER/
    return os.path.join(os.path.expanduser("~"), "Documents", "Satellite_VISUALLZER") + os.sep 