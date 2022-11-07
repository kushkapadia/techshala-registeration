const adminsCollection = require('../db').db().collection("admins")
const ObjectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt')
const validator = require("validator")
const md5 = require('md5')

let Admin = function(data) {
    this.data = data
    this.errors = []
}

Admin.prototype.cleanUp = function(){
    this.data = {
        adminFname: this.data.fName,
        adminLname: this.data.lName,
        adminContactNo : this.data.contactNo,
        adminEmail : this.data.email,
        adminUsername: this.data.username,
        adminPassword: this.data.password,
        // adminInstitute: this.data.instituteName,       
        role: "admin",
        createdDate: new Date()
    }
}


Admin.prototype.login = async function(){
    return new Promise((resolve, reject) => {
        this.cleanUp()
        
        adminsCollection.findOne({adminEmail: this.data.adminEmail}).then((attemptedUser) => {
           if (attemptedUser && bcrypt.compareSync(this.data.adminPassword, attemptedUser.adminPassword)) {
             this.data = attemptedUser
             console.log("Congrats")
             resolve("Congrats!")
           } else {
             console.log("Invalid username / password")
             reject("Invalid username / password.")
           }
         }).catch(function() {
           console.log("Please try again later.")
           reject("Please try again later.")
         })
     })
}

module.exports = Admin