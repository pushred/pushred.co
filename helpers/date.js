const moment = require('moment');

module.exports = (date, format) => {
  date = new Date(date);
  return moment(date).format(format);
}
