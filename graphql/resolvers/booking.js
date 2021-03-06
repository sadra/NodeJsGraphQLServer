const Event = require('../../models/event.model');
const Booking = require('../../models/booking.model');
const { transformBooking, transformEvent } = require('./commons');

module.exports = {
  bookings: async (args) => {
    if (!args.isAuth) {
      throw new Error('UnAuthorized!');
    }

    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    if (!args.isAuth) {
      throw new Error('UnAuthorized!');
    }

    const fetchedEvent = await Event.findOne({ _id: args.eventId });

    const booking = new Booking({
      user: args.userId,
      event: fetchedEvent,
    });

    const result = await booking.save();

    return transformBooking(result);
  },
  cancelBooking: async (args) => {
    if (!args.isAuth) {
      throw new Error('UnAuthorized!');
    }

    try {
      const booking = await Booking.findById(args.bookingId).populate('event');

      const event = transformEvent(booking.event);

      await Booking.deleteOne({ _id: args.bookingId });

      return event;
    } catch (err) {
      throw err;
    }
  },
};
