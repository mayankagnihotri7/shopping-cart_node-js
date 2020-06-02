let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reviewSchema = new Schema({
    author : String,
    content: String,
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
},{timestamps: true});

module.exports = mongoose.model("Review", reviewSchema);