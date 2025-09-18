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

# get admin by id
@app.route("/getAdmin/<id>", methods=['GET'])
def getAdmin(id):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    query = "SELECT * FROM Admins WHERE adminID = %s;"
    cursor.execute(query, (id,))
    data = cursor.fetchall()

    # close db
    cursor.close()
    cnx.close()

    print(data)

    return json.dumps(data[0])

# inserting a new admin 
@app.route("/addNewAdmin/<fn>/<ln>/<email>", methods=['POST', 'GET'])
def addAdmin(fn, ln, email):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("adding: " + fn + " " + ln + ", " + email)

    query = "INSERT INTO Admins (fn, ln, email) VALUES (%s, %s, %s);"
    cursor.execute(query, (fn, ln, email))
    cnx.commit()
    msg = "Successfully added a person!"

    # close db
    cursor.close()
    cnx.close()

    return msg

# edit admin info
@app.route("/editAdmin/<adminID>/<fn>/<ln>/<email>/<password>", methods=['GET', 'POST', 'PUT'])
def editAdmin(adminID, fn, ln, email, password):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    # once frontend is done
    # info = request.get_json(force=True)
    # name = info['name']
    # email = info['email']
    # password = info['password']

    query = "UPDATE Admins SET fn = %s, ln = %s, email = %s, password =%s \
                WHERE adminID = %s;"
    cursor.execute(query, (fn, ln, email, password, adminID))
    cnx.commit()

    # close db
    cursor.close()
    cnx.close()

    msg = "updated"

    return getAdmin(adminID)

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

################################################################################
#
#                           Details Manipulations
#
################################################################################

# 
@app.route("/getDetails", methods=['GET'])
def getDetails():
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    query = "SELECT Details.detailID, Details.content, CONCAT(Admins.fn, ' ', Admins.ln) AS name, Admins.email FROM Details INNER JOIN Admins ON Details.adminID = Admins.adminID;"
    cursor.execute(query)
    data = cursor.fetchall()

    # close db
    cursor.close()
    cnx.close()

    print(data)

    return json.dumps(data)

# insert new description
@app.route("/addNewDescription/<content>/<adminID>", methods=['POST', 'GET'])
def addDescription(content, adminID):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    query = "INSERT INTO Details (content, adminID) VALUES (%s, %s);"
    cursor.execute(query, (content, adminID))
    cnx.commit()
    msg = "Successfully added description"

    # get last item added
    query = "SELECT Details.detailID, Details.content, CONCAT(Admins.fn, ' ', Admins.ln) AS name, Admins.email FROM Details INNER JOIN Admins ON Details.adminID = Admins.adminID;"
    cursor.execute(query)
    data = cursor.fetchall()

    # close db
    cursor.close()
    cnx.close()

    print(type(data))

    temp = []
    temp.append(data[-1][-4])
    temp.append(data[-1][-3])
    temp.append(data[-1][-2])
    temp.append(data[-1][-1])

    return temp

################################################################################
#
#                           Courses Manipulations
#
################################################################################


################################################################################
#
#                           Modules Manipulations
#
################################################################################

if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, port=5000)