const { json } = require("express")
const Coordinator = require("../models/Coordinator")


exports.registerCordEmail = async function(req, res){
    req.body.email = req.body.email.trim()
    console.log(req.body.email)
  let emailArray =  req.body.email.split("\n")
  console.log(emailArray)
for(x in emailArray){
    req.body.email = emailArray[x]
    console.log(req.body.email)
let coordinator = new Coordinator(req.body)
     await coordinator.registerCordEmail()
}
req.flash("success", "Event Deleted Successfully.")
  req.session.save(function() {
    res.redirect("/displayRegisterCoordinatorPage")

  })
}


exports.setUpAccount = async function(req, res){
  console.log(req.body)
    let coordinator = new Coordinator()
let result = await coordinator.setUpAccount(req.body)
console.log(result)
if(result ==null){
    res.json("Email Not Registered")
} else{
    res.json(result.value)
}

}

exports.dsiplayAddCordPage = async function(req, res){
    res.render('register-coordinator')
}