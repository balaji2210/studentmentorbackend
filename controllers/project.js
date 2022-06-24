const Bigpromise = require("../middlewares/Bigpromise");
const Project = require("../models/project");

exports.createProject = Bigpromise(async (req, res, next) => {
	req.body.user = req.user._id;

	const project = await Project.create(req.body);
	return res.status(200).json({
		success: true,
		project,
	});
});

exports.getAdminProjects = Bigpromise(async (req, res, next) => {
	const user = await Project.find({ user: req.user });
	const skills = user[0].skills;
	// console.log(user);

	let projects = await Project.find({ skills: { $in: skills } }).populate(
		"user",
		"_id name role"
	);
	// console.log(projects);

	projects = projects.filter((proj) => proj.user.role.toString() !== "admin");
	projects = projects.filter(
		(proj) => proj.isSelected.toString() !== "accepted"
	);

	// console.log(projects);
	return res.status(200).json({
		success: true,
		projects,
	});
});

exports.getAllSelectedProjects = Bigpromise(async (req, res, next) => {
	const user = await Project.find({ user: req.user });
	const skills = user[0].skills;
	projects = await Project.find({ skills: { $in: skills } }).populate(
		"user",
		"_id name role"
	);
	projects = projects.filter((proj) => proj.user.role.toString() !== "admin");
	projects = projects.filter(
		(proj) => proj.isSelected.toString() !== "pending"
	);
	if (!projects) {
		return res.status(400).json({
			message: "No projects Found",
		});
	}
	return res.status(200).json({
		success: true,
		projects,
	});
});

exports.updateProjects = Bigpromise(async (req, res, next) => {
	let project = await Project.findById(req.params.id);
	if (!project) {
		return res.status(400).json({
			success: true,
			message: "No project found with Id",
		});
	}
	if (project.isSelected === "pending") {
		project.isSelected = "accepted";
	}
	await project.save();
	return res.status(200).json({
		success: true,
		project,
	});
});

exports.updateRating = Bigpromise(async (req, res, next) => {
	let project = await Project.findById(req.params.id);
	let ratings = req.body.ratings;

	if (!project) {
		return res.status(400).json({
			success: true,
			message: "No project found with Id",
		});
	}
	project.ratings = ratings;

	await project.save();
	return res.status(200).json({
		success: true,
		project,
	});
});

exports.getStudentsProjects = Bigpromise(async (req, res) => {
	let projects = await Project.find({ user: req.user }).populate(
		"user",
		"_id name"
	);
	if (!projects) {
		return res.status(400).json({
			success: false,
			message: "No project found with Id",
		});
	}
	return res.status(200).json({
		success: true,
		projects,
	});
});

exports.adminGetAProject = Bigpromise(async (req, res, next) => {
	const project = await Project.findById(req.params.id).populate(
		"user",
		"_id name"
	);
	if (!project) {
		return res.status(400).json({
			success: false,
			message: "No project found with Id",
		});
	}
	return res.status(200).json({
		success: true,
		project,
	});
});

exports.superUserGetAllProjects = Bigpromise(async (req, res, next) => {
	const projects = await Project.find({ isSelected: "accepted" });
	if (!projects) {
		return res.status(400).json({
			success: false,
			message: "No projects found ",
		});
	}
	return res.status(200).json({
		success: true,
		projects,
	});
});
