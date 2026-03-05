const express = require("express");

const route = express.Router();

const clientcontroller = require("../controllers/ClientController");

//create client
route.post("/", clientcontroller.createclient);

module.exports = route;
