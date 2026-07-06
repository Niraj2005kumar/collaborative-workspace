const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    workspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace"
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Board",boardSchema);