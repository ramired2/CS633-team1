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

# for font)

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER # where ppt files will be stored temp
                                            # while ppt --> png happens

# loading to read .env info
load_dotenv()

uri = os.environ['URI']

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
    # client = pymongo.MongoClient("mongodb://localhost:27017/")  # connect db
    client = pymongo.MongoClient(uri)
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
# Description: edit the password for a specific admin
#
# params: password --> password of admin
# 
# return: 400 --> update not executed
#         200 --> query executed
# 
#-------------------------------------------------------------------------------
@app.route("/editAdmin", methods=['GET', 'POST', 'PUT'])
def editAdmin():
    print("inside edit admin")
    db = connect()                  # opens DB connection
    admins = db["admins"]           # specifically get admins table

    stat = 200
    password = request.args.get('password')         # get id sent as param

    print(password)

    admin = getPartialAdmin()     # get user id with default partial name 'alex'
    admin = json.loads(admin)       # turn into json
    id = intToObjID(admin["_id"])   # turn adminID to ObjectId

    query = { "_id": id}       # query to get admin with specific id

    # the new info we want to input into the id
    edited = { "$set": { "password": password } }

    res = admins.update_one(query, edited) # does the update
    changed = res.acknowledged                    # if query ran successfuly
                                                  # acknowledged return true

    if res == False:                    # if false then query was not executed
        stat = 400

    print(stat)
    

    return f"{stat}"

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
#              of the admin who owns it (aka prof alex)
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

    id = intToObjID(admin["_id"])   # turn adminID to ObjectId

    query = { "adminID": id}               # want to find desc that attached to the admin id
    data = db.descriptions.find_one(query) # search for desc w prof _id

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: insert a new description and adds alex as admin
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
# return: stat --> 200 if query successfully executed
#                  400 if query not executed
# 
#-------------------------------------------------------------------------------
@app.route("/editDesc", methods=['PUT', 'OPTIONS', 'GET'])
def editDesc():
    stat = 200                          # status code if query executed or not
    id = request.args.get('id')         # get id sent as param
    desc = request.args.get('description') # get description sent as param
    
    db = connect()                      # opens DB connection
    descriptions = db["descriptions"]   # specifically get descriptions table

    id = intToObjID(id)                 # takes id and return id in ObjectId

    query = { "_id": id}                # query for specific ID
    edited = { "$set": { "desc": desc } }   # will only change description. 
                                            # not the adminID

    res = descriptions.update_one(query, edited)  # update the info
    changed = res.acknowledged                    # if query ran successfuly
                                                  # acknowledged return true

    if res == False:                    # if false then query was not executed
        stat = 400
    

    return f"{stat}"

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

    for x in modules.find().sort("modName"):    # parse thru info and add ea entry to data
        data.append(x)                          # and sort by module name

    return retreiveBytesToPng(modules,data,"all")

#-------------------------------------------------------------------------------
#
# Description: gets all the module names and IDs for dropdown
#
# params: NONE
# 
# return: data --> list of mod names and ids
# 
#-------------------------------------------------------------------------------
@app.route("/getModNameID", methods=['GET'])
def getModNameID():
    db = connect()              # opens DB connection
    modules = db["modules"]     # specifically get modules table

    data = []                   # make list for the data

    for x in modules.find({}, {"pics":0}).sort("modName"):   # get id and modName only, "pics" key
        data.append(x)                                       # and sort by module name

    return json.dumps(data, default=str)

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

#-------------------------------------------------------------------------------
#
# Description: depending on option, will either get all of the PNGs in db, or
#              only from specific module and save them to static in their specific
#              module folders
#
# params: modules --> db collection
#         data    --> list of modules
#         option  --> "all" gets all pngs in db
#                      any other value will be module name, so get PNGs for that
# 
# return: "saved imgs to static"
# 
#-------------------------------------------------------------------------------
def retreiveBytesToPng(modules, data, option="all"):
    listBytes = []              # list to save bytes in

    if (option == "all"):       # want to get all of the modules imgs
        # print(modules.count())
        for j in range((modules.count())):  # will loop through modules
            idx = int(data[j]['modName'][-1])
            print(f'CURRENT MOD IS {idx}')
            mod = f'module{idx}'            # module name

            for i in range(6):                                      # loop through the pngs for ea module
                listBytes.append(data[j]["pics"][i])                # save binary info to png to list

                imgBytes = io.BytesIO(data[j]["pics"][i]["pics"])   # binary --> pillow type
                imgPillow = Image.open(imgBytes)                    # open the img info and put in imgPillow 

                fileName = f"./static/{mod}/{mod}_{str(i)}.png" # name of file + where storing
                imgPillow.save(fileName, format='PNG')              # Save the image as a PNG file
                # print(f"Image successfully saved as {fileName}")
    else:                                                           #want to get specific module bytes
        for i in range(6):      # only loop through PNGs specific mod                                       
            listBytes.append(data["pics"][i])                       # save binary info to png to list

            imgBytes = io.BytesIO(data["pics"][i]["pics"])          # binary --> pillow type
            imgPillow = Image.open(imgBytes)                        # open the img info and put in imgPillow 

            fileName = f"./static/{option}/{option}_{str(i)}.png" # name of file + where storing
            imgPillow.save(fileName, format='PNG')                  # Save the image as a PNG file
            # print(f"Image successfully saved as {fileName}")
        
    return seeImgs('all', data)

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
@app.route("/upload", methods=['POST', 'GET', 'OPTIONS'])
def upload():
    # print(request.files)
    # font = "./font/calibri"
    
    if not request.files:           # checks if the file was received
        return str({'message': 'empty'}), 200
    
    files = request.files.getlist('file')

    for file in files:
        # print(f'file og name: {file.filename}')
        filename = ''
        
        if('pptx' in file.filename):                        # get extension pptx OR ppt
            filenameExtension = '.pptx'
            print(file.filename[-13:-5].replace(" ", "").lower())
            filename = secure_filename(file.filename[-13:-5].replace(" ", "").lower())   # get filename and get mod #
        
        else:
            filenameExtension = '.ppt'

            # file name follows format -- Patterns of Course QM Module #.ppt/x
            filename = secure_filename(file.filename[-12:-4].replace(" ", "").lower())       # get mod #

        
        
        #  any file will be named "module<#>_temp.ppt/x"
        # save file to static folder
        file.save(os.path.join("./static", f'{filename}_temp{filenameExtension}').replace("\\","/") )  

        img = []                        # list to save imgs

        presentation = Presentation()   # instance of ppt
        presentation.CustomFontFileDirectory=['./fonts']

        # save to pdf

        print(f'FILE SHOULD BE IN./static/{filename}_temp{filenameExtension}')

        # load ppt
        presentation.LoadFromFile(f'./static/{filename}_temp{filenameExtension}')

        # open presentation and change font



        for i, slide in enumerate(presentation.Slides):               # loop thru # slides
            fileName =f"./static/{filename}/{filename}_{str(i)}.png"  # folder location + name
        
            image = slide.SaveAsImage() # turn to png
            img.append(image)           # append to list of images

            image.Save(fileName)        # save to static 
            image.Dispose()             # get rid of instance

        presentation.Dispose()          # get rid of ppt instance

    return addMod(files, filenameExtension)

#-------------------------------------------------------------------------------
#
# Description: modules uploaded will always have seven PNGs and six modules.
#              Will parse thru the PNGs convert them to binary then add the info
#              to the db.
#
# params: mod --> name of the module
# 
# return: 400 --> if mod exist and update not executed
#         "finished" --> otherwise
# 
#-------------------------------------------------------------------------------
@app.route("/addMod/<mod>", methods=['POST', 'GET', 'OPTIONS'])
def addMod(files, ext):
    db = connect()          # open db connection
    modules = db["modules"] # will create table modules

    arry = []               # list to store PNGs info (filename and binary data)

    for file in files:      # loop thru modules
        if ext == ".pptx":
            mod = f'{file.filename[-13:-5].replace(" ", "").lower()}'                # specific module looking at atm
        else:
            mod = f'{file.filename[-12:-4].replace(" ", "").lower()}'
        print(f"adding pngs for {mod}")

        for i in range(6):      # loop to go thru the diff pngs to bytes and append to arry
            blob = gridfs.GridFS(db)    # creating blob
            file = f"./static/{mod}/{mod}_{i}.png" # file name

            with open(file, 'rb') as f: # opens the file
                contents = f.read()     # read the file

            arry.append({"filename": file, "pics": contents})   # add png info to arry

        query = {"modName": mod, "pics": arry } # query add to db

        # check if already exist in db (editing) or new (add)
        data = db.modules.find_one({ "modName": mod})
        if (data != None):                          # would need to be edited
            # print(data['modName'])
            query = { "_id": data['_id']}           # query for specific ID
            edited = { "$set": { "pics": arry } }   # will only change slide pics 

            res = modules.update_one(query, edited) # update the info

            if res.acknowledged == False:            # false? then query was not executed
                return f'{400}'

        else:                                       # need be added
            print("adding whole new mod")
            x = modules.insert_one(query)           # add to db

        arry = []                                   # reset arry for next file
        
    return f'{'finished'}'

#-------------------------------------------------------------------------------
#
# Description: will get all the slide imgs from static and send as dict
#
# params: NONE
# 
# return: dictionary of slide links
# 
#-------------------------------------------------------------------------------
@app.route("/seeImgs/<option>", methods=['POST', 'GET', 'PUT'])
def seeImgs(option, data):
    db = connect()                          # opens DB connection
    modules = db["modules"]                 # specifically get modules table
    pics = {}                               # dict of module slides

    link = "https://pgcqm-backend.onrender.com/static"   # host link
    # link = 'http://localhost:5000/'

    if(str(option) == 'all'):
        print("get all imgs")
        for j in range((modules.count())):      # loop thru modules
            idx = int(data[j]['modName'][-1])
            mod = f'module{idx}'                # specific module looking at atm

            pics.update( {mod[-1]:   {
                                "key-concepts": f'{link}/{mod}/{mod}_0.png',
                                "summary": f'{link}/{mod}/{mod}_1.png',
                                "principles": f'{link}/{mod}/{mod}_2.png',
                                "do-notes": f'{link}/{mod}/{mod}_3.png',
                                "quiz": f'{link}/{mod}/{mod}_4.png',
                                "faq": f'{link}/{mod}/{mod}_5.png'}} )
    else:
        print(f"get imgs from module {option}")
        pics.update({mod:   {
                            "key-concepts": f'{link}/{option}/{option}_0.png',
                            "summary": f'{link}/{option}/{option}_1.png',
                            "principles": f'{link}/{option}/{option}_2.png',
                            "do-notes": f'{link}/{option}/{option}_3.png',
                            "quiz": f'{link}/{option}/{option}_4.png',
                            "faq": f'{link}/{option}/{option}_5.png'}})

    return pics

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
@app.route("/deleteMod/<id>", methods=['GET', 'DELETE', 'PUT', 'OPTIONS'])
def deleteMod(id):
    db = connect()                              # opens DB connection
    modules = db["modules"]                     # specifically get modules table

    id = intToObjID(id)                         # id to ObjectId type

    query = { "_id": id}                       # query for specific id

    modules.delete_one(query)                  # deletes it

    data = db.modules.find_one({ "_id": id})   # check if id found after deleted

    if data != None:                           # if none then deleted success
        return "Error deleting."
    

    return getModNameID()

################################################################################
#
#                          SECURITY MANIPULATIONS
#
################################################################################

#-------------------------------------------------------------------------------
#
# Description: insert a new security question
#
# params: q --> question to add without '?'
#         ans -- > the answer to the question
# 
# return: data --> info of added description in json
# 
#-------------------------------------------------------------------------------
@app.route("/addSecureQ/<q>/<ans>", methods=['POST', 'GET'])
def addSecureQ(q, ans):
    db = connect()                  # open db connection
    security = db["security"]       # get table for security

    query = { "question": q, "answer": ans} # query to add security Q

    x = security.insert_one(query)# insert new description 

    # get the description just added (ensures it added), if null then not inserted
    data = db.security.find_one({ "_id": ObjectId(x.inserted_id)}) 

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: Will get the security questions needed to see if password should
#              be reset or not
#
# params: NONE
# 
# return: data --> info of added description in json
# 
#-------------------------------------------------------------------------------
@app.route("/getSecureQ", methods=['GET', 'POST', 'PUT'])
def getSecureQ():
    db = connect()                      # opens DB connection
    security = db["security"]           # specifically get security table

    data = []                           # make list for the data

    for x in security.find({},{"answer": 0}): # parse thru info and add ea entry to data
        data.append(x)

    return json.dumps(data, default=str)

#-------------------------------------------------------------------------------
#
# Description: edits the information of a description
#
# params: id --> _id of the description
#         desc --> new description
# 
# return: stat --> 200 if user input correct answer
#                  400 if user input wrong answer
# 
#-------------------------------------------------------------------------------
@app.route("/verify", methods=['PUT', 'OPTIONS', 'GET'])
def verify():
    stat = 400                          # status code if user entered correct ans
    id = request.args.get('id')         # get id sent as param
    ans = request.args.get('answer')    # get answer sent as param
    
    db = connect()                      # opens DB connection
    security = db["security"]           # specifically get security table

    id = intToObjID(id)                 # takes id and return id in ObjectId

    query = { "_id": id}                # want to find question associated w id
    data = db.security.find_one(query)  # search for desc w prof _id

    print(ans)
    print(data['answer'])
    if (int(ans) == int(data['answer'])):       # if answer correctly, change status code
        print(" was correct ")
        stat = 200

    return f"{stat}"

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
    for i in range(6):
        file = f'./static/{mod}/{mod}_{i}.png'
        try:
            os.remove(file)
            stat.append(f"deleted {file} successfuly")
        except Exception as e:
            return f"Error in deleting {file}: {e}"
    return json.dumps(stat, default=str)


if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True

    app.run(host='0.0.0.0', port=5000)