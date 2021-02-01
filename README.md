# beep



Using Multithread is simples. Include multithread.js on any page u wanna with wats below
------------------------------------------------------
<script src="my/path/to/multithread.js"></script>
------------------------------------------------------


And instantiate it in any script tag using
---------------------------------------------
var num_threads = 2;
var MT = new Multithread(num_threads);
----------------------------------------------



Multithread will provide the best results when num_threads matches the processor core count of the computer you're using, but 2-4 threads should be perfect and the average computer got 4 threads so 4 should be perfect

_____________________________________________________
dont take my example on the static website cuz its not fully implemented on static, but i did make the js for the multithreading so hab fun
also i cant figure out how to get the js to properly run as it keeps fighting with the looping partical generator(keeps trying to loop the creation of threads) but that prob because of my placement and im dumb. but im sure you can figure out how to add in the multithreading, feel free to experiment on the static as the 40,000 particles is VERY cpu intensive
