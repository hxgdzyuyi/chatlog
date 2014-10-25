var chatlog = require('../lib/chatlog.js')
  , fs = require('fs')
  , path = require('path')
  , _ = require('underscore')

var UTF_8 = 'utf-8'

function Fixture(name) {
  var fixtureDirectory = path.resolve('./test/fixture', name)
  this.content = fs.readFileSync(path.resolve(fixtureDirectory, 'log.txt')
    , UTF_8)
  this.result = require(path.resolve(fixtureDirectory, 'log.json.js'))
}

describe('chatlog', function() {
  _.each(['mac-qq', 'skype-en', 'skype-cn'], function(fixtureName) {
    var fixture = new Fixture(fixtureName)
    it('convert ' + fixtureName + ' to json', function() {
      chatlog(fixture.content).should.eql(fixture.result)
    })
  })
})

var Time = require('../lib/time.js')

describe('time', function() {
  it('support basic time format', function() {
    _.each([
        [ '14-8-25 22:11:49', 1411654309000 ]
      , [ '16:23:21', 59001000 ]
      , [ '14-10-24 下午6:24:28', 1416824668000 ]
      ], function(combined) {
      var time = new Time(combined[0])
        , expected = combined[1]
      time.getTime().should.eql(expected)
    })
  })
})
