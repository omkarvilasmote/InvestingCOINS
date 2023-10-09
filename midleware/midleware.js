const { getUser } = require("../config/auth");
const express = require('express')
const cookieParser = require('cookie-parser');
const routes = require("../routes");

const router = express.Router();

router.use(cookieParser())

async function restrictToLoggedinUserOnly(req, res, next) {
  const userUid = req.cookies?.uid;

  if (!userUid) {
  return res.redirect("/login")};

  const user = getUser(userUid);

  if (!user) {
  return res.redirect("/login")};

  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
  const userUid = req.cookies?.uid;

  const user = getUser(userUid);

  req.user = user;
  next();
}

module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth,
};