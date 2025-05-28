const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
    },
    age : {
        type : Number ,
        required : true ,
    },
    work : {
        type : String ,
        enum : ['chef' , 'manager' , 'waiter'] ,
        required : true ,

    },
    mobile : {
        type : String ,
        required : true ,
    },
    email : {
        type : String ,
        required : true ,
        unique : true , //no same email address will be stored .
    },
     salary : {
        type : Number ,
        required : true ,
        
    },
    username : {
        type : String ,
        required : true 
    },
    password : {
        type : String ,
        required : true ,
    }
});
//create person model .

const Person = mongoose.model('Person' , personSchema); //export personschema as person .
module.exports = Person ;