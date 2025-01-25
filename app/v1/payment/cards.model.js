"use strict"
const mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');


const schema = mongoose.Schema({
    cardAuth: { type: String, required:true,min: 2, max:255},
    user_id: { type: String ,required:true},
    cardSig: { type: String, required:true, min: 8,max:64},
    last4: { type: String ,required:true , min:4, max:4},
    bank: {type: String, required: true},
    
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.cardID = ret._id;
            delete ret.__v;
            delete ret._id;
        }
    },
    timestamps: true
});

schema.post('save', function(card){
    console.log("Post save ", card);
})

schema.index({"$**": "text"});
schema.plugin(mongoosePaginate)
module.exports = mongoose.model('cards',schema);  