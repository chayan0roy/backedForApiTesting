const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required:true,
    },
    image:{
        type: String,
        default: null
    }
},{timestamps:true});


const TeacherModel = mongoose.model('Teacher', TeacherSchema);
module.exports = TeacherModel;