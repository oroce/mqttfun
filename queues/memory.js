function MemoryQueue() {
  this.arr = [];
}
MemoryQueue.prototype.get = function(cb) {
  cb(null, this.arr);
};
MemoryQueue.prototype.push = function(packet) {
  this.arr.push(packet);
};
MemoryQueue.prototype.shift = function(cb) {
  cb(null, this.arr.shift());
};

module.exports = MemoryQueue;
