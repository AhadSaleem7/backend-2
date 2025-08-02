const mongoose = require("mongoose")
const listSchema = mongoose.Schema({
 title : {
    type : String,
    required : true
 },
 body : {
    type : String,
    required : true 
 },
 user  : [
    {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    }
 ]
},{timestamps : true})
listSchema.index({ title: 1, body: 1, user: 1 }, { unique: true });


module.exports = mongoose.model("List",listSchema)