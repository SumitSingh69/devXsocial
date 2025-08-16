const userAuth = (req, res, next) => {
  const token = req.query.token;
  const isUser = token === "notSumit69";
  if (!isUser) {
    return res.status(401).send("Nice try bastard");
  } else {
    next();
  }
};

module.exports = { userAuth };
