const express = require("express");

const route = express.Router();

const NotificationController = require("../controllers/NotificationController");
const isauth = require("../middlewares/isauth");

route.get("/all", isauth, NotificationController.getAllNotifications);
route.get("/my", isauth, NotificationController.getMyNotifications);
route.put("/read-all", isauth, NotificationController.markAllAsRead);
route.get("/:id", isauth, NotificationController.getNotificationById);
route.put("/:id/read", isauth, NotificationController.markAsRead);

module.exports = route;
