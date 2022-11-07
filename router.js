const express= require('express')
const router = express.Router()
const studentController = require('./controller/studentController')
const adminController = require('./controller/adminController')
const eventController = require('./controller/eventController')
const coordinatorController = require('./controller/coordinatorController')


router.get('/', studentController.home)
router.get('/signUpPage' ,studentController.displaySignUpPage)
router.get('/myProfile', studentController.mustBeLoggedIn, studentController.displayProfilePage)
router.post('/register', studentController.register)
router.post('/login', studentController.login)
router.post('/logout',studentController.logout)

router.get('/displayAddEventPage',  eventController.displayAddEventPage)
router.post('/add-event',  eventController.addEvent)
router.post('/register/:studId/for/:eventId', eventController.registerForEvent)
router.get('/eventPage/:id', eventController.eventPageAdminView)
router.get('/displayRegisterCoordinatorPage', coordinatorController.dsiplayAddCordPage)
router.post('/registerCordEmail', coordinatorController.registerCordEmail)




//APIS
router.post('/registerCord', coordinatorController.setUpAccount)
router.get('/getTodaysEvents', eventController.getTodaysEvents)
router.get('/getSingleEvent/:id', eventController.getSingleEvent)
router.post('/markPresent', eventController.markPresent)
router.get('/getPresentParticipants/:id', eventController.getPresentParticipants)
router.get('*', function(req, res){res.send("404")})
module.exports = router