require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

require("./config/database"); // ✅ IMPORTANT: connect to MongoDB

app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// routes
app.use("/users", require("./routes/UserRouter"));
app.use("/orders", require("./routes/OrderRouter"));
app.use("/services", require("./routes/ServiceRouter"));
app.use("/interventions", require("./routes/InterventionRouter"));
app.use("/admins", require("./routes/AdminRouter"));
app.use("/auth", require("./routes/AuthRouter"));
app.use("/notifications", require("./routes/NotificationRouter"));

app.get("/", (req, res) => res.send("hello moatez wajdi"));

app.get("/hello/:name", (req, res) => res.send("hello " + req.params.name));

app.get("/getfile/:image", (req, res) => {
  res.sendFile(__dirname + "/uploads/" + req.params.image);
});

app.listen(5000, () => {
  console.log("server is runing on port 5000");
});