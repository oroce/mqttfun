var mqtt = require('mqtt');
var LevelQueue = require('./queues/level');
var MemoryQueue = require('./queues/memory');
var RedisQueue = require('./queues/redis');

var client = mqtt.connect({
  port: 1883,
  queue: new LevelQueue() /* || new RedisQueue() || new MemoryQueue() */
});

client
  .on('connect', function() {
    console.log('client is connected');
  })
  .on('disconnect', function() {
    console.log('client is disconnected');
  });
var tick = 0;
setInterval(function() {
  client.publish('message', JSON.stringify({
    tick: ++tick
  }, null, 2), {
    qos: 1,
    retain: true
  });
  console.log('[sent] %s', tick);
}, 2000);
