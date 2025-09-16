from flask import Flask
import mysql.connector
import os
from dotenv import load_dotenv
import json

app = Flask(__name__)

# loading to read .env info
load_dotenv()

# connect to db
def connect():
    cnx = mysql.connector.connect(
        host = 'localhost',
        port = 3306,
        user = 'root',
        password = os.getenv('PASSWORD'),
        database = 'classwhisper'
    )
    cursor = cnx.cursor()
    return (cnx, cursor)

# ensure backend is running
@app.route("/")
def hello_world():
    return "<p>hi</p>"

################################################################################
#
#                           Admin Manipulations
#
################################################################################

# getting all of the admins
@app.route("/getAllAdmins", methods=['GET'])
def getAllAdmins():
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    query = "SELECT * FROM Admins;"
    cursor.execute(query)
    data = cursor.fetchall()

    # close db
    cursor.close()
    cnx.close()

    print(data)

    return json.dumps(data)

# inserting a new admin 
@app.route("/addNewAdmin/<name>/<email>", methods=['POST', 'GET'])
def addAdmin(name, email):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("adding: " + name + ", " + email)

    query = "INSERT INTO Admins (name, email) VALUES (%s, %s);"
    cursor.execute(query, (name, email))
    cnx.commit()
    msg = "Successfully added a person!"

    # close db
    cursor.close()
    cnx.close()

    return msg

# getting all of the admins
@app.route("/editAdmin/<adminID>/<name>/<email>/<password>", methods=['GET', 'POST', 'PUT'])
def editAdmin(adminID, name, email, password):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    # once frontend is done
    # info = request.get_json(force=True)
    # name = info['name']
    # email = info['email']
    # password = info['password']

    query = "UPDATE Admins SET name = %s, email = %s, password =%s WHERE adminID = %s;"
    cursor.execute(query, (name, email, password, adminID))
    cnx.commit()

    # close db
    cursor.close()
    cnx.close()

    msg = "updated"

    return msg

# delete admin
@app.route("/deleteAdmin/<id>", methods=['DELETE', 'GET'])
def deleteAdmin(id):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0] 

    cursor.execute('DELETE FROM Admins WHERE adminID =  %s', (id,))
    cnx.commit()
    msg = "deleted"

    # closes DB connections
    cursor.close()
    cnx.close()

    return msg

if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, port=5000)