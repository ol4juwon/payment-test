"use strict"
const mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');


const schema = mongoose.Schema({
    amount: { type: String, required:true,min: 2, max:255},
    trx_ref: { type: String ,index: true, unique: true,required:true},
    channel: { type: String, required:true, min: 8,max:64},
    meta: {type: Object,required: true },
    status: {type: String, default: 'pending'},
    user_id: {type: String,required: true},
    description: {type: String, default: 'Payment on alvative'}
    
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.trxID = ret._id;
            ret.id = ret._id;
            delete ret.__v;
            delete ret._id;
        }
    },
    timestamps: true
});

schema.post('save', function(payment){
    console.log("Post save ", payment);
})

schema.index({"$**": "text"});
schema.plugin(mongoosePaginate)
module.exports = mongoose.model('payment',schema);  