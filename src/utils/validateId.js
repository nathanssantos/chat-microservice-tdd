module.exports = (number) =>
  !!number && number > 0 && number >>> 0 === parseFloat(number);
