const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "name is required"],
	},
	email: {
		type: String,
		unique: true,
		required: [true, "email is required field"],
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	role: {
		type: String,
		default: "user",
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.validatePassword = async function (usersendPassword) {
	return bcrypt.compare(usersendPassword, this.password);
};

userSchema.methods.getJwt = function () {
	return jwt.sign({ id: this.id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("User", userSchema);
