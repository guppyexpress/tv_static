//create canvas stuffs
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var particles = [];
var num_particles = 40000;//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM MICROWAVE TIME

//Helps prevent colors from being too high or too low
function GetRandomColor() {
    var r = 0, g = 0, b = 0;
    while (r > 100 && g > 100 && b > 100)
    {
        r = Math.floor(0);
        g = Math.floor(0);
        b = Math.floor(0);
    }

    return "rgb(" + r + "," + g + ","  + b + ")";
}
//Particle object with random starting position, velocity and color
var Particle = function () {
    this.x = canvas.width * Math.random();
    this.y = canvas.height * Math.random();
    this.vx = 200 * Math.random() - 100;//x axis
    this.vy = 200 * Math.random() - 120;//y axis
    this.Color = GetRandomColor();
}
//Ading two methods
Particle.prototype.Draw = function (ctx) {
    ctx.fillStyle = this.Color;
    //change fuzzy boi size
    ctx.fillRect(this.x, this.y, 5, 7);
}

Particle.prototype.Update = function () {
    this.x += this.vx;
    this.y += this.vy;
 
    if (this.x<0 || this.x > canvas.width)
        this.vx = -this.vx;
 
    if (this.y < 0 || this.y > canvas.height)
        this.vy = -this.vy;
}
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < num_particles; i++) {
        particles[i].Update();
        particles[i].Draw(ctx);
    }
    requestAnimationFrame(loop);
}
//Create particles
for (var i = 0; i < num_particles; i++)
    particles.push(new Particle());
loop();
//multithread stuff
!function() {

	var URL = window.URL || window.webkitURL;
	if(!URL) {
		throw new Error('This browser does not support Blob URLs');
	}

	if(!window.Worker) {
		throw new Error('This browser does not support Web Workers');
	}

	function Multithread(threads) {
		this.threads = Math.max(2, threads | 0);
		this._queue = [];
		this._queueSize = 0;
		this._activeThreads = 0;
		this._debug = {
			start: 0,
			end: 0,
			time: 0
		};
	}

	Multithread.prototype._worker = {
		JSON: function() {
			var /**/name/**/ = (/**/func/**/);
			self.addEventListener('message', function(e) {
				var data = e.data;
				var view = new DataView(data);
				var len = data.byteLength;
				var str = Array(len);
				for(var i=0;i<len;i++) {
					str[i] = String.fromCharCode(view.getUint8(i));
				}
				var args = JSON.parse(str.join(''));
				var value = (/**/name/**/).apply(/**/name/**/, args);
				try {
					data = JSON.stringify(value);
				} catch(e) {
					throw new Error('Parallel function must return JSON serializable response');
				}
				len = typeof(data)==='undefined'?0:data.length;
				var buffer = new ArrayBuffer(len);
				view = new DataView(buffer);
				for(i=0;i<len;i++) {
					view.setUint8(i, data.charCodeAt(i) & 255);
				}
				self.postMessage(buffer, [buffer]);
				self.close();
			})
		},
		Int32: function() {
			var /**/name/**/ = (/**/func/**/);
			self.addEventListener('message', function(e) {
				var data = e.data;
				var view = new DataView(data);
				var len = data.byteLength / 4;
				var arr = Array(len);
				for(var i=0;i<len;i++) {
					arr[i] = view.getInt32(i*4);
				}
				var value = (/**/name/**/).apply(/**/name/**/, arr);
				if(!(value instanceof Array)) { value = [value]; }
				len = value.length;
				var buffer = new ArrayBuffer(len * 4);
				view = new DataView(buffer);
				for(i=0;i<len;i++) {
					view.setInt32(i*4, value[i]);
				}
				self.postMessage(buffer, [buffer]);
				self.close();
			})
		},
		Float64: function() {
			var /**/name/**/ = (/**/func/**/);
			self.addEventListener('message', function(e) {
				var data = e.data;
				var view = new DataView(data);
				var len = data.byteLength / 8;
				var arr = Array(len);
				for(var i=0;i<len;i++) {
					arr[i] = view.getFloat64(i*8);
				}
				var value = (/**/name/**/).apply(/**/name/**/, arr);
				if(!(value instanceof Array)) { value = [value]; }
				len = value.length;
				var buffer = new ArrayBuffer(len * 8);
				view = new DataView(buffer);
				for(i=0;i<len;i++) {
					view.setFloat64(i*8, value[i]);
				}
				self.postMessage(buffer, [buffer]);
				self.close();
			})
		}
	};

	Multithread.prototype._encode = {
		JSON: function(args) {
			try {
				var data = JSON.stringify(args);
			} catch(e) {
				throw new Error('Arguments provided to parallel function must be JSON serializable');
			}
			len = data.length;
			var buffer = new ArrayBuffer(len);
			var view = new DataView(buffer);
			for(var i=0;i<len;i++) {
				view.setUint8(i, data.charCodeAt(i) & 255);
			}
			return buffer;
		},
		Int32: function(args) {
			len = args.length;
			var buffer = new ArrayBuffer(len*4);
			var view = new DataView(buffer);
			for(var i=0;i<len;i++) {
				view.setInt32(i*4, args[i]);
			}
			return buffer;
		},
		Float64: function(args) {
			len = args.length;
			var buffer = new ArrayBuffer(len*8);
			var view = new DataView(buffer);
			for(var i=0;i<len;i++) {
				view.setFloat64(i*8, args[i]);
			}
			return buffer;
		}
	};

	Multithread.prototype._decode = {
		JSON: function(data) {
			var view = new DataView(data);
			var len = data.byteLength;
			var str = Array(len);
			for(var i=0;i<len;i++) {
				str[i] = String.fromCharCode(view.getUint8(i));
			}
			if(!str.length) {
				return;
			} else {
				return JSON.parse(str.join(''));
			}
		},
		Int32: function(data) {
			var view = new DataView(data);
			var len = data.byteLength / 4;
			var arr = Array(len);
			for(var i=0;i<len;i++) {
				arr[i] = view.getInt32(i*4);
			}
			return arr;
		},
		Float64: function(data) {
			var view = new DataView(data);
			var len = data.byteLength / 8;
			var arr = Array(len);
			for(var i=0;i<len;i++) {
				arr[i] = view.getFloat64(i*8);
			}
			return arr;
		},
	};

	Multithread.prototype._execute = function(resource, args, type, callback) {
		if(!this._activeThreads) {
			this._debug.start = (new Date).valueOf();
		}
		if(this._activeThreads < this.threads) {
			this._activeThreads++;
			var t = (new Date()).valueOf();
			var worker = new Worker(resource);
			var buffer = this._encode[type](args);
			var decode = this._decode[type];
			var self = this;
			if(type==='JSON') {
				var listener = function(e) {
					callback.call(self, decode(e.data));
					self.ready();
				};
			} else {
				var listener = function(e) {
					callback.apply(self, decode(e.data));
					self.ready();
				};
			}
			worker.addEventListener('message', listener);
			worker.postMessage(buffer, [buffer]);
		} else {
			this._queueSize++;
			this._queue.push([resource, args, type, callback]);
		}
	};

	Multithread.prototype.ready = function() {
		this._activeThreads--;
		if(this._queueSize) {
			this._execute.apply(this, this._queue.shift());
			this._queueSize--;
		} else if(!this._activeThreads) {
			this._debug.end = (new Date).valueOf();
			this._debug.time = this._debug.end - this._debug.start;
		}
	};

	Multithread.prototype._prepare = function(fn, type) {

		fn = fn;

		var name = fn.name;
		var fnStr = fn.toString();
		if(!name) {
			name = '$' + ((Math.random()*10)|0);
			while (fnStr.indexOf(name) !== -1) {
				name += ((Math.random()*10)|0);
			}
		}

		var script = this._worker[type]
			.toString()
			.replace(/^.*?[\n\r]+/gi, '')
			.replace(/\}[\s]*$/, '')
			.replace(/\/\*\*\/name\/\*\*\//gi, name)
			.replace(/\/\*\*\/func\/\*\*\//gi, fnStr);

		var resource = URL.createObjectURL(new Blob([script], {type: 'text/javascript'}));

		return resource;

	};

	Multithread.prototype.process = function(fn, callback) {

		var resource = this._prepare(fn, 'JSON');
		var self = this;

		return function() {
			self._execute(resource, [].slice.call(arguments), 'JSON', callback)
		};

	};

	Multithread.prototype.processInt32 = function(fn, callback) {

		var resource = this._prepare(fn, 'Int32');
		var self = this;

		return function() {
			self._execute(resource, [].slice.call(arguments), 'Int32', callback)
		};

	};

	Multithread.prototype.processFloat64 = function(fn, callback) {

		var resource = this._prepare(fn, 'Float64');
		var self = this;

		return function() {
			self._execute(resource, [].slice.call(arguments), 'Float64', callback)
		};

	};

	window['Multithread'] = Multithread;
	var num_threads = 4;
var MT = new Multithread(num_threads);

}();
