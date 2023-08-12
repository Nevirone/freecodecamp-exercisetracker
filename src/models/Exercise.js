const mongoose = require('mongoose')

const exerciseSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    default: new Date(Date.now()).toDateString()
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  }

})

const Exercise = mongoose.model('exercise', exerciseSchema)

module.exports = Exercise