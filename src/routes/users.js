const express = require('express')
const User = require('../models/User')
const Exercise = require('../models/Exercise')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const users = await User.find()

    res.status(200).send(users)
  }
  catch (err) {
    console.error(err)
    res.status(500).send()
  }
})

router.post('/', async (req, res) => {
  if (!req.body.username)
    return res.status(400).send({ message: 'Username not provided' })

  try {
    const user = User({
      username: req.body.username
    })

    await user.save()
    res.status(201).send(user)
  }
  catch (err) {
    console.error(err)
    res.status(500).send()
  }
})

router.post('/:_id/exercises', async (req, res) => {
  if (!req.body.description)
    return res.status(400).send({ message: 'Description not provided' })

  if (!req.body.duration)
    return res.status(400).send({ message: 'Duration not provided' })

  try {
    const user = await User.findById(req.params._id)

    if (!user)
      return res.status(404).send({ message: 'User with given id not found' })

    const exercise = Exercise({
      description: req.body.description,
      duration: Number(req.body.duration),
      userId: user._id
    })

    if (req.body.date)
      exercise.date = new Date(req.body.date).toDateString()

    await exercise.save()

    res.json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date,
      _id: user._id
    });
  }
  catch (err) {
    console.error(err)
    res.status(500).send()
  }
})

router.get('/:_id/logs', async (req, res) => {
  try {
    const user = await User.findById(req.params._id)

    if (!user)
      return res.status(404).send({ message: 'User with given id not found' })

    const exercises = await Exercise.find({ userId: user._id })

    let response = user.toObject()
    response.count = exercises.length
    response.log = exercises

    if(req.query.from) {
      const fromDate = new Date(req.query.from)
       response.log = response.log.filter(obj => {
        const date = new Date(obj.date)
        return date >= fromDate
      })
    }
    
    if(req.query.to) {
  const toDate = new Date(req.query.to)
       response.log = response.log.filter(obj => {
        const date = new Date(obj.date)
        return date <= toDate
      })
    }

    if(req.query.limit)
      response.log = response.log.splice(0, req.query.limit)
 
    res.json(response)
  }
  catch(err) {
    console.error(err)
    res.status(500).send()
  }
})

module.exports = router