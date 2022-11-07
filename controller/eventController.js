const Event = require('../models/Event')
const Student = require('../models/Student')
const fileUpload = require('express-fileupload')
const path = require('path')
const { ObjectID } = require('mongodb')


exports.addEvent= async function(req, res){

  const eventPoster = req.files.eventPoster
  // console.log(eventPoster);
  const fileName = new Date().getTime().toString() + path.extname(eventPoster.name)
  const savePath = path.join(__dirname, '../public/uploads', fileName)
  await eventPoster.mv(savePath)

  // if(req.files.eventAttachment){
  //   if( isArray(req.files.eventAttachment)){
  //     const eventAttachment = req.files.eventAttachment
  //     console.log(eventAttachment);
    
  //     const attachmentName = new Date().getTime().toString() + path.extname(eventAttachment.name)
  //     const saveAttPath = path.join(__dirname, 'public' , 'uploads', attachmentName)
  //     await eventPoster.mv(saveAttPath)
  //   }
  // }
  

req.body.eventPoster =fileName
    let event = new Event(req.body)
    console.log(req.body)
  await  event.addEvent()
  req.flash("success", "Event Added Successfully.")
      req.session.save(function() {
        res.redirect('/')
      })
}

exports.deleteEvent = async function(req, res){
    let event = new Event()
  await  event.deleteEvent(req.params.id)
  req.flash("success", "Event Deleted Successfully.")
  req.session.save(function() {
    res.redirect('/')
  })
}

exports.displayAddEventPage = function(req, res){
    res.render("add-event-page")
}

exports.getAllEvents = async function(){
    let event = new Event()
  let events =  await event.getAllEvents()
    res.send(events)
}

exports.registerForEvent = async function(req, res){
    console.log(req.params.studId)
    console.log(req.params.eventId)
    let event = new Event()
    await event.registerForEvent(req.params.studId,req.params.eventId)
    let student = new Student()
    await student.registerForEvent(req.params.studId,req.params.eventId)
    req.flash("success", "Registered Successfully.")
    req.session.save(function() {
      res.redirect('/')
    })
}

exports.eventPageAdminView = async function(req, res){
let event = new Event()
let eventDoc = await event.getEventById(req.params.id)

let student = new Student()

// for(let x of eventDoc.registeredParticipants){
//   let studDoc =  await student.getStudentById(x.studId)
// arr.push(studDoc)
// console.log(arr)
// }

let registeredParticipants = await student.getRegisteredParticipants(req.params.id)

res.render('event-profile', {
  event : eventDoc,
  participants: registeredParticipants

})
}

exports.markPresent = async function(req, res){
console.log("hit")
console.log(req.body.eventId) 
console.log(req.body.studId)
let event = new Event()

let eventOldDoc = await event.getEventById(req.body.eventId)
console.log(eventOldDoc)
if(eventOldDoc.registeredParticipants.find((partic)=>partic.studId == req.body.studId)){
  console.log("In first if")
  if(!eventOldDoc.presentParticipants.find((partic)=>partic.studId.equals(new ObjectID(req.body.studId)))){
  console.log("In second if")

    let eventDoc = await  event.markPresent(req.body.eventId,req.body.studId)
    let student = new Student()
    // console.log(eventDoc.value.vpCoins)
    console.log("Marked present")
    await student.updateCoins(req.body.studId, eventDoc.value.vpCoins )
    res.json("success")
  } else{
    console.log("Already present")

    res.json("alreadyPresent")
  }

} else{
  console.log("Not Registerd")

  res.json("notRegistered")
}


}




//Api
exports.getTodaysEvents = async function(req, res){
  let event = new Event()
let todaysEvents = await event.getTodaysEvents()
res.json(todaysEvents)
}

exports.getSingleEvent = async function(req, res){
  console.log(req.params.id)
  let event = new Event()
let eventDoc = await event.getEventById(req.params.id)
console.log(eventDoc)
res.json(eventDoc)
}


exports.getPresentParticipants = async function(){
  let event = new Event()
  event.getPresentParticipants()
}