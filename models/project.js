const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "please Enter name"],
	},
	skills: {
		type: [String],
		required: true,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	isSelected: {
		type: String,
		default: "pending",
	},
	ratings: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model("Project", projectSchema);
