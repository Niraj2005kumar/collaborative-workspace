const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    assignee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    priority:{
        type:String,
        enum:["Low","Medium","High"],
        default:"Medium"
    },

    dueDate:{
        type:Date
    },

    list:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"List"
    },

    position:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Card",cardSchema);