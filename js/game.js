const WEATHER_TYPES = {
    sunny: {
        id: 'sunny',
        name: '晴朗',
        icon: '☀️',
        description: '阳光明媚，万物生长',
        temperature: 'high',
        bgClass: 'weather-sunny'
    },
    cloudy: {
        id: 'cloudy',
        name: '多云',
        icon: '⛅',
        description: '云层遮日，气候温和',
        temperature: 'mild',
        bgClass: 'weather-cloudy'
    },
    rainy: {
        id: 'rainy',
        name: '雨天',
        icon: '🌧️',
        description: '甘霖普降，润泽万物',
        temperature: 'mild',
        bgClass: 'weather-rainy'
    },
    stormy: {
        id: 'stormy',
        name: '雷暴',
        icon: '⛈️',
        description: '电闪雷鸣，风雨交加',
        temperature: 'mild',
        bgClass: 'weather-stormy'
    },
    windy: {
        id: 'windy',
        name: '大风',
        icon: '💨',
        description: '狂风呼啸，飞沙走石',
        temperature: 'mild',
        bgClass: 'weather-windy'
    },
    snowy: {
        id: 'snowy',
        name: '雪天',
        icon: '❄️',
        description: '银装素裹，天寒地冻',
        temperature: 'low',
        bgClass: 'weather-snowy'
    },
    foggy: {
        id: 'foggy',
        name: '迷雾',
        icon: '🌫️',
        description: '仙雾缭绕，灵气充盈',
        temperature: 'mild',
        bgClass: 'weather-foggy'
    },
    hot: {
        id: 'hot',
        name: '酷暑',
        icon: '🔥',
        description: '烈日炎炎，酷热难当',
        temperature: 'extreme',
        bgClass: 'weather-hot'
    }
};

const GOURD_TYPES = {
    cuiyu: {
        id: 'cuiyu',
        name: '翠玉葫芦',
        element: 'wood',
        elementName: '木',
        rarity: 'common',
        rarityName: '凡品',
        icon: '🟢',
        matureIcon: '🟢',
        seedIcon: '🟤',
        description: '最常见的仙山葫芦，翠绿如玉，是修仙者的入门之选。',
        growDays: 3,
        sellPrice: 15,
        seedPrice: 5,
        ability: {
            name: '灵气滋养',
            description: '成熟后每天产出2灵石',
            type: 'passive_income',
            value: 2
        },
        stageIcons: ['🟤', '🌱', '🌿', '🌸', '🫛', '🟢'],
        weatherAffinity: {
            favorite: ['rainy', 'foggy'],
            disliked: ['hot'],
            favoriteMultiplier: 1.4,
            dislikedMultiplier: 0.6,
            desc: '喜雨水迷雾，畏酷暑'
        }
    },
    jinyuan: {
        id: 'jinyuan',
        name: '金元葫芦',
        element: 'gold',
        elementName: '金',
        rarity: 'uncommon',
        rarityName: '良品',
        icon: '🟡',
        matureIcon: '🟡',
        seedIcon: '🟤',
        description: '通体金黄的宝葫芦，蕴含丰厚灵气，是灵石的重要来源。',
        growDays: 5,
        sellPrice: 40,
        seedPrice: 15,
        ability: {
            name: '金光万丈',
            description: '成熟后每天产出5灵石',
            type: 'passive_income',
            value: 5
        },
        stageIcons: ['🟤', '🌱', '🌿', '🌼', '🫛', '🟡'],
        weatherAffinity: {
            favorite: ['sunny', 'hot'],
            disliked: ['snowy'],
            favoriteMultiplier: 1.3,
            dislikedMultiplier: 0.5,
            desc: '喜晴朗酷暑，畏严寒'
        }
    },
    bishui: {
        id: 'bishui',
        name: '碧水葫芦',
        element: 'water',
        elementName: '水',
        rarity: 'uncommon',
        rarityName: '良品',
        icon: '🔵',
        matureIcon: '🔵',
        seedIcon: '🟤',
        description: '碧蓝如水的葫芦，内蕴清泉灵力，可自动浇灌周围灵田。',
        growDays: 4,
        sellPrice: 30,
        seedPrice: 12,
        ability: {
            name: '甘霖普降',
            description: '成熟后自动浇灌周围3x3范围内的灵田',
            type: 'auto_water',
            value: 3
        },
        stageIcons: ['🟤', '🌱', '🌿', '💧', '🫛', '🔵'],
        weatherAffinity: {
            favorite: ['rainy', 'stormy'],
            disliked: ['hot'],
            favoriteMultiplier: 1.5,
            dislikedMultiplier: 0.5,
            desc: '喜暴雨天，畏酷暑'
        }
    },
    lieyan: {
        id: 'lieyan',
        name: '烈焰葫芦',
        element: 'fire',
        elementName: '火',
        rarity: 'rare',
        rarityName: '上品',
        icon: '🔴',
        matureIcon: '🔴',
        seedIcon: '🟤',
        description: '赤红似火的葫芦，蕴含纯阳之火，可加速周围植物生长。',
        growDays: 6,
        sellPrice: 55,
        seedPrice: 25,
        ability: {
            name: '烈阳催熟',
            description: '成熟后每天使周围3x3范围内的葫芦生长进度+20%',
            type: 'growth_boost',
            value: 0.2
        },
        stageIcons: ['🟤', '🌱', '🌿', '🔥', '🫛', '🔴'],
        weatherAffinity: {
            favorite: ['hot', 'sunny'],
            disliked: ['rainy', 'snowy'],
            favoriteMultiplier: 1.6,
            dislikedMultiplier: 0.4,
            desc: '喜酷暑烈日，畏雨雪'
        }
    },
    qingmu: {
        id: 'qingmu',
        name: '青木葫芦',
        element: 'wood',
        elementName: '木',
        rarity: 'rare',
        rarityName: '上品',
        icon: '🟩',
        matureIcon: '🟩',
        seedIcon: '🟤',
        description: '生机盎然的葫芦，木气充沛，可提升周围葫芦的品质。',
        growDays: 5,
        sellPrice: 50,
        seedPrice: 22,
        ability: {
            name: '万物生辉',
            description: '成熟后周围3x3范围内葫芦出售价格+30%',
            type: 'price_boost',
            value: 0.3
        },
        stageIcons: ['🟤', '🌱', '🌿', '🌺', '🫛', '🟩'],
        weatherAffinity: {
            favorite: ['rainy', 'foggy'],
            disliked: ['hot', 'windy'],
            favoriteMultiplier: 1.4,
            dislikedMultiplier: 0.6,
            desc: '喜雨水仙雾，畏酷暑狂风'
        }
    },
    xuantu: {
        id: 'xuantu',
        name: '玄土葫芦',
        element: 'earth',
        elementName: '土',
        rarity: 'uncommon',
        rarityName: '良品',
        icon: '🟫',
        matureIcon: '🟫',
        seedIcon: '🟤',
        description: '厚德载物的玄土葫芦，可改良土壤，增加灵田产量。',
        growDays: 4,
        sellPrice: 35,
        seedPrice: 14,
        ability: {
            name: '厚土培元',
            description: '成熟后周围3x3范围内葫芦收获时额外产出1个同类型种子',
            type: 'extra_seed',
            value: 1
        },
        stageIcons: ['🟤', '🌱', '🌿', '🌾', '🫛', '🟫'],
        weatherAffinity: {
            favorite: ['cloudy', 'foggy'],
            disliked: ['windy'],
            favoriteMultiplier: 1.3,
            dislikedMultiplier: 0.7,
            desc: '喜阴云仙雾，畏狂风'
        }
    },
    zilei: {
        id: 'zilei',
        name: '紫雷葫芦',
        element: 'thunder',
        elementName: '雷',
        rarity: 'epic',
        rarityName: '极品',
        icon: '🟣',
        matureIcon: '🟣',
        seedIcon: '🟤',
        description: '紫电缠绕的葫芦，雷威赫赫，可驱除灵田中的一切虫害。',
        growDays: 7,
        sellPrice: 80,
        seedPrice: 40,
        ability: {
            name: '雷霆护田',
            description: '成熟后保护全山灵田免受虫害，并每天产出1灵石',
            type: 'pest_protection',
            value: 1
        },
        stageIcons: ['🟤', '🌱', '🌿', '⚡', '🫛', '🟣'],
        weatherAffinity: {
            favorite: ['stormy'],
            disliked: ['sunny'],
            favoriteMultiplier: 1.8,
            dislikedMultiplier: 0.5,
            desc: '喜雷暴天，畏晴朗'
        }
    },
    shuofeng: {
        id: 'shuofeng',
        name: '朔风葫芦',
        element: 'wind',
        elementName: '风',
        rarity: 'rare',
        rarityName: '上品',
        icon: '⚪',
        matureIcon: '⚪',
        seedIcon: '🟤',
        description: '乘风而生的葫芦，风灵之力可传播种子，有概率获得随机种子。',
        growDays: 5,
        sellPrice: 45,
        seedPrice: 20,
        ability: {
            name: '风播万里',
            description: '成熟后每天有30%概率产生1个随机种子',
            type: 'random_seed',
            value: 0.3
        },
        stageIcons: ['🟤', '🌱', '🌿', '🎐', '🫛', '⚪'],
        weatherAffinity: {
            favorite: ['windy', 'stormy'],
            disliked: ['snowy'],
            favoriteMultiplier: 1.5,
            dislikedMultiplier: 0.6,
            desc: '喜狂风雷暴，畏严寒'
        }
    },
    xuanbing: {
        id: 'xuanbing',
        name: '玄冰葫芦',
        element: 'ice',
        elementName: '冰',
        rarity: 'epic',
        rarityName: '极品',
        icon: '🔷',
        matureIcon: '🔷',
        seedIcon: '🟤',
        description: '寒冰凝结的葫芦，可冻结时间，使成熟葫芦不会过熟凋零。',
        growDays: 6,
        sellPrice: 70,
        seedPrice: 35,
        ability: {
            name: '冰封永驻',
            description: '成熟后周围3x3范围内已成熟葫芦永不过熟，且每天产出2灵石',
            type: 'preserve',
            value: 2
        },
        stageIcons: ['🟤', '🌱', '🌿', '❄️', '🫛', '🔷'],
        weatherAffinity: {
            favorite: ['snowy'],
            disliked: ['hot', 'sunny'],
            favoriteMultiplier: 1.7,
            dislikedMultiplier: 0.4,
            desc: '喜严寒飞雪，畏酷暑烈日'
        }
    },
    hundun: {
        id: 'hundun',
        name: '混沌葫芦',
        element: 'chaos',
        elementName: '混沌',
        rarity: 'legendary',
        rarityName: '仙品',
        icon: '🌀',
        matureIcon: '🌀',
        seedIcon: '🟤',
        description: '传说中混沌之力的化身，蕴含无穷变数，可随机触发其他葫芦的能力。',
        growDays: 10,
        sellPrice: 150,
        seedPrice: 80,
        ability: {
            name: '混沌万象',
            description: '成熟后每天随机触发一种葫芦能力，效果翻倍',
            type: 'chaos',
            value: 2
        },
        stageIcons: ['🟤', '🌱', '🌿', '🌀', '🫛', '🌀'],
        weatherAffinity: {
            favorite: ['foggy', 'stormy'],
            disliked: [],
            favoriteMultiplier: 2.0,
            dislikedMultiplier: 1.0,
            desc: '喜仙雾雷暴，不受天气克制'
        }
    }
};

const STAGE_NAMES = ['种子', '发芽', '藤蔓', '开花', '结果', '成熟'];
const STAGE_PROGRESS = [0, 0.15, 0.35, 0.55, 0.75, 1.0];

const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
const RARITY_COLORS = {
    common: '#9e9e9e',
    uncommon: '#4caf50',
    rare: '#2196f3',
    epic: '#9c27b0',
    legendary: '#ff9800'
};

const GRID_ROWS = 5;
const GRID_COLS = 6;
const TOTAL_PLOTS = GRID_ROWS * GRID_COLS;
const INITIAL_UNLOCKED = 12;

const SHOP_ITEMS = [
    { id: 'water', name: '灵泉水', icon: '💧', price: 3, description: '浇灌一株葫芦', type: 'resource', resource: 'water', amount: 5 },
    { id: 'fertilizer', name: '仙灵肥', icon: '🧪', price: 8, description: '施肥加速生长30%', type: 'resource', resource: 'fertilizer', amount: 3 },
    { id: 'plot_unlock', name: '开垦灵田', icon: '🏔️', price: 50, description: '解锁一块新灵田', type: 'unlock_plot' }
];

class GameState {
    constructor() {
        this.day = 1;
        this.spiritStones = 100;
        this.water = 10;
        this.fertilizer = 5;
        this.plots = [];
        this.inventory = {};
        this.seeds = { cuiyu: 3 };
        this.unlockedPlots = INITIAL_UNLOCKED;
        this.discoveredGourds = new Set(['cuiyu']);
        this.log = [];
        this.pestFlags = new Array(TOTAL_PLOTS).fill(false);
        this.currentWeather = 'sunny';
        this.nextDayWeather = null;

        for (let i = 0; i < TOTAL_PLOTS; i++) {
            this.plots.push({
                id: i,
                unlocked: i < INITIAL_UNLOCKED,
                gourd: null,
                watered: false,
                fertilized: false,
                growthProgress: 0,
                stage: 0,
                matureDay: -1,
                overripe: false
            });
        }
    }

    save() {
        const data = {
            day: this.day,
            spiritStones: this.spiritStones,
            water: this.water,
            fertilizer: this.fertilizer,
            plots: this.plots,
            inventory: this.inventory,
            seeds: this.seeds,
            unlockedPlots: this.unlockedPlots,
            discoveredGourds: [...this.discoveredGourds],
            pestFlags: this.pestFlags,
            currentWeather: this.currentWeather,
            nextDayWeather: this.nextDayWeather
        };
        localStorage.setItem('xianshan_save', JSON.stringify(data));
    }

    load() {
        const raw = localStorage.getItem('xianshan_save');
        if (!raw) return false;
        try {
            const data = JSON.parse(raw);
            this.day = data.day || 1;
            this.spiritStones = data.spiritStones || 100;
            this.water = data.water || 10;
            this.fertilizer = data.fertilizer || 5;
            this.plots = data.plots || this.plots;
            this.inventory = data.inventory || {};
            this.seeds = data.seeds || { cuiyu: 3 };
            this.unlockedPlots = data.unlockedPlots || INITIAL_UNLOCKED;
            this.discoveredGourds = new Set(data.discoveredGourds || ['cuiyu']);
            this.pestFlags = data.pestFlags || new Array(TOTAL_PLOTS).fill(false);
            this.currentWeather = data.currentWeather || 'sunny';
            this.nextDayWeather = data.nextDayWeather || null;
            return true;
        } catch (e) {
            return false;
        }
    }
}

class Game {
    constructor() {
        this.state = new GameState();
        this.selectedSeed = null;
        this.autoSaveTimer = null;
        this.draggedSeedId = null;
        this.draggedFromShop = false;
        this.canvasRenderer = null;
        this.init();
    }

    init() {
        const loaded = this.state.load();
        if (loaded) {
            this.showToast('读取存档成功，欢迎回到仙山！', 'info');
        }

        if (!this.state.nextDayWeather) {
            this.state.nextDayWeather = this.generateWeather();
        }

        const canvas = document.getElementById('farm-canvas');
        if (canvas) {
            this.canvasRenderer = new CanvasRenderer(canvas, this);
        }

        this.renderSeedList();
        this.renderInventory();
        this.renderShop();
        this.renderCodex();
        this.updateResourceDisplay();
        this.updateWeatherDisplay();
        this.bindEvents();
        this.startAutoSave();
    }

    bindEvents() {
        document.getElementById('btn-water-all').addEventListener('click', () => this.waterAll());
        document.getElementById('btn-harvest-all').addEventListener('click', () => this.harvestAll());
        document.getElementById('btn-next-day').addEventListener('click', () => this.nextDay());

        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('info-modal').addEventListener('click', (e) => {
            if (e.target.id === 'info-modal') this.closeModal();
        });
    }

    startAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            this.state.save();
        }, 30000);
    }

    renderFarm() {
    }

    handlePlotClick(plotId, e) {
        const plot = this.state.plots[plotId];
        if (!plot.gourd) {
            this.handlePlantClick(plotId);
            return;
        }

        const isMature = plot.stage >= 5;
        if (isMature) {
            this.harvestPlot(plotId);
        } else if (!plot.watered && this.state.water > 0) {
            this.waterPlot(plotId);
        } else if (!plot.fertilized && this.state.fertilizer > 0) {
            this.fertilizePlot(plotId);
        } else {
            this.showGourdDetail(plotId);
        }
    }

    handlePlantClick(plotId) {
        if (this.selectedSeed && this.state.seeds[this.selectedSeed] > 0) {
            this.plantSeed(plotId, this.selectedSeed);
        } else {
            this.showPlantMenu(plotId);
        }
    }

    showPlantMenu(plotId) {
        const availableSeeds = Object.entries(this.state.seeds).filter(([id, count]) => count > 0);
        if (availableSeeds.length === 0) {
            this.showToast('没有可用的种子，请去仙市购买！', 'warning');
            return;
        }

        let html = `<div class="modal-title">🌱 选择种子</div>`;
        html += `<div class="gourd-detail">`;
        for (const [seedId, count] of availableSeeds) {
            const gourd = GOURD_TYPES[seedId];
            if (!gourd) continue;
            const seedPreviewUrl = GourdPreview.getSeedPreview(seedId, 36).toDataURL();
            html += `
                <div class="shop-item" onclick="game.plantSeed(${plotId}, '${seedId}')">
                    <span class="shop-icon"><img src="${seedPreviewUrl}" width="36" height="36" class="gourd-modal-preview" /></span>
                    <div class="shop-info">
                        <div class="shop-name element-${gourd.element}">${gourd.name}</div>
                        <div class="shop-desc">${gourd.description}</div>
                    </div>
                    <span class="shop-price">x${count}</span>
                </div>
            `;
        }
        html += `</div>`;

        this.showModal(html);
    }

    plantSeed(plotId, seedId) {
        const plot = this.state.plots[plotId];
        if (!plot.unlocked || plot.gourd) return;
        if (!this.state.seeds[seedId] || this.state.seeds[seedId] <= 0) {
            this.showToast('没有该类型种子！', 'error');
            return;
        }

        this.state.seeds[seedId]--;
        if (this.state.seeds[seedId] <= 0) delete this.state.seeds[seedId];

        plot.gourd = seedId;
        plot.growthProgress = 0;
        plot.stage = 0;
        plot.watered = false;
        plot.fertilized = false;
        plot.matureDay = -1;
        plot.overripe = false;

        this.state.discoveredGourds.add(seedId);
        this.closeModal();
        this.showToast(`种下了${GOURD_TYPES[seedId].name}！`, 'success');
        this.refreshAll();
    }

    waterPlot(plotId) {
        const plot = this.state.plots[plotId];
        if (!plot.gourd || plot.watered || this.state.water <= 0) return;

        this.state.water--;
        plot.watered = true;
        this.showToast('浇水成功！', 'info');
        this.refreshAll();
    }

    waterAll() {
        let watered = 0;
        for (const plot of this.state.plots) {
            if (plot.gourd && !plot.watered && plot.stage < 5 && this.state.water > 0) {
                plot.watered = true;
                this.state.water--;
                watered++;
            }
        }
        if (watered > 0) {
            this.showToast(`浇灌了${watered}株葫芦！`, 'info');
            this.refreshAll();
        } else {
            this.showToast('没有需要浇水的葫芦！', 'warning');
        }
    }

    fertilizePlot(plotId) {
        const plot = this.state.plots[plotId];
        if (!plot.gourd || plot.fertilized || this.state.fertilizer <= 0 || plot.stage >= 5) return;

        this.state.fertilizer--;
        plot.fertilized = true;
        this.showToast('施肥成功，生长加速30%！', 'success');
        this.refreshAll();
    }

    harvestPlot(plotId) {
        const plot = this.state.plots[plotId];
        if (!plot.gourd || plot.stage < 5) return;

        const gourdType = GOURD_TYPES[plot.gourd];
        let sellPrice = gourdType.sellPrice;

        const priceMultiplier = this.getPriceMultiplier(plotId);
        sellPrice = Math.floor(sellPrice * priceMultiplier);

        this.state.spiritStones += sellPrice;

        if (!this.state.inventory[plot.gourd]) {
            this.state.inventory[plot.gourd] = 0;
        }
        this.state.inventory[plot.gourd]++;

        const extraSeeds = this.getExtraSeeds(plotId);
        if (extraSeeds > 0) {
            if (!this.state.seeds[plot.gourd]) this.state.seeds[plot.gourd] = 0;
            this.state.seeds[plot.gourd] += extraSeeds;
            this.showToast(`额外获得${extraSeeds}个${gourdType.name}种子！`, 'ability');
        }

        plot.gourd = null;
        plot.growthProgress = 0;
        plot.stage = 0;
        plot.watered = false;
        plot.fertilized = false;
        plot.matureDay = -1;
        plot.overripe = false;
        this.state.pestFlags[plotId] = false;

        this.showToast(`收获${gourdType.name}，获得${sellPrice}灵石！`, 'success');
        this.refreshAll();
    }

    harvestAll() {
        let harvested = 0;
        for (let i = 0; i < TOTAL_PLOTS; i++) {
            const plot = this.state.plots[i];
            if (plot.gourd && plot.stage >= 5) {
                this.harvestPlot(i);
                harvested++;
            }
        }
        if (harvested === 0) {
            this.showToast('没有可收获的葫芦！', 'warning');
        }
    }

    getPriceMultiplier(plotId) {
        let multiplier = 1.0;
        const row = Math.floor(plotId / GRID_COLS);
        const col = plotId % GRID_COLS;

        for (let i = 0; i < TOTAL_PLOTS; i++) {
            const other = this.state.plots[i];
            if (!other.gourd || other.stage < 5) continue;
            const gourdType = GOURD_TYPES[other.gourd];
            if (gourdType.ability.type !== 'price_boost') continue;

            const otherRow = Math.floor(i / GRID_COLS);
            const otherCol = i % GRID_COLS;
            const dist = Math.max(Math.abs(row - otherRow), Math.abs(col - otherCol));

            if (dist <= 1) {
                multiplier += gourdType.ability.value;
            }
        }
        return multiplier;
    }

    getExtraSeeds(plotId) {
        let extra = 0;
        const row = Math.floor(plotId / GRID_COLS);
        const col = plotId % GRID_COLS;

        for (let i = 0; i < TOTAL_PLOTS; i++) {
            const other = this.state.plots[i];
            if (!other.gourd || other.stage < 5) continue;
            const gourdType = GOURD_TYPES[other.gourd];
            if (gourdType.ability.type !== 'extra_seed') continue;

            const otherRow = Math.floor(i / GRID_COLS);
            const otherCol = i % GRID_COLS;
            const dist = Math.max(Math.abs(row - otherRow), Math.abs(col - otherCol));

            if (dist <= 1) {
                extra += gourdType.ability.value;
            }
        }
        return extra;
    }

    tryUnlockPlot(plotId) {
        const cost = 50 + (this.state.unlockedPlots - INITIAL_UNLOCKED) * 30;
        if (this.state.spiritStones < cost) {
            this.showToast(`灵石不足！开垦需要${cost}灵石`, 'error');
            return;
        }

        this.state.spiritStones -= cost;
        this.state.plots[plotId].unlocked = true;
        this.state.unlockedPlots++;
        this.showToast(`开垦新灵田成功！花费${cost}灵石`, 'success');
        this.refreshAll();
    }

    nextDay() {
        this.state.day++;

        if (this.state.nextDayWeather) {
            this.state.currentWeather = this.state.nextDayWeather;
        }
        this.state.nextDayWeather = this.generateWeather();

        this.processGrowth();
        this.processAbilities();
        this.processPests();
        this.processOverripe();
        this.processWeatherEffects();

        for (const plot of this.state.plots) {
            plot.watered = false;
        }

        const weather = WEATHER_TYPES[this.state.currentWeather];
        this.showToast(`第${this.state.day}天 — ${weather.icon} ${weather.name}：${weather.description}`, 'info');
        this.refreshAll();
        this.state.save();
    }

    processGrowth() {
        for (const plot of this.state.plots) {
            if (!plot.gourd || plot.stage >= 5) continue;

            const gourdType = GOURD_TYPES[plot.gourd];
            const dailyGrowth = 1 / gourdType.growDays;

            let growth = dailyGrowth;

            if (plot.watered) {
                growth *= 1.0;
            } else {
                growth *= 0.3;
            }

            if (plot.fertilized) {
                growth *= 1.3;
                plot.fertilized = false;
            }

            if (this.state.pestFlags[plot.id]) {
                growth *= 0.5;
            }

            const weatherMultiplier = this.getWeatherGrowthMultiplier(plot.gourd);
            growth *= weatherMultiplier;

            plot.growthProgress = Math.min(1.0, plot.growthProgress + growth);

            let newStage = 0;
            for (let s = STAGE_PROGRESS.length - 1; s >= 0; s--) {
                if (plot.growthProgress >= STAGE_PROGRESS[s]) {
                    newStage = s;
                    break;
                }
            }
            plot.stage = newStage;

            if (plot.stage >= 5 && plot.matureDay < 0) {
                plot.matureDay = this.state.day;
            }
        }
    }

    processAbilities() {
        for (let i = 0; i < TOTAL_PLOTS; i++) {
            const plot = this.state.plots[i];
            if (!plot.gourd || plot.stage < 5) continue;

            const gourdType = GOURD_TYPES[plot.gourd];
            const ability = gourdType.ability;
            const row = Math.floor(i / GRID_COLS);
            const col = i % GRID_COLS;

            switch (ability.type) {
                case 'passive_income':
                    this.state.spiritStones += ability.value;
                    break;

                case 'auto_water':
                    this.autoWaterArea(row, col, ability.value);
                    break;

                case 'growth_boost':
                    this.boostGrowthArea(row, col, ability.value);
                    break;

                case 'random_seed':
                    if (Math.random() < ability.value) {
                        this.grantRandomSeed();
                    }
                    break;

                case 'pest_protection':
                    this.state.pestFlags = this.state.pestFlags.map(() => false);
                    this.state.spiritStones += ability.value;
                    break;

                case 'preserve':
                    this.preserveArea(row, col);
                    this.state.spiritStones += ability.value;
                    break;

                case 'chaos':
                    this.triggerChaosAbility(ability.value);
                    break;

                case 'price_boost':
                case 'extra_seed':
                    break;
            }
        }
    }

    autoWaterArea(centerRow, centerCol, range) {
        for (let i = 0; i < TOTAL_PLOTS; i++) {
            const plot = this.state.plots[i];
            if (!plot.gourd || plot.stage >= 5) continue;

            const r = Math.floor(i / GRID_COLS);
            const c = i % GRID_COLS;
            const dist = Math.max(Math.abs(r - centerRow), Math.abs(c - centerCol));

            if (dist <= 1) {
                plot.watered = true;
            }
        }
    }

    boostGrowthArea(centerRow, centerCol, boost) {
        for (let i = 0; i < TOTAL_PLOTS; i++) {
            const plot = this.state.plots[i];
            if (!plot.gourd || plot.stage >= 5) continue;

            const r = Math.floor(i / GRID_COLS);
            const c = i % GRID_COLS;
            const dist = Math.max(Math.abs(r - centerRow), Math.abs(c - centerCol));

            if (dist <= 1) {
                plot.growthProgress = Math.min(1.0, plot.growthProgress + boost);
                let newStage = 0;
                for (let s = STAGE_PROGRESS.length - 1; s >= 0; s--) {
                    if (plot.growthProgress >= STAGE_PROGRESS[s]) {
                        newStage = s;
                        break;
                    }
                }
                plot.stage = newStage;
                if (plot.stage >= 5 && plot.matureDay < 0) {
                    plot.matureDay = this.state.day;
                }
            }
        }
    }

    preserveArea(centerRow, centerCol) {
        for (let i = 0; i < TOTAL_PLOTS; i++) {
            const plot = this.state.plots[i];
            if (!plot.gourd || plot.stage < 5) continue;

            const r = Math.floor(i / GRID_COLS);
            const c = i % GRID_COLS;
            const dist = Math.max(Math.abs(r - centerRow), Math.abs(c - centerCol));

            if (dist <= 1) {
                plot.overripe = false;
            }
        }
    }

    triggerChaosAbility(multiplier) {
        const abilityTypes = ['passive_income', 'auto_water', 'growth_boost', 'random_seed', 'price_boost', 'extra_seed'];
        const chosen = abilityTypes[Math.floor(Math.random() * abilityTypes.length)];

        switch (chosen) {
            case 'passive_income':
                this.state.spiritStones += 10 * multiplier;
                this.showToast(`🌀 混沌之力：灵石涌来！获得${10 * multiplier}灵石`, 'ability');
                break;
            case 'auto_water':
                for (const plot of this.state.plots) {
                    if (plot.gourd && plot.stage < 5) plot.watered = true;
                }
                this.showToast('🌀 混沌之力：甘霖天降！全山浇灌', 'ability');
                break;
            case 'growth_boost':
                for (const plot of this.state.plots) {
                    if (plot.gourd && plot.stage < 5) {
                        plot.growthProgress = Math.min(1.0, plot.growthProgress + 0.3 * multiplier);
                    }
                }
                this.showToast('🌀 混沌之力：万物疯长！', 'ability');
                break;
            case 'random_seed':
                for (let i = 0; i < 2 * multiplier; i++) {
                    this.grantRandomSeed();
                }
                break;
            case 'price_boost':
                this.state.spiritStones += 20 * multiplier;
                this.showToast(`🌀 混沌之力：财运亨通！获得${20 * multiplier}灵石`, 'ability');
                break;
            case 'extra_seed':
                const types = Object.keys(GOURD_TYPES);
                const seedType = types[Math.floor(Math.random() * types.length)];
                if (!this.state.seeds[seedType]) this.state.seeds[seedType] = 0;
                this.state.seeds[seedType] += Math.floor(multiplier);
                this.showToast(`🌀 混沌之力：获得${GOURD_TYPES[seedType].name}种子x${Math.floor(multiplier)}！`, 'ability');
                break;
        }
    }

    grantRandomSeed() {
        const types = Object.keys(GOURD_TYPES);
        const weights = types.map(id => {
            const rarity = GOURD_TYPES[id].rarity;
            switch (rarity) {
                case 'common': return 40;
                case 'uncommon': return 25;
                case 'rare': return 15;
                case 'epic': return 5;
                case 'legendary': return 1;
                default: return 10;
            }
        });

        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let roll = Math.random() * totalWeight;
        let chosen = types[0];

        for (let i = 0; i < types.length; i++) {
            roll -= weights[i];
            if (roll <= 0) {
                chosen = types[i];
                break;
            }
        }

        if (!this.state.seeds[chosen]) this.state.seeds[chosen] = 0;
        this.state.seeds[chosen]++;
        this.state.discoveredGourds.add(chosen);
        this.showToast(`风灵送来一颗${GOURD_TYPES[chosen].name}种子！`, 'ability');
    }

    processPests() {
        const hasProtection = this.state.plots.some(p => p.gourd && p.stage >= 5 && GOURD_TYPES[p.gourd].ability.type === 'pest_protection');

        if (hasProtection) return;

        for (let i = 0; i < TOTAL_PLOTS; i++) {
            const plot = this.state.plots[i];
            if (!plot.gourd || plot.stage >= 5 || this.state.pestFlags[i]) continue;

            if (Math.random() < 0.1) {
                this.state.pestFlags[i] = true;
            }
        }
    }

    processOverripe() {
        for (const plot of this.state.plots) {
            if (!plot.gourd || plot.stage < 5 || plot.matureDay < 0) continue;

            const daysSinceMature = this.state.day - plot.matureDay;
            if (daysSinceMature > 5 && !plot.overripe) {
                const gourdType = GOURD_TYPES[plot.gourd];
                const isPreserved = this.isPreserved(plot.id);
                if (!isPreserved && Math.random() < 0.3) {
                    plot.overripe = true;
                    this.showToast(`${gourdType.name}已过熟，品质下降！`, 'warning');
                }
            }
        }
    }

    isPreserved(plotId) {
        const row = Math.floor(plotId / GRID_COLS);
        const col = plotId % GRID_COLS;

        for (let i = 0; i < TOTAL_PLOTS; i++) {
            const other = this.state.plots[i];
            if (!other.gourd || other.stage < 5) continue;
            if (GOURD_TYPES[other.gourd].ability.type !== 'preserve') continue;

            const otherRow = Math.floor(i / GRID_COLS);
            const otherCol = i % GRID_COLS;
            const dist = Math.max(Math.abs(row - otherRow), Math.abs(col - otherCol));

            if (dist <= 1) return true;
        }
        return false;
    }

    renderSeedList() {
        const container = document.getElementById('seed-list');
        container.innerHTML = '';

        const seeds = Object.entries(this.state.seeds).filter(([id, count]) => count > 0);
        if (seeds.length === 0) {
            container.innerHTML = '<div class="item-entry"><span class="item-name" style="color:var(--text-secondary)">暂无种子</span></div>';
            return;
        }

        for (const [seedId, count] of seeds) {
            const gourd = GOURD_TYPES[seedId];
            if (!gourd) continue;

            const div = document.createElement('div');
            div.className = `item-entry rarity-${gourd.rarity} seed-draggable`;
            div.draggable = true;
            div.dataset.seedId = seedId;

            const preview = GourdPreview.createPreviewElement(seedId, 'seed', 28);
            const nameSpan = document.createElement('span');
            nameSpan.className = `item-name element-${gourd.element}`;
            nameSpan.textContent = gourd.name;
            const countSpan = document.createElement('span');
            countSpan.className = 'item-count';
            countSpan.textContent = `x${count}`;

            div.appendChild(preview);
            div.appendChild(nameSpan);
            div.appendChild(countSpan);

            if (this.selectedSeed === seedId) {
                div.style.background = 'rgba(226, 183, 20, 0.2)';
                div.style.border = '1px solid var(--accent-gold)';
            }

            div.addEventListener('click', () => {
                this.selectedSeed = this.selectedSeed === seedId ? null : seedId;
                this.renderSeedList();
                if (this.selectedSeed) {
                    this.showToast(`已选择${gourd.name}种子，点击空灵田种植`, 'info');
                }
            });

            div.addEventListener('dragstart', (e) => {
                this.draggedSeedId = seedId;
                this.draggedFromShop = false;
                e.dataTransfer.setData('text/plain', seedId);
                e.dataTransfer.effectAllowed = 'move';
                const dragCanvas = GourdPreview.getDragImage(seedId);
                e.dataTransfer.setDragImage(dragCanvas, 24, 24);
                div.classList.add('dragging');
                this.highlightEmptyPlots(true);
            });

            div.addEventListener('dragend', () => {
                div.classList.remove('dragging');
                this.draggedSeedId = null;
                this.draggedFromShop = false;
                this.highlightEmptyPlots(false);
            });

            container.appendChild(div);
        }
    }

    renderInventory() {
        const container = document.getElementById('inventory-list');
        container.innerHTML = '';

        const items = Object.entries(this.state.inventory).filter(([id, count]) => count > 0);
        if (items.length === 0) {
            container.innerHTML = '<div class="item-entry"><span class="item-name" style="color:var(--text-secondary)">暂无收获</span></div>';
            return;
        }

        for (const [gourdId, count] of items) {
            const gourd = GOURD_TYPES[gourdId];
            if (!gourd) continue;

            const div = document.createElement('div');
            div.className = `item-entry rarity-${gourd.rarity}`;

            const preview = GourdPreview.createPreviewElement(gourdId, 'mature', 28);
            const nameSpan = document.createElement('span');
            nameSpan.className = `item-name element-${gourd.element}`;
            nameSpan.textContent = gourd.name;
            const countSpan = document.createElement('span');
            countSpan.className = 'item-count';
            countSpan.textContent = `x${count}`;

            div.appendChild(preview);
            div.appendChild(nameSpan);
            div.appendChild(countSpan);

            div.addEventListener('click', () => this.showGourdTypeInfo(gourdId));
            container.appendChild(div);
        }
    }

    renderShop() {
        const container = document.getElementById('shop-list');
        container.innerHTML = '';

        for (const item of SHOP_ITEMS) {
            const div = document.createElement('div');
            div.className = 'item-entry';
            div.innerHTML = `
                <span class="item-icon">${item.icon}</span>
                <span class="item-name">${item.name}</span>
                <span class="item-price">💎${item.price}</span>
            `;
            div.addEventListener('click', () => this.buyItem(item));
            container.appendChild(div);
        }

        const seedEntries = Object.values(GOURD_TYPES).sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);
        for (const gourd of seedEntries) {
            const div = document.createElement('div');
            div.className = `item-entry rarity-${gourd.rarity} shop-seed-draggable`;
            div.draggable = true;
            div.dataset.seedId = gourd.id;

            const preview = GourdPreview.createPreviewElement(gourd.id, 'seed', 28);
            const nameSpan = document.createElement('span');
            nameSpan.className = `item-name element-${gourd.element}`;
            nameSpan.textContent = `${gourd.name}种`;
            const priceSpan = document.createElement('span');
            priceSpan.className = 'item-price';
            priceSpan.textContent = `💎${gourd.seedPrice}`;

            div.appendChild(preview);
            div.appendChild(nameSpan);
            div.appendChild(priceSpan);

            div.addEventListener('click', () => this.buySeed(gourd.id));

            div.addEventListener('dragstart', (e) => {
                this.draggedSeedId = gourd.id;
                this.draggedFromShop = true;
                e.dataTransfer.setData('text/plain', gourd.id);
                e.dataTransfer.effectAllowed = 'move';
                const dragCanvas = GourdPreview.getDragImage(gourd.id);
                e.dataTransfer.setDragImage(dragCanvas, 24, 24);
                div.classList.add('dragging');
                this.highlightEmptyPlots(true);
            });

            div.addEventListener('dragend', () => {
                div.classList.remove('dragging');
                this.draggedSeedId = null;
                this.draggedFromShop = false;
                this.highlightEmptyPlots(false);
            });

            container.appendChild(div);
        }
    }

    renderCodex() {
        const container = document.getElementById('codex-list');
        container.innerHTML = '';

        const allGourds = Object.values(GOURD_TYPES).sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);

        for (const gourd of allGourds) {
            const discovered = this.state.discoveredGourds.has(gourd.id);
            const div = document.createElement('div');
            div.className = `item-entry rarity-${gourd.rarity}`;

            if (discovered) {
                const preview = GourdPreview.createPreviewElement(gourd.id, 'mature', 28);
                const nameSpan = document.createElement('span');
                nameSpan.className = `item-name element-${gourd.element}`;
                nameSpan.textContent = gourd.name;
                div.appendChild(preview);
                div.appendChild(nameSpan);
                div.addEventListener('click', () => this.showGourdTypeInfo(gourd.id));
            } else {
                const qSpan = document.createElement('span');
                qSpan.className = 'item-icon';
                qSpan.textContent = '❓';
                const nameSpan = document.createElement('span');
                nameSpan.className = 'item-name';
                nameSpan.style.color = 'var(--text-secondary)';
                nameSpan.textContent = '未发现';
                div.appendChild(qSpan);
                div.appendChild(nameSpan);
            }

            container.appendChild(div);
        }
    }

    buyItem(item) {
        if (this.state.spiritStones < item.price) {
            this.showToast('灵石不足！', 'error');
            return;
        }

        this.state.spiritStones -= item.price;

        if (item.type === 'resource') {
            this.state[item.resource] += item.amount;
            this.showToast(`购买了${item.name}x${item.amount}！`, 'success');
        } else if (item.type === 'unlock_plot') {
            const lockedPlot = this.state.plots.find(p => !p.unlocked);
            if (lockedPlot) {
                lockedPlot.unlocked = true;
                this.state.unlockedPlots++;
                this.showToast('开垦新灵田成功！', 'success');
            } else {
                this.showToast('所有灵田已开垦！', 'info');
                this.state.spiritStones += item.price;
            }
        }

        this.refreshAll();
    }

    buySeed(gourdId) {
        const gourd = GOURD_TYPES[gourdId];
        if (this.state.spiritStones < gourd.seedPrice) {
            this.showToast('灵石不足！', 'error');
            return;
        }

        this.state.spiritStones -= gourd.seedPrice;
        if (!this.state.seeds[gourdId]) this.state.seeds[gourdId] = 0;
        this.state.seeds[gourdId]++;
        this.state.discoveredGourds.add(gourdId);
        this.showToast(`购买了${gourd.name}种子！`, 'success');
        this.refreshAll();
    }

    showGourdDetail(plotId) {
        const plot = this.state.plots[plotId];
        if (!plot.gourd) return;

        const gourdType = GOURD_TYPES[plot.gourd];
        const isMature = plot.stage >= 5;
        const progressPct = Math.floor(plot.growthProgress * 100);
        const weatherMultiplier = this.getWeatherGrowthMultiplier(plot.gourd);
        const weatherAffinityText = this.getWeatherAffinityText(plot.gourd);
        const currentWeather = WEATHER_TYPES[this.state.currentWeather];

        let weatherStatusHtml = '';
        if (!isMature) {
            let statusColor = '#a0a0b0';
            let statusText = '一般';
            if (weatherMultiplier > 1.0) {
                statusColor = '#4caf50';
                statusText = `喜好 (+${Math.round((weatherMultiplier - 1) * 100)}%)`;
            } else if (weatherMultiplier < 1.0) {
                statusColor = '#ef5350';
                statusText = `不适 (${Math.round((weatherMultiplier - 1) * 100)}%)`;
            }
            weatherStatusHtml = `
                <div style="margin-top:8px;padding:8px;background:var(--card-bg);border-radius:6px;">
                    <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;">🌤️ 当前天气：${currentWeather.icon} ${currentWeather.name}</div>
                    <div style="font-size:0.85rem;color:${statusColor};font-weight:bold;">${weatherAffinityText} ${statusText}</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px;">${gourdType.weatherAffinity.desc}</div>
                </div>
            `;
        }

        const bigPreviewUrl = GourdPreview.getMaturePreview(plot.gourd, 64).toDataURL();

        let html = `
            <div class="modal-title">${gourdType.name}</div>
            <div class="gourd-detail">
                <div class="gourd-big-icon"><img src="${bigPreviewUrl}" width="64" height="64" class="gourd-modal-preview" /></div>
                <div style="color:${RARITY_COLORS[gourdType.rarity]};font-size:0.9rem;">【${gourdType.rarityName}】· ${gourdType.elementName}属性</div>
                <div class="gourd-desc">${gourdType.description}</div>
                <div class="gourd-stats">
                    <div class="stat-item">
                        <div class="stat-label">生长阶段</div>
                        <div class="stat-value">${STAGE_NAMES[plot.stage]}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">生长进度</div>
                        <div class="stat-value">${progressPct}%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">成熟天数</div>
                        <div class="stat-value">${gourdType.growDays}天</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">出售价格</div>
                        <div class="stat-value">💎${gourdType.sellPrice}</div>
                    </div>
                </div>
                ${weatherStatusHtml}
                <div class="ability-box">
                    <div class="ability-name">✨ ${gourdType.ability.name}</div>
                    <div class="ability-desc">${gourdType.ability.description}</div>
                    ${isMature ? '<div style="color:#ffd700;margin-top:4px;font-size:0.8rem;">⚡ 能力已激活</div>' : '<div style="color:var(--text-secondary);margin-top:4px;font-size:0.8rem;">🔒 成熟后激活</div>'}
                </div>
                ${this.state.pestFlags[plotId] ? '<div style="color:#ef5350;margin-top:8px;">🐛 受到虫害侵袭，生长速度减半！</div>' : ''}
                ${plot.overripe ? '<div style="color:#ff9800;margin-top:8px;">⚠️ 已过熟，请尽快收获！</div>' : ''}
            </div>
        `;

        this.showModal(html);
    }

    showGourdTypeInfo(gourdId) {
        const gourd = GOURD_TYPES[gourdId];

        let favoriteWeatherHtml = '';
        let dislikedWeatherHtml = '';
        if (gourd.weatherAffinity) {
            const favIcons = gourd.weatherAffinity.favorite.map(w => WEATHER_TYPES[w] ? `${WEATHER_TYPES[w].icon} ${WEATHER_TYPES[w].name}` : w).join('  ');
            const disIcons = gourd.weatherAffinity.disliked.map(w => WEATHER_TYPES[w] ? `${WEATHER_TYPES[w].icon} ${WEATHER_TYPES[w].name}` : w).join('  ');
            const noDislike = gourd.weatherAffinity.disliked.length === 0 ? '无' : disIcons;

            favoriteWeatherHtml = `
                <div style="margin-top:8px;padding:8px;background:var(--card-bg);border-radius:6px;">
                    <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;">🌤️ 天气偏好</div>
                    <div style="font-size:0.8rem;color:#4caf50;">喜好：${favIcons} (+${Math.round((gourd.weatherAffinity.favoriteMultiplier - 1) * 100)}%)</div>
                    <div style="font-size:0.8rem;color:#ef5350;">厌恶：${noDislike} (${Math.round((gourd.weatherAffinity.dislikedMultiplier - 1) * 100)}%)</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px;">${gourd.weatherAffinity.desc}</div>
                </div>
            `;
        }

        const bigPreviewUrl = GourdPreview.getMaturePreview(gourdId, 64).toDataURL();

        let html = `
            <div class="modal-title">${gourd.name}</div>
            <div class="gourd-detail">
                <div class="gourd-big-icon"><img src="${bigPreviewUrl}" width="64" height="64" class="gourd-modal-preview" /></div>
                <div style="color:${RARITY_COLORS[gourd.rarity]};font-size:0.9rem;">【${gourd.rarityName}】· ${gourd.elementName}属性</div>
                <div class="gourd-desc">${gourd.description}</div>
                <div class="gourd-stats">
                    <div class="stat-item">
                        <div class="stat-label">成熟天数</div>
                        <div class="stat-value">${gourd.growDays}天</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">出售价格</div>
                        <div class="stat-value">💎${gourd.sellPrice}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">种子价格</div>
                        <div class="stat-value">💎${gourd.seedPrice}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">属性</div>
                        <div class="stat-value element-${gourd.element}">${gourd.elementName}</div>
                    </div>
                </div>
                ${favoriteWeatherHtml}
                <div class="ability-box">
                    <div class="ability-name">✨ ${gourd.ability.name}</div>
                    <div class="ability-desc">${gourd.ability.description}</div>
                </div>
                <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;">
                    <button onclick="game.buySeed('${gourdId}');game.closeModal();" class="action-btn" style="padding:8px 16px;">购买种子 💎${gourd.seedPrice}</button>
                </div>
            </div>
        `;

        this.showModal(html);
    }

    showModal(html) {
        const modal = document.getElementById('info-modal');
        const body = document.getElementById('modal-body');
        body.innerHTML = html;
        modal.classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('info-modal').classList.add('hidden');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3000);
    }

    updateResourceDisplay() {
        document.getElementById('spirit-stones').textContent = this.state.spiritStones;
        document.getElementById('seed-count').textContent = Object.values(this.state.seeds).reduce((a, b) => a + b, 0);
        document.getElementById('water-count').textContent = this.state.water;
        document.getElementById('fertilizer-count').textContent = this.state.fertilizer;
        document.getElementById('day-count').textContent = this.state.day;
    }

    refreshAll() {
        this.renderSeedList();
        this.renderInventory();
        this.renderCodex();
        this.updateResourceDisplay();
        this.updateWeatherDisplay();
    }

    highlightEmptyPlots(highlight) {
    }

    buyAndPlantSeed(plotId, seedId) {
        const gourd = GOURD_TYPES[seedId];
        if (!gourd) return;
        if (this.state.spiritStones < gourd.seedPrice) {
            this.showToast('灵石不足，无法购买种子！', 'error');
            return;
        }

        this.state.spiritStones -= gourd.seedPrice;
        if (!this.state.seeds[seedId]) this.state.seeds[seedId] = 0;
        this.state.seeds[seedId]++;
        this.state.discoveredGourds.add(seedId);

        this.plantSeed(plotId, seedId);
    }

    generateWeather() {
        const current = this.state.currentWeather;
        const weatherKeys = Object.keys(WEATHER_TYPES);

        const transitionWeights = {};
        for (const key of weatherKeys) {
            transitionWeights[key] = 10;
        }

        if (current === 'sunny') {
            transitionWeights['hot'] = 20;
            transitionWeights['cloudy'] = 25;
            transitionWeights['sunny'] = 20;
        } else if (current === 'cloudy') {
            transitionWeights['rainy'] = 25;
            transitionWeights['sunny'] = 15;
            transitionWeights['foggy'] = 15;
            transitionWeights['cloudy'] = 15;
        } else if (current === 'rainy') {
            transitionWeights['stormy'] = 20;
            transitionWeights['cloudy'] = 20;
            transitionWeights['rainy'] = 15;
        } else if (current === 'stormy') {
            transitionWeights['rainy'] = 20;
            transitionWeights['windy'] = 20;
            transitionWeights['cloudy'] = 15;
        } else if (current === 'windy') {
            transitionWeights['cloudy'] = 20;
            transitionWeights['sunny'] = 15;
            transitionWeights['stormy'] = 15;
        } else if (current === 'snowy') {
            transitionWeights['cloudy'] = 20;
            transitionWeights['snowy'] = 15;
            transitionWeights['foggy'] = 15;
        } else if (current === 'foggy') {
            transitionWeights['cloudy'] = 20;
            transitionWeights['rainy'] = 15;
            transitionWeights['sunny'] = 15;
        } else if (current === 'hot') {
            transitionWeights['sunny'] = 25;
            transitionWeights['cloudy'] = 15;
            transitionWeights['hot'] = 15;
        }

        const totalWeight = Object.values(transitionWeights).reduce((a, b) => a + b, 0);
        let roll = Math.random() * totalWeight;
        let chosen = weatherKeys[0];

        for (const key of weatherKeys) {
            roll -= transitionWeights[key];
            if (roll <= 0) {
                chosen = key;
                break;
            }
        }

        return chosen;
    }

    getWeatherGrowthMultiplier(gourdId) {
        const gourdType = GOURD_TYPES[gourdId];
        if (!gourdType.weatherAffinity) return 1.0;

        const affinity = gourdType.weatherAffinity;
        const currentWeather = this.state.currentWeather;

        if (affinity.favorite.includes(currentWeather)) {
            return affinity.favoriteMultiplier;
        }

        if (affinity.disliked.includes(currentWeather)) {
            return affinity.dislikedMultiplier;
        }

        return 1.0;
    }

    getWeatherAffinityText(gourdId) {
        const gourdType = GOURD_TYPES[gourdId];
        if (!gourdType.weatherAffinity) return '';

        const affinity = gourdType.weatherAffinity;
        const currentWeather = this.state.currentWeather;

        if (affinity.favorite.includes(currentWeather)) {
            return '☀️ 天气喜好';
        }
        if (affinity.disliked.includes(currentWeather)) {
            return '⚠️ 天气不适';
        }
        return '🌤️ 天气一般';
    }

    processWeatherEffects() {
        const weather = this.state.currentWeather;

        switch (weather) {
            case 'rainy':
                for (const plot of this.state.plots) {
                    if (plot.gourd && !plot.watered && plot.stage < 5) {
                        plot.watered = true;
                    }
                }
                break;

            case 'stormy':
                for (const plot of this.state.plots) {
                    if (plot.gourd && !plot.watered && plot.stage < 5) {
                        plot.watered = true;
                    }
                }
                if (Math.random() < 0.15) {
                    const growingPlots = this.state.plots.filter(p => p.gourd && p.stage < 5 && p.stage > 0);
                    if (growingPlots.length > 0) {
                        const target = growingPlots[Math.floor(Math.random() * growingPlots.length)];
                        const gourdName = GOURD_TYPES[target.gourd].name;
                        target.growthProgress = Math.max(0, target.growthProgress - 0.1);
                        this.showToast(`⚡ 雷击波及${gourdName}，生长倒退！`, 'warning');
                    }
                }
                break;

            case 'snowy':
                for (const plot of this.state.plots) {
                    if (plot.gourd && plot.stage >= 5) {
                        plot.overripe = false;
                    }
                }
                break;

            case 'foggy':
                this.state.spiritStones += 2;
                break;

            case 'windy':
                if (Math.random() < 0.2) {
                    this.grantRandomSeed();
                }
                break;

            case 'hot':
                for (const plot of this.state.plots) {
                    if (plot.gourd && plot.watered && plot.stage < 5) {
                        plot.watered = false;
                    }
                }
                break;
        }
    }

    updateWeatherDisplay() {
        const currentWeather = WEATHER_TYPES[this.state.currentWeather];
        const nextWeather = this.state.nextDayWeather ? WEATHER_TYPES[this.state.nextDayWeather] : null;

        const currentEl = document.getElementById('current-weather');
        const forecastEl = document.getElementById('weather-forecast');

        if (currentEl) {
            currentEl.innerHTML = `${currentWeather.icon} ${currentWeather.name}`;
            currentEl.title = currentWeather.description;
            currentEl.className = `weather-display weather-${this.state.currentWeather}`;
        }

        if (forecastEl && nextWeather) {
            forecastEl.innerHTML = `${nextWeather.icon} ${nextWeather.name}`;
            forecastEl.title = `明日天气：${nextWeather.description}`;
        }
    }
}

let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});
