let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reviewSchema = new Schema({
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    content: {
        type: String,
        trim: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
},{timestamps: true});

module.exports = mongoose.model("Review", reviewSchema);