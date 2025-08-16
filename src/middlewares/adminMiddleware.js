const adminAuth = (req, res, next) => {
  // check wheter the user is an admin or not
  const token = req.query.token;
  const isAdmin = token === "sumit69";
  if (!isAdmin) {
    return res.status(401).send("get out you bastard");
  } else {
    next();
  }
};

module.exports = { adminAuth };
