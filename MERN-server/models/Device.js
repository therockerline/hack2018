const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

var DeviceSchema = new Schema({
    deviceId : String,
    platform : String
});

module.exports = DeviceSchema = mongoose.model("DeviceSchema", DeviceSchema);