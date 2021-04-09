const { dateToString } = require('../../helpers/date');
const { events, singleEvent, user } = require('./commons');

exports.transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

exports.transformBooking = (booking) => {
  return {
    ...result._doc,
    _id: result.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(result._doc.createdAt),
    updatedAt: dateToString(result._doc.updatedAt),
  };
};
