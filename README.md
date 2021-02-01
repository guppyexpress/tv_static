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
