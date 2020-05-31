let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let cartSchema = new Schema ( {
    userId : String,
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true} )

module.exports = mongoose.model('Cart', cartSchema);