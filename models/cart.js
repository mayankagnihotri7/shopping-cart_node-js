let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let cartSchema = new Schema ( {
    userId : {type: Schema.Types.ObjectId, ref: 'User'},
    products: [{
        productId: {type: Schema.Types.ObjectId,
        ref: 'Product'},
        quantity: {type: Number, deafult: 1}
    }]
}, {timestamps: true} )

module.exports = mongoose.model('Cart', cartSchema);