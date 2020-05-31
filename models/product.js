let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema ( {
    image: String,
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        default: 0,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    reviews: [{type: Schema.Types.ObjectId, ref: 'User'}]
}, {timestamps: true} )

module.exports = mongoose.model('Product', productSchema);