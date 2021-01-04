var mongoose = require('mongoose');

// Page Schema
var TestimonialSchema = mongoose.Schema({
   
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    content: {
        type: String
    },
    slug: {
        type: String
    }
    
});

var Testimonial = module.exports = mongoose.model('Testimonial', TestimonialSchema);
