const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundAlpha: 0
});
document.body.appendChild(app.view);

let ativo = false;
window.addEventListener("click", () => ativo = !ativo);

const vortex = new PIXI.Container();
vortex.x = app.screen.width / 2;
vortex.y = app.screen.height / 2;
app.stage.addChild(vortex);

const face = new PIXI.Graphics();
app.stage.addChild(face);

const particles = new PIXI.Container();
app.stage.addChild(particles);

const blur = new PIXI.BlurFilter(6);
vortex.filters = [blur];

function drawOrganic(g, t, intensidade, scale=1) {
    g.clear();

    for (let layer = 0; layer < 3; layer++) {
        let alpha = 0.2 + layer * 0.2;

        g.beginFill(0xff66cc, alpha);

        let first = true;

        for (let i = 0; i <= 80; i++) {
            let ang = (Math.PI * 2 * i) / 80;

            let noise =
                Math.sin(ang * 2 + t * 1.5 + layer) * 20 +
                Math.cos(ang * 3 + t * 2 + layer) * 15;

            let r = (80 + noise * intensidade) * scale;

            let x = Math.cos(ang) * r;
            let y = Math.sin(ang) * r * 0.6;

            if (first) {
                g.moveTo(x, y);
                first = false;
            } else {
                g.lineTo(x, y);
            }
        }

        g.endFill();
    }
}

const layers = [];
for (let i = 0; i < 3; i++) {
    let g = new PIXI.Graphics();
    vortex.addChild(g);
    layers.push(g);
}

const particleList = [];
for (let i = 0; i < 25; i++) {
    let p = new PIXI.Graphics();
    p.beginFill(0x39ff14);
    p.drawCircle(0, 0, 3);
    p.endFill();

    particles.addChild(p);

    particleList.push({
        sprite: p,
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random(),
        baseRadius: 120 + Math.random() * 60
    });
}

function drawFace(t) {
    face.clear();

    face.x = vortex.x;
    face.y = vortex.y;

    face.beginFill(0x9cff57);

    face.moveTo(-70, -25);
    face.lineTo(-70, 5);
    face.lineTo(-5, -10);
    face.closePath();

    face.moveTo(70, -25);
    face.lineTo(70, 5);
    face.lineTo(5, -10);
    face.closePath();

    face.endFill();

    face.lineStyle(2, 0x000000, 1);

    let cx = -35;
    let cy = -10;

    face.moveTo(cx, cy);

    for (let i = 0; i < 14; i++) {
        let angle = i * 0.5;
        let r = i * 0.9;

        let x = cx + Math.cos(angle) * r;
        let y = cy + Math.sin(angle) * r;

        face.lineTo(x, y);
    }

    face.lineStyle(4, 0x9cff57);

    face.moveTo(-50, 25);
    face.lineTo(-30, 45);
    face.lineTo(-10, 30);
    face.lineTo(10, 45);
    face.lineTo(30, 30);
    face.lineTo(50, 45);
    face.lineTo(70, 25);
}

const stone = new PIXI.Graphics();
stone.x = vortex.x;
stone.y = vortex.y + 140;
app.stage.addChild(stone);

function drawStone() {
    stone.clear();

    stone.beginFill(0x555555);
    stone.moveTo(-40, 0);
    stone.lineTo(40, 0);
    stone.lineTo(25, 40);
    stone.lineTo(-25, 40);
    stone.endFill();
}

app.ticker.add(() => {
    let t = performance.now() * 0.001;

    let scale = ativo ? 1.8 : 1;

    vortex.scale.set(scale);

    layers.forEach((layer, i) => {
        drawOrganic(layer, t + i, 1, scale * (1 + i * 0.1));
    });

    particleList.forEach(p => {
        p.angle += 0.01 * p.speed;

        let radius = p.baseRadius * scale;

        let x = vortex.x + Math.cos(p.angle) * radius;
        let y = vortex.y + Math.sin(p.angle) * radius * 0.6;

        p.sprite.x = x;
        p.sprite.y = y;

        p.sprite.scale.set(scale);
        p.sprite.alpha = 0.6 + Math.sin(t * 5 + p.angle) * 0.4;
    });

    drawFace(t);
    drawStone();

    blur.blur = ativo ? 16 : 6;
});
