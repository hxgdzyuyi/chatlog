var _ = require('underscore')

var patternStrings = [
  '%y-%m-%d %H:%M:%S'
, '%H:%M:%S'
, '%y-%m-%d %p%h:%M:%S'
, '%y/%m/%d %h:%M:%S'
, '%m/%d/%y, %h:%M:%S %p'
]

var patterns = _.chain(patternStrings)
  .sortBy(function(string) { return string.length })
  .map(function(string) {
    var pattern = {}

    pattern.string = string
    pattern.groups = string.match(/\w/g)
    pattern.regex = new RegExp(
      string.replace(/\-/g, '\\-')
        .replace(/\//g, '\\/')
        .replace(/(%M|%S)/g, '([0-5][0-9])')
        .replace(/(%H|%h)/g, '([0-2]?[0-9])')
        .replace(/%y/g, '([0-9]{1,4})')
        .replace(/(%m|%d)/g, '([0-9]{1,2})')
        .replace(/%p/g, '(上午|下午|AM.|PM.|PM|AM)')
      , 'i')

    return pattern
  }).value()

var Time = function(timeString, pattern) {
  this.pattern = pattern || Time.getPattern(timeString)
  var matched = timeString.match(this.pattern.regex)
  matched.shift()
  this.matched = _.object(this.pattern.groups, matched)
}

var rIsPm = /(下午|PM.)/i

Time.getPattern = function(timeString) {
  return _.filter(patterns, function(pattern) {
    return pattern.regex.test(timeString)
  }).pop()
}

_.extend(Time.prototype, {
  getTime: function() {
    var matched = this.matched
    if (!matched.d) { return this.getTimeWithoutDay() } // XXX(yangqing): pass
    matched.y = parseInt(matched.y, 10)

    if (matched.y < 100) { // TODO(yangqing): Y2K
      matched.y = parseInt('20' + matched.y, 10)
    }

    if (matched.p && rIsPm.test(matched.p)) {
      matched.h = +matched.h + 12
    }

    var date = new Date(matched.y, matched.m
      , matched.d, matched.H || matched.h, matched.M, matched.S)
    return date.getTime()
  }
, getTimeWithoutDay: function() {
    var baseDate = new Date()
      , date = new Date()
    _.each(_.zip(['setHours', 'setMinutes', 'setSeconds'], ['H', 'M', 'S'])
      , function(combined) {
        var method = combined[0]
          , propName = combined[1]
        baseDate[method](0)
        date[method](this.matched[propName])
      }, this)
    return date.getTime() - baseDate.getTime()
  }
})

module.exports = Time
