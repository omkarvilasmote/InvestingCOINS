const jwt = require('jsonwebtoken')
require('dotenv').config();
const privatekey = process.env.UIDKEY;
const secret = privatekey;

function setUser(user) {
  return jwt.sign({
    _id: user._id,
    phoneNumber : user.phoneNumber,
  },secret)
}

function getUser(token) {
  if(!token) return null;
  return jwt.verify(token,secret);
}

module.exports = {
  setUser,
  getUser,
  secret,
};