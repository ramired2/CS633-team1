from flask import Flask, render_template
from flask import request, send_file
import pymongo
from bson.objectid import ObjectId
import os
from werkzeug.utils import secure_filename
import io
from PIL import Image
import bson
import gridfs
from dotenv import load_dotenv
import json
from flask_cors import CORS

# for slides (free but have logo near top middle)
from spire.presentation.common import *
from spire.presentation import *

app = Flask(__name__)
UPLOAD_FOLDER = './static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER 
CORS(app)

# loading to read .env info
load_dotenv()

#-------------------------------------------------------------------------------
#
# Description: connects to db
#
# params: NONE
# 
# return: db --> instance of db
# 
#-------------------------------------------------------------------------------
def connect():
    client = pymongo.MongoClient("mongodb://localhost:27017/")  # connect db
    db = client["cs633"]                                        # db instance

    return db

#-------------------------------------------------------------------------------
#
# Description: ensure backend is functioning
#
# params: NONE
# 
# return: string --> says hi to user
# 
#-------------------------------------------------------------------------------
@app.route("/")
def hello_world():
    return "<p>hi</p>"

################################################################################
#
#                           Admin Manipulations
#
################################################################################

#-------------------------------------------------------------------------------
#
# Description: gets all admins from the database. when deployed prof. alex
#              should be the only admin
#
# params: NONE
# 
# return: data --> displays the admins in json format
# 
#-------------------------------------------------------------------------------
@app.route("/getAllAdmins", methods=['GET'])
def getAllAdmins():
    db = connect()              # opens DB connection
    admins = db["admins"]       #specifically get admins table

    data = []                   # make list for the data

    for x in admins.find():     #parse thru info and add ea admin to data
        data.append(x)

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: get a specific admin info by their email and check if we should
#
# params: email --> email of the admin 
#         password --> password of admin
# 
# return: stat --> 400 if wrong completely
#                  300 if email right but wrong password
#                  200 if correct for both
# 
#-------------------------------------------------------------------------------
@app.route("/getAdmin/<email>/<password>", methods=['GET'])
def getAdmin(email, password):
    db = connect()                      # opens DB connection
    admins = db["admins"]               #specifically get admins table
    stat = '400'                        # default 400, dont login

    query = { "email": email}           # query to find admin of specidic email
    data = db.admins.find_one(query)    # search for admin

    if(data != None):                   # ensure user email found in db
        # case where email and password correct. let login
        if(data['email'] == email and data['password'] == password):
            stat = '200'
        # case where email correct, password wrong. dont login
        elif ((data['email'] == email) and (data['password'] != password)):
            stat = '300'

    return stat

#-------------------------------------------------------------------------------
#
# Description: get admin by searching for a partial name (first name or last name)
#              Alex should be the only admin so default is alex (=/= case sensitive)
#
# params: name --> name of user looking for. default is professor name 'alex'
# 
# return: data --> display admin that matches the partial
# 
#-------------------------------------------------------------------------------
@app.route("/getPartialAdmin/<name>", methods=['GET'])
def getPartialAdmin(name="alex"):
    db = connect()              # opens DB connection
    admins = db["admins"]       #specifically get admins table

    query = "^" + name          # ^ --> denote string starts with given name

    query = { "name": {"$regex": query}}                # sets query for partial match
    data = db.admins.find_one(query, {"password":0})    # search for admin with specific
                                                        # name but dont return password

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: inserting a new admin.
#
# params: name --> name of admin
#         email -- > email of admin
#         password --> password of admin
# 
# return: data --> inserted admin in json
# 
#-------------------------------------------------------------------------------
@app.route("/addAdmin/<name>/<email>/<password>", methods=['POST', 'GET'])
def addAdmin(name, email, password):
    db = connect()              # open db connection
    admins = db["admins"]       # specifically want Admins table

    query = { "name": name, "email": email, "password": password} # query to add admin

    x = admins.insert_one(query) # will add the admin and return id_ created

    # will look through the database with the generated id to see whether admin 
    # was successfully added or not and insert info into data
    data = db.admins.find_one({ "_id": ObjectId(x.inserted_id)}) 
                

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: edit the information for a specific admin
#
# params: adminID --> unique _id of the user to edit
#         name --> name of admin
#         email -- > email of admin
#         password --> password of admin
# 
# return: data --> edited admin info in json
# 
#-------------------------------------------------------------------------------
@app.route("/editAdmin/<adminID>/<name>/<email>/<password>", methods=['GET', 'POST', 'PUT'])
def editAdmin(adminID, name, email, password):
    db = connect()                  # opens DB connection
    admins = db["admins"]           # specifically get admins table

    adminID = intToObjID(adminID)   # mongoDB _id is ObjectId type so def takes str
                                    # of id and returns type ObjectId for searching 
                                    # specific id we want

    query = { "_id": adminID}       # query to get admin with specific id

    # the new info we want to input into the id
    edited = { "$set": { "name": name, "email": email, "password": password } }

    admins.update_one(query, edited) # does the update

    data = db.admins.find_one({ "_id": adminID})    # search for admin with specific
                                                    # id that was edited
    

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: delete a specific admin given their id
#
# params: id --> unique _id of the admin
# 
# return: data --> if deleted will say "deleted", otherwise returns info for 
#                   admin that was supposed to be deleted
# 
#-------------------------------------------------------------------------------
@app.route("/deleteAdmin/<id>", methods=['DELETE', 'GET'])
def deleteAdmin(id):
    db = connect()          # opens DB connection
    admins = db["admins"]   #specifically get admins table

    id = intToObjID(id)     # returns type ObjectId of id for searching specific
                            # id we want

    query = { "_id": id}    # query for specific id

    admins.delete_one(query) #deletes it

    data = db.admins.find_one({ "_id": id}) # search for admin with specific id
                                            
                                            
    if data == None:         # if deleted correctly should return null
        data = "deleted"
    

    return json.dumps(data, default=str)

################################################################################
#
#                           Details Manipulations
#
################################################################################

#-------------------------------------------------------------------------------
#
# Description: get all description for course for homepage. should only contain
#              item when in deployment
#
# params: NONE
# 
# return: data --> description of course
# 
#-------------------------------------------------------------------------------
@app.route("/getDescs", methods=['GET'])
def getDescs():
    db = connect()                      # opens DB connection
    descriptions = db["descriptions"]   #specifically get descriptions table

    data = []                           # make list for the data

    for x in descriptions.find():       # parse thru info and add ea entry to data
        data.append(x)

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: getting the course description for the homepage given a partial
#              of the admin who owns it (aka prof)
#
# params: NONE
# 
# return: data --> description of course
# 
#-------------------------------------------------------------------------------
@app.route("/getDesc/", methods=['GET'])
def getDetails():
    db = connect()                      # opens DB connection
    descriptions = db["descriptions"]   # specifically get descriptions table

    data = []                           # make list for the data

    admin = getPartialAdmin()   # looks for admin info with name containing "alex"
    admin = json.loads(admin)   # turn into json
    # print(admin["_id"])         # checks the id

    id = intToObjID(admin["_id"])   # turn adminID to ObjectId

    query = { "adminID": id}               # want to find desc that attached to the admin id
    data = db.descriptions.find_one(query) # search for desc w prof _id

    print(data)

    return json.dumps(data, default=str)

# insert new description
# atm adds the adminID (aka alex's) 
#-------------------------------------------------------------------------------
#
# Description: insert a new description and adds 
#
# params: desc --> description of course
#         adminID -- > id of admin
# 
# return: data --> info of added description in json
# 
#-------------------------------------------------------------------------------
@app.route("/addDesc/<desc>/<adminID>", methods=['POST', 'GET'])
def addDesc(desc, adminID):
    db = connect()                  # open db connection
    admins = db["admins"]           # get table for admins
    admin = getPartialAdmin()       # looks for admin info with name containing "alex"
    admin = json.loads(admin)       # turn into json
    id = intToObjID(admin["_id"])   # turn adminID to ObjectId

    query = { "desc": desc, "adminID": id} # query to add description

    # print("trying to add ", query)

    descriptions = db["descriptions"] # will get table Descriptions
    x = descriptions.insert_one(query)# insert new description 

    # get the description just added (ensures it added), if null then not inserted
    data = db.descriptions.find_one({ "_id": ObjectId(x.inserted_id)}) 

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: edits the information of a description
#
# params: id --> _id of the description
#         desc --> new description
# 
# return: data --> edited info in json
# 
#-------------------------------------------------------------------------------
@app.route("/editDesc/<desc>/<id>", methods=['GET', 'POST', 'PUT'])
def editDesc(desc, id):
    db = connect()                      # opens DB connection
    descriptions = db["descriptions"]   # specifically get descriptions table

    id = intToObjID(id)                 # takes id and return id in ObjectId

    query = { "_id": id}                # query for specific ID
    edited = { "$set": { "desc": desc } }   # will only change description. 
                                            # not the adminID

    descriptions.update_one(query, edited)  # update the info

    data = db.descriptions.find_one({ "_id": id}) # search for desc with specific
                                                  # id that was edited
    

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: delete a specific description given their id
#
# params: id --> unique _id of the description
# 
# return: data --> if deleted will say "deleted", otherwise returns info for 
#                   description that was supposed to be deleted
# 
#-------------------------------------------------------------------------------
@app.route("/deleteDesc/<id>", methods=['DELETE', 'GET'])
def deleteDesc(id):
    db = connect()                      # opens DB connection
    descriptions = db["descriptions"]   #specifically get descriptions table

    id = intToObjID(id)                 # the id in ObjectId type

    query = { "_id": id}                # query for specific id

    descriptions.delete_one(query)      # deletes it

    data = db.descriptions.find_one({ "_id": id}) # search for desc with specific
                                                  # id that was edited

    if data == None:                    # if deleted correctly returns null
        data = "deleted"

    return json.dumps(data, default=str)

################################################################################
#
#                           Courses Manipulations
#
################################################################################

#-------------------------------------------------------------------------------
#
# Description: gets all courses
#
# params: NONE
# 
# return: data --> list of courses
# 
#-------------------------------------------------------------------------------
@app.route("/getCourses", methods=['GET'])
def getCourses():
    db = connect()              # opens DB connection
    courses = db["courses"]     # specifically get courses table

    data = []                   # make list for the data

    for x in courses.find():    # parse thru info and add ea entry to data
        data.append(x)

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: inserts a new course
#
# params: name --> full name of the course
#         code --> course code 'cs633'
#         numModules --> number of modules in the course
# 
# return: data --> the inserted item
# 
#-------------------------------------------------------------------------------
@app.route("/addCourse/<name>/<code>/<numModules>", methods=['POST', 'GET'])
def addCourse(name, code, numModules):
    db = connect()              # open db connection
    courses = db["courses"]     # will get table courses

    # query of info we want to add
    query = { "courseName": name, "courseCode": code, "numModules": numModules}

    x = courses.insert_one(query) # insert to db

    # get the info of the course just inserted
    data = db.courses.find_one({ "_id": ObjectId(x.inserted_id)})

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: edit a specific course
#
# params: id --> id of course want edit
#         name --> name of course
#         code --> code of course
#         mods --> number of modules course has
# 
# return: data --> info of edited course
# 
#-------------------------------------------------------------------------------
@app.route("/editCourse/<id>/<name>/<code>/<mods>", methods=['GET', 'POST', 'PUT'])
def editCourse(id, name, code, mods):
    db = connect()                      # opens DB connection
    courses = db["courses"]             #specifically get courses table

    id = intToObjID(id)                 # id in ObjectID type

    query = { "_id": id}                # query for specific id

    # new info to set into course
    edited = { "$set": { "courseName": name, "courseCode": code, "numModules": mods }}
                                            
    courses.update_one(query, edited)   # update the info

    data = db.courses.find_one({ "_id": id})    # search for just edited course

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: delete a specific course given their id
#
# params: id --> unique _id of the course
# 
# return: data --> if deleted will say "deleted", otherwise returns info for 
#                   course that was supposed to be deleted
# 
#-------------------------------------------------------------------------------
@app.route("/deleteCourse/<id>", methods=['DELETE', 'GET'])
def deleteCourse(id):
    db = connect()              # opens DB connection
    courses = db["courses"]     #specifically get courses table

    id = intToObjID(id)         # get id in ObjectId type

    query = { "_id": id}        # query for specific id

    courses.delete_one(query)   #deletes it

    data = db.courses.find_one({ "_id": id}) # search for desc with specific

    if data == None:            # if success deleted return None
        data = "deleted"
    

    return json.dumps(data, default=str)


################################################################################
#
#                           Modules Manipulations
#
################################################################################

#-------------------------------------------------------------------------------
#
# Description: gets all the modules
#
# params: NONE
# 
# return: retreiveBytesToPng() --> gets bytes of images from the db and converts
#                                  to png and saves to static folder
# 
#-------------------------------------------------------------------------------
@app.route("/getMods", methods=['GET'])
def getMods():
    db = connect()              # opens DB connection
    modules = db["modules"]     # specifically get modules table

    data = []                   # make list for the data

    for x in modules.find():    # parse thru info and add ea entry to data
        data.append(x)

    return retreiveBytesToPng(modules,data,"all")

#-------------------------------------------------------------------------------
#
# Description: gets info from specific module
#
# params: mod --> specific module looking for 
# 
# return: retreiveBytesToPng() --> gets bytes of images from the db and converts
#                                  to png and saves to static folder
# 
#-------------------------------------------------------------------------------
@app.route("/getMod/<mod>", methods=['GET'])
def getMod(mod):
    db = connect()                    # opens DB connection
    modules = db["modules"]           # specifically get modules table

    data = []                         # make list for the data

    
    query = { "modName": mod}         # query when getting a specific module
    data = db.modules.find_one(query) # search specific module name

    return retreiveBytesToPng(modules,data,mod)

# will get the byte imgs and make them into pngs to then send to frontend
#-------------------------------------------------------------------------------
#
# Description: depending on option, will either get all of the PNGs in db, or
#              only from specific module and save them to static in their specific
#              module folders
#
# params: modules -->
#         data -->
#         option --> "all" gets all pngs in db
#                    any other value will be module name, so get PNGs for that
# 
# return: "saved imgs to static"
# 
#-------------------------------------------------------------------------------
def retreiveBytesToPng(modules, data, option="all"):
    listBytes = []              # list to save bytes in

    if (option == "all"):       # want to get all of the modules imgs
        # print(modules.count())
        for j in range((modules.count())):  # will loop through modules
            mod = f'module{j+1}'            # module name

            for i in range(7):                                      # loop through the pngs for ea module
                listBytes.append(data[j]["pics"][i])                # save binary info to png to list

                imgBytes = io.BytesIO(data[j]["pics"][i]["pics"])   # binary --> pillow type
                imgPillow = Image.open(imgBytes)                    # open the img info and put in imgPillow 

                fileName = f"./static/{mod}/{mod}_test{str(i)}.png" # name of file + where storing
                imgPillow.save(fileName, format='PNG')              # Save the image as a PNG file
                # print(f"Image successfully saved as {fileName}")
    else:                                                           #want to get specific module bytes
        for i in range(7):      # only loop through PNGs specific mod                                       
            listBytes.append(data["pics"][i])                       # save binary info to png to list

            imgBytes = io.BytesIO(data["pics"][i]["pics"])          # binary --> pillow type
            imgPillow = Image.open(imgBytes)                        # open the img info and put in imgPillow 

            fileName = f"./static/{option}/{option}_test{str(i)}.png" # name of file + where storing
            imgPillow.save(fileName, format='PNG')                  # Save the image as a PNG file
            # print(f"Image successfully saved as {fileName}")
        
    return f"saved imgs to static"

# uploading file and saving to static in specified module file
#  return a definition that will add the pngs to the db "modules"
#-------------------------------------------------------------------------------
#
# Description: uploaded file will turn the ppt into PNGs and save to /static/module#
#              and call function addMod that will add the png in binary to db
#
# params: mod --> module the slides are for
# 
# return: addMod(mod) --> will add the module to db
# 
#-------------------------------------------------------------------------------
@app.route("/upload/<mod>", methods=['POST', 'GET', 'OPTIONS'])
def upload(mod):
    
    if not request.files:           # checks if the file was received
        return str({'message': 'empty'}), 200

    file = request.files['file']

    # save ppt to static
    print(file)
    filename = secure_filename(file.filename)
    print(filename)
    file.save(os.path.join("./static", filename))


    img = []                        # list to save imgs

    presentation = Presentation()   # instance of ppt

    # In deployment will read the ppt from uploaded file from frontend in 
    # FormData, but for now testing file is in static
    presentation.LoadFromFile(f'./static/{filename}')
    # presentation.LoadFromFile("./static/module1_test.pptx")

    for i, slide in enumerate(presentation.Slides):         # loop thru # slides
        fileName =f"./static/{mod}/{mod}_test{str(i)}.png" # folder location + name
       
        image = slide.SaveAsImage() # turn to png
        img.append(image)           # append to list of images

        image.Save(fileName)        # save to static 
        image.Dispose()             # get rid of instance

    presentation.Dispose()          # get rid of ppt instance

    # print(img)

    return addMod(mod)

#-------------------------------------------------------------------------------
#
# Description: modules uploaded will always have seven PNGs and six modules.
#              Will parse thru the PNGs convert them to binary them add the info
#              to the db.
#
# params: mod --> name of the module
# 
# return: deletePng() --> def that will delete the pngs from static
# 
#-------------------------------------------------------------------------------
@app.route("/addMod/<mod>", methods=['POST', 'GET', 'OPTIONS'])
def addMod(mod):
    db = connect()          # open db connection
    modules = db["modules"] # will create table modules

    arry = []               # list to store PNGs info (filename and binary data)     
    for i in range(7):      # loop to go thru the diff pngs to bytes and append to arry
        blob = gridfs.GridFS(db)    # creating blob
        file = f"./static/{mod}/{mod}_test{i}.png" # file name

        with open(file, 'rb') as f: # opens the file
            contents = f.read()     # read the file

        arry.append({"filename": file, "pics": contents})   # add png info to arry

    query = {"modName": mod, "pics": arry } # query add to db

    x = modules.insert_one(query)   # add to db

    data = db.modules.find_one({ "_id": ObjectId(x.inserted_id)})   # check if added
    # print(data)
    return deletePng(mod)

#-------------------------------------------------------------------------------
#
# Description: will output the pngs of a specific module
#
# params: mod --> the name of the module
# 
# return: html of the pics to be output
# 
#-------------------------------------------------------------------------------
@app.route("/seeImg/<mod>", methods=['POST', 'GET'])
def seeImg(mod):
    # string of html to render the pics of  a module
    pics = ['/static/{mod}/{mod}_test0.png',
    '/static/{mod}/{mod}_test1.png',
    '/static/{mod}/{mod}_test2.png',
    '/static/{mod}/{mod}_test3.png',
    '/static/{mod}/{mod}_test4.png',
    '/static/{mod}/{mod}_test5.png',
    '/static/{mod}/{mod}_test6.png']

    # pics = f"<img src='/static/{mod}/{mod}_test0.png'> \
    #         <img src='/static/{mod}/{mod}_test1.png'> \
    #         <img src='/static/{mod}/{mod}_test2.png'> \
    #         <img src='/static/{mod}/{mod}_test3.png'> \
    #         <img src='/static/{mod}/{mod}_test4.png'> \
    #         <img src='/static/{mod}/{mod}_test5.png'> \
    #         <img src='/static/{mod}/{mod}_test6.png'>"

    return pics

#-------------------------------------------------------------------------------
#
# Description: will output the all the pngs from the modules in the DB
#
# params: NONE
# 
# return: html of the pics to be output
# 
#-------------------------------------------------------------------------------
@app.route("/seeAllImgs", methods=['POST', 'GET', 'PUT'])
def seeAllImgs():
    pics = ''
    db = connect()                          # opens DB connection
    modules = db["modules"]                 # specifically get modules table
    for j in range((modules.count())):      # loop thru modules
        mod = f'module{j+1}'                # specific module looking at atm

        # string of html to render the pics of  a module
        pics += f"<img src='/static/{mod}/{mod}_test0.png'> \
                <img src='/static/{mod}/{mod}_test1.png'> \
                <img src='/static/{mod}/{mod}_test2.png'> \
                <img src='/static/{mod}/{mod}_test3.png'> \
                <img src='/static/{mod}/{mod}_test4.png'> \
                <img src='/static/{mod}/{mod}_test5.png'> \
                <img src='/static/{mod}/{mod}_test6.png'>"

    return pics

#-------------------------------------------------------------------------------
#
# Description: will edit a module. 
#              If module name is changed then need to update the names of 
#               the PNGs as they contain the moduleName. 
#              If want to change a single slide will upload, read binary, and edit
#               that single PNGs binary.
#              If want to edit more than one, potentially insert the whole ppt 
#
# params: id --> id of module want edit
#         mod --> name of module
# 
# return: data --> the edited module in json
# 
#-------------------------------------------------------------------------------
@app.route("/editMod/<id>/<mod>", methods=['GET', 'POST', 'PUT', 'OPTIONS'])
def editMod(id, mod):
    # when deployed will use FromData to get info from frontend

    db = connect()              # opens DB connection
    modules = db["modules"]     #specifically get modules table

    id = intToObjID(id)         # turn id to ObjectId

    query = { "_id": id}        # query for the specific db item you want

    og = db.modules.find_one({ "_id": id})  # if changing module name, need og
                                            # name for when update PNG names
    
    edited = { "$set": { "modName": mod}}   # query to change the module name
    modules.update_one(query, edited)       # update the info

    # if want to edit one of the module imgs need to replace all or user has to
        # if doing all
            # for loop to go thru the diff pngs to bytes and append to arry
            # arry = []
            # for i in range(7):
            #     blob = gridfs.GridFS(db)
            #     file = f"{mod}_test{i}.png"

            #     with open(file, 'rb') as f:
            #         contents = f.read()

            #     arry.append({"filename": file, "pics": contents})

            # query = {"$set": { "pics": arry }}
            # 
        # edit one by one.
            # query worked in MongoDB Compass
            # query2 = [{'$addFields': {'pics': {'$map': {'input': '$pics', 'as': 'picsA','in': {'$mergeObjects': ['$$picsA', { 'pics': { '$replaceOne': { 'input': '$$picsA.filename', 'find': 'module4_test2.png', 'replacement': 'NEW_BINARY_IMG'}}}]}}}}}]
            # modules.update_many(query, query2)

    # if changing module name, need to change mod name of all pics!
    db = connect()                          # opens DB connection
    modules = db["modules"]                 # specifically get modules table

    # query that will parse thru all filenames that contain Module{old mod number}
    # and update it to the new module name
    query3 = [{'$addFields': {'pics': {'$map': {'input': '$pics', 'as': 'picsA','in': {'$mergeObjects': ['$$picsA', { 'filename': { '$replaceOne': { 'input': '$$picsA.filename', 'find': og["modName"], 'replacement': mod}}}]}}}}}]

    # [{ '$addFields':                                                          # add/edit new field document
    #       { 'pics':                                                           # {_id: ..., modName: ..., pics}
    #           { '$map':                                                       # want to map because pics is an array
    #               { 'input': '$pics',                                         # map the pics
    #                 'as': 'picsA',                                            # use picsA as a variable for content of pics
    #                  'in': { '$mergeObjects':                                 # merge objs so all objs in one line
    #                          [ '$$picsA',                                     # reference the list as the thing to mergeObjects
    #                               { 'filename':                               # {_id: ..., modName: ..., pics[{filename:..., pics:...}, {filename:..., pics:...}, ..., {filename:..., pics:...}]}
    #                               { '$replaceOne':                            # setting up to replace a substring of the module{old}
    #                                   { 'input': '$$picsA.filename',          # looking at the filename field
    #                                     'find': og["modName"],                # look for any instance of the old module name
    #                                     'replacement': mod                    # update it w the new module name
    # }}}]}}}}}]

    modules.update_many(query, query3)       # make the update

    data = db.modules.find_one({ "_id": id}) # search for mod that was edited

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: delete a specific module given their id
#
# params: id --> unique _id of the module
# 
# return: data --> if deleted will say "deleted", otherwise returns info for 
#                   module that was supposed to be deleted
# 
#-------------------------------------------------------------------------------
@app.route("/deleteMod/<id>", methods=['GET', 'POST', 'PUT', 'OPTIONS'])
def deleteMod(id):
    db = connect()                              # opens DB connection
    modules = db["modules"]                     # specifically get modules table

    id = intToObjID(id)                         # id to ObjectId type

    query = { "_id": id}                       # query for specific id

    modules.delete_one(query)                  # deletes it

    data = db.modules.find_one({ "_id": id})   # check if id found after deleted

    if data == None:                           # if none then deleted success
        data = "deleted"
    

    return json.dumps(data, default=str)


################################################################################
#
#                                  Other
#
################################################################################

#-------------------------------------------------------------------------------
#
# Description: turn an int id to ObjectId for query searches w specific ID
#
# params: id --> the id that should be in ObjectId type
# 
# return: id --> ObjectId type id
# 
#-------------------------------------------------------------------------------
def intToObjID(id):
    id = str(id)    # cast to int
    s = '0' * (24 - len(id)) + id   # creates a string that 24 length
                                    # ('0000000000000000xxxxxxxx')
                                    # if id = xxxxxxxx, then fill lower w 0s

    return bson.ObjectId(id)

#-------------------------------------------------------------------------------
#
# Description: removes pngs of a specific module from static
#
# params: mod --> the name of the module
# 
# return: stat --> arry of msgs if succeded or failed to delete png
# 
#-------------------------------------------------------------------------------
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