var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
// User Schema
var UserSchema = mongoose.Schema({
   
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    mobilenumber: {
        type: String,
        required: true
    },
    refcode: {
        type: String,
    },
    customerid:{
        type: Number
    }
});
UserSchema.plugin(autoIncrement.plugin, {
    model: 'Users',
    field:'customerid',
    prefix:'CUST_',
});

var User = module.exports = mongoose.model('User', UserSchema);