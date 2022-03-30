const mongoose = require('mongoose');
const _ = require('underscore');

let DomoModel = {};

const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    require: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  level: {
    type: Number,
    min: 1,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  level: doc.level,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // Convert the string ownerId to an object id
    owner: mongoose.Types.ObjectId(ownerId),
  };
  // Find data given the query above (user ID), give me the name and age,
  // lean object returned, exec is for mongoose sake
  // Then call the callback after all that!
  return DomoModel.find(search).select('name age level').lean().exec(callback);
};

// https://stackoverflow.com/questions/2824157/random-record-from-mongodb
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/sample/
// https://www.mongodb.com/docs/manual/aggregation/
DomoSchema.statics.findRandomDomo = (callback) => DomoModel.aggregate([{ $sample: { size: 1 } }]).select('name age level').lean().exec(callback);

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports = DomoModel;
