# beep



Using Multithread is simple. Include multithread.js on any page you'd like using
------------------------------------------------------
<script src="my/path/to/multithread.js"></script>
------------------------------------------------------


And instantiate it in any script tag using
---------------------------------------------
var num_threads = 2;
var MT = new Multithread(num_threads);
----------------------------------------------



Multithread will provide the best results when num_threads matches the processor core count of the computer you're using, but 2-4 threads should always be reasonably speedy.

_____________________________________________________
Running a Thread Asynchronously
The fun stuff! Run any code you want (in the form of a function) asynchronously, in a separate thread like so:

MT.process(function, callback)(arg1, arg2, ..., argN);
Where function is of the form:

function(arg1, arg2, ... argN) {
  /* function body */
}
and callback is of the form:

function(returnValue) {
  /* do something with returnValue in main thread */
}
Note that .process() itself will return a function object that will not execute until explicitly told to do so.

var funcInADifferentThread = MT.process(
  function(a, b) { return a + b; },
  function(r) { console.log(r) }
);

// Nothing has happened,
//funcInADifferentThread has not executed yet...

funcInADifferentThread(1, 2);
console.log('Before or after?');

// We now see "Before or after?" logged in the console,
// and "3" (= 1 + 2) logged shortly thereafter...
// it was running asynchronously
Special Data Types
Multithread.js uses JSON serialization with .process() so you can deal with your threaded, asynchronous functions like you'd deal with normal JavaScript functions.

However, optimized support is also provided for typed data, specifically Int32 and Float64 (being signed 32-bit integers and 64-bit floats, respectively).

You can access these using...

// Only deal with 32-bit signed integers...
var threadedInt32Func = MT.processInt32(
  function(int32_arg1, int32_arg2, ..., int32_argN) {
    /* function body */
  },
  function(int32_returnValue1, int32_returnValue2, ..., int32_returnValueN) {
    /* main thread callback */
  }
);

// Only deal with 64-bit floats...
var threadedFloat64Func = MT.processFloat64(
  function(float64_arg1, float64_arg2, ..., float64_argN) {
    /* function body */
  },
  function(float64_returnValue1, float64_returnValue2, ..., float64_returnValueN) {
    /* main thread callback */
  }
);
You may notice that the threaded functions take an argument list of Int32 and Float64 data, and the most common use case is more likely an array of data. In this case, feel free to use Javascript's Function.prototype.apply(context, argArray) to send your array as an argument list.

// Use Function.apply to send arguments as an array
threadedInt32Func.apply(null, [32, 64, 128, 256])
Note that threaded functions can not have their context set, so the first argument to .apply should always be null.

Additionally, a keen observer would detect that the callback format is also a little bit different. The return from a .processInt32 or .processFloat64 threaded function can be a single value or Array.

The arguments sent to callback are the values of a returned array, in order, or just a single argument representing a single returned value. These values can be accessed via the magic arguments object, but you may want built-in Array functionality, in which case you can convert this arguments object into an array:

// your callback
function callback() {
  var argumentArray = [].slice.call(arguments);
  /* do something with your argumentArray here */
}
That's it! ... Almost.

Scope Warning
Keep in mind that any threaded function is completely scope unaware, meaning something like:

function scopeCheck() {
  var scopeVar = 2;
  MT.process(
    function() { return scopeVar + 2; },
    function(r) { console.log('Cool'); }
  )();
}
scopeCheck();
Will throw ReferenceError: scopeVar is not defined

However, callbacks are scope aware so you needn't be as careful with them.

Recursion
You can accomplish recursion simply by naming your functions as you pass them to Multithread

MT.process(
  function Recurse(m, n) {
    if(n>0) {
      return Recurse(m + 1, n--);
    } else {
      return m;
    }
  },
  function(r) {
    console.log(r);
  }
)(5, 2);

// This will increase m twice recursively and log "7"
