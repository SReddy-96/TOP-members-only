const getClub = async (req, res) => {
  // show member form if no premium_member
  // if true, then don't show the page or link in header.
  res.render("club", { title: "Premium Member" });
};

// post request takes a secret password in .env and if it matches then change premium_member to true
// check if user is premium already

module.exports = {
  getClub,
};
