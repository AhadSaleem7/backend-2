require('dotenv').config();
const User = require("../models/User");
const List = require("../models/list");
const mongoose = require('mongoose');

const conn = async () => {
    console.log("Loaded URI:", process.env.MONGODB_URI); // debug!
    await mongoose.connect(process.env.MONGODB_URI);
    await List.init();
    await User.init();
    console.log("Successfully connected to database");
}
conn();
