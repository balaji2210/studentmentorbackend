const User = require("../models/User");
const BigPromise = require("../middlewares/Bigpromise");
const CustomError = require("../utils/customError");
const { cookieToken } = require("../utils/cookieToken");

exports.signup = BigPromise(async (req, res, next) => {
	const { name, email, password } = req.body;

	if (!(name || email || password)) {
		return res.status(400).json({
			message: "All field are required",
		});
	}

	const existUser = await User.findOne({ email });

	if (existUser) {
		return res.status(400).json({
			success: false,
			message: "User Email already exists",
		});
	} else {
		const user = await User.create(req.body);

		cookieToken(user, res);
	}
});

exports.signin = BigPromise(async (req, res, next) => {
	const { email, password } = req.body;

	if (!(email || password)) {
		return res.status(400).json({
			message: "email and password is required",
		});
	}

	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400).json({
			message: "No user found with email",
		});
	}
	const isValid = await user.validatePassword(password);

	if (!isValid) {
		return res.status(400).json({
			message: "Wrong Email or password",
		});
	}
	cookieToken(user, res);
});

exports.adminUpdateUser = BigPromise(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (user._id.toString() === process.env.ID) {
		return res.status(200).json({
			success: false,
			message: "Super Admin role Cannot be Changed",
		});
	}
	if (user.role === "user") {
		user.role = "admin";
	} else {
		user.role = "user";
	}

	await user.save();

	return res.status(200).json({
		success: true,
		message: "User Updated",
	});
});

exports.adminGetAllUsers = BigPromise(async (req, res, next) => {
	const users = await User.find().select("-password");

	if (!users) {
		return res.status(400).json({
			message: "No Users found",
		});
	}

	return res.status(200).json({
		success: true,
		users,
	});
});
