var leveldown = require('levelup');
var peek = require('level-peek');

function LevelQueue() {
  this.queue = leveldown('./queue');
  this.queue.open(function(err) {
    console.log('open: ', err ? 'NO' : 'YES');
  });
  this._cbs = {};
}
LevelQueue.prototype.shift = function shift(cb) {
  var self = this;

  peek.first(this.queue, {
    start: null,
    end: undefined
  }, function(err, key, value) {
    console.log(err, key, value);
    if (err) {
      console.error(err);
      return cb(err);
    }
    if (!key) {
      console.log('no item');
      return cb();
    }
    // `peek.first` wont delete so we need to
    self.queue.del(key, function(err) {
      if (err) {
        console.error(err);
        return cb(err);
      }
      var packet = JSON.parse(value);
      var packetCb = self._cbs[packet.packet.messageId];
      var fn = function(err) {
        if (err) {
          // put back to leveldb
          self.push(packet);
          return;
        }
        if (packetCb) {
          packetCb(err);
          delete self._cbs[packet.messageId];
        }
      };
      packet.cb = fn;
      cb(null, packet);
    });
  });
};

LevelQueue.prototype.push = function push(packet) {
  console.log('[push]', packet);
  if (packet.cb) {
    this._cbs[packet.messageId] = packet.cb;
    delete packet.cb;
  }
  this.queue.put(packet.packet.messageId, JSON.stringify(packet), function(err) {
    if (err) {
      // what should we do
      return console.log(err);
    }
  });
};

module.exports = LevelQueue;
