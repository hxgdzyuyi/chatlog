var chatlog = require('../lib/chatlog.js')
  , fs = require('fs')
  , path = require('path')

var UTF_8 = 'utf-8'

function Fixture(name) {
  var fixtureDirectory = path.resolve('./test/fixture', name)
  this.content = fs.readFileSync(path.resolve(fixtureDirectory, 'log.txt')
    , UTF_8)
  this.result = require(path.resolve(fixtureDirectory, 'log.json.js'))
}

describe('Without params', function() {
  var fixture = new Fixture('mac-qq')
  it('should work with no params', function() {
    chatlog(fixture.content).should.eql(fixture.result)
  })
})
