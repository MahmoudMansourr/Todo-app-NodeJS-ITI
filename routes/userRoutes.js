const express = require("express");
const router = express.Router();
const User = require('../models/user');
const Joi = require('joi');
const validator = require("../middlewares/validator");
const verify = require("../middlewares/verify");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
const signJwt = promisify(jwt.sign);
const verifyJwt = promisify(jwt.verify);
const jwtSecret = "mySecret";
// const {jwtSecret} = require("../config");
const CustomError = require("../helpers/customError");
require("express-async-errors");



const checkRequiredFields= (params) => (req, res, next)=>{
    const receivedParams = Object.keys(req.body);
    const missingParams = params.filter(param=> !receivedParams.includes(param));
    if (missingParams.length){
        throw new CustomError(`missing parameter ${missingParams.join(",")}`, 400);
    }
    next();
}



router.get("/" ,verify ,async (req, res, next)=>{
    const users = await User.find({});
    res.send(users);
})

router.get("/:id", async (req, res, next)=>{
    const user = await User.findById(req.params.id);
    res.send(user); 
})

router.post("/",validator.validateSignin, async (req, res, next)=>{
    const {username, password} = req.body;
    const createdUser = new User({
    username,
    password
})
    await createdUser.save();
    res.send(createdUser);
    
})

router.post("/login", validator.validateSignin, async (req, res, next)=>{
    const {username, password} = req.body;

        const user = await User.findOne({username});
        if (!user){
            throw new CustomError("Invalid Credentails", 400);
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch){
            throw new CustomError("Invalid Credentails", 400);
        }

        const payload = {id:user._id};
        const token = await signJwt(payload, jwtSecret, {expiresIn: "1h"});
        // res.headers.Authorization = token;

        res.json({
            message: "logged in",
            token,
            user
        });
})

router.patch("/:id", validator.validateSignin ,async(req, res, next)=>{
    const {username, password} = req.body; 
    const filter = { id: req.params.id };
    const update = { username, password };

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { username, password },
        { new: true }
        );
        res.json(user);

})

router.delete("/:id", async(req, res, next)=>{
   
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });

})

module.exports = router;