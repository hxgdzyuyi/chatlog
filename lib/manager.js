var _ = require('underscore')
  , Time = require('./time')
  , Stat = require('./stat')
  , statPatterns = [
      '{{ name }}  {{ time }}'
    , '[{{ time }}] {{ name }}: {{ content }}'
    ]

var statRegexSourcesWithoutTime = _.map(statPatterns, function(pattern) {
  return pattern
    .replace(/{{\s?(name|content)\s?}}/g, '(.*)')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
})

function Manager(textLog) {
  return this.fromLogFirstLine(textLog)
}

_.extend(Manager.prototype, {
  fromLogFirstLine: function(textLog) {
    var timePattern = Time.getPattern(textLog)

    var statRegexs = _.chain(statRegexSourcesWithoutTime)
      .map(function(pattern) {
        return new RegExp(
          pattern.replace(/{{\s?time\s?}}/g, function() {
            return '(' + timePattern.regex.source + ')'
          })
        , 'i'
        )
      })
      .each(function(regex, index) {
        var r = regex.test(textLog)
        if (regex.test(textLog)) {
          statIndex = index
        }
      }).value()

    if (_.isUndefined(statIndex)) {
      throw 'Counld\'t detect stat.'
      return
    }

    var groups = statPatterns[statIndex].match(/\w+/g)

    groups = _.flatten(_.map(groups, function(group) {
      if (group === 'time') {
        return ['time'].concat(timePattern.groups)
      }
      return group
    }))

    this.pattern = {
      regex: statRegexs[statIndex]
    , groups: groups
    }

    this.timePattern = timePattern

    this.config = {
      timeWithoutDay: this.isTimeWithoutDay()
    }
  }
, isTimeWithoutDay: function() {
    return _.indexOf(this.pattern.groups, 'd') === -1
  }
, createCurrentLog: function(textStat) {
    var matchResult = textStat.match(this.pattern.regex)
    if (!matchResult.length) {
      return new Error('Stat match failed')
    }
    matchResult.shift()
    var stat = new Stat(
      _.object(this.pattern.groups, matchResult)
    , { timePattern: this.timePattern }
    )
    return stat.toJSON()
  }
, isStat: function(string) {
    return this.pattern.regex.test(string)
  }
, getConfig: function() {
    return this.config
  }
})

module.exports = Manager
