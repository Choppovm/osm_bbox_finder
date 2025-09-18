from flask import *

# Define web app
app = Flask(__name__)

@app.route("/") # Main page
def index():
    return render_template("index.html")

# Start local server
if __name__ == "__main__":
    app.run(debug=True, port=5000)
