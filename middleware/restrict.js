const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");

function restrict() {
 const authError = {
  message: "Invalid Credentials"
 };
 return async (req, res, next) => {
  try {
   const { username, password } = req.headers;
   // make sure that the values aren't empty
   if (!username || !password) {
    return res.status(401).json(authError);
   }
   // fetch user from database
   const user = await Users.findBy({ username }).first();
   // make sure the user exists

   if (!user) {
    return res.status(401).json(authError);
   }
   // fetch the password from the database
   const passwordValid = await bcrypt.compare(password, user.password);

   // make sure thhe password is correct
   if (!passwordValid) {
    return res.status(401).json(authError);
   }
   // if we reach this point, thhe user is authenticated!
   next();
  } catch (err) {
   next(err);
  }
 };
}

module.exports = restrict;
