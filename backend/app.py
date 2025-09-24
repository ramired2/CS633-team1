from flask import Flask, render_template
# import mysql.connector
import pymongo
from bson.objectid import ObjectId
import os
import io
from PIL import Image
import bson
import gridfs
from dotenv import load_dotenv
import json

# for slides
from spire.presentation.common import *
from spire.presentation import *

# for slides HAVE TO PAY
import aspose.slides as slides
import aspose.pydrawing as drawing

app = Flask(__name__)

# loading to read .env info
load_dotenv()

# connect to db
def connect():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["cs633"]

    return db

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
    db = connect()          # opens DB connection
    admins = db["admins"]   #specifically get admins table

    data = []               # make list for the data

    for x in admins.find(): #parse thru info and add ea entry to data
        data.append(x)

    return json.dumps(data, default=str)

# get admin by email
@app.route("/getAdmin/<email>", methods=['GET'])
def getAdmin(email):
    db = connect()          # opens DB connection
    admins = db["admins"]   #specifically get admins table

    query = { "email": email}
    data = db.admins.find_one(query)    # search for admin with specific
                                                    # email

    print(data)

    return json.dumps(data, default=str)

# get admin by partial name (first name or last name)
@app.route("/getPartialAdmin/<name>", methods=['GET'])
def getPartialAdmin(name="alex"):
    db = connect()          # opens DB connection
    admins = db["admins"]   #specifically get admins table

    query = "^" + name

    query = { "name": {"$regex": query}}
    data = db.admins.find_one(query, {"password":0})    # search for admin with specific
                                                        # name but dont return password

    print(data)

    return json.dumps(data, default=str)

# inserting a new admin 
@app.route("/addAdmin/<name>/<email>/<password>", methods=['POST', 'GET'])
def addAdmin(name, email, password):
    # open db connection
    db = connect()

    # will create table Admins
    admins = db["admins"]

    query = { "name": name, "email": email, "password": password}

    x = admins.insert_one(query)

    # print(x.inserted_id)
    data = db.admins.find_one({ "_id": ObjectId(x.inserted_id)})
    print(data)

    return json.dumps(data, default=str)

# edit admin info
@app.route("/editAdmin/<adminID>/<name>/<email>/<password>", methods=['GET', 'POST', 'PUT'])
def editAdmin(adminID, name, email, password):
    db = connect()          # opens DB connection
    admins = db["admins"]   #specifically get admins table

    adminID = intToObjID(adminID)   # returns type ObjectId for searching specific
                                    # id we want

    query = { "_id": adminID}
    edited = { "$set": { "name": name, "email": email, "password": password } }

    admins.update_one(query, edited)

    data = db.admins.find_one({ "_id": adminID})    # search for admin with specific
                                                    # id that was edited
    

    return json.dumps(data, default=str)

# delete admin
@app.route("/deleteAdmin/<id>", methods=['DELETE', 'GET'])
def deleteAdmin(id):
    db = connect()          # opens DB connection
    admins = db["admins"]   #specifically get admins table

    id = intToObjID(id)     # returns type ObjectId for searching specific
                            # id we want

    query = { "_id": id}    # query for specific id

    admins.delete_one(query) #deletes it

    data = db.admins.find_one({ "_id": id}) # search for admin with specific
                                            # id. if deleted correctly
                                            # then should return null

    data = db.admins.find_one({ "_id": id}) # search for admin with specific
                                            # id that was edited
    if data == None:
        data = "deleted"
    

    return json.dumps(data, default=str)

################################################################################
#
#                           Details Manipulations
#
################################################################################

# get all descs
@app.route("/getDescs", methods=['GET'])
def getDescs():
    db = connect()          # opens DB connection
    descriptions = db["descriptions"]   #specifically get descriptions table

    data = []               # make list for the data

    for x in descriptions.find(): #parse thru info and add ea entry to data
        data.append(x)

    return json.dumps(data, default=str)

# getting the course description for the homepage
@app.route("/getDesc/", methods=['GET'])
def getDetails():
    db = connect()          # opens DB connection
    descriptions = db["descriptions"]   #specifically get descriptions table

    data = []               # make list for the data

    # for x in descriptions.find(): #parse thru info and add ea entry to data
    #     data.append(x)
    #  data[0] -- should b alex's admin info

    admin = getPartialAdmin()   # looks for admin info with name containing "alex"
    admin = json.loads(admin)   # turn into json
    print(admin["_id"])         # get the id

    id = intToObjID(admin["_id"])   # turn to ObjectId

    query = { "adminID": id}        # want to find desc that attached to the admin id
    data = db.descriptions.find_one(query)    # search for desc w alex _id

    return json.dumps(data, default=str)

# insert new description
# atm adds the adminID (aka alex's) 
@app.route("/addDesc/<desc>/<adminID>", methods=['POST', 'GET'])
def addDesc(desc, adminID):
    db = connect()          # open db connection
    
    admins = db["admins"]   # get table for admins
    admin = db.admins.find_one({})   # get first item which should be alex

    query = { "desc": desc, "adminID": admin["_id"]}    # could have str(adminID)

    print("trying to add ", query)

    # db = connect()          # open db connection
    descriptions = db["descriptions"]   # will get table Descriptions

    x = descriptions.insert_one(query)  # insert new description 

    print(x.inserted_id)
    print(type(db.descriptions.find_one({ "_id": ObjectId(x.inserted_id)})))
    data = db.descriptions.find_one({ "_id": ObjectId(x.inserted_id)})  # get the description just added (ensures it added)
                                                                        # if none == not inserted
    print(data)

    return json.dumps(data, default=str)

# edit desc info
@app.route("/editDesc/<desc>/<id>", methods=['GET', 'POST', 'PUT'])
def editDesc(desc, id):
    db = connect()          # opens DB connection
    descriptions = db["descriptions"]   #specifically get descriptions table

    id = intToObjID(id)   # returns type ObjectId for searching specific
                                    # id we want

    query = { "_id": id}
    edited = { "$set": { "desc": desc } }   # will only change description. 
                                            # not the adminID

    descriptions.update_one(query, edited)  # update the info

    data = db.descriptions.find_one({ "_id": id})    # search for desc with specific
                                                     # id that was edited
    

    return json.dumps(data, default=str)

# delete desc
@app.route("/deleteDesc/<id>", methods=['DELETE', 'GET'])
def deleteDesc(id):
    db = connect()          # opens DB connection
    descriptions = db["descriptions"]   #specifically get descriptions table

    id = intToObjID(id)     # returns type ObjectId for searching specific
                            # id we want

    query = { "_id": id}    # query for specific id

    descriptions.delete_one(query) #deletes it

    data = db.descriptions.find_one({ "_id": id})   # search for desc with specific
                                                    # id. if deleted correctly
                                                    # then should return null

    data = db.descriptions.find_one({ "_id": id}) # search for desc with specific
                                            # id that was edited
    if data == None:
        data = "deleted"
    

    return json.dumps(data, default=str)

################################################################################
#
#                           Courses Manipulations
#
################################################################################

# get all courses
@app.route("/getCourses", methods=['GET'])
def getCourses():
    db = connect()          # opens DB connection
    courses = db["courses"]   #specifically get courses table

    data = []               # make list for the data

    for x in courses.find(): #parse thru info and add ea entry to data
        data.append(x)

    return json.dumps(data, default=str)

# inserting a new course 
@app.route("/addCourse/<name>/<code>/<numModules>", methods=['POST', 'GET'])
def addCourse(name, code, numModules):
    # open db connection
    db = connect()

    # will create/get table courses
    courses = db["courses"]

    query = { "courseName": name, "courseCode": code, "numModules": numModules}

    x = courses.insert_one(query)

    # print(x.inserted_id)
    data = db.courses.find_one({ "_id": ObjectId(x.inserted_id)})
    print(data)

    return json.dumps(data, default=str)

# edit a course
@app.route("/editCourse/<id>/<name>/<code>/<mods>", methods=['GET', 'POST', 'PUT'])
def editCourse(id, name, code, mods):
    db = connect()          # opens DB connection
    courses = db["courses"] #specifically get courses table

    id = intToObjID(id) # returns type ObjectId for searching specific
                        # id we want

    query = { "_id": id}
    # what it will b set to
    edited = { "$set": { "courseName": name, "courseCode": code, "numModules": mods }}
                                            

    courses.update_one(query, edited)  # update the info

    data = db.courses.find_one({ "_id": id})    # search for desc with specific
                                                     # id that was edited
    

    return json.dumps(data, default=str)

# delete course
@app.route("/deleteCourse/<id>", methods=['DELETE', 'GET'])
def deleteCourse(id):
    db = connect()          # opens DB connection
    courses = db["courses"]   #specifically get courses table

    id = intToObjID(id)     # returns type ObjectId for searching specific
                            # id we want

    query = { "_id": id}    # query for specific id

    courses.delete_one(query) #deletes it

    data = db.courses.find_one({ "_id": id})   # search for desc with specific
                                                    # id. if deleted correctly
                                                    # then should return null

    data = db.courses.find_one({ "_id": id}) # search for desc with specific
                                            # id that was edited
    if data == None:
        data = "deleted"
    

    return json.dumps(data, default=str)


################################################################################
#
#                           Modules Manipulations
#
################################################################################

# get all modules
@app.route("/getMods", methods=['GET'])
def getMods():
    db = connect()          # opens DB connection
    modules = db["modules"]   #specifically get modules table

    data = []               # make list for the data

    for x in modules.find(): #parse thru info and add ea entry to data
        data.append(x)

    # query when getting a specific module
    # query = { "modName": mod}
    # data = db.admins.find_one(query)    # search for admin with specific
                                                    # email

    # return json.dumps(data, default=str)
    return retreiveBytesToPng(modules,data)

# will get the byte imgs and make them into pngs to then send to frontend
def retreiveBytesToPng(modules, data, mod="module3"):
    listBytes = []
    # will loop through 
    print(modules.count())
    for j in range(modules.count()):
        for i in range(7):
            
            print(data[j]["pics"][i])
            listBytes.append(data[j]["pics"][i])
            # binary --> pillow
            imgBytes = io.BytesIO(data[j]["pics"][i]["pics"])
            imgPillow = Image.open(imgBytes)

            # # Save the image as a PNG file
            fileName = f"./static/{mod}/{mod}_test{str(i)}.png"
            imgPillow.save(fileName, format='PNG')
            print(f"Image successfully saved as {fileName}")
    return f"saved imgs to {mod}"

# uploading file and saving to static in specified module file
#  return a definition that will add the pngs to the db "modules"
@app.route("/upload/<mod>")
def upload(mod):
    # the module where you want to save it
    print(mod)

    img = []
    presentation = Presentation()
    # FOR LATER
        # read ppt from FormData from frontned. for now reading from file
    presentation.LoadFromFile("./static/module1_test.pptx")

    for i, slide in enumerate(presentation.Slides):
        print(i)
        # fow now will save the images to this folder
        fileName =f"./static/{mod}/{mod}_test{str(i)}.png"

        # save as png
        image = slide.SaveAsImage()
        #append to list of images
        img.append(image)

        # save to file and get rid of instance
        image.Save(fileName)
        image.Dispose()

    presentation.Dispose()

    print(img)

    return addMod(mod)

# will always have six modules
# will always have seven pics
# Will add the png info to the db
# will return a definition that will delete the pngs from the static folder
@app.route("/addMod/<mod>")
def addMod(mod):
    # open db connection
    db = connect()

    # will create table modules
    modules = db["modules"]

    # for loop to go thru the diff pngs to bytes and append to arry
    arry = []
    for i in range(7):
        blob = gridfs.GridFS(db)
        file = f"{mod}_test{i}.png"
        # print(file)

        with open(file, 'rb') as f:
            contents = f.read()

        arry.append({"filename": file, "pics": contents})

    query = {"modName": mod, "pics": arry }

    x = modules.insert_one(query)

    data = db.modules.find_one({ "_id": ObjectId(x.inserted_id)})
    print(data)
    return deletePng(mod)

@app.route("/seeImg/<mod>")
def seeImg(mod):
    link = f"/static/{mod}/{mod}_test"

    pics = f"<img src='/static/{mod}/{mod}_test0.png'> \
            <img src='/static/{mod}/{mod}_test1.png'> \
            <img src='/static/{mod}/{mod}_test2.png'> \
            <img src='/static/{mod}/{mod}_test3.png'> \
            <img src='/static/{mod}/{mod}_test4.png'> \
            <img src='/static/{mod}/{mod}_test5.png'> \
            <img src='/static/{mod}/{mod}_test6.png'>"

    return pics


################################################################################
#
#                                  Other
#
################################################################################
#turn an int to ObjectId for query searches w specific ID
def intToObjID(id):
    id = str(id)    # cast to int
    s = '0' * (24 - len(id)) + id   # creates a string that 24 length
                                    # ('0000000000000000xxxxxxxx')
                                    # if id = xxxxxxxx, then fill lower w 0s

    print(s)

    return bson.ObjectId(id)

# remove pngs after saved to db
@app.route("/deletePng/<mod>")
def deletePng(mod):
    stat = []
    # going to loop through all the diff pngs saved for a specific module
    # and delete them from the static folder
    for i in range(7):
        file = f'./static/{mod}/{mod}_test{i}.png'
        try:
            os.remove(file)
            stat.append(f"deleted {file} successfuly")
        except Exception as e:
            return f"Error in deleting {file}: {e}"
    return json.dumps(stat, default=str)




if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True

    app.run(debug=True, port=5000)