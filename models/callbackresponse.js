var mongoose = require('mongoose');
var datetime = require('datetime');
// Product Schema
var CallbackResponseSchema = mongoose.Schema({
   
    CURRENCY: {
        type: String
    },
    GATEWAYNAME: {
        type: String
    },
    RESPMSG: {
        type: String
    },
    BANKNAME: {
        type: String
    },
    PAYMENTMODE: {
        type: String
    },
    MID: {
        type: String
    },
    RESPCODE: {
        type: String
    },
    TXNID: {
        type: String
    },
    TXNAMOUNT: {
        type: String
    },
    ORDERID: {
        type: String
    },
    STATUS: {
        type: String
    },
    BANKTXNID: {
        type: String
    },
    TXNDATE: {
        type: datetime
    },
    CHECKSUMHASH: {
        type: String
    }
    
});

var CallbackResponse = module.exports = mongoose.model('CallbackResponse', CallbackResponseSchema);