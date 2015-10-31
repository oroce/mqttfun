var redis = require('redis');
function RedisQueue() {
  this.client = redis.createClient();
  this._cbs = {};
}
RedisQueue.prototype.shift = function shift(cb) {
  var self = this;
  console.log('shifting');
  this.client.lpop('queue', function(err, item) {
    if (err) {
      console.error(err);
      return cb(err);
    }
    if (!item) {
      console.log('no item');
      return cb();
    }
    var packet = JSON.parse(item);
    var packetCb = self._cbs[packet.packet.messageId];
    var fn = function(err) {
      if (err) {
        // put back to redis
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
};
RedisQueue.prototype.push = function push(packet) {
  console.log('pushpacket', packet);
  if (packet.cb) {
    this._cbs[packet.messageId] = packet.cb;
    delete packet.cb;
  }
  return;
  this.client.lpush('queue', JSON.stringify(packet), function(err) {
    if (err) {
      // what should we do with err
      console.error(err);
    }
  });
}

module.exports = RedisQueue;
