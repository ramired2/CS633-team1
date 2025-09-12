from flask import Flask

app = Flask(__name__)

# ensure backend is running
@app.route("/")
def hello_world():
    return "<p>hi</p>"

if __name__ == "__main__":
    app.run(debug=True, port=5000)