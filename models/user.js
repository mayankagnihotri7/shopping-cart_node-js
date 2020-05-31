let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');

let userSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    image: String,
    verification: String,
    bio: String,
    cart: {type: Schema.Types.ObjectId, ref: 'Product'}
}, {timestamps: true});

// Hashing password.
userSchema.pre('save', async function (next) {
    try {
    
        if (this.password && this.isModified('password')) {
            
        this.password = await bcrypt.hash(this.password, 10);
    
        return next();
    
    } else { next() }

    } catch (error) {

        next (error);

    }
})

// Verify Password.
userSchema.methods.verify = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema);