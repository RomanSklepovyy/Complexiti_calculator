(function () {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var w = canvas.width = innerWidth;
    var h = canvas.height = innerHeight;
    var particles = [];

    var properties = {
        bgColor : 'rgba(10,10,12,0)',
        particleColour : 'rgb(135,135,135)',
        particleRadius : 4,
        particleCount : 60,
        particleMaxVelocity: 0.35,
        lineLength : 150,
        particleLife : 8,
        lineWidth : 2
    };

    //document.querySelector('body').appendChild(canvas);

    window.onresize = function () {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
            this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
            this.life = Math.random() * properties.particleLife * 60;
        }

        position() {

            if (this.x + this.velocityX > w && this.velocityX > 0 || this.x +this.velocityX < 0 && this.velocityX < 0) {
                this.velocityX *= -1;
            }

            if (this.y + this.velocityY > h && this.velocityY > 0 || this.y +this.velocityY < 0 && this.velocityY < 0) {
                this.velocityY *= -1;
            }

            this.x += this.velocityX;
            this.y += this.velocityY;
        }

        reDraw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = properties.particleColour;
            ctx.fill();
        }

        reCalculateLife() {
            if (this.life < 1) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
                this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
                this.life = Math.random() * properties.particleLife * 60;
            }

            this.life --;
        }
    }

    function reDrawBackground() {
        ctx.fillStyle = properties.bgColor;
        ctx.fillRect(0, 0, w, h);
    }

    function drawLines() {
        let x1, x2, y1, y2, length, opacity;

        for(let i in particles) {
            for (let j in particles) {
                x1 = particles[i].x;
                y1 = particles[i].y;
                x2 = particles[j].x;
                y2 = particles[j].y;

                length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                if (length < properties.lineLength) {
                    opacity = 1 - length/properties.lineLength;
                    ctx.lineWidth = properties.lineWidth;
                    ctx.strokeStyle = 'rgba(135, 135, 135, ' + opacity + ')';
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }
    }
    
    function reDrawParticles() {
        for(let i in particles) {
            particles[i].reCalculateLife();
            particles[i].position();
            particles[i].reDraw();
        }
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        reDrawBackground();
        reDrawParticles();
        drawLines();
        document.body.style.background = 'url(' + canvas.toDataURL() + ') no-repeat fixed';
        requestAnimationFrame(loop);
    }

    function init() {

        for (let i = 0; i < properties.particleCount; i++) {
            particles.push(new Particle());
        }

        loop();
    }

    init();

})();