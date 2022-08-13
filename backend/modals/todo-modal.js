const mongoose = require("mongoose");

const todoArray = new mongoose.Schema({
    activityName:{
        type: String,
        require: true,
        unique:true
    },
    status:{
        type:String,
        required: true,
        default: "Pending"
    },
    bufferTime:{
        type:String,
        require:true,
        default:"00:00:00"
    },
    StartTime:{
        type:Date,
        require:true
    }
})

const todoInfoSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    todoList:{
        type:[todoArray],
        default:[]
    }
});

const todoInfo = mongoose.model("todoInfo",todoInfoSchema)

module.exports = todoInfo;