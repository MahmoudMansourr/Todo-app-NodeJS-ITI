const mongoose = require('mongoose');
const {mongoUri} = require('./config');
require('dotenv').config();
mongoose.connect(mongoUri)
.then(()=> console.log("connected to database"))
.catch((err)=> {
    console.log(err);
    process.exit
})