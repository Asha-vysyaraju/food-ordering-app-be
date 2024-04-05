import { model, Schema } from 'mongoose';

import mongoose from "mongoose";
// var CounterSchema = new Schema({
//   _id: {type: String, required: true},
//   seq: { type: Number, default: 0 }
// });
// var counter = model('counter', CounterSchema);

export const FoodSchema = new Schema(
  {
   
      
   name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    stars: { type: Number, default: 3 },
    imageUrl: { type: String, required: true },
    
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export const FoodModel = model('food', FoodSchema);




// FoodSchema.pre('save', function(next) {
//   var doc = this;
//   counter.findByIdAndUpdateAsync({_id: 'foodId'}, {$inc: { seq: 1} }, {new: true, upsert: true}).then(function(count) {
//       console.log("...count: "+JSON.stringify(count));
//       doc.id = count.seq;
//       next();
//   })
//   .catch(function(error) {
//       console.error("counter error-> : "+error);
//       throw error;
//   });
// })