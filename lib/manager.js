var _ = require('underscore')
  , statPattern = ''
  , statPatterns = [
      '{{ name }}  {{ time(hh:mm:ss) }}'
    , '[{{ time(YYYY-MM-DD hh:mm:ss) }}] {{ name }}: {{ content }}'
    ]
  , Stat = require('./stat')

var statRegexs = _.map(statPatterns, function(pattern) {
  return new RegExp(
    pattern
      .replace(/{{\s?(name|content)\s?}}/g, '(.*)')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/{{\s?time\((.*)\)\s?}}/g, function(matched, p1) {
        var format = p1
        return format
          .replace(/\-/g, '\\-')
          .replace(/(mm|ss)/g, '([0-5][0-9])')
          .replace(/hh/g, '([0-2][1-9])')
          .replace(/Y{1,4}/g, '([0-9]{1,4})')
          .replace(/(M|D){1,2}/g, '([0-9]{1,2})')
      })
    , 'i')
})

var statResultPatterns = _.map(statPatterns, function(pattern) {
  return pattern.match(/name|content|hh|mm|ss|YYYY|MM|DD/g)
})

function Manager(textLog) {
  return this.fromLogFirstLine(textLog)
}

_.extend(Manager.prototype, {
  fromLogFirstLine: function(textLog) {
    var statIndex
    _.each(statRegexs, function(regex, index) {
      var r = regex.test(textLog)
      if (regex.test(textLog)) {
        statIndex = index
      }
    })

    if (_.isUndefined(statIndex)) {
      throw 'Counld\'t detect stat.'
      return
    }

    this.statResultPattern = statResultPatterns[statIndex]
    this.statRegex = statRegexs[statIndex]
    this.statPattern = statPatterns[statIndex]

    this.config = {
      timeWithoutDay: this.isTimeWithoutDay()
    }
  }
, isTimeWithoutDay: function() {
    return !/DD/g.test(this.statPattern)
  }
, createCurrentLog: function(textStat) {
    var matchResult = textStat.match(this.statRegex)
    if (!matchResult.length) {
      return new Error('Stat match failed')
    }
    matchResult.shift()
    var stat = new Stat(_.object(this.statResultPattern, matchResult))
    return stat.toJSON()
  }
, isStat: function(string) {
    return this.statRegex.test(string)
  }
, getConfig: function() {
    return this.config
  }
})

module.exports = Manager
