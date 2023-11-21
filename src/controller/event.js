const Event = require('../models/event.model')

const catchAsync = require('../utils/catchAsync')

const getEvent = catchAsync(async (req, res, next) => {

    const { eventId, from, to, category, subcategory, long, lat, status, name, createdBy, self } = req.query

    let { limit, page } = req.query

    const miles = 20

    limit = Number(limit) || 10

    page = Number(page) || 1

    const skip = (page - 1) * limit

    const userId = req.userId

    const query = {}

    if (eventId)
        query._id = eventId

    if (from)
        query['date.start'] = { $gte: new Date(from) }

    if (to)
        query['date.end'] = { $lte: new Date(to) }

    if (category)
        query.category = category

    if (subcategory)
        query.subcategory = subcategory

    if (status)
        query.status = status

    if (name)
        query.name = { $regex: name, $options: 'i' }

    if (long && lat)
        query['location.coordinates'] = {
            $geoWithin:
                { $centerSphere: [[Number(long), Number(lat)], miles / 3963.2] }
        }

    if (createdBy)
        query.createdBy = userId

    if (self)
        query['bookedBy.userId'] = userId

    const model = createdBy ? Event.find(query).populate({
        path: 'bookedBy',
        model: 'Users',
        match: { _id: { $exists: true } },
        select: 'name'
    }) : Event.find(query).select('-bookedBy')

    const fetchEvent = await model.skip(skip).limit(limit).sort({ 'date.start': -1 }).lean()

    return res.json({ statusCode: 200, data: fetchEvent })

})

const createEvent = catchAsync(async (req, res, next) => {

    const { name,
        description,
        date,
        location,
        seats,
        organiser,
        price,
        cover,
        category,
        subcategory } = req.body

    const userId = req.userId

    const eventData = await new Event({
        name,
        description,
        date,
        location,
        seats,
        organiser,
        price,
        cover,
        category,
        subcategory, createdBy: userId
    }).save()

    return res.json({ statusCode: 200, data: eventData })

})

const updateEvent = catchAsync(async (req, res, next) => {

    const { name,
        description,
        date,
        location,
        seats,
        organiser,
        price,
        cover,
        category,
        subcategory } = req.body

    const updateData = {
        name,
        description,
        date,
        location,
        seats,
        organiser,
        price,
        cover,
        category,
        subcategory
    }

    const userId = req.userId

    const { eventId } = req.params

    const eventData = await Event.findOne({
        _id: eventId, createdBy: userId
    })

    if (
        !eventData
    )
        throw new NotFoundError('/updateEvent')

    Object.assign(eventData, updateData)

    await eventData.save()

    return res.json({ statusCode: 200, data: eventData })

})

const deleteEvent = catchAsync(async (req, res, next) => {

    const userId = req.userId

    const { eventId } = req.params

    const fetchEvent = await Event.findOne({ _id: eventId, createdBy: userId })

    if (
        !fetchEvent
    )
        throw new NotFoundError('/deleteEvent')

    await Event.deleteOne({ _id: eventId })

    return res.json({ statusCode: 200, data: true })

})

const bookEvent = catchAsync(async (req, res, next) => {

    const { eventId } = req.params

    const fetchEvent = await Event.findOne({ _id: eventId })

    if (
        !fetchEvent
    )
        throw new NotFoundError('/bookEvent')

    if (
        fetchEvent.seats === fetchEvent.bookedBy.length
    )
        throw new BadRequestError('/bookEvent')

    // creating order code goes here

    return true

})

const pgWebhook = catchAsync(async (req, res, next) => {

})
module.exports = { getEvent, createEvent, updateEvent, deleteEvent, bookEvent, pgWebhook }