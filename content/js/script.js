class SymbolManager {
    #characters;
    #characterCount;
    fontSize;
    #symbolColor;
    #width;
    #height;

    constructor(width, height) {
        this.symbols = [];
        this.#width = width;
        this.#height = height;
        this.#characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        this.#characterCount = this.#characters.length;
        this.fontSize = 8;
        this.symbolColor = "#a0ff0a";
    }

    init() {
        const amountOfSymbols = this.#width / this.fontSize;
        console.log(amountOfSymbols);
        for (let i = 0; i < amountOfSymbols; i++) {
            const ch = new Character(this, i, 0, this.fontSize);
            this.symbols.push(ch);
        }
    }
    
    getCharacter() {
        const index = Math.floor(Math.random() * this.#characterCount);
        return this.#characters[index];
    }

    getCanvasHeight() {
        return this.#height;
    }
}

class Character {
    #text;
    #symbolManager;

    constructor(symbolManager, x, y, fontSize, color) {
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.#symbolManager = symbolManager;
        this.#text = '';
    }

    draw(ctx) {
        this.#text = this.#symbolManager.getCharacter();
        ctx.fillText(this.#text, this.x * this.fontSize, this.y * this.fontSize);
    }

    update() {
        this.y++;
        if (this.y * this.fontSize > this.#symbolManager.getCanvasHeight() && Math.random() > 0.98) {
            this.y = 0;
        }
    }
}

class TheMatrix {
    #canvas;
    #ctx;
    #deltaTime;
    #lastTime;
    #fps;
    #nextFrame;
    #timer
    #gradient

    constructor() {
        this.#canvas = document.getElementById("canvas");
        this.#ctx = this.#canvas.getContext("2d");
        this.#deltaTime = 0;
        this.#lastTime = 0;
        this.#timer = 0;
        this.#fps = 20;
        this.#nextFrame = 1000 / this.#fps;

        this.#gradient = this.#ctx.createRadialGradient(
            this.#canvas.width / 2, this.#canvas.height/ 2, 50,
            this.#canvas.width / 2, this.#canvas.height/ 2, 150
        );

        this.#gradient.addColorStop(0, 'red');
        this.#gradient.addColorStop(0.2, 'blue');
        this.#gradient.addColorStop(0.4, 'yellow');
        this.#gradient.addColorStop(0.6, 'cyan');
        this.#gradient.addColorStop(0.8, 'green')
        this.#gradient.addColorStop(1, 'magenta')

        this.symbolManager = new SymbolManager(this.#canvas.width, this.#canvas.height);
        this.symbolManager.init();
    }

    animate(timestamp) {
        this.#deltaTime = timestamp - this.#lastTime;
        this.#lastTime = timestamp;
        if (this.#timer > this.#nextFrame) {
            this.#ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

            this.#ctx.font = `${this.symbolManager.fontSize}px monospace`
            this.#ctx.fillStyle = this.#gradient; //this.symbolManager.symbolColor;

            this.symbolManager.symbols.forEach((symbol) => {
                symbol.draw(this.#ctx);
                symbol.update(this.#ctx);
            });

            this.#timer = 0;
        } else {
            this.#timer += this.#deltaTime;
        }

        requestAnimationFrame(timestamp => {
            this.animate(timestamp);
        });
    }
}

document.addEventListener("DOMContentLoaded", (e) => {
    const theMatrix = new TheMatrix();
    theMatrix.animate(0);
});