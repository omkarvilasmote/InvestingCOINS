const express = require("express");
const cookieParser = require("cookie-parser");
router = express.Router();

router.use(cookieParser());

router.get("/logout", (req, res) => {
    // Clear the "uid" cookie
    res.clearCookie("uid");
    res.redirect("/login"); // Redirect to the home page or login page
});


module.exports=router;