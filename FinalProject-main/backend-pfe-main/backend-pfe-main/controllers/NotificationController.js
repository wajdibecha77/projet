const Notification = require("../models/Notification");
const User = require("../models/User");
const Intervention = require("../models/intervention");

const normalizeRole = (role) => String(role || "").toUpperCase();

const buildNotificationScope = async (req) => {
  const me = await User.findById(req.user?.id).select("role");
  if (!me) return { denied: true, query: { _id: null } };

  if (normalizeRole(me.role) === "ADMIN") {
    return { denied: false, query: {} };
  }

  const interventions = await Intervention.find({
    $or: [{ createdBy: req.user.id }, { affectedBy: req.user.id }],
  }).select("_id");

  const interventionIds = interventions.map((i) => i._id);
  return {
    denied: false,
    query: {
      interventionId: { $in: interventionIds },
    },
  };
};

module.exports = {
  getAllNotifications: async (req, res) => {
    try {
      const { denied, query } = await buildNotificationScope(req);
      if (denied) {
        return res.status(401).json({
          message: "user not found",
          data: [],
        });
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(100);

      return res.status(200).json({
        message: "notifications found",
        data: notifications,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "error from server",
      });
    }
  },

  getNotificationById: async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({
        message: "notification id is required",
      });
    }

    try {
      const { denied, query } = await buildNotificationScope(req);
      if (denied) {
        return res.status(401).json({
          message: "user not found",
          data: null,
        });
      }

      const notification = await Notification.findOne({
        _id: req.params.id,
        ...(Object.keys(query).length ? query : {}),
      });

      if (!notification) {
        return res.status(404).json({
          message: "notification not found",
          data: null,
        });
      }

      return res.status(200).json({
        message: "notification found",
        data: notification,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "error from server",
      });
    }
  },

  markAsRead: async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({
        message: "notification id is required",
      });
    }

    try {
      const { denied, query } = await buildNotificationScope(req);
      if (denied) {
        return res.status(401).json({
          message: "user not found",
          data: null,
        });
      }

      const notification = await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          ...(Object.keys(query).length ? query : {}),
        },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({
          message: "notification not found",
          data: null,
        });
      }

      return res.status(200).json({
        message: "notification marked as read",
        data: notification,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "error from server",
      });
    }
  },
};
