const express = require("express");
const router = express.Router();
const Todo = require('../models/todo')
const verify = require("../middlewares/verify");
const CustomError = require('../helpers/customError');

router.get("/" ,verify, async (req, res, next)=>{
    try{
        const todos = await Todo.find({user:req.user._id});
    res.send(todos);
    }catch(err){
        return next(err);
    }
})

// router.get("/:id", async (req, res, next)=>{
//     try{
//         const todo = await Todo.findById(req.params.id);
//         res.send(todo); 
//     }catch(err){
//         return next(err);
//     }
// })

router.post('/',verify, async(req,res,next)=>{
    const createdTodo = await Todo.create({
        title: req.body.title,
        status: req.body.status,
        user: req.user._id
    })
    // try{
    //     const {title, status} = req.body;
    //     const createdTodo = new Todo({
    //     title,
    //     status
    // })
    // await createdTodo.save();
    res.send(createdTodo);

    // }catch(err){
    //     return next(err);
    // }
})

router.patch("/:id", verify, async(req, res, next)=>{
    const {title, status} = req.body; 
    const filter = { id: req.params.id };
    const update = { title, status };
    let flag = false
    try{
        const todos = await Todo.find({user:req.user._id});
        for(let i=0; i< todos.length; i++){
            if(todos[i]._id == req.params.id){
                const todo = await Todo.findByIdAndUpdate(
                req.params.id,
                { title, status },
                { new: true }
                );
                res.json(todo);
                flag = true
            }
        }
        if(!flag) throw new CustomError("not auth", 401);

    }catch(err){
        return next(err);
    }
})

router.delete("/:id", verify, async(req, res, next)=>{
    try{
        let flag = false;

        const todos = await Todo.find({user:req.user._id});
        for(let i=0; i< todos.length; i++){
            if(todos[i]._id == req.params.id){
                const todo = await Todo.findByIdAndDelete(req.params.id);
                res.json({ message: 'Todo deleted successfully' });
                flag = true
            }
        }
        if(!flag) throw new CustomError("not auth", 401);



        // const todo = await Todo.findByIdAndDelete(req.params.id);
        // res.json({ message: 'Todo deleted successfully' });

    }catch(err){
        return next(err);
    }
})


module.exports = router;