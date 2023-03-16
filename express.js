const express = require('express');
const app = express();
const cors = require('cors');
// const port = 3002;
const {port} = require("./config");
const morgan = require('morgan');
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");
require("express-async-errors");
require("dotenv").config();
require("./config");


require('./db');
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use("/user", userRoutes);
app.use("/todo", todoRoutes);

app.use((err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    console.log("error from handler");
    res.status(err.statusCode).json({
        status: "error",
        code: err.statusCode,
        message: err.message || "something went wrong"
    })
    // res.json({
    //     status: "error",
    //     code: err.statusCode,
    //     message: err.message || "something went wrong"
    // })
    // res.status(500).send(err.statusCode<500 ? err.message: "internal server error");
    //res.send(err.message);

})
app.listen(port);