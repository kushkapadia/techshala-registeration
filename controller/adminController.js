const Admin = require("../models/Admin")

exports.mustBeLoggedIn = function(req, res, next) {
    if (req.session.user) {
      if(req.session.user.role=="admin"){

        next()
      }
    } else {
      req.flash("errors", "You must be logged in to perform that action.")
      req.session.save(function() {
        res.redirect('/')
      })
    }
  }