const GOURD_VISUAL = {
    cuiyu: { main: '#4caf50', light: '#81c784', dark: '#2e7d32', glow: 'rgba(76,175,80,0.4)', particle: '#a5d6a7' },
    jinyuan: { main: '#ffc107', light: '#ffd54f', dark: '#ff8f00', glow: 'rgba(255,193,7,0.4)', particle: '#ffe082' },
    bishui: { main: '#2196f3', light: '#64b5f6', dark: '#1565c0', glow: 'rgba(33,150,243,0.4)', particle: '#90caf9' },
    lieyan: { main: '#f44336', light: '#ef5350', dark: '#b71c1c', glow: 'rgba(244,67,54,0.4)', particle: '#ef9a9a' },
    qingmu: { main: '#66bb6a', light: '#a5d6a7', dark: '#388e3c', glow: 'rgba(102,187,106,0.4)', particle: '#c8e6c9' },
    xuantu: { main: '#8d6e63', light: '#bcaaa4', dark: '#4e342e', glow: 'rgba(141,110,99,0.4)', particle: '#d7ccc8' },
    zilei: { main: '#9c27b0', light: '#ce93d8', dark: '#6a1b9a', glow: 'rgba(156,39,176,0.4)', particle: '#e1bee7' },
    shuofeng: { main: '#78909c', light: '#b0bec5', dark: '#455a64', glow: 'rgba(120,144,156,0.4)', particle: '#cfd8dc' },
    xuanbing: { main: '#00bcd4', light: '#80deea', dark: '#00838f', glow: 'rgba(0,188,212,0.4)', particle: '#b2ebf2' },
    hundun: { main: '#ff7043', light: '#ffab91', dark: '#d84315', glow: 'rgba(255,112,67,0.4)', particle: '#ffccbc' }
};

const WEATHER_SKY = {
    sunny: { top: '#1a2a3a', mid: '#2a3a4a', bot: '#1a2a3a', ambient: 'rgba(255,235,59,0.03)' },
    cloudy: { top: '#1a1f2e', mid: '#252a38', bot: '#1a1f2e', ambient: 'rgba(158,158,158,0.03)' },
    rainy: { top: '#0d1b2a', mid: '#1a2535', bot: '#0d1b2a', ambient: 'rgba(33,150,243,0.04)' },
    stormy: { top: '#0a0a1a', mid: '#1a1030', bot: '#0a0a1a', ambient: 'rgba(156,39,176,0.04)' },
    windy: { top: '#1a2530', mid: '#253540', bot: '#1a2530', ambient: 'rgba(120,144,156,0.03)' },
    snowy: { top: '#1a2535', mid: '#2a3545', bot: '#1a2535', ambient: 'rgba(200,230,255,0.05)' },
    foggy: { top: '#1a1a2a', mid: '#2a2a3a', bot: '#1a1a2a', ambient: 'rgba(206,147,216,0.04)' },
    hot: { top: '#2a1a0a', mid: '#3a2a1a', bot: '#2a1a0a', ambient: 'rgba(255,87,34,0.04)' }
};

class CanvasRenderer {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.game = game;

        this.TILE_W = 140;
        this.TILE_H = 70;
        this.TILE_D = 30;

        this.offsetX = 0;
        this.offsetY = 0;
        this.displayW = 0;
        this.displayH = 0;

        this.hoveredPlot = -1;
        this.dragOverPlot = -1;
        this.time = 0;
        this.animationFrame = null;

        this.weatherParticles = [];
        this.gourdParticles = [];
        this.stars = [];
        this.lightningTimer = 0;
        this.lightningFlash = 0;

        this.tooltipPlot = -1;
        this.tooltipX = 0;
        this.tooltipY = 0;

        this.creatures = [];
        this.creatureSpawnTimer = 0;

        this.sceneryTrees = [];
        this.sceneryGrass = [];
        this.snowAccumulation = 0;

        this.init();
    }

    init() {
        this.generateStars();
        this.generateScenery();
        this.bindEvents();

        requestAnimationFrame(() => {
            this.resize();
            this.startAnimation();
        });

        this._resizeObserver = new ResizeObserver(() => {
            this.resize();
        });
        this._resizeObserver.observe(this.canvas.parentElement);
    }

    generateStars() {
        this.stars = [];
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Math.random(),
                y: Math.random() * 0.5,
                size: Math.random() * 1.5 + 0.5,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }

    resize() {
        const container = this.canvas.parentElement;
        const w = container.clientWidth;
        const h = container.clientHeight;

        if (w <= 0 || h <= 0) return;

        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        this.displayW = w;
        this.displayH = h;
        this.calculateOffsets();
    }

    calculateOffsets() {
        const gridW = (GRID_COLS + GRID_ROWS) * this.TILE_W / 2;
        this.offsetX = (this.displayW - gridW) / 2 + this.TILE_W * GRID_ROWS / 2;
        this.offsetY = 90;
    }

    isoToScreen(row, col) {
        return {
            x: this.offsetX + (col - row) * this.TILE_W / 2,
            y: this.offsetY + (col + row) * this.TILE_H / 2
        };
    }

    screenToIso(sx, sy) {
        const ax = sx - this.offsetX;
        const ay = sy - this.offsetY;
        const col = (ax / (this.TILE_W / 2) + ay / (this.TILE_H / 2)) / 2;
        const row = (ay / (this.TILE_H / 2) - ax / (this.TILE_W / 2)) / 2;
        return { row: Math.floor(row), col: Math.floor(col) };
    }

    getPlotAtPoint(sx, sy) {
        const { row, col } = this.screenToIso(sx, sy);
        if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
            const plotId = row * GRID_COLS + col;
            const pos = this.isoToScreen(row, col);
            const dx = sx - pos.x;
            const dy = sy - pos.y;
            if (Math.abs(dx) / (this.TILE_W / 2) + Math.abs(dy) / (this.TILE_H / 2) <= 1.1) {
                return plotId;
            }
        }
        return -1;
    }

    startAnimation() {
        const loop = () => {
            this.time += 0.016;
            this.updateWeatherParticles();
            this.updateGourdParticles();
            this.updateCreatures();
            this.updateSnowAccumulation();
            this.draw();
            this.animationFrame = requestAnimationFrame(loop);
        };
        loop();
    }

    stopAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    draw() {
        const ctx = this.ctx;
        if (this.displayW <= 0 || this.displayH <= 0) return;

        ctx.clearRect(0, 0, this.displayW, this.displayH);

        this.drawBackground();
        this.drawGroundGrass();
        this.drawBackTrees();
        this.drawCottage();
        this.drawFenceBack();

        for (let row = 0; row < GRID_ROWS; row++) {
            for (let col = 0; col < GRID_COLS; col++) {
                this.drawPlot(row, col);
            }
        }

        this.drawFenceFront();
        this.drawFrontTrees();
        this.drawGourdParticlesLayer();
        this.drawCreatures();
        this.drawWeatherEffects();
        this.drawDragFeedback();
        this.drawTooltip();
    }

    drawBackground() {
        const ctx = this.ctx;
        const weather = WEATHER_SKY[this.game.state.currentWeather] || WEATHER_SKY.sunny;

        const grad = ctx.createLinearGradient(0, 0, 0, this.displayH);
        grad.addColorStop(0, weather.top);
        grad.addColorStop(0.5, weather.mid);
        grad.addColorStop(1, weather.bot);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.displayW, this.displayH);

        ctx.fillStyle = weather.ambient;
        ctx.fillRect(0, 0, this.displayW, this.displayH);

        this.drawStars();
        this.drawMountains();
    }

    drawStars() {
        const ctx = this.ctx;
        const weather = this.game.state.currentWeather;
        if (weather === 'sunny' || weather === 'hot') return;

        let alpha = 0.6;
        if (weather === 'cloudy' || weather === 'foggy') alpha = 0.3;
        if (weather === 'stormy') alpha = 0.15;

        for (const star of this.stars) {
            const twinkle = Math.sin(this.time * 1.5 + star.twinkle) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(star.x * this.displayW, star.y * this.displayH, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha * twinkle})`;
            ctx.fill();
        }
    }

    drawMountains() {
        const ctx = this.ctx;
        const baseY = this.offsetY - 10;

        ctx.fillStyle = 'rgba(20,25,40,0.8)';
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        ctx.lineTo(0, baseY - 40);
        ctx.lineTo(60, baseY - 70);
        ctx.lineTo(120, baseY - 45);
        ctx.lineTo(180, baseY - 85);
        ctx.lineTo(260, baseY - 55);
        ctx.lineTo(340, baseY - 95);
        ctx.lineTo(420, baseY - 60);
        ctx.lineTo(500, baseY - 75);
        ctx.lineTo(580, baseY - 50);
        ctx.lineTo(660, baseY - 80);
        ctx.lineTo(740, baseY - 45);
        ctx.lineTo(820, baseY - 65);
        ctx.lineTo(this.displayW, baseY - 40);
        ctx.lineTo(this.displayW, baseY);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(30,35,55,0.6)';
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        ctx.lineTo(0, baseY - 25);
        ctx.lineTo(80, baseY - 50);
        ctx.lineTo(160, baseY - 30);
        ctx.lineTo(250, baseY - 60);
        ctx.lineTo(350, baseY - 35);
        ctx.lineTo(450, baseY - 55);
        ctx.lineTo(550, baseY - 30);
        ctx.lineTo(650, baseY - 50);
        ctx.lineTo(750, baseY - 35);
        ctx.lineTo(this.displayW, baseY - 45);
        ctx.lineTo(this.displayW, baseY);
        ctx.closePath();
        ctx.fill();
    }

    drawPlot(row, col) {
        const ctx = this.ctx;
        const plotId = row * GRID_COLS + col;
        const plot = this.game.state.plots[plotId];
        const pos = this.isoToScreen(row, col);
        const cx = pos.x;
        const cy = pos.y;

        const W = this.TILE_W / 2;
        const H = this.TILE_H / 2;
        const D = this.TILE_D;

        const isHovered = this.hoveredPlot === plotId;
        const isDragTarget = this.dragOverPlot === plotId;

        let topColor, leftColor, rightColor, borderColor;

        if (!plot.unlocked) {
            topColor = '#151525';
            leftColor = '#0e0e1a';
            rightColor = '#121220';
            borderColor = 'rgba(100,100,140,0.3)';
        } else if (!plot.gourd) {
            topColor = '#3e2723';
            leftColor = '#2c1a0e';
            rightColor = '#33200f';
            borderColor = 'rgba(139,119,101,0.4)';
        } else {
            if (plot.watered) {
                topColor = '#2e3a2a';
                leftColor = '#1e2a1a';
                rightColor = '#253020';
            } else {
                topColor = '#4e342e';
                leftColor = '#3e2723';
                rightColor = '#45291f';
            }
            borderColor = 'rgba(139,119,101,0.5)';
        }

        if (isHovered || isDragTarget) {
            topColor = this.lightenColor(topColor, 25);
            leftColor = this.lightenColor(leftColor, 18);
            rightColor = this.lightenColor(rightColor, 18);
            borderColor = 'rgba(226,183,20,0.7)';
        }

        if (plot.gourd && plot.stage >= 5) {
            const pulse = Math.sin(this.time * 3) * 0.15 + 0.85;
            borderColor = `rgba(226,183,20,${pulse})`;
        }

        ctx.beginPath();
        ctx.moveTo(cx, cy - H);
        ctx.lineTo(cx + W, cy);
        ctx.lineTo(cx, cy + H);
        ctx.lineTo(cx - W, cy);
        ctx.closePath();
        ctx.fillStyle = topColor;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        if (!plot.unlocked) {
            this.drawDashedBorder(ctx, cx, cy, W, H);
        }

        ctx.beginPath();
        ctx.moveTo(cx - W, cy);
        ctx.lineTo(cx, cy + H);
        ctx.lineTo(cx, cy + H + D);
        ctx.lineTo(cx - W, cy + D);
        ctx.closePath();
        ctx.fillStyle = leftColor;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + W, cy);
        ctx.lineTo(cx, cy + H);
        ctx.lineTo(cx, cy + H + D);
        ctx.lineTo(cx + W, cy + D);
        ctx.closePath();
        ctx.fillStyle = rightColor;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        if (!plot.unlocked) {
            this.drawLockIcon(cx, cy);
        } else if (!plot.gourd) {
            this.drawEmptySoil(cx, cy);
            if (isDragTarget && this.game.draggedSeedId) {
                this.drawPlantPreview(cx, cy);
            }
        } else {
            this.drawGourd(cx, cy, plot, plotId);
            this.drawProgressBar(cx, cy + H + D + 4, plot);
            this.drawStatusIcons(cx, cy, plot, plotId);
        }
    }

    drawDashedBorder(ctx, cx, cy, W, H) {
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx, cy - H);
        ctx.lineTo(cx + W, cy);
        ctx.lineTo(cx, cy + H);
        ctx.lineTo(cx - W, cy);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(100,100,140,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }

    drawLockIcon(cx, cy) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = 'rgba(100,100,140,0.6)';
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔒', cx, cy - 2);
        ctx.restore();
    }

    drawEmptySoil(cx, cy) {
        const ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = 'rgba(62,39,35,0.6)';
        for (let i = 0; i < 3; i++) {
            const ox = (i - 1) * 12;
            const oy = -2 + Math.sin(i * 1.5) * 3;
            ctx.beginPath();
            ctx.ellipse(cx + ox, cy + oy, 6, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.strokeStyle = 'rgba(93,64,55,0.4)';
        ctx.lineWidth = 0.5;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(cx - 15, cy + i * 4);
            ctx.lineTo(cx + 15, cy + i * 4);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawPlantPreview(cx, cy) {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = 0.4 + Math.sin(this.time * 4) * 0.15;
        ctx.fillStyle = 'rgba(226,183,20,0.3)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '14px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🌱', cx, cy - 4);
        ctx.restore();
    }

    drawGourd(cx, cy, plot, plotId) {
        const gourdType = GOURD_TYPES[plot.gourd];
        const colors = GOURD_VISUAL[plot.gourd];
        const stage = plot.stage;

        const baseY = cy - 4;

        switch (stage) {
            case 0: this.drawSeedStage(cx, baseY); break;
            case 1: this.drawSproutStage(cx, baseY, colors); break;
            case 2: this.drawVineStage(cx, baseY, colors); break;
            case 3: this.drawFlowerStage(cx, baseY, colors); break;
            case 4: this.drawFruitStage(cx, baseY, colors); break;
            case 5: this.drawMatureStage(cx, baseY, colors, plot.gourd); break;
        }

        if (stage >= 5) {
            this.drawMatureGlow(cx, baseY - 18, colors);
            this.spawnGourdParticle(cx, baseY - 18, colors, plot.gourd);
        }
    }

    drawSeedStage(cx, cy) {
        const ctx = this.ctx;

        ctx.beginPath();
        ctx.ellipse(cx, cy, 8, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#5d4037';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx, cy - 2, 5, 3.5, 0.2, 0, Math.PI * 2);
        const seedGrad = ctx.createRadialGradient(cx - 1, cy - 3, 0, cx, cy - 2, 5);
        seedGrad.addColorStop(0, '#a1887f');
        seedGrad.addColorStop(1, '#6d4c41');
        ctx.fillStyle = seedGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx - 1, cy - 3, 2, 1, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fill();
    }

    drawSproutStage(cx, cy, colors) {
        const ctx = this.ctx;
        const sway = Math.sin(this.time * 2) * 1.5;

        ctx.beginPath();
        ctx.ellipse(cx, cy + 1, 7, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cx + sway, cy - 10, cx + sway * 0.5, cy - 18);
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(cx + sway * 0.5 - 5, cy - 13, 6, 3, -0.5 + sway * 0.02, 0, Math.PI * 2);
        ctx.fillStyle = '#66bb6a';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx + sway * 0.5 + 5, cy - 15, 6, 3, 0.5 - sway * 0.02, 0, Math.PI * 2);
        ctx.fillStyle = '#81c784';
        ctx.fill();
    }

    drawVineStage(cx, cy, colors) {
        const ctx = this.ctx;
        const sway = Math.sin(this.time * 1.5) * 1;

        ctx.beginPath();
        ctx.ellipse(cx, cy + 1, 10, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cx - 5 + sway, cy - 12, cx - 2, cy - 22);
        ctx.quadraticCurveTo(cx + 3, cy - 28, cx + 8 + sway, cy - 32);
        ctx.strokeStyle = '#388e3c';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        const leafPositions = [
            { x: cx - 6, y: cy - 14, r: -0.6 },
            { x: cx + 4, y: cy - 20, r: 0.4 },
            { x: cx + 10, y: cy - 30, r: 0.7 },
            { x: cx - 3, y: cy - 26, r: -0.3 }
        ];

        for (const leaf of leafPositions) {
            ctx.beginPath();
            ctx.ellipse(leaf.x + sway * 0.3, leaf.y, 7, 3.5, leaf.r + sway * 0.02, 0, Math.PI * 2);
            ctx.fillStyle = colors.dark;
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(leaf.x + sway * 0.3, leaf.y, 6, 3, leaf.r + sway * 0.02, 0, Math.PI * 2);
            ctx.fillStyle = colors.main;
            ctx.fill();
        }
    }

    drawFlowerStage(cx, cy, colors) {
        const ctx = this.ctx;
        const sway = Math.sin(this.time * 1.2) * 0.8;

        ctx.beginPath();
        ctx.ellipse(cx, cy + 1, 10, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cx - 6 + sway, cy - 14, cx - 3, cy - 24);
        ctx.quadraticCurveTo(cx + 4, cy - 30, cx + 10 + sway, cy - 35);
        ctx.strokeStyle = '#388e3c';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        const leafPositions = [
            { x: cx - 7, y: cy - 16, r: -0.5 },
            { x: cx + 5, y: cy - 22, r: 0.5 },
            { x: cx + 12, y: cy - 33, r: 0.6 }
        ];

        for (const leaf of leafPositions) {
            ctx.beginPath();
            ctx.ellipse(leaf.x + sway * 0.3, leaf.y, 7, 3.5, leaf.r, 0, Math.PI * 2);
            ctx.fillStyle = colors.dark;
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(leaf.x + sway * 0.3, leaf.y, 6, 3, leaf.r, 0, Math.PI * 2);
            ctx.fillStyle = colors.main;
            ctx.fill();
        }

        const flowerPositions = [
            { x: cx - 4, y: cy - 25, size: 4 },
            { x: cx + 8, y: cy - 34, size: 5 },
            { x: cx + 2, y: cy - 28, size: 3.5 }
        ];

        for (const flower of flowerPositions) {
            const fx = flower.x + sway * 0.3;
            const fy = flower.y;
            const fs = flower.size;

            for (let p = 0; p < 5; p++) {
                const angle = (p / 5) * Math.PI * 2 + this.time * 0.3;
                ctx.beginPath();
                ctx.ellipse(
                    fx + Math.cos(angle) * fs,
                    fy + Math.sin(angle) * fs * 0.6,
                    fs * 0.6, fs * 0.3, angle, 0, Math.PI * 2
                );
                ctx.fillStyle = colors.light;
                ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(fx, fy, fs * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = '#ffd54f';
            ctx.fill();
        }
    }

    drawFruitStage(cx, cy, colors) {
        const ctx = this.ctx;
        const sway = Math.sin(this.time * 1) * 0.5;

        ctx.beginPath();
        ctx.ellipse(cx, cy + 1, 10, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cx - 4 + sway, cy - 12, cx - 2, cy - 22);
        ctx.quadraticCurveTo(cx + 3, cy - 28, cx + 6 + sway, cy - 30);
        ctx.strokeStyle = '#388e3c';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        const leafPositions = [
            { x: cx - 5, y: cy - 15, r: -0.4 },
            { x: cx + 8, y: cy - 28, r: 0.5 }
        ];
        for (const leaf of leafPositions) {
            ctx.beginPath();
            ctx.ellipse(leaf.x + sway * 0.2, leaf.y, 6, 3, leaf.r, 0, Math.PI * 2);
            ctx.fillStyle = colors.main;
            ctx.fill();
        }

        const gourdX = cx + sway * 0.3;
        const gourdY = cy - 12;

        const botGrad = ctx.createRadialGradient(gourdX - 2, gourdY - 3, 1, gourdX, gourdY, 8);
        botGrad.addColorStop(0, colors.light);
        botGrad.addColorStop(0.7, colors.main);
        botGrad.addColorStop(1, colors.dark);

        ctx.beginPath();
        ctx.ellipse(gourdX, gourdY, 7, 9, 0, 0, Math.PI * 2);
        ctx.fillStyle = botGrad;
        ctx.fill();

        const topGrad = ctx.createRadialGradient(gourdX - 1, gourdY - 16, 0.5, gourdX, gourdY - 14, 5);
        topGrad.addColorStop(0, colors.light);
        topGrad.addColorStop(0.7, colors.main);
        topGrad.addColorStop(1, colors.dark);

        ctx.beginPath();
        ctx.ellipse(gourdX, gourdY - 14, 5, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = topGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(gourdX, gourdY - 22);
        ctx.quadraticCurveTo(gourdX + 2, gourdY - 25, gourdX + 1, gourdY - 26);
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    drawMatureStage(cx, cy, colors, gourdId) {
        const ctx = this.ctx;
        const bob = Math.sin(this.time * 2) * 1.5;
        const gx = cx;
        const gy = cy - 8 + bob;

        ctx.beginPath();
        ctx.ellipse(cx, cy + 1, 14, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fill();

        const botGrad = ctx.createRadialGradient(gx - 4, gy - 6, 2, gx, gy, 14);
        botGrad.addColorStop(0, colors.light);
        botGrad.addColorStop(0.5, colors.main);
        botGrad.addColorStop(1, colors.dark);

        ctx.beginPath();
        ctx.ellipse(gx, gy, 12, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = botGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(gx - 4, gy - 5, 4, 6, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(gx - 4, gy - 12);
        ctx.quadraticCurveTo(gx - 5, gy - 16, gx - 3, gy - 15);
        ctx.lineTo(gx + 3, gy - 15);
        ctx.quadraticCurveTo(gx + 5, gy - 16, gx + 4, gy - 12);
        ctx.fillStyle = colors.main;
        ctx.fill();

        const topGrad = ctx.createRadialGradient(gx - 2, gy - 22, 1, gx, gy - 19, 8);
        topGrad.addColorStop(0, colors.light);
        topGrad.addColorStop(0.5, colors.main);
        topGrad.addColorStop(1, colors.dark);

        ctx.beginPath();
        ctx.ellipse(gx, gy - 19, 7, 9, 0, 0, Math.PI * 2);
        ctx.fillStyle = topGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(gx - 2, gy - 21, 3, 4, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(gx, gy - 27);
        ctx.quadraticCurveTo(gx + 3, gy - 31, gx + 2, gy - 33);
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(gx + 5, gy - 31, 5, 2.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4caf50';
        ctx.fill();
        ctx.strokeStyle = '#388e3c';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        this.drawElementEffect(gx, gy - 12, gourdId, colors);
    }

    drawElementEffect(x, y, gourdId, colors) {
        const ctx = this.ctx;
        const gourdType = GOURD_TYPES[gourdId];
        if (!gourdType) return;

        switch (gourdType.element) {
            case 'fire':
                for (let i = 0; i < 3; i++) {
                    const fx = x + Math.sin(this.time * 3 + i * 2) * 8;
                    const fy = y - 5 - Math.abs(Math.sin(this.time * 4 + i)) * 12;
                    const fs = 2 + Math.sin(this.time * 5 + i) * 1;
                    ctx.beginPath();
                    ctx.arc(fx, fy, fs, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,${100 + i * 40},0,${0.4 + Math.sin(this.time * 3 + i) * 0.2})`;
                    ctx.fill();
                }
                break;
            case 'water':
                for (let i = 0; i < 3; i++) {
                    const dx = x + Math.sin(this.time * 2 + i * 2.1) * 10;
                    const dy = y + Math.cos(this.time * 1.5 + i * 1.7) * 5;
                    ctx.beginPath();
                    ctx.ellipse(dx, dy, 2, 3, 0, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(100,181,246,${0.3 + Math.sin(this.time * 2 + i) * 0.15})`;
                    ctx.fill();
                }
                break;
            case 'thunder':
                if (Math.sin(this.time * 8) > 0.9) {
                    ctx.beginPath();
                    ctx.moveTo(x - 3, y - 8);
                    ctx.lineTo(x + 1, y - 2);
                    ctx.lineTo(x - 1, y - 2);
                    ctx.lineTo(x + 3, y + 4);
                    ctx.strokeStyle = 'rgba(206,147,216,0.8)';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
                break;
            case 'ice':
                for (let i = 0; i < 4; i++) {
                    const angle = this.time * 0.8 + i * Math.PI / 2;
                    const dist = 12 + Math.sin(this.time * 2 + i) * 3;
                    const sx = x + Math.cos(angle) * dist;
                    const sy = y + Math.sin(angle) * dist * 0.5;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(128,222,234,${0.4 + Math.sin(this.time * 3 + i) * 0.2})`;
                    ctx.fill();
                }
                break;
            case 'wind':
                for (let i = 0; i < 2; i++) {
                    const wy = y - 5 + i * 8;
                    const phase = this.time * 3 + i * 2;
                    ctx.beginPath();
                    ctx.moveTo(x - 12, wy);
                    ctx.quadraticCurveTo(x - 4 + Math.sin(phase) * 4, wy - 3, x + 8, wy);
                    ctx.strokeStyle = `rgba(176,190,197,${0.3 + Math.sin(phase) * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                break;
            case 'chaos':
                const hue = (this.time * 60) % 360;
                ctx.beginPath();
                ctx.arc(x, y - 12, 14 + Math.sin(this.time * 2) * 2, 0, Math.PI * 2);
                ctx.strokeStyle = `hsla(${hue},70%,60%,0.3)`;
                ctx.lineWidth = 2;
                ctx.stroke();
                break;
        }
    }

    drawMatureGlow(x, y, colors) {
        const ctx = this.ctx;
        const pulse = Math.sin(this.time * 2.5) * 0.15 + 0.85;

        const glowGrad = ctx.createRadialGradient(x, y, 5, x, y, 28);
        glowGrad.addColorStop(0, colors.glow);
        glowGrad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
        ctx.restore();
    }

    spawnGourdParticle(cx, cy, colors, gourdId) {
        if (Math.random() > 0.03) return;

        this.gourdParticles.push({
            x: cx + (Math.random() - 0.5) * 20,
            y: cy + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -Math.random() * 0.8 - 0.3,
            life: 1.0,
            decay: 0.01 + Math.random() * 0.01,
            size: Math.random() * 2.5 + 1,
            color: colors.particle
        });
    }

    updateGourdParticles() {
        for (let i = this.gourdParticles.length - 1; i >= 0; i--) {
            const p = this.gourdParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) {
                this.gourdParticles.splice(i, 1);
            }
        }
    }

    drawProgressBar(cx, cy, plot) {
        if (!plot.gourd) return;
        const ctx = this.ctx;
        const barW = 30;
        const barH = 3;
        const progress = plot.growthProgress;
        const isMature = plot.stage >= 5;

        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(cx - barW / 2, cy, barW, barH);

        const fillColor = isMature ? '#ffd700' : '#4caf50';
        ctx.fillStyle = fillColor;
        ctx.fillRect(cx - barW / 2, cy, barW * progress, barH);

        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(cx - barW / 2, cy, barW, barH);
    }

    drawStatusIcons(cx, cy, plot, plotId) {
        const ctx = this.ctx;
        let offsetX = -12;
        const baseY = cy - this.TILE_H / 2 - 8;

        if (plot.watered) {
            ctx.beginPath();
            ctx.moveTo(cx + offsetX, baseY + 4);
            ctx.quadraticCurveTo(cx + offsetX - 3, baseY, cx + offsetX, baseY - 3);
            ctx.quadraticCurveTo(cx + offsetX + 3, baseY, cx + offsetX, baseY + 4);
            ctx.fillStyle = 'rgba(66,165,245,0.8)';
            ctx.fill();
            offsetX += 8;
        }

        if (plot.fertilized) {
            ctx.beginPath();
            ctx.arc(cx + offsetX, baseY, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139,195,74,0.8)';
            ctx.fill();
            offsetX += 8;
        }

        if (this.game.state.pestFlags[plotId]) {
            ctx.beginPath();
            ctx.arc(cx + offsetX, baseY, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(244,67,54,0.8)';
            ctx.fill();
            offsetX += 8;
        }

        if (plot.stage < 5) {
            const multiplier = this.game.getWeatherGrowthMultiplier(plot.gourd);
            if (multiplier > 1.0) {
                ctx.beginPath();
                ctx.arc(cx + offsetX, baseY, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,235,59,0.8)';
                ctx.fill();
            } else if (multiplier < 1.0) {
                ctx.beginPath();
                ctx.arc(cx + offsetX, baseY, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,152,0,0.8)';
                ctx.fill();
            }
        }
    }

    drawWeatherEffects() {
        const ctx = this.ctx;
        const weather = this.game.state.currentWeather;

        switch (weather) {
            case 'rainy':
            case 'stormy':
                this.drawRain(weather === 'stormy');
                break;
            case 'snowy':
                this.drawSnow();
                break;
            case 'foggy':
                this.drawFog();
                break;
            case 'windy':
                this.drawWindStreaks();
                break;
            case 'sunny':
                this.drawSunRays();
                break;
            case 'hot':
                this.drawHeatShimmer();
                break;
        }

        if (weather === 'stormy') {
            this.lightningTimer += 0.016;
            if (this.lightningTimer > 3 + Math.random() * 5) {
                this.lightningFlash = 1.0;
                this.lightningTimer = 0;
            }
            if (this.lightningFlash > 0) {
                ctx.fillStyle = `rgba(200,200,255,${this.lightningFlash * 0.15})`;
                ctx.fillRect(0, 0, this.displayW, this.displayH);
                this.lightningFlash -= 0.08;
            }
        }
    }

    updateWeatherParticles() {
        const weather = this.game.state.currentWeather;
        const maxParticles = weather === 'stormy' ? 150 : weather === 'rainy' ? 100 : weather === 'snowy' ? 60 : 0;

        while (this.weatherParticles.length < maxParticles) {
            const p = {
                x: Math.random() * this.displayW,
                y: -10,
                speed: 0,
                size: 0,
                drift: 0,
                life: 1
            };

            if (weather === 'rainy' || weather === 'stormy') {
                p.speed = 4 + Math.random() * 4;
                p.size = 1 + Math.random() * 2;
                p.drift = weather === 'stormy' ? (Math.random() - 0.3) * 3 : (Math.random() - 0.5) * 0.5;
                p.length = 8 + Math.random() * 8;
            } else if (weather === 'snowy') {
                p.speed = 0.5 + Math.random() * 1.5;
                p.size = 1 + Math.random() * 3;
                p.drift = Math.sin(Math.random() * Math.PI * 2) * 0.5;
            }

            this.weatherParticles.push(p);
        }

        for (let i = this.weatherParticles.length - 1; i >= 0; i--) {
            const p = this.weatherParticles[i];
            p.y += p.speed;
            p.x += p.drift;

            if (weather === 'snowy') {
                p.drift = Math.sin(this.time * 2 + i * 0.1) * 0.5;
            }

            if (p.y > this.displayH + 10 || p.x < -10 || p.x > this.displayW + 10) {
                this.weatherParticles.splice(i, 1);
            }
        }
    }

    drawRain(isStormy) {
        const ctx = this.ctx;
        ctx.strokeStyle = isStormy ? 'rgba(150,150,220,0.4)' : 'rgba(100,150,255,0.3)';
        ctx.lineWidth = 1;

        for (const p of this.weatherParticles) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.drift * 2, p.y + p.length);
            ctx.stroke();
        }
    }

    drawSnow() {
        const ctx = this.ctx;

        for (const p of this.weatherParticles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(230,240,255,${0.4 + Math.sin(this.time + p.x) * 0.15})`;
            ctx.fill();
        }
    }

    drawFog() {
        const ctx = this.ctx;

        for (let i = 0; i < 3; i++) {
            const y = this.displayH * (0.3 + i * 0.2) + Math.sin(this.time * 0.3 + i) * 20;
            const grad = ctx.createLinearGradient(0, y - 40, 0, y + 40);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(0.5, `rgba(180,170,200,${0.08 + Math.sin(this.time * 0.5 + i) * 0.03})`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(0, y - 40, this.displayW, 80);
        }
    }

    drawWindStreaks() {
        const ctx = this.ctx;

        for (let i = 0; i < 8; i++) {
            const y = (this.time * 50 + i * 80) % this.displayH;
            const x = Math.sin(this.time + i * 2) * 30;
            const len = 30 + Math.sin(this.time * 2 + i) * 15;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + len, y + Math.sin(this.time + i) * 3);
            ctx.strokeStyle = `rgba(176,190,197,${0.15 + Math.sin(this.time * 2 + i) * 0.05})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    drawSunRays() {
        const ctx = this.ctx;
        const sx = this.displayW - 60;
        const sy = 30;

        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 0.5 + Math.PI + this.time * 0.1;
            const len = 50 + Math.sin(this.time * 2 + i) * 10;

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
            ctx.strokeStyle = `rgba(255,235,59,${0.08 + Math.sin(this.time * 2 + i) * 0.03})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        const sunGrad = ctx.createRadialGradient(sx, sy, 3, sx, sy, 20);
        sunGrad.addColorStop(0, 'rgba(255,235,59,0.4)');
        sunGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(sx, sy, 20, 0, Math.PI * 2);
        ctx.fillStyle = sunGrad;
        ctx.fill();
    }

    drawHeatShimmer() {
        const ctx = this.ctx;

        for (let i = 0; i < 5; i++) {
            const y = this.displayH * 0.6 + i * 20;
            const wave = Math.sin(this.time * 3 + i * 1.5) * 3;

            ctx.beginPath();
            ctx.moveTo(0, y + wave);
            for (let x = 0; x < this.displayW; x += 20) {
                ctx.lineTo(x, y + Math.sin(this.time * 3 + x * 0.02 + i) * 3);
            }
            ctx.strokeStyle = `rgba(255,87,34,${0.04 + Math.sin(this.time + i) * 0.02})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    drawDragFeedback() {
        if (!this.game.draggedSeedId) return;

        const ctx = this.ctx;

        for (let row = 0; row < GRID_ROWS; row++) {
            for (let col = 0; col < GRID_COLS; col++) {
                const plotId = row * GRID_COLS + col;
                const plot = this.game.state.plots[plotId];
                if (!plot.unlocked || plot.gourd) continue;

                const pos = this.isoToScreen(row, col);
                const pulse = Math.sin(this.time * 3) * 0.15 + 0.25;

                ctx.save();
                ctx.globalAlpha = pulse;
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y - this.TILE_H / 2);
                ctx.lineTo(pos.x + this.TILE_W / 2, pos.y);
                ctx.lineTo(pos.x, pos.y + this.TILE_H / 2);
                ctx.lineTo(pos.x - this.TILE_W / 2, pos.y);
                ctx.closePath();
                ctx.fillStyle = 'rgba(226,183,20,0.3)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(226,183,20,0.6)';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    drawTooltip() {
        if (this.hoveredPlot < 0) return;

        const plot = this.game.state.plots[this.hoveredPlot];
        if (!plot) return;

        const ctx = this.ctx;
        const row = Math.floor(this.hoveredPlot / GRID_COLS);
        const col = this.hoveredPlot % GRID_COLS;
        const pos = this.isoToScreen(row, col);

        let lines = [];
        if (!plot.unlocked) {
            const cost = 50 + (this.game.state.unlockedPlots - INITIAL_UNLOCKED) * 30;
            lines = [`🔒 未开垦`, `开垦费用: 💎${cost}`];
        } else if (!plot.gourd) {
            lines = ['空灵田', '点击或拖拽种子种植'];
        } else {
            const gourdType = GOURD_TYPES[plot.gourd];
            const progress = Math.floor(plot.growthProgress * 100);
            lines = [
                `${gourdType.name}`,
                `${STAGE_NAMES[plot.stage]} (${progress}%)`,
                `属性: ${gourdType.elementName}`
            ];
            if (plot.stage >= 5) {
                lines.push('✨ 已成熟，点击收获');
            }
        }

        ctx.save();
        ctx.font = '12px "Microsoft YaHei", sans-serif';

        const tx = pos.x + 20;
        const ty = pos.y - 30;
        const padding = 8;
        const lineHeight = 16;
        const maxWidth = Math.max(...lines.map(l => ctx.measureText(l).width)) + padding * 2;
        const height = lines.length * lineHeight + padding * 2;

        const drawX = Math.min(tx, this.displayW - maxWidth - 5);
        const drawY = Math.max(ty, 5);

        ctx.fillStyle = 'rgba(20,20,40,0.9)';
        ctx.strokeStyle = 'rgba(226,183,20,0.5)';
        ctx.lineWidth = 1;

        const r = 6;
        ctx.beginPath();
        ctx.moveTo(drawX + r, drawY);
        ctx.lineTo(drawX + maxWidth - r, drawY);
        ctx.quadraticCurveTo(drawX + maxWidth, drawY, drawX + maxWidth, drawY + r);
        ctx.lineTo(drawX + maxWidth, drawY + height - r);
        ctx.quadraticCurveTo(drawX + maxWidth, drawY + height, drawX + maxWidth - r, drawY + height);
        ctx.lineTo(drawX + r, drawY + height);
        ctx.quadraticCurveTo(drawX, drawY + height, drawX, drawY + height - r);
        ctx.lineTo(drawX, drawY + r);
        ctx.quadraticCurveTo(drawX, drawY, drawX + r, drawY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#e8e8e8';

        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], drawX + padding, drawY + padding + i * lineHeight);
        }

        ctx.restore();
    }

    drawGourdParticlesLayer() {
        const ctx = this.ctx;
        for (const p of this.gourdParticles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));
        this.canvas.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.canvas.addEventListener('dragleave', () => this.handleDragLeave());
        this.canvas.addEventListener('drop', (e) => this.handleDrop(e));
    }

    getCanvasPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    handleMouseMove(e) {
        const pos = this.getCanvasPos(e);
        this.hoveredPlot = this.getPlotAtPoint(pos.x, pos.y);
        this.canvas.style.cursor = this.hoveredPlot >= 0 ? 'pointer' : 'default';
    }

    handleClick(e) {
        const pos = this.getCanvasPos(e);
        const plotId = this.getPlotAtPoint(pos.x, pos.y);
        if (plotId < 0) return;

        const plot = this.game.state.plots[plotId];
        if (!plot.unlocked) {
            this.game.tryUnlockPlot(plotId);
        } else if (plot.gourd) {
            this.game.handlePlotClick(plotId, e);
        } else {
            this.game.handlePlantClick(plotId);
        }
    }

    handleContextMenu(e) {
        e.preventDefault();
        const pos = this.getCanvasPos(e);
        const plotId = this.getPlotAtPoint(pos.x, pos.y);
        if (plotId < 0) return;

        const plot = this.game.state.plots[plotId];
        if (plot.gourd) {
            this.game.showGourdDetail(plotId);
        } else if (plot.unlocked) {
            this.game.showPlantMenu(plotId);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const pos = this.getCanvasPos(e);
        const plotId = this.getPlotAtPoint(pos.x, pos.y);
        this.dragOverPlot = plotId;
    }

    handleDragLeave() {
        this.dragOverPlot = -1;
    }

    handleDrop(e) {
        e.preventDefault();
        const seedId = e.dataTransfer.getData('text/plain');
        if (!seedId) return;

        const pos = this.getCanvasPos(e);
        const plotId = this.getPlotAtPoint(pos.x, pos.y);
        if (plotId < 0) return;

        const plot = this.game.state.plots[plotId];
        if (!plot.unlocked || plot.gourd) return;

        if (this.game.draggedFromShop) {
            this.game.buyAndPlantSeed(plotId, seedId);
        } else {
            this.game.plantSeed(plotId, seedId);
        }

        this.dragOverPlot = -1;
    }

    generateScenery() {
        this.sceneryTrees = [];
        this.sceneryGrass = [];

        const treePositions = [
            { row: -3, col: -3, size: 1.2, type: 'pine' },
            { row: -2, col: 8, size: 1.0, type: 'pine' },
            { row: -3, col: 5, size: 0.9, type: 'round' },
            { row: -4, col: 2, size: 1.1, type: 'pine' },
            { row: 2, col: -3, size: 1.0, type: 'round' },
            { row: 5, col: -3, size: 1.1, type: 'pine' },
            { row: 6, col: 8, size: 0.95, type: 'round' },
            { row: 3, col: 9, size: 1.05, type: 'pine' },
            { row: 7, col: 3, size: 1.15, type: 'round' },
            { row: -2, col: -2, size: 0.85, type: 'round' },
            { row: 6, col: -2, size: 0.9, type: 'pine' },
            { row: -3, col: 7, size: 0.8, type: 'round' },
        ];

        for (const tp of treePositions) {
            this.sceneryTrees.push({
                ...tp,
                sway: Math.random() * Math.PI * 2,
                leafDensity: 0.8 + Math.random() * 0.4
            });
        }

        const grassSeeds = [
            { row: -2, col: 0 }, { row: -2, col: 3 }, { row: -1, col: 7 },
            { row: 0, col: -2 }, { row: 1, col: -2 }, { row: 2, col: -2 },
            { row: 3, col: -2 }, { row: 4, col: -2 }, { row: 5, col: 7 },
            { row: 6, col: 2 }, { row: 6, col: 5 }, { row: 7, col: 1 },
            { row: 7, col: 4 }, { row: -1, col: -2 }, { row: -2, col: 6 },
            { row: 0, col: 8 }, { row: 1, col: 8 }, { row: 4, col: 8 },
            { row: 5, col: -2 }, { row: 7, col: 6 }, { row: -2, col: 2 },
            { row: 6, col: 7 }, { row: -1, col: 4 }, { row: 3, col: 8 },
        ];

        for (const gs of grassSeeds) {
            const blades = [];
            const count = 5 + Math.floor(Math.random() * 6);
            for (let i = 0; i < count; i++) {
                blades.push({
                    ox: (Math.random() - 0.5) * 30,
                    oy: (Math.random() - 0.5) * 15,
                    h: 6 + Math.random() * 8,
                    w: 1.5 + Math.random() * 1.5,
                    phase: Math.random() * Math.PI * 2
                });
            }
            this.sceneryGrass.push({
                row: gs.row,
                col: gs.col,
                blades: blades
            });
        }
    }

    updateSnowAccumulation() {
        const weather = this.game.state.currentWeather;
        if (weather === 'snowy') {
            this.snowAccumulation = Math.min(1.0, this.snowAccumulation + 0.0008);
        } else {
            this.snowAccumulation = Math.max(0, this.snowAccumulation - 0.0003);
        }
    }

    getGrassColor() {
        const weather = this.game.state.currentWeather;
        const snow = this.snowAccumulation;

        const baseColors = {
            sunny: { r: 76, g: 175, b: 80 },
            cloudy: { r: 60, g: 140, b: 65 },
            rainy: { r: 50, g: 130, b: 55 },
            stormy: { r: 40, g: 100, b: 45 },
            windy: { r: 65, g: 150, b: 70 },
            snowy: { r: 76, g: 175, b: 80 },
            foggy: { r: 70, g: 145, b: 75 },
            hot: { r: 160, g: 160, b: 60 }
        };

        const snowColor = { r: 230, g: 240, b: 250 };
        const base = baseColors[weather] || baseColors.sunny;

        const r = Math.round(base.r + (snowColor.r - base.r) * snow);
        const g = Math.round(base.g + (snowColor.g - base.g) * snow);
        const b = Math.round(base.b + (snowColor.b - base.b) * snow);

        return { r, g, b };
    }

    getTreeLeafColor() {
        const weather = this.game.state.currentWeather;
        const snow = this.snowAccumulation;

        const baseColors = {
            sunny: { r: 56, g: 142, b: 60 },
            cloudy: { r: 46, g: 120, b: 50 },
            rainy: { r: 38, g: 110, b: 45 },
            stormy: { r: 30, g: 85, b: 38 },
            windy: { r: 50, g: 130, b: 55 },
            snowy: { r: 56, g: 142, b: 60 },
            foggy: { r: 55, g: 125, b: 60 },
            hot: { r: 140, g: 150, b: 50 }
        };

        const snowColor = { r: 220, g: 235, b: 245 };
        const base = baseColors[weather] || baseColors.sunny;

        const r = Math.round(base.r + (snowColor.r - base.r) * snow);
        const g = Math.round(base.g + (snowColor.g - base.g) * snow);
        const b = Math.round(base.b + (snowColor.b - base.b) * snow);

        return { r, g, b };
    }

    drawGroundGrass() {
        const ctx = this.ctx;
        const gc = this.getGrassColor();
        const weather = this.game.state.currentWeather;

        const topLeft = this.isoToScreen(-2, -2);
        const topRight = this.isoToScreen(-2, GRID_COLS + 1);
        const botLeft = this.isoToScreen(GRID_ROWS + 1, -2);
        const botRight = this.isoToScreen(GRID_ROWS + 1, GRID_COLS + 1);

        const groundGrad = ctx.createLinearGradient(0, topLeft.y - 20, 0, botRight.y + 30);
        groundGrad.addColorStop(0, `rgba(${gc.r - 20},${gc.g - 20},${gc.b - 15},0.3)`);
        groundGrad.addColorStop(0.5, `rgba(${gc.r},${gc.g},${gc.b},0.25)`);
        groundGrad.addColorStop(1, `rgba(${gc.r - 10},${gc.g - 10},${gc.b - 8},0.2)`);

        ctx.fillStyle = groundGrad;
        ctx.beginPath();
        ctx.moveTo(topLeft.x - 40, topLeft.y - 20);
        ctx.lineTo(topRight.x + 40, topRight.y - 20);
        ctx.lineTo(botRight.x + 40, botRight.y + 30);
        ctx.lineTo(botLeft.x - 40, botLeft.y + 30);
        ctx.closePath();
        ctx.fill();

        for (const grassPatch of this.sceneryGrass) {
            this.drawGrassPatch(grassPatch);
        }

        if (this.snowAccumulation > 0.1) {
            this.drawGroundSnow();
        }
    }

    drawGrassPatch(patch) {
        const ctx = this.ctx;
        const gc = this.getGrassColor();
        const weather = this.game.state.currentWeather;
        const pos = this.isoToScreen(patch.row, patch.col);
        const windSway = weather === 'windy' ? 3 : (weather === 'stormy' ? 2 : 0.5);

        for (const blade of patch.blades) {
            const bx = pos.x + blade.ox;
            const by = pos.y + blade.oy;
            const sway = Math.sin(this.time * 2 + blade.phase) * windSway;

            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.quadraticCurveTo(bx + sway, by - blade.h * 0.6, bx + sway * 1.2, by - blade.h);
            ctx.strokeStyle = `rgba(${gc.r + 15},${gc.g + 20},${gc.b + 10},0.6)`;
            ctx.lineWidth = blade.w;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    drawGroundSnow() {
        const ctx = this.ctx;
        const alpha = this.snowAccumulation * 0.4;

        const topLeft = this.isoToScreen(-2, -2);
        const topRight = this.isoToScreen(-2, GRID_COLS + 1);
        const botLeft = this.isoToScreen(GRID_ROWS + 1, -2);
        const botRight = this.isoToScreen(GRID_ROWS + 1, GRID_COLS + 1);

        ctx.fillStyle = `rgba(230,240,255,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(topLeft.x - 40, topLeft.y - 20);
        ctx.lineTo(topRight.x + 40, topRight.y - 20);
        ctx.lineTo(botRight.x + 40, botRight.y + 30);
        ctx.lineTo(botLeft.x - 40, botLeft.y + 30);
        ctx.closePath();
        ctx.fill();

        for (let i = 0; i < 15; i++) {
            const t = (i + 0.5) / 15;
            const sx = topLeft.x + (topRight.x - topLeft.x) * t + (Math.sin(i * 3.7) * 20);
            const sy = topLeft.y + (botLeft.y - topLeft.y) * (0.3 + Math.sin(i * 2.3) * 0.2);
            const sr = 8 + Math.sin(i * 1.7) * 4;

            ctx.beginPath();
            ctx.ellipse(sx, sy, sr * this.snowAccumulation, sr * 0.4 * this.snowAccumulation, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(240,248,255,${alpha * 0.6})`;
            ctx.fill();
        }
    }

    drawBackTrees() {
        const sorted = this.sceneryTrees
            .filter(t => t.row < 0)
            .sort((a, b) => a.row - b.row || a.col - b.col);

        for (const tree of sorted) {
            this.drawTree(tree);
        }
    }

    drawFrontTrees() {
        const sorted = this.sceneryTrees
            .filter(t => t.row >= GRID_ROWS || t.col < 0 || t.col >= GRID_COLS)
            .filter(t => t.row >= 0)
            .sort((a, b) => a.row - b.row || a.col - b.col);

        for (const tree of sorted) {
            this.drawTree(tree);
        }
    }

    drawTree(tree) {
        const ctx = this.ctx;
        const pos = this.isoToScreen(tree.row, tree.col);
        const x = pos.x;
        const y = pos.y;
        const s = tree.size;
        const lc = this.getTreeLeafColor();
        const weather = this.game.state.currentWeather;
        const windLean = weather === 'windy' ? 5 * s : (weather === 'stormy' ? 3 * s : 0);
        const sway = Math.sin(this.time * 1.2 + tree.sway) * (weather === 'windy' ? 3 : 1) + windLean;

        ctx.save();

        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x - 3 * s, y - 50 * s, 6 * s, 50 * s);

        ctx.fillStyle = '#4e342e';
        ctx.fillRect(x - 3 * s + 1 * s, y - 50 * s, 2 * s, 50 * s);

        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(x - 3 * s - 1 * s, y - 50 * s, 2 * s, 50 * s);

        if (tree.type === 'pine') {
            this.drawPineTree(ctx, x, y, s, lc, sway);
        } else {
            this.drawRoundTree(ctx, x, y, s, lc, sway);
        }

        if (this.snowAccumulation > 0.05) {
            this.drawTreeSnow(ctx, x, y, s, tree.type, sway);
        }

        if (weather === 'hot') {
            ctx.beginPath();
            ctx.arc(x + sway, y - 65 * s, 18 * s, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,200,50,0.06)';
            ctx.fill();
        }

        ctx.restore();
    }

    drawPineTree(ctx, x, y, s, lc, sway) {
        const layers = 4;
        for (let i = 0; i < layers; i++) {
            const layerY = y - 45 * s - i * 18 * s;
            const layerW = (22 - i * 4) * s;
            const layerH = 22 * s;
            const layerSway = sway * (1 - i * 0.15);

            ctx.beginPath();
            ctx.moveTo(x + layerSway, layerY - layerH);
            ctx.lineTo(x + layerW + layerSway * 0.5, layerY);
            ctx.lineTo(x - layerW + layerSway * 0.5, layerY);
            ctx.closePath();

            const shade = i % 2 === 0 ? 0 : 15;
            ctx.fillStyle = `rgb(${lc.r - shade},${lc.g - shade},${lc.b - shade})`;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(x + layerSway, layerY - layerH);
            ctx.lineTo(x + layerW + layerSway * 0.5, layerY);
            ctx.lineTo(x + layerSway * 0.3, layerY - layerH * 0.3);
            ctx.closePath();
            ctx.fillStyle = `rgba(${lc.r + 20},${lc.g + 25},${lc.b + 15},0.3)`;
            ctx.fill();
        }
    }

    drawRoundTree(ctx, x, y, s, lc, sway) {
        const cx = x + sway * 0.5;
        const cy = y - 65 * s;
        const rx = 24 * s;
        const ry = 20 * s;

        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${lc.r - 15},${lc.g - 15},${lc.b - 10})`;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx - rx * 0.2, cy - ry * 0.2, rx * 0.85, ry * 0.85, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${lc.r},${lc.g},${lc.b})`;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx - rx * 0.3, cy - ry * 0.35, rx * 0.5, ry * 0.45, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${lc.r + 25},${lc.g + 30},${lc.b + 20},0.4)`;
        ctx.fill();

        const subClusters = [
            { ox: -rx * 0.5, oy: ry * 0.1, r: rx * 0.45 },
            { ox: rx * 0.4, oy: -ry * 0.1, r: rx * 0.4 },
            { ox: -rx * 0.1, oy: -ry * 0.5, r: rx * 0.5 },
        ];

        for (const sc of subClusters) {
            ctx.beginPath();
            ctx.ellipse(cx + sc.ox, cy + sc.oy, sc.r, sc.r * 0.75, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${lc.r + 5},${lc.g + 8},${lc.b + 3},0.5)`;
            ctx.fill();
        }
    }

    drawTreeSnow(ctx, x, y, s, type, sway) {
        const snow = this.snowAccumulation;
        const snowAlpha = Math.min(0.8, snow * 1.2);

        if (type === 'pine') {
            const layers = 4;
            for (let i = 0; i < layers; i++) {
                const layerY = y - 45 * s - i * 18 * s;
                const layerW = (20 - i * 4) * s * snow;
                const layerSway = sway * (1 - i * 0.15);

                ctx.beginPath();
                ctx.ellipse(x + layerSway * 0.5, layerY - 2 * s, layerW, 3 * s * snow, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(240,248,255,${snowAlpha})`;
                ctx.fill();
            }

            ctx.beginPath();
            ctx.ellipse(x + sway, y - 45 * s - 4 * 18 * s - 5 * s, 4 * s * snow, 2 * s * snow, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(250,252,255,${snowAlpha})`;
            ctx.fill();
        } else {
            const cx = x + sway * 0.5;
            const cy = y - 65 * s;

            ctx.beginPath();
            ctx.ellipse(cx, cy - 8 * s, 20 * s * snow, 5 * s * snow, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(240,248,255,${snowAlpha * 0.7})`;
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(cx - 5 * s, cy - 12 * s, 12 * s * snow, 3 * s * snow, -0.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245,250,255,${snowAlpha * 0.5})`;
            ctx.fill();
        }
    }

    drawCottage() {
        const ctx = this.ctx;
        const pos = this.isoToScreen(-1, -1);
        const cx = pos.x - 30;
        const cy = pos.y + 15;

        ctx.save();

        const wallW = 90;
        const wallH = 55;
        const wallD = 45;

        ctx.fillStyle = '#3e2723';
        ctx.beginPath();
        ctx.moveTo(cx, cy - wallH);
        ctx.lineTo(cx + wallW / 2, cy - wallH + wallD / 2);
        ctx.lineTo(cx + wallW / 2, cy + wallD / 2);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#2c1a0e';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        for (let i = 0; i < 6; i++) {
            const ly = cy - wallH + (wallH + wallD / 2) * (i + 1) / 7;
            const lx1 = cx + (wallW / 2) * (i + 1) / 7;
            ctx.beginPath();
            ctx.moveTo(cx, cy - wallH + (wallH) * (i + 1) / 7);
            ctx.lineTo(cx + (wallW / 2) * (i + 1) / 7, cy - wallH + (wallH + wallD / 2) * (i + 1) / 7);
            ctx.strokeStyle = 'rgba(93,64,55,0.3)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        ctx.fillStyle = '#5d4037';
        ctx.beginPath();
        ctx.moveTo(cx + wallW / 2, cy - wallH + wallD / 2);
        ctx.lineTo(cx + wallW, cy - wallH);
        ctx.lineTo(cx + wallW, cy);
        ctx.lineTo(cx + wallW / 2, cy + wallD / 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#2c1a0e';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        for (let i = 0; i < 6; i++) {
            const t = (i + 1) / 7;
            ctx.beginPath();
            ctx.moveTo(cx + wallW / 2 + (wallW / 2) * t, cy - wallH + wallD / 2 - (wallD / 2) * t);
            ctx.lineTo(cx + wallW / 2 + (wallW / 2) * t, cy + wallD / 2 - (wallD / 2) * t);
            ctx.strokeStyle = 'rgba(93,64,55,0.25)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        const doorX = cx + wallW / 2 + 8;
        const doorY = cy - wallH + wallD / 2 + 10;
        const doorW = 16;
        const doorH = 25;

        ctx.fillStyle = '#1a1208';
        ctx.fillRect(doorX, doorY, doorW, doorH);

        const doorGrad = ctx.createLinearGradient(doorX, doorY, doorX + doorW, doorY);
        doorGrad.addColorStop(0, 'rgba(93,64,55,0.4)');
        doorGrad.addColorStop(0.5, 'rgba(93,64,55,0.1)');
        doorGrad.addColorStop(1, 'rgba(93,64,55,0.3)');
        ctx.fillStyle = doorGrad;
        ctx.fillRect(doorX, doorY, doorW, doorH);

        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 1;
        ctx.strokeRect(doorX, doorY, doorW, doorH);

        ctx.beginPath();
        ctx.moveTo(doorX + doorW / 2, doorY);
        ctx.lineTo(doorX + doorW / 2, doorY + doorH);
        ctx.strokeStyle = '#4e342e';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(doorX, doorY + doorH * 0.4);
        ctx.lineTo(doorX + doorW, doorY + doorH * 0.4);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(doorX + doorW * 0.75, doorY + doorH * 0.4, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#c9a84c';
        ctx.fill();
        ctx.strokeStyle = '#8d6e63';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        const winX = cx + 8;
        const winY = cy - wallH + wallD / 2 + 15;
        const winW = 14;
        const winH = 14;

        ctx.fillStyle = '#1a237e';
        ctx.fillRect(winX, winY, winW, winH);

        const winGlow = ctx.createRadialGradient(winX + winW / 2, winY + winH / 2, 1, winX + winW / 2, winY + winH / 2, winW);
        winGlow.addColorStop(0, 'rgba(255,183,77,0.3)');
        winGlow.addColorStop(1, 'rgba(255,183,77,0)');
        ctx.fillStyle = winGlow;
        ctx.fillRect(winX - 3, winY - 3, winW + 6, winH + 6);

        ctx.fillStyle = '#1a237e';
        ctx.fillRect(winX, winY, winW, winH);

        ctx.strokeStyle = '#6d4c41';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(winX, winY, winW, winH);
        ctx.beginPath();
        ctx.moveTo(winX + winW / 2, winY);
        ctx.lineTo(winX + winW / 2, winY + winH);
        ctx.moveTo(winX, winY + winH / 2);
        ctx.lineTo(winX + winW, winY + winH / 2);
        ctx.lineWidth = 1;
        ctx.stroke();

        const roofPeak = cy - wallH - 40;
        const roofOverhang = 14;

        this.drawThatchedRoof(ctx, cx, cy, wallW, wallH, roofPeak, roofOverhang);

        const smokeBase = roofPeak - 5;
        const smokeX = cx + wallW * 0.35;
        for (let i = 0; i < 5; i++) {
            const t = this.time * 0.4 + i * 0.9;
            const sy = smokeBase - ((t * 18) % 60);
            const sx = smokeX + Math.sin(t * 1.8 + i) * 8;
            const sr = 4 + ((t * 18) % 60) * 0.2;
            const alpha = Math.max(0, 0.25 - ((t * 18) % 60) * 0.005);
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(190,190,210,${alpha})`;
            ctx.fill();
        }

        ctx.restore();
    }

    drawThatchedRoof(ctx, cx, cy, wallW, wallH, roofPeak, roofOverhang) {
        const leftX = cx - roofOverhang;
        const rightX = cx + wallW + roofOverhang;
        const midX = cx + wallW / 2;
        const wallTopY = cy - wallH;

        ctx.fillStyle = '#6d4c41';
        ctx.beginPath();
        ctx.moveTo(leftX, wallTopY + 3);
        ctx.lineTo(midX, roofPeak + 3);
        ctx.lineTo(rightX, wallTopY + 3);
        ctx.lineTo(rightX, wallTopY);
        ctx.lineTo(midX, roofPeak);
        ctx.lineTo(leftX, wallTopY);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8d6e63';
        ctx.beginPath();
        ctx.moveTo(leftX, wallTopY);
        ctx.lineTo(midX, roofPeak);
        ctx.lineTo(rightX, wallTopY);
        ctx.closePath();
        ctx.fill();

        const layers = 10;
        for (let i = 0; i < layers; i++) {
            const t = (i + 0.5) / layers;
            const ly = roofPeak + (wallTopY - roofPeak) * t;
            const halfW = (rightX - leftX) / 2 * t;
            const lx1 = midX - halfW;
            const lx2 = midX + halfW;

            const shade = i % 2 === 0 ? '#7b5b3a' : '#6d4c41';
            ctx.strokeStyle = shade;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(lx1, ly);
            ctx.lineTo(lx2, ly);
            ctx.stroke();

            for (let j = 0; j < 12; j++) {
                const strawX = lx1 + (lx2 - lx1) * (j + 0.5) / 12;
                const strawLen = 4 + Math.random() * 3;
                const strawAngle = -0.2 + Math.random() * 0.4;
                ctx.beginPath();
                ctx.moveTo(strawX, ly);
                ctx.lineTo(strawX + Math.sin(strawAngle) * strawLen, ly - strawLen);
                ctx.strokeStyle = i % 2 === 0 ? 'rgba(139,110,99,0.5)' : 'rgba(109,76,65,0.5)';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }

        for (let i = 0; i < 30; i++) {
            const t = Math.random();
            const ly = roofPeak + (wallTopY - roofPeak) * t;
            const halfW = (rightX - leftX) / 2 * t * 0.9;
            const sx = midX + (Math.random() - 0.5) * halfW * 2;
            const sLen = 5 + Math.random() * 6;
            const sAngle = -0.3 + Math.random() * 0.6;

            ctx.beginPath();
            ctx.moveTo(sx, ly);
            ctx.lineTo(sx + Math.sin(sAngle) * sLen, ly - sLen);
            ctx.strokeStyle = `rgba(${160 + Math.random() * 40},${120 + Math.random() * 40},${80 + Math.random() * 30},0.4)`;
            ctx.lineWidth = 0.6 + Math.random() * 0.4;
            ctx.stroke();
        }

        ctx.fillStyle = '#6d4c41';
        ctx.beginPath();
        ctx.moveTo(midX, roofPeak);
        ctx.lineTo(rightX, wallTopY);
        ctx.lineTo(rightX, wallTopY + 4);
        ctx.lineTo(midX, roofPeak + 4);
        ctx.closePath();
        ctx.fill();

        for (let i = 0; i < layers; i++) {
            const t = (i + 0.5) / layers;
            const ly = roofPeak + 4 + (wallTopY - roofPeak) * t;
            const halfW = (rightX - midX) * t;
            const lx1 = midX;
            const lx2 = midX + halfW;

            ctx.strokeStyle = i % 2 === 0 ? 'rgba(93,64,55,0.4)' : 'rgba(78,52,46,0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lx1, ly);
            ctx.lineTo(lx2, ly);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(midX, roofPeak - 2);
        ctx.lineTo(midX - 3, roofPeak + 5);
        ctx.lineTo(midX + 3, roofPeak + 5);
        ctx.closePath();
        ctx.fillStyle = '#5d4037';
        ctx.fill();
    }

    drawFenceBack() {
        this._drawFenceSection('back');
        this._drawFenceSection('left');
        this._drawFenceSection('right');
    }

    drawFenceFront() {
        this._drawFenceSection('front');
    }

    _drawFenceSection(side) {
        const ctx = this.ctx;
        ctx.save();

        const fenceSegments = [];

        if (side === 'back') {
            for (let col = -1; col <= GRID_COLS; col++) {
                fenceSegments.push({ row: -1, col: col, side: 'back' });
            }
        } else if (side === 'front') {
            for (let col = -1; col <= GRID_COLS; col++) {
                fenceSegments.push({ row: GRID_ROWS, col: col, side: 'front' });
            }
        } else if (side === 'left') {
            for (let row = -1; row <= GRID_ROWS; row++) {
                fenceSegments.push({ row: row, col: -1, side: 'left' });
            }
        } else if (side === 'right') {
            for (let row = -1; row <= GRID_ROWS; row++) {
                fenceSegments.push({ row: row, col: GRID_COLS, side: 'right' });
            }
        }

        for (const seg of fenceSegments) {
            const pos = this.isoToScreen(seg.row, seg.col);
            this.drawFencePost(pos.x, pos.y, seg.side);
        }

        for (const seg of fenceSegments) {
            if (seg.side === 'back' && seg.col < GRID_COLS) {
                const p1 = this.isoToScreen(seg.row, seg.col);
                const p2 = this.isoToScreen(seg.row, seg.col + 1);
                this.drawFenceRail(p1.x, p1.y, p2.x, p2.y, 'back');
            }
            if (seg.side === 'left' && seg.row < GRID_ROWS) {
                const p1 = this.isoToScreen(seg.row, seg.col);
                const p2 = this.isoToScreen(seg.row + 1, seg.col);
                this.drawFenceRail(p1.x, p1.y, p2.x, p2.y, 'left');
            }
            if (seg.side === 'right' && seg.row < GRID_ROWS) {
                const p1 = this.isoToScreen(seg.row, seg.col);
                const p2 = this.isoToScreen(seg.row + 1, seg.col);
                this.drawFenceRail(p1.x, p1.y, p2.x, p2.y, 'right');
            }
            if (seg.side === 'front' && seg.col < GRID_COLS) {
                const p1 = this.isoToScreen(seg.row, seg.col);
                const p2 = this.isoToScreen(seg.row, seg.col + 1);
                this.drawFenceRail(p1.x, p1.y, p2.x, p2.y, 'front');
            }
        }

        ctx.restore();
    }

    drawFencePost(x, y, side) {
        const ctx = this.ctx;
        const postH = 26;
        const postW = 4;

        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x - postW / 2, y - postH, postW, postH);

        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(x - postW / 2 + 1, y - postH + 1, postW - 2, postH - 1);

        ctx.fillStyle = '#795548';
        ctx.fillRect(x - postW / 2 - 1, y - postH - 3, postW + 2, 4);

        ctx.fillStyle = '#4e342e';
        ctx.fillRect(x - postW / 2 + 1.5, y - postH + 4, 1.2, postH - 4);

        ctx.beginPath();
        ctx.moveTo(x - postW / 2, y - postH);
        ctx.lineTo(x - postW / 2 - 1, y - postH + 2);
        ctx.lineTo(x - postW / 2, y - postH + 4);
        ctx.strokeStyle = '#4e342e';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    drawFenceRail(x1, y1, x2, y2, side) {
        const ctx = this.ctx;

        const isBack = side === 'back';
        const isFront = side === 'front';

        let alpha = 0.55;
        if (isBack) alpha = 0.4;
        if (isFront) alpha = 0.75;

        const railOffsets = [-20, -12];

        for (const offset of railOffsets) {
            ctx.beginPath();
            ctx.moveTo(x1, y1 + offset);
            ctx.lineTo(x2, y2 + offset);
            ctx.strokeStyle = `rgba(93,64,55,${alpha})`;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x1, y1 + offset - 1);
            ctx.lineTo(x2, y2 + offset - 1);
            ctx.strokeStyle = `rgba(141,110,99,${alpha * 0.5})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    updateCreatures() {
        this.creatureSpawnTimer += 0.016;

        if (this.creatures.length < 3 && this.creatureSpawnTimer > 5 + Math.random() * 10) {
            this.creatureSpawnTimer = 0;
            this.spawnCreature();
        }

        for (let i = this.creatures.length - 1; i >= 0; i--) {
            const c = this.creatures[i];
            c.x += c.vx;
            c.y += c.vy;
            c.walkPhase += c.speed * 0.5;

            c.pauseTimer -= 0.016;
            if (c.pauseTimer <= 0) {
                if (c.paused) {
                    c.paused = false;
                    const angle = Math.random() * Math.PI * 2;
                    c.vx = Math.cos(angle) * c.speed;
                    c.vy = Math.sin(angle) * c.speed * 0.5;
                    c.dir = c.vx > 0 ? 1 : -1;
                    c.pauseTimer = 3 + Math.random() * 8;
                } else {
                    if (Math.random() < 0.3) {
                        c.paused = true;
                        c.vx = 0;
                        c.vy = 0;
                        c.pauseTimer = 2 + Math.random() * 4;
                    } else {
                        const angle = Math.random() * Math.PI * 2;
                        c.vx = Math.cos(angle) * c.speed;
                        c.vy = Math.sin(angle) * c.speed * 0.5;
                        c.dir = c.vx > 0 ? 1 : -1;
                        c.pauseTimer = 3 + Math.random() * 8;
                    }
                }
            }

            const margin = 60;
            if (c.x < -margin || c.x > this.displayW + margin ||
                c.y < -margin || c.y > this.displayH + margin) {
                this.creatures.splice(i, 1);
            }
        }
    }

    spawnCreature() {
        const type = Math.random() < 0.5 ? 'crane' : 'deer';
        const side = Math.floor(Math.random() * 4);
        let x, y, vx, vy;
        const speed = type === 'crane' ? 0.3 : 0.25;

        const topLeft = this.isoToScreen(-1, -1);
        const topRight = this.isoToScreen(-1, GRID_COLS);
        const botLeft = this.isoToScreen(GRID_ROWS, -1);
        const botRight = this.isoToScreen(GRID_ROWS, GRID_COLS);

        const cx = (topLeft.x + topRight.x + botLeft.x + botRight.x) / 4;
        const cy = (topLeft.y + topRight.y + botLeft.y + botRight.y) / 4;

        switch (side) {
            case 0:
                x = cx + (Math.random() - 0.5) * 200;
                y = Math.min(topLeft.y, topRight.y) - 30;
                vx = (Math.random() - 0.5) * speed;
                vy = speed * 0.5;
                break;
            case 1:
                x = Math.max(botLeft.x, botRight.x) + 30;
                y = cy + (Math.random() - 0.5) * 100;
                vx = -speed;
                vy = (Math.random() - 0.5) * speed * 0.3;
                break;
            case 2:
                x = cx + (Math.random() - 0.5) * 200;
                y = Math.max(botLeft.y, botRight.y) + 30;
                vx = (Math.random() - 0.5) * speed;
                vy = -speed * 0.5;
                break;
            case 3:
                x = Math.min(topLeft.x, botLeft.x) - 30;
                y = cy + (Math.random() - 0.5) * 100;
                vx = speed;
                vy = (Math.random() - 0.5) * speed * 0.3;
                break;
        }

        this.creatures.push({
            type: type,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            speed: speed,
            dir: vx > 0 ? 1 : -1,
            walkPhase: Math.random() * Math.PI * 2,
            paused: false,
            pauseTimer: 3 + Math.random() * 6
        });
    }

    drawCreatures() {
        const ctx = this.ctx;

        const sorted = [...this.creatures].sort((a, b) => a.y - b.y);

        for (const c of sorted) {
            if (c.type === 'crane') {
                this.drawCrane(c.x, c.y, c.dir, c.walkPhase, c.paused);
            } else {
                this.drawDeer(c.x, c.y, c.dir, c.walkPhase, c.paused);
            }
        }
    }

    drawCrane(x, y, dir, phase, paused) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(dir, 1);

        const legSwing = paused ? 0 : Math.sin(phase * 3) * 6;

        ctx.strokeStyle = '#37474f';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(3, -12);
        ctx.lineTo(3 + legSwing, 5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-3, -12);
        ctx.lineTo(-3 - legSwing, 5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(3 + legSwing, 5);
        ctx.lineTo(5 + legSwing, 8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-3 - legSwing, 5);
        ctx.lineTo(-5 - legSwing, 8);
        ctx.stroke();

        ctx.fillStyle = '#fafafa';
        ctx.beginPath();
        ctx.ellipse(0, -24, 9, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        const bodyGrad = ctx.createRadialGradient(-2, -26, 2, 0, -24, 12);
        bodyGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
        bodyGrad.addColorStop(1, 'rgba(200,200,200,0.1)');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(0, -24, 9, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(0, -24, 9, 14, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#212121';
        ctx.beginPath();
        ctx.moveTo(9, -32);
        ctx.quadraticCurveTo(22, -40, 25, -34);
        ctx.quadraticCurveTo(22, -28, 9, -26);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f44336';
        ctx.beginPath();
        ctx.ellipse(7, -35, 3.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#212121';
        ctx.beginPath();
        ctx.arc(11, -32, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(11, -32, 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        const tailFlutter = paused ? 0 : Math.sin(phase * 2) * 3;
        ctx.fillStyle = '#e0e0e0';
        ctx.beginPath();
        ctx.moveTo(-7, -30);
        ctx.quadraticCurveTo(-16, -26 + tailFlutter, -14, -18);
        ctx.quadraticCurveTo(-11, -20, -7, -20);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#bdbdbd';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-7, -30);
        ctx.quadraticCurveTo(-16, -26 + tailFlutter, -14, -18);
        ctx.stroke();

        ctx.restore();
    }

    drawDeer(x, y, dir, phase, paused) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(dir, 1);

        const legSwing = paused ? 0 : Math.sin(phase * 3) * 7;

        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(6, -8);
        ctx.lineTo(8 + legSwing, 8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-3, -8);
        ctx.lineTo(-5 - legSwing, 8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(11, -8);
        ctx.lineTo(13 - legSwing, 8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(3, -8);
        ctx.lineTo(1 + legSwing, 8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(8 + legSwing, 8);
        ctx.lineTo(10 + legSwing, 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-5 - legSwing, 8);
        ctx.lineTo(-7 - legSwing, 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(13 - legSwing, 8);
        ctx.lineTo(15 - legSwing, 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(1 + legSwing, 8);
        ctx.lineTo(-1 + legSwing, 10);
        ctx.stroke();

        ctx.fillStyle = '#8d6e63';
        ctx.beginPath();
        ctx.ellipse(5, -20, 14, 10, -0.1, 0, Math.PI * 2);
        ctx.fill();

        const bodyGrad = ctx.createRadialGradient(3, -22, 3, 5, -20, 12);
        bodyGrad.addColorStop(0, 'rgba(161,136,127,0.3)');
        bodyGrad.addColorStop(1, 'rgba(109,76,65,0.1)');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(5, -20, 14, 10, -0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d7ccc8';
        ctx.beginPath();
        ctx.ellipse(5, -17, 10, 5, -0.1, 0, Math.PI);
        ctx.fill();

        ctx.fillStyle = '#6d4c41';
        ctx.beginPath();
        ctx.ellipse(20, -28, 6, 5, 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#212121';
        ctx.beginPath();
        ctx.arc(23, -29, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(23, -29, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.fillStyle = '#4e342e';
        ctx.beginPath();
        ctx.ellipse(24, -27, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e8e0d8';
        ctx.beginPath();
        ctx.ellipse(-8, -18, 5, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();

        const glowPulse = Math.sin(this.time * 2) * 0.15 + 0.85;

        ctx.strokeStyle = `rgba(255,215,0,${glowPulse})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(17, -32);
        ctx.lineTo(14, -44);
        ctx.lineTo(11, -50);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(17, -32);
        ctx.lineTo(20, -46);
        ctx.lineTo(23, -52);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(14, -44);
        ctx.lineTo(10, -48);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(20, -46);
        ctx.lineTo(24, -50);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(11, -50);
        ctx.lineTo(8, -54);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(23, -52);
        ctx.lineTo(27, -56);
        ctx.stroke();

        const antlerGlow = ctx.createRadialGradient(17, -42, 3, 17, -42, 15);
        antlerGlow.addColorStop(0, `rgba(255,215,0,${0.2 * glowPulse})`);
        antlerGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = antlerGlow;
        ctx.beginPath();
        ctx.arc(17, -42, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    lightenColor(hex, amount) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + amount);
        const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
        const b = Math.min(255, (num & 0x0000FF) + amount);
        return `rgb(${r},${g},${b})`;
    }
}

class GourdPreview {
    static _cache = {};

    static getSeedPreview(gourdId, size) {
        const key = `seed_${gourdId}_${size}`;
        if (this._cache[key]) return this._cache[key];

        const canvas = document.createElement('canvas');
        const s = size || 36;
        canvas.width = s;
        canvas.height = s;
        const ctx = canvas.getContext('2d');

        const colors = GOURD_VISUAL[gourdId];
        if (!colors) return canvas;

        const cx = s / 2;
        const cy = s * 0.65;
        const scale = s / 36;

        ctx.save();
        ctx.scale(scale, scale);
        const lx = cx / scale;
        const ly = cy / scale;

        ctx.beginPath();
        ctx.ellipse(lx, ly + 2, 8, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#5d4037';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(lx, ly, 5, 3.5, 0.2, 0, Math.PI * 2);
        const seedGrad = ctx.createRadialGradient(lx - 1, ly - 1, 0, lx, ly, 5);
        seedGrad.addColorStop(0, colors.light);
        seedGrad.addColorStop(0.6, colors.main);
        seedGrad.addColorStop(1, colors.dark);
        ctx.fillStyle = seedGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(lx - 1, ly - 1.5, 2, 1, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fill();

        ctx.restore();

        this._cache[key] = canvas;
        return canvas;
    }

    static getMaturePreview(gourdId, size) {
        const key = `mature_${gourdId}_${size}`;
        if (this._cache[key]) return this._cache[key];

        const canvas = document.createElement('canvas');
        const s = size || 36;
        canvas.width = s;
        canvas.height = s;
        const ctx = canvas.getContext('2d');

        const colors = GOURD_VISUAL[gourdId];
        if (!colors) return canvas;

        const cx = s / 2;
        const cy = s * 0.55;
        const scale = s / 36;

        ctx.save();
        ctx.scale(scale, scale);
        const lx = cx / scale;
        const ly = cy / scale;

        ctx.beginPath();
        ctx.ellipse(lx, ly + 8, 10, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fill();

        const botGrad = ctx.createRadialGradient(lx - 2, ly - 3, 1, lx, ly, 8);
        botGrad.addColorStop(0, colors.light);
        botGrad.addColorStop(0.5, colors.main);
        botGrad.addColorStop(1, colors.dark);

        ctx.beginPath();
        ctx.ellipse(lx, ly, 7, 9, 0, 0, Math.PI * 2);
        ctx.fillStyle = botGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(lx - 2, ly - 2, 2.5, 4, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(lx - 2, ly - 8);
        ctx.quadraticCurveTo(lx - 3, ly - 10, lx - 1, ly - 9);
        ctx.lineTo(lx + 2, ly - 9);
        ctx.quadraticCurveTo(lx + 3, ly - 10, lx + 2, ly - 8);
        ctx.fillStyle = colors.main;
        ctx.fill();

        const topGrad = ctx.createRadialGradient(lx - 1, ly - 14, 0.5, lx, ly - 12, 5);
        topGrad.addColorStop(0, colors.light);
        topGrad.addColorStop(0.5, colors.main);
        topGrad.addColorStop(1, colors.dark);

        ctx.beginPath();
        ctx.ellipse(lx, ly - 12, 5, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = topGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(lx - 1, ly - 13, 2, 2.5, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(lx, ly - 17);
        ctx.quadraticCurveTo(lx + 2, ly - 20, lx + 1, ly - 21);
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(lx + 3, ly - 20, 3, 1.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4caf50';
        ctx.fill();

        ctx.restore();

        this._cache[key] = canvas;
        return canvas;
    }

    static getDragImage(gourdId) {
        const canvas = document.createElement('canvas');
        const size = 48;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const colors = GOURD_VISUAL[gourdId];
        if (!colors) return canvas;

        const cx = size / 2;
        const cy = size * 0.5;

        ctx.beginPath();
        ctx.ellipse(cx, cy + 10, 12, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fill();

        const botGrad = ctx.createRadialGradient(cx - 3, cy - 4, 1, cx, cy, 10);
        botGrad.addColorStop(0, colors.light);
        botGrad.addColorStop(0.5, colors.main);
        botGrad.addColorStop(1, colors.dark);

        ctx.beginPath();
        ctx.ellipse(cx, cy, 9, 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = botGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx - 3, cy - 3, 3, 5, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx - 3, cy - 10);
        ctx.quadraticCurveTo(cx - 4, cy - 13, cx - 2, cy - 12);
        ctx.lineTo(cx + 2, cy - 12);
        ctx.quadraticCurveTo(cx + 4, cy - 13, cx + 3, cy - 10);
        ctx.fillStyle = colors.main;
        ctx.fill();

        const topGrad = ctx.createRadialGradient(cx - 1, cy - 18, 0.5, cx, cy - 16, 6);
        topGrad.addColorStop(0, colors.light);
        topGrad.addColorStop(0.5, colors.main);
        topGrad.addColorStop(1, colors.dark);

        ctx.beginPath();
        ctx.ellipse(cx, cy - 16, 5, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = topGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx - 1, cy - 17, 2, 3, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, cy - 22);
        ctx.quadraticCurveTo(cx + 2, cy - 26, cx + 1, cy - 27);
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(cx + 4, cy - 26, 4, 2, Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4caf50';
        ctx.fill();

        const glowGrad = ctx.createRadialGradient(cx, cy - 8, 5, cx, cy - 8, 22);
        glowGrad.addColorStop(0, colors.glow);
        glowGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy - 8, 22, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        return canvas;
    }

    static createPreviewElement(gourdId, type, size) {
        const previewSize = size || 28;
        let canvas;
        if (type === 'seed') {
            canvas = this.getSeedPreview(gourdId, previewSize);
        } else {
            canvas = this.getMaturePreview(gourdId, previewSize);
        }

        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        img.width = previewSize;
        img.height = previewSize;
        img.className = 'gourd-preview-img';
        img.draggable = false;
        return img;
    }
}
