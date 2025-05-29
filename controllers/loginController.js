const passport = require('passport')

const getLogin = async (req, res) => {
  // get login form
  // shouldn't show the link if already logged in 
  res.render("login", { title: "login" });
};

// post request
// make sure to validate and sanitise data.
// this can be done inside the routes create a middleware.

const postLogin = (req,res)=>{
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
}

module.exports = {
  getLogin,
  postLogin
};
