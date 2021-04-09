const Event = require('../../models/event.model');
const User = require('../../models/user.model');
const Booking = require('../../models/booking.model');

exports.events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });

    return events.map((event) => transformEvent(event));
  } catch (err) {
    throw err;
  }
};

exports.user = async (userId) => {
  try {
    const user = await User.findById(userId);

    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

exports.singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      _id: event.id,
      creator: user.bind(this, event.creator),
    };
  } catch (err) {
    throw err;
  }
};
