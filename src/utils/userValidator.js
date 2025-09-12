const validator = require("validator");

const userValidator = (req) => {
  const { firstName, midName = "", lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }

  if (validator.isEmail(email) === false) {
    throw new Error("Invalid email");
  }
  if (validator.isStrongPassword(password) === false) {
    throw new Error("Password is not strong enough");
  }
};

module.exports = userValidator;
