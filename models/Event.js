const eventsCollection = require('../db').db().collection("events")
const ObjectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt')
const validator = require("validator")
const md5 = require('md5')
const { ReturnDocument } = require('mongodb')

let Event = function(data) {
    this.data = data
    this.errors = []
}

Event.prototype.cleanUp = function(){
    this.data = {
        eventName: this.data.eventName,
        eventDescription: this.data.eventDescription,
        eventPosterFileName: this.data.eventPoster,
        eventLikeCount: 0,
        eventStartDate: new Date(this.data.startDate),
        eventStartTime: this.data.startTime,
        eventEndDate: new Date(this.data.endDate),
        eventEndTime: this.data.endTime,
        eventAttachment: this.data.eventAttachment,
        contactName1 : this.data.contact1,
        contact1 : this.data.contactNo1,
        contactName2 : this.data.contact2,
        contact2 : this.data.contactNo2,
        workSubmissionMail: this.data.email,
        whatsAppLink: this.data.whatsAppLink,
        isCertificate: this.data.isCertificate,
        eventCriteria: this.data.criteria, //(takes year 1/2/3)
        isWalkInAllowed: this.data.isWalkIn,
        registeredParticipants: [],
        presentParticipants: [],
        winners:[],
        vpCoins: Number(this.data.vpCoins),
        createdBy: null, //(admin id)
        createdDate: new Date()
    }
}

Event.prototype.addEvent = async function(){
    this.cleanUp()
   await eventsCollection.insertOne(this.data)
}

Event.prototype.deleteEvent= async function(id){
await eventsCollection.findOneAndDelete({_id: new ObjectID(id)})
}

Event.prototype.getAllEvents = async function(){
let events =  await eventsCollection.find({}).sort({eventStarteDate: 1 }).toArray()
return events
}


Event.prototype.registerForEvent = async function(studId, eventId){
    try{
        console.log(studId)
        console.log(eventId)
        await eventsCollection.findOneAndUpdate({_id: new ObjectID(eventId)}, {$push:{ "registeredParticipants":{studId: studId, date: new Date()} }}) 

    } catch(e){
console.log(e)
    }
}

Event.prototype.getEventById = async function(eventId){
   let eventDoc = await eventsCollection.findOne({_id: new ObjectID(eventId)})
    return eventDoc
}

Event.prototype.markPresent = async function(eventId, studId, adminId){


    return eventsCollection.findOneAndUpdate({_id: new ObjectID(eventId)}, {"$push":{"presentParticipants":{"studId": new ObjectID(studId), "markedPresentBy": new ObjectID(adminId), "date": new Date(), "certificateRecvd": false}}}, {new: true}).then(eventDoc=>{
        // console.log(eventDoc)
             return eventDoc;
         }).catch((e)=>{
           console.log(e);
        
         })




        }

Event.prototype.getTodaysEvents = async function(){
    let allEvent = await eventsCollection.find({}).toArray()
  let  todaysEvent = allEvent.filter((elem)=>{
  
      return  elem.eventStartDate.toDateString() == new Date().toDateString()
    })
  console.log(todaysEvent)
    return todaysEvent;
}


Event.prototype.getPresentParticipants = async function(eventId){

}

module.exports =Event