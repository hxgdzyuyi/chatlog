var _ = require('underscore')
  , Manager = require('./manager')

var chatlog = function(text) {
  var textLogs = text.split('\n')
    , manager = new Manager(textLogs[0])
    , logs = []
    , currentLog

  _.each(textLogs, function(textLog, index) {
    if (!textLog) { return }

    if (manager.isStat(textLog)) {
      if (currentLog) { logs.push(currentLog) }
      currentLog = manager.createCurrentLog(textLog)
    } else if (currentLog) {
      currentLog.content = currentLog.content
        ? [currentLog.content, textLog].join('\n')
        : textLog
    }

  })

  if (currentLog) { logs.push(currentLog) }

  return {
    config: manager.getConfig()
  , logs: logs
  }
}

module.exports = chatlog
