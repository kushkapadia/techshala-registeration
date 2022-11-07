const coordinatorsCollection = require('../db').db().collection("coordinators")
const ObjectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt')
const validator = require("validator")
const md5 = require('md5')


let Coordinator = function(data) {
    this.data = data
    this.errors = []
}

Coordinator.prototype.cleanUp = function(){
    this.data = {
        fName: this.data.fName,
        lName: this.data.lname,
        email: this.data.email,
        contactNo: this.data.contactNo,
        rollId: this.data.rollId,
        clubName: this.data.clubName,
        password: this.data.password,

    }

}

Coordinator.prototype.registerCordEmail = async function(){
    this.cleanUp()
    await coordinatorsCollection.insertOne(this.data)
}


Coordinator.prototype.setUpAccount = async function(data){
    console.log(data.email)
    let registeredCord = await coordinatorsCollection.findOne({email: {$regex : data.email}})
console.log(registeredCord)
    if (registeredCord){

        let salt = bcrypt.genSaltSync(10)
        data.password = bcrypt.hashSync(data.password, salt)

   let cordDoc = await coordinatorsCollection.findOneAndUpdate({_id: registeredCord._id}, {$set:{ fName: data.fName, lName: data.lName, contactNo: data.contactNo, rollId: data.rollId, clubName: data.clubName, password: data.password }}, {returnNewDocument:true})
        return cordDoc
    } else{       
        return null
    }
}

module.exports = Coordinator