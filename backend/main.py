from flask import Flask, send_from_directory, request, jsonify
import os
from routes.fileupload import fileupload_api_endpoint
from routes.CustomData import CustomData_api_endpoint

static_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend', 'dist')
app = Flask(__name__, static_folder=static_folder, static_url_path="/")

# default route for serving the react(intdex file)
@app.route("/", methods=["POST", "GET"])
def serve_index():
    return send_from_directory(app.static_folder, "index.html")


# ... APIs ......
app.register_blueprint(fileupload_api_endpoint)
app.register_blueprint(CustomData_api_endpoint)


if __name__ == "__main__":
    app.run(debug=True)
