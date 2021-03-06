const {LogSnag} = require('logsnag');
const logsnag = new LogSnag(process.env.LOGSNAG);

const EVENTS = {
  USER_REGISTRATION: {
    channel: 'users',
    event: 'User Registered',
    icon: '๐',
  },
  THREAD_CREATED: {
    channel: 'threads',
    event: 'New Thread',
    icon: '๐งต',
  },
  THREAD_POST: {
    channel: 'threads',
    event: 'New Post',
    icon: '๐',
  },
  WALL_POST: {
    channel: 'users',
    event: 'Wall Posts',
    icon: '๐ฌ',
  },
};

module.exports = {
  EVENTS: EVENTS,
  publish: function(event) {
    logsnag.publish({
      project: 'noname',
      notify: true,
      ...event,
    });
  },
};
