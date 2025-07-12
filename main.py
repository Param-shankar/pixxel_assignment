from flask import Flask, send_from_directory, request, jsonify
import os
from routes.fileupload import fileupload_blueprint

app = Flask(__name__, static_folder="frontend/dist", static_url_path="")

# setting up the folder path of the user local storage
FOLDER_PATH = (
    os.path.join(os.path.expanduser("~"), "Documents", "Satellite_VISUALiZER") + "/"
)


# default route for serving the react(intdex file)
@app.route("/", methods=["POST", "GET"])
def serve_index():
    return send_from_directory(app.static_folder, "index.html")


# ... APIs ......

app.register_blueprint(fileupload_blueprint);


if __name__ == "__main__":
    app.run(debug=True)
