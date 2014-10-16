var _ = require('underscore')
  , statPattern = '{{ name }}  {{ hh:mm:ss }}'
  , TIME_WITHOUT_DATE = true

statRegexString = statPattern
  .replace('{{ name }}', '(.*)')
  .replace('{{ hh:mm:ss }}', function(timeFormat) {
    var timeFormat = timeFormat.replace(/^{{|}}$/g, '').trim()
      .replace('hh', '([0-2][1-9])')
      .replace('mm', '([0-5][0-9])')
      .replace('ss', '([0-5][0-9])')
    return timeFormat
  })

var statRegex = new RegExp(statRegexString, 'i')
  , statResultPattern = statPattern.match(/name|hh|mm|ss/g)

function Stat(options) {
  _.extend(this, options)
}

_.extend(Stat.prototype, {
  toJSON: function() {
    return { name: this.name, time: this.getTime() }
  }
, getTime: function() {
    if (this.dd) { return } // XXX(yangqing): pass
    var baseDate = new Date()
      , date = new Date()
    _.each(_.zip(['setHours', 'setMinutes', 'setSeconds'], ['hh', 'mm', 'ss'])
      , function(combined) {
        var method = combined[0]
          , propName = combined[1]
        baseDate[method](0)
        date[method](this[propName])
      }, this)
    return date.getTime() - baseDate.getTime()
  }
})

Stat.isValid = function(string) {
  return statRegex.test(string)
}

var chatlog = function(text) {
  var textLogs = text.split('\n')
    , logs = []
    , currentLog

  function createCurrentLog(textStat) {
    var matchResult = textStat.match(statRegex)
    if (!matchResult.length) {
      return new Error('Stat match failed')
    }
    matchResult.shift()
    var stat = new Stat(_.object(statResultPattern, matchResult))
    return _.extend({content: ''}, stat.toJSON())
  }

  _.each(textLogs, function(textLog, index) {
    if (!textLog) { return }

    var isStat = Stat.isValid(textLog)
    if (isStat) {
      if (currentLog) { logs.push(currentLog) }
      currentLog = createCurrentLog(textLog)
    } else if (currentLog) {
      currentLog.content = currentLog.content
        ? [currentLog.content, textLog].join('\n')
        : textLog
    }

  })

  if (currentLog) { logs.push(currentLog) }

  return {
    config: {
      timeWithoutDay: TIME_WITHOUT_DATE // TODO(yangqing)
    }
  , logs: logs
  }
}

module.exports = chatlog
