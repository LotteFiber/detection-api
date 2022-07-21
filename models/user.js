const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:true
    },
    pass_word:{
        type:String,
        required:true
    }
})

mongoose.model('User',userSchema)