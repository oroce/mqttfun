var levelup = require('levelup');
var db = levelup('./queue');
db.open(function(err) {
  console.log('open: ', err ? 'NO' : 'YES');
});
db.createReadStream()
  .on('data', function(data) {
    console.log(data);
  });
