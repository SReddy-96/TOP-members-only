const db = require("../db/queries");

const getIndex = async (req, res, next) => {
  // get all messages if none show 'no messages'
  // show delete button if admin
  // show names and dates if premium member
  // probably all done in index.ejs using the user object.
  try {
    const messages = await db.getAllMessages();
    res.render("index", {
      title: "InnerCircle",
      messages: messages,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// admin delete message
const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("Message not found");
      err.statusCode = 404;
      return next(err);
    }
    await db.deleteMessage(id);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};


module.exports = {
  getIndex,
  deleteMessage,
};
