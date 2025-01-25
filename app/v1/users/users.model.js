"use strict"
const mongoose = require('mongoose');
// let mongoosePaginate = require('mongoose-paginate');


const schema = mongoose.Schema({
    name: { type: String, required:true,min: 2, max:255},
    email: { type: String ,required:true, unique: true},
    password: { type: String, required:true, min: 8,max:64},
    balance: {type: Number, default: 0.00},
    avatar: {type: String, default: "https://cdn2.vectorstock.com/i/1000x1000/20/76/man-avatar-profile-vector-21372076.jpg"},
    
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.userId = ret._id;
            ret.id = ret.userId;
            delete ret.password;
            delete ret.__v;
            delete ret._id;
        }
    },
    timestamps: true
});

schema.post('save', function(user){
    logger.info("Post save ", user);
})

schema.index({"$**": "text"});
// schema.plugin(mongoosePaginate)
module.exports = mongoose.model('users',schema);  