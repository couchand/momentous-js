/*
 * Momentous.js
 *
 * a tiny moment wrapper exposing an immutable api
 */

(function() {
  var Momentous, momentous, Moment, moment,
      errorMethods, getterMethods, mutatorMethods,
      proxyMethods, staticMethods;

  moment = require('moment');

  proxyMethods = [
    'isValid', 'parsingFlags', 'invalidAt',
    'daysInMonth', 'weeksInYear', 'isoWeeksInYear',
    'get', 'format', 'fromNow', 'from', 'calendar',
    'diff', 'valueOf', 'unix',
    'toDate', 'toArray', 'toJSON', 'toISOString',
    'isBefore', 'isSame', 'isAfter',
    'isLeapYear', 'isDST', 'isDSTShifted'
  ];

  getterMethods = [
    'millisecond', 'milliseconds', 'second', 'seconds',
    'minute', 'minutes', 'hour', 'hours',
    'date', 'dates', 'day', 'days',
    'weekday', 'isoWeekday', 'dayOfYear',
    'week', 'weeks', 'isoWeek', 'isoWeeks',
    'month', 'months', 'quarter',
    'year', 'years', 'weekYear', 'isoWeekYear',
    'zone'
  ];

  mutatorMethods = [
    'add', 'subtract', 'startOf', 'endOf',
    'max', 'min', 'local', 'utc', 'lang'
  ];

  staticMethods = [
    'unix', 'utc', 'parseZone', 'isMoment', 'lang', 'langData',
    'months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin',
    'normalizeUnits', 'invalid'
  ];

  errorMethods = ['set'];

  Momentous = function Momentous(me) {
    Moment.prototype.constructor.call(this, this.me = me);
  };

  Moment = moment().constructor;

  function ctor() {
    this.constructor = Momentous;
  }
  ctor.prototype = Moment.prototype;
  Momentous.prototype = new ctor();

  proxyMethods.map(function(method) {
    return Momentous.prototype[method] = function() {
      return this.me[method].apply(this.me, arguments);
    };
  });

  getterMethods.map(function(method) {
    return Momentous.prototype[method] = function() {
      if (arguments.length) {
        throw new Error("Momentous is immutable");
      }
      return this.me[method].call(this.me);
    };
  });

  mutatorMethods.map(function(method) {
    return Momentous.prototype[method] = function() {
      var m;
      m = moment.utc(this.me);
      m[method].apply(m, arguments);
      return new Momentous(m);
    };
  });

  errorMethods.map(function(method) {
    return Momentous.prototype[method] = function() {
      throw new Error("Method " + method + " is unsupported in Momentous");
    };
  });

  module.exports = momentous = function() {
    return new Momentous(moment.utc.apply(moment, arguments));
  };

  staticMethods.map(function(method) {
    return momentous[method] = moment[method];
  });

  momentous.isMomentous = function(d) {
    return d.constructor === Momentous;
  };

})();
