const studentsCollection = require('../db').db().collection("students")
const ObjectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt')
const validator = require("validator")
const md5 = require('md5')

let Student = function(data) {
    this.data = data
    this.errors = []
}

Student.prototype.cleanUp = function(){
    this.data = {
        studentFname: this.data.fName,
        studentLname: this.data.lName,
        studentContactNo : this.data.contactNo,
        studentRollNumber : this.data.rollNumber,
        studentYear: this.data.year,
        studentEmail : this.data.email,
        studentUsername: this.data.username,
        studentPassword: this.data.password,
        studentInstitute: this.data.instituteName,
        eventsRegisteredIn:  [],
        certificates:[],
        myCoins: 10,
        role: "student",
        createdDate: new Date()
    }
}


// Student.prototype.validate = function() {
//     return new Promise(async (resolve, reject) => {
//       if (this.data.studentUsername == "") {this.errors.push("You must provide a username.")}
//       if (this.data.studentUsername != "" && !validator.isAlphanumeric(this.data.studentUsername)) {this.errors.push("Username can only contain letters and numbers.")}
//       if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")}
//       if (this.data.studentPassword == "") {this.errors.push("You must provide a password.")}
//       if (this.data.studentPassword.length > 0 && this.data.password.length < 7) {this.errors.push("Password must be at least 7 characters.")}
//       if (this.data.studentPassword.length > 50) {this.errors.push("Password cannot exceed 50 characters.")}
//       if (this.data.studentUsername.length > 0 && this.data.username.length < 3) {this.errors.push("Username must be at least 3 characters.")}
//       if (this.data.studentUsername.length > 30) {this.errors.push("Username cannot exceed 30 characters.")}
    
//       // Only if username is valid then check to see if it's already taken
//       if (this.data.studentUsername.length > 2 && this.data.studentUsername.length < 31 && validator.isAlphanumeric(this.data.studentUsername)) {
//         let usernameExists = await usersCollection.findOne({username: this.data.studentUsername})
//         if (usernameExists) {this.errors.push("That username is already taken.")}
//       }
    
//       // Only if email is valid then check to see if it's already taken
//       if (validator.isEmail(this.data.studentEmail)) {
//         let emailExists = await studentsCollection.findOne({email: this.data.studentEmail})
//         if (emailExists) {this.errors.push("That email is already being used.")}
//       }
//       resolve()
//     })
//   }

Student.prototype.login = function() {
    return new Promise((resolve, reject) => {
       this.cleanUp()
       
       studentsCollection.findOne({studentEmail: this.data.studentEmail}).then((attemptedUser) => {
          if (attemptedUser && bcrypt.compareSync(this.data.studentPassword, attemptedUser.studentPassword)) {
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

 Student.prototype.register = function() {
    return new Promise(async (resolve, reject) => {
      // Step #1: Validate user data
      this.cleanUp()
    //   await this.validate()
    
      // Step #2: Only if there are no validation errors 
      // then save the user data into a database
      if (!this.errors.length) {
        // hash user password
        let salt = bcrypt.genSaltSync(10)
        this.data.studentPassword = bcrypt.hashSync(this.data.studentPassword, salt)
        await studentsCollection.insertOne(this.data)
        resolve()
      } else {
        reject(this.errors)
      }
    })
  }
  

  Student.prototype.getStudentById = async function(studId){
  let userDoc =  await studentsCollection.findOne({_id: new ObjectID(studId)})
    return userDoc
  }


  Student.prototype.registerForEvent = async function(studId, eventId){
    await studentsCollection.findOneAndUpdate({_id: new ObjectID(studId)}, {"$push":{ "eventsRegisteredIn":{eventId: eventId, date: new Date()} }}) 

  }

Student.prototype.getRegisteredParticipants = async function(eventId){
let registeredStudents =  await studentsCollection.find({eventsRegisteredIn:{ $elemMatch: { "eventId": eventId} }}).toArray()
  return registeredStudents
}

Student.prototype.updateCoins = async function(studId, coins){
       

await studentsCollection.findOneAndUpdate({_id: new ObjectID(studId)}, {$inc:{ myCoins: Number(coins)}})
}

module.exports = Student
