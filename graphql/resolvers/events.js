const Event = require('../../models/event.model');
const User = require('../../models/user.model');
const { transformEvent } = require('./commons');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map((event) => transformEvent(event));
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    if (!args.isAuth) {
      throw new Error('UnAuthorized!');
    }

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: args.userId,
    });

    try {
      const result = await event.save();

      const createdEvent = transformEvent(result);

      const creator = await User.findById(args.userId);

      if (!creator) {
        throw new Error('User not found.');
      }

      creator.createdEvents.push(event);

      await creator.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
};
