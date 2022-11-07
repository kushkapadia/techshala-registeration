const Student = require('../models/Student.js')
const Admin = require('../models/Admin.js')
const Event = require('../models/Event.js')

exports.mustBeLoggedIn = function(req, res, next) {
    if (req.session.user) {
  

        next()
      
    } else {
      req.flash("errors", "You must be logged in to perform that action.")
      req.session.save(function() {
        res.redirect('/')
      })
    }
  }

  exports.login = function(req, res) {
    if(req.body.loginType == "student"){
  let student = new Student(req.body)
    student.login().then(function(result) {
      req.session.user = {fName: student.data.studentFname, lName: student.data.studentLname, username: student.data.StudentUsername, _id: student.data._id, email:student.data.studentEmail,  role: student.data.role, year: student.data.studentYear
        }

      req.session.save(function() {
        res.redirect('/')
      })
    }).catch(function(e) {
      req.flash('errors', e)
      req.session.save(function() {
        res.redirect('/')
      })
    }) 
  }else{
    let admin = new Admin(req.body)
      admin.login().then(function(result) {
      req.session.user = {fName: admin.data.adminFname, lName: admin.data.adminLname, username: admin.data.adminUsername, _id: admin.data._id, email:admin.data.adminEmail, role: admin.data.role}
      req.session.save(function() {
        res.redirect('/')
      })
    }).catch(function(e) {
      req.flash('errors', e)
      req.session.save(function() {
        res.redirect('/')
      })
    }) 
  }
  }

  exports.logout = function(req, res) {
    req.session.destroy(function() {
      res.redirect('/')
    })
  }

  exports.register = function(req, res) {
    let student = new Student(req.body)
    student.register().then(() => {
      req.session.user = {fName: student.data.studentFname, lName: student.data.studentLname, username: student.data.StudentUsername, _id: student.data._id, email:student.data.studentEmail}
      req.session.save(function() {
        // res.redirect('/')
        res.send("Hiii")
      })
    }).catch((regErrors) => {
      regErrors.forEach(function(error) {
        req.flash('regErrors', error)
      })
      req.session.save(function() {
        res.redirect('/')
      })
    })
  }
  
  exports.home = async function(req, res) {
    if (req.session.user) {
      // fetch feed of posts for current user
      let event = new Event()
      let student = new Student()
      let events = await event.getAllEvents()
      let studentDoc = await student.getStudentById(req.session.user._id)
      console.log(events)
      res.render('home-dashboard', {
        events: events,
        student: studentDoc
      })
    } else {
      res.render('home-guest', {regErrors: req.flash('regErrors')})
    }
  }

  exports.displaySignUpPage = function(req, res){
    res.render('sign-up')
  }

  exports.displayProfilePage = function(req, res){
    res.render('student-profile')
  }