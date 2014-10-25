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
  _.each(['mac-qq', 'skype-en'], function(fixtureName) {
    var fixture = new Fixture(fixtureName)
    it('convert ' + fixtureName + ' to json', function() {
      chatlog(fixture.content).should.eql(fixture.result)
    })
  })
})
