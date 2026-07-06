const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    card:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Card"
    },

    message:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Comment",commentSchema);