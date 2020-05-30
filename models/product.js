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
        required: true
    },
    catgory: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        min: 1
    },
    reviews: [String],
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true} )

module.exports = mongoose.model('Product', productSchema);