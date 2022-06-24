const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
	res.send("Hello");
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", projectRoutes);

module.exports = app;
