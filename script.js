const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let ativo = false;
window.addEventListener("click", () => ativo = !ativo);

const particleList = [];
for (let i = 0; i < 25; i++) {
    particleList.push({
        angle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        baseRadius: 120 + Math.random() * 60
    });
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function drawOrganicShape(t, layer, scaleBase, numPoints = 80, noiseMult = 1.0) {
    ctx.beginPath();
    for (let i = 0; i <= numPoints; i++) {
        let ang = (Math.PI * 2 * i) / numPoints;
        let noise = Math.sin(ang * 2 + t * 1.5 + layer) * 20 +
                    Math.cos(ang * 3 + t * 2 + layer) * 15;
        
        let r = (80 + noise * noiseMult) * scaleBase;
        let x = Math.cos(ang) * r;
        let y = Math.sin(ang) * r * 0.6;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}

function update() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const t = performance.now() * 0.001;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const globalScale = ativo ? 1.8 : 1.0;

    ctx.save();
    ctx.translate(centerX, centerY); 
    ctx.scale(globalScale, globalScale); 

    ctx.shadowBlur = ativo ? 20 : 5;
    ctx.shadowColor = "#ff66cc";

    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = `rgba(255, 102, 204, ${0.2 + i * 0.2})`;
        drawOrganicShape(t, i, 1 + i * 0.1);
    }
    ctx.restore();

    particleList.forEach(p => {
        p.angle += p.speed;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(p.angle); 
        ctx.translate(p.baseRadius * globalScale, 0);
        
        let pulse = 0.6 + Math.sin(t * 5 + p.angle) * 0.4;
        ctx.scale(pulse * globalScale, pulse * globalScale);

        ctx.fillStyle = "#39ff14";
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    const stoneX = centerX;
    const stoneY = centerY + 140;
    
    ctx.save();
    ctx.translate(stoneX, stoneY);
    ctx.rotate(Math.sin(t) * 0.2);
    ctx.fillStyle = "#555555";
    ctx.beginPath();
    ctx.moveTo(-40, 0); ctx.lineTo(40, 0);
    ctx.lineTo(25, 40); ctx.lineTo(-25, 40);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(centerX, centerY);
    
    ctx.fillStyle = "#9cff57";
    ctx.beginPath();
    ctx.moveTo(-70, -25); ctx.lineTo(-70, 5); ctx.lineTo(-5, -10);
    ctx.fill();

    ctx.save();
    ctx.translate(70, -5);
    ctx.beginPath();
    ctx.moveTo(-30, -5); ctx.lineTo(35, -20); ctx.lineTo(35, 10);
    ctx.closePath();
    ctx.fill();

    ctx.scale(globalScale, globalScale);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 15; i++) {
        let angleSp = i * 0.5;
        let r = i * 0.7;
        let x = Math.cos(angleSp) * r;
        let y = Math.sin(angleSp) * r;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = "#9cff57";
    ctx.lineWidth = 4 * globalScale;
    ctx.beginPath();
    ctx.moveTo(-50, 25);
    ctx.lineTo(-35, 45); 
    ctx.lineTo(-20, 30); 
    ctx.lineTo(0, 50);   
    ctx.lineTo(20, 35);  
    ctx.lineTo(35, 45);  
    ctx.lineTo(50, 25);  
    ctx.stroke();
    
    ctx.restore();

    requestAnimationFrame(update);
}

update();
