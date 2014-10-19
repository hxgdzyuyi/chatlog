var _ = require('underscore')

function Stat(options) {
  _.extend(this, options)
}

_.extend(Stat.prototype, {
  toJSON: function() {
    return { name: this.name
      , time: this.getTime()
      , content: this.content || ""
    }
  }
, getTime: function() {
    if (!this.DD) { return this.getTimeWithoutDay()} // XXX(yangqing): pass
    this.YYYY = parseInt(this.YYYY, 10)
    if (this.YYYY < 100) {
      this.YYYY = parseInt(
        (new Date().getFullYear() + "").substr(0, 2) + this.YYYY, 10)
    }
    var date = new Date(this.YYYY, this.MM, this.DD, this.hh, this.mm, this.ss)
    return date.getTime()
  }
, getTimeWithoutDay: function() {
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

module.exports = Stat
