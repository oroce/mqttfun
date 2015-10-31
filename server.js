var mosca = require('mosca');
var server = new (mosca.Server)({
  port: 1883
});
server.on('ready', function() {
  console.log('ready');
});

server.published = function(packet) {
  console.log('[published]', packet.topic, '' + packet.payload);
}
