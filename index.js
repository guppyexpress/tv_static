var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var particles = [];
var num_particles = 1;//Change that to your liking

//Helper function to get a random color - but not too dark
function GetRandomColor() {
    var r = 0, g = 0, b = 0;
    while (r < 100 && g < 100 && b < 100)
    {
        r = Math.floor(256);
        g = Math.floor(256);
        b = Math.floor(256);
    }

    return "rgb(" + r + "," + g + ","  + b + ")";
}
//Particle object with random starting position, velocity and color
var Particle = function () {
    this.x = canvas.width * Math.random();
    this.y = canvas.height * Math.random();
    this.vx = 4 * Math.random() - 2;
    this.vy = 4 * Math.random() - 2;
    this.Color = GetRandomColor();
}
//Ading two methods
Particle.prototype.Draw = function (ctx) {
    ctx.fillStyle = this.Color;
    ctx.fillRect(this.x, this.y, 2, 2);
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
//hi whoever is reading this i want to know that you enjoyed my particle demo, im not currently done all this is nothing but a test, so hope you enjoy! past this this is just a placeholder in order to fill up more space so it looks like the website actually has effort in it when in reality it doent lol bjkf bjskdbfhsdvchsvchjxvhjdsxnvb hjdxnbv hjxncv chjdsnvxchjzdxvbc hjzxdvc hjxvbc hjdbfcv hjxb cvhjxchjxcbv uhjdfncb vhjcxv hjxcvchjxnbv cxhjb cxjhmn bxchjc bhjxcm bxhj jxcn bxhj bxhjn xhj hjx hjnx hx hj
