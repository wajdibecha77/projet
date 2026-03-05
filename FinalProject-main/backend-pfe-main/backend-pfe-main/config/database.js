//Set up mongoose connection
const mongoose = require("mongoose");
const mongoDB = "mongodb://localhost:27017/mybackend";
mongoose.connect(
  mongoDB,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log('successffuly connected to db')
  }
);
mongoose.Promise = global.Promise;
module.exports = mongoose;