const express = require("express");

const { isLoggedIn, customRole } = require("../middlewares/user");

const {
	createProject,

	getAllSelectedProjects,
	updateProjects,
	updateRating,
	getAdminProjects,
	getStudentsProjects,
	adminGetAProject,
	superUserGetAllProjects,
} = require("../controllers/project");

const router = express.Router();

router
	.route("/create/project")
	.post(isLoggedIn, customRole("user"), createProject);

router
	.route("/admin/projects")
	.get(isLoggedIn, customRole("admin"), getAdminProjects);

router
	.route("/admin/projects/selected")
	.get(isLoggedIn, customRole("admin"), getAllSelectedProjects);
router
	.route("/admin/projects/superuser")
	.get(isLoggedIn, customRole("admin"), superUserGetAllProjects);

router
	.route("/admin/project/:id")
	.put(isLoggedIn, customRole("admin"), updateProjects)
	.get(isLoggedIn, customRole("admin"), adminGetAProject);

router
	.route("/admin/projects/rating/:id")
	.put(isLoggedIn, customRole("admin"), updateRating);

router
	.route("/student/projects")
	.get(isLoggedIn, customRole("user"), getStudentsProjects);
module.exports = router;
