const getIndex = async (req, res) => {
  // get all messages if none show 'no messages'
  // show delete button if admin
  // show names and dates if premium member
  // probably all done in index.ejs using the user object.

  res.render("index", { title: "Homepage", user: req.user });
};

module.exports = {
  getIndex,
};
