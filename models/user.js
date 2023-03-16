const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {saltRound} = require('../config');
// const saltRound = 12;
// console.log(saltRound);

const userSchema = new Schema({
    username: {
        type : String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
},
{
    toJSON:{ 
    transform: (doc, ret)=>{
        delete ret.__v;
        delete ret.password;
        const dataToReturn = _.pick(ret,["_id", "username"]);
        return dataToReturn;
    }
}
})

userSchema.pre("save", async function(){
    const userDocument = this;
    if(userDocument.isModified("password")){
        const hashedPassword = await bcrypt.hash(userDocument.password,parseInt(saltRound));
        userDocument.password = hashedPassword;
    }
})
userSchema.methods.comparePassword = function(password){
    const userDocument = this;
    return bcrypt.compare(password, userDocument.password)
}
const User = mongoose.model('User', userSchema);
module.exports= User; 