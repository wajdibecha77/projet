const { useColors } = require("debug/src/browser");
const { MongoClient, ObjectID } = require("mongodb");
const Intervention = require("../models/intervention");
const User = require("../models/User");
const Notification = require("../models/Notification");

const normalizeRole = (role) => String(role || "").toUpperCase();
const sameId = (a, b) => String(a || "") === String(b || "");

const canAccessIntervention = (intervention, requesterId, requesterRole) => {
  if (!intervention) return false;
  if (normalizeRole(requesterRole) === "ADMIN") return true;
  return (
    sameId(intervention.createdBy, requesterId) ||
    sameId(intervention.affectedBy, requesterId)
  );
};

module.exports = {
  addIntervention: async (req, res) => {
    const { name, delai, description, lieu, degree, createdBy } = req.body;

    if (!name || !delai || !description || !lieu || !degree || !createdBy) {
      return res.status(400).json({
        message: "all fields is required!",
      });
    }

    try {
      const newIntervention = new Intervention({
        name: name,

        delai: delai,
        description: description,
        lieu: lieu,
        degree: degree,
        createdBy: createdBy,
      });
      const savedIntervention = await newIntervention.save();

      const creator = await User.findById(createdBy).populate("service");
      if (creator && creator.role === "EMPLOYEE") {
        const employeeName = creator?.name || "Employe inconnu";
        const concernedTarget =
          (creator?.service && creator.service.name) ||
          description ||
          "Non specifie";
        const interventionDateTime = savedIntervention.createdAt || new Date();

        await Notification.create({
          category: "INTERVENTION_DECLARED",
          title: "Nouvelle declaration d'intervention",
          message:
            employeeName +
            " a declare une intervention de type " +
            name +
            " au lieu " +
            lieu +
            ".",
          type: "warning",
          isRead: false,
          interventionId: savedIntervention._id,
          metadata: {
            interventionType: name,
            employeeName,
            concernedTarget,
            interventionDateTime,
            lieu,
          },
        });
      }

      return res.status(200).json({
        message: "Intervention added!",
        data: savedIntervention,
      });
    } catch (err) {
      return res.status(500).json({
        message: err,
      });
    }
  },

  allInterventions: async (req, res) => {
    try {
      const me = await User.findById(req.user?.id).select("role");
      if (!me) {
        return res.status(401).json({
          message: "Utilisateur introuvable",
        });
      }

      let query = {};
      const role = String(me.role || "").toUpperCase();

      if (role === "ADMIN") {
        query = {};
      } else if (role === "EMPLOYEE") {
        // Employee/requester: only interventions created by this user.
        query = { createdBy: req.user.id };
      } else {
        // Technician roles: only interventions assigned to this user.
        query = { affectedBy: req.user.id };
      }

      const interventions = await Intervention.find(query)
        .populate("createdBy")
        .populate("affectedBy")
        .sort({ createdAt: -1 });

      return res.status(200).json(interventions);
    } catch (err) {
      return res.status(500).json({
        message: err.message || "error from server",
      });
    }
  },

  getInterventionById: async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({
        status: 400,
        message: "Intervention ID is required in params!",
      });
    }
    try {
      const inter = await Intervention.findById({ _id: req.params.id });
      if (!inter) {
        return res.status(404).json({
          message: "Intervention not found",
        });
      }

      const me = await User.findById(req.user?.id).select("role");
      if (!me) {
        return res.status(401).json({
          message: "Utilisateur introuvable",
        });
      }

      if (!canAccessIntervention(inter, req.user.id, me.role)) {
        return res.status(403).json({
          message: "Acces refuse",
        });
      }

      let createdby = await User.findById({ _id: inter.createdBy });
      let affected = null;
      if (inter.affectedBy) {
        affected = await User.findById({ _id: inter.affectedBy });
      }
      if (inter.affectedToUsers && inter.affectedToUsers.length > 0) {
        let result = await Promise.all(
          inter.affectedToUsers.map(async (id) => {
            let user = await User.findById({ _id: id.toString() });
            return user;
          })
        );

        return res.status(200).json({
          name: inter.name,
          _id: inter._id,
          createdBy: createdby,
          degree: inter.degree,
          etat: inter.etat,
          delai: inter.delai,
          dateDebut: inter.dateDebut,
          dateEnd: inter.dateEnd || null,
          affectedBy: affected || null,
          description: inter.description,
          lieu: inter.lieu,
          affectedToUsers: result,
          workDetails: inter.workDetails || "",
          technicianComments: inter.technicianComments || [],
          reportedProblems: inter.reportedProblems || [],
        });
      }

      return res.status(200).json({
        name: inter.name,
        _id: inter._id,
        createdBy: createdby,
        degree: inter.degree,
        etat: inter.etat,
        dateDebut: inter.dateDebut,
        dateEnd: inter.dateEnd || null,
        delai: inter.delai,
        affectedBy: affected || null,
        description: inter.description,
        lieu: inter.lieu,
        affectedToUsers: null,
        workDetails: inter.workDetails || "",
        technicianComments: inter.technicianComments || [],
        reportedProblems: inter.reportedProblems || [],
      });
    } catch (err) {
      return res.status(400).json({
        message: err,
      });
    }
  },

  deleteIntervention: async (req, res) => {
    if (req.params.id) {
      let id = req.params.id;
      try {
        await Intervention.findByIdAndDelete({ _id: id });
        res.status(200).json({
          message: "Intervention deleted successfully",
        });
      } catch (err) {
        res.status(500).json({
          message: "Error collection!",
        });
      }
    } else {
      res.status(400).json({
        message: "ID is required!",
      });
    }
  },

  updateIntervention: async (req, res) => {
    const { affectedBy, etat, fermer, workDetails, comment, problem } = req.body;
    const me = await User.findById(req.user?.id).select("role");
    if (!me) {
      return res.status(401).json({
        message: "Utilisateur introuvable",
      });
    }

    const requesterRole = normalizeRole(me.role);
    const isAdmin = requesterRole === "ADMIN";
    const inter = await Intervention.findById({ _id: req.params.id });

    if (!inter) {
      return res.status(404).json({
        message: "Intervention introuvable",
      });
    }

    const hasAssignmentUpdate = !!affectedBy;
    const hasStatusUpdate = !!etat || !!fermer;
    const hasWorkUpdate =
      (workDetails !== undefined && String(workDetails).trim() !== "") ||
      (comment !== undefined && String(comment).trim() !== "") ||
      (problem !== undefined && String(problem).trim() !== "");

    if (req.params.id && hasAssignmentUpdate) {
      if (!isAdmin) {
        return res.status(403).json({
          message: "Seul l'administrateur peut affecter une intervention",
        });
      }

      try {
        await Intervention.findByIdAndUpdate(
          { _id: req.params.id },
          {
            affectedBy: affectedBy,
            affectedToUsers: inter.affectedToUsers && inter.affectedToUsers.length > 0 ? [...inter.affectedToUsers, affectedBy] : [affectedBy],
            dateDebut: Date.now(),
            etat: "EN_COURS",
          }
        );
        res.status(200).json({
          message: "Intervention affected to tech successfully",
        });
      } catch (err) {
        return res.status(500).json({
          message: "error from server",
        });
      }
    } else if (fermer && !etat) {
      if (!isAdmin && !sameId(inter.affectedBy, req.user.id)) {
        return res.status(403).json({
          message: "Acces refuse",
        });
      }

      try {
        await Intervention.findByIdAndUpdate(
          { _id: req.params.id },
          {
            dateDebut: null,
            etat: "NON_AFFECTEE",
            affectedBy: null,
          }
        );
        return res.status(200).json({
          message: "Intervention updated successfully",
        });
      } catch (err) {
        return res.status(500).json({
          message: "error from server",
        });
      }
    } else if (etat) {
      if (!isAdmin && !sameId(inter.affectedBy, req.user.id)) {
        return res.status(403).json({
          message: "Acces refuse",
        });
      }

      try {
        await Intervention.findByIdAndUpdate(
          { _id: req.params.id },
          {
            dateEnd: Date.now(),
            etat: etat,
          }
        );
        return res.status(200).json({
          message: "Intervention updated successfully",
        });
      } catch (err) {
        return res.status(500).json({
          message: "error from server",
        });
      }
    } else if (hasWorkUpdate) {
      if (!isAdmin && !sameId(inter.affectedBy, req.user.id)) {
        return res.status(403).json({
          message: "Acces refuse",
        });
      }

      try {
        const updateOps = {};

        if (workDetails !== undefined && String(workDetails).trim() !== "") {
          updateOps.$set = {
            workDetails: String(workDetails).trim(),
          };
        }

        if (comment !== undefined && String(comment).trim() !== "") {
          updateOps.$push = {
            ...(updateOps.$push || {}),
            technicianComments: {
              author: req.user.id,
              text: String(comment).trim(),
              createdAt: new Date(),
            },
          };
        }

        if (problem !== undefined && String(problem).trim() !== "") {
          updateOps.$push = {
            ...(updateOps.$push || {}),
            reportedProblems: {
              author: req.user.id,
              description: String(problem).trim(),
              createdAt: new Date(),
              status: "OPEN",
            },
          };
        }

        await Intervention.findByIdAndUpdate({ _id: req.params.id }, updateOps);
        return res.status(200).json({
          message: "Intervention details updated successfully",
        });
      } catch (err) {
        return res.status(500).json({
          message: "error from server",
        });
      }
    }

    return res.status(400).json({
      message: "Aucune mise a jour fournie",
    });
  },
};
