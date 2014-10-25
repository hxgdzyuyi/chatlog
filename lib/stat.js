var _ = require('underscore')
  , Time = require('./time')

function Stat(options) {
  _.extend(this, options)
}

_.extend(Stat.prototype, {
  toJSON: function() {
    return { name: this.name
      , time: (new Time(this.time, this.timePattern)).getTime()
      , content: this.content || ""
    }
  }
})

module.exports = Stat
