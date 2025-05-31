const mongoose = require('mongoose');
require('dotenv').config();

// const mongoUrl = 'mongodb://localhost:27017/hotel'
//const mongoUrl = 'mongodb+srv://yogeshkhinchi2005:YogeshZ7877@cluster0.npfllfr.mongodb.net/'

//we connected to uor server with some privacy :) 
const mongoUrl = process.env.DB_URL ;

mongoose.connect(mongoUrl , {
    useNewUrlParser : true ,
    useUnifiedTopology : true 
});

const db = mongoose.connection ;

//define event listeners on the database connection .

db.on('connected' , ()=>{
    console.log("connected to the mongoose server ");
})

db.on('error' , (err)=>{
    console.log("an error accured " , err)
})

db.on('disconnected' , ()=>{
    console.log("server disconnected");
})

module.exports = db ;