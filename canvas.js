import { Particles } from "./Particles.js";

window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.cursor = { x: -100, y: -100, enabled: true };
            this.particles = new Particles(this, 100);
            this.nonVisibleWidth = () => {
                return this.width + 5;
            };
            this.nonVisibleHeight = () => {
                return this.height + 5;
            };
            // ==Created by Sam
            console.log("Created by Sam");
        }
        update(deltaTime) {
            this.particles.update(deltaTime);
        }
        draw(context) {
            context.clearRect(0, 0, this.width, this.height);
            this.particles.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    window.addEventListener("mousemove", (e) => {
        game.cursor.x = e.clientX;
        game.cursor.y = e.clientY;
    });
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.width = canvas.width;
        game.height = canvas.height;
    });
    window.addEventListener("click", (e) => {
        if (e.target.tagName === "CANVAS") {
            game.particles.add(10);
        }
    });
    window.addEventListener("contextmenu", (e) => {
        if (e.target.tagName === "CANVAS") {
            e.preventDefault();
            game.particles.remove(10);
        }
    });

    let cursorToggler = document.getElementById("toggleCursor");

    cursorToggler.addEventListener("click", () => {
        game.cursor.enabled = !game.cursor.enabled;
        cursorToggler.innerHTML = "Cursor: " + game.cursor.enabled;
    });
    animate(0);
});
