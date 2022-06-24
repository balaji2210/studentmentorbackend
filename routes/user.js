const express = require("express");

const {
	signup,
	signin,
	adminGetAllUsers,
	adminUpdateUser,
} = require("../controllers/user");
const { customRole, isLoggedIn } = require("../middlewares/user");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);

router
	.route("/admin/users")
	.get(isLoggedIn, customRole("admin"), adminGetAllUsers);

router
	.route("/admin/user/:id")
	.put(isLoggedIn, customRole("admin"), adminUpdateUser);

module.exports = router;
