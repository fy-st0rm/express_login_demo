const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
	var username = req.query.username;
	res.render("sucess", { username: username });
});

module.exports = router;
