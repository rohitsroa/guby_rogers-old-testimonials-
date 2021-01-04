var mongoose = require('mongoose');

// Page Schema
var EndSchema = mongoose.Schema({
   
    packagename: {
        type: [String],
    },
    totalamount: {
        type: Number
    },
    amount:{
        type:[Number]
    }

});

var End = module.exports = mongoose.model('End', EndSchema);