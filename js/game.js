// ============================================
// ELDEN KING - Jeu plateforme médiéval
// ============================================

// --- CONFIG GLOBALE ---
const CONFIG = {
    playerSpeed: 250,
    jumpForce: -500,
    gravity: 1400,
    deathDelay: 3000,
    tileSize: 40,
};

// --- SAUVEGARDE (niveaux débloqués) ---
const SAVE = {
    unlockedLevel: parseInt(localStorage.getItem('eldenking_unlocked') || '1'),
    selectedChar: 0,
    deaths: JSON.parse(localStorage.getItem('eldenking_deaths') || '[0,0,0,0,0,0,0,0]'),
    unlock(level) {
        if (level > this.unlockedLevel) {
            this.unlockedLevel = level;
            localStorage.setItem('eldenking_unlocked', level);
        }
    },
    addDeath(levelIndex) {
        this.deaths[levelIndex]++;
        localStorage.setItem('eldenking_deaths', JSON.stringify(this.deaths));
    },
    totalDeaths() {
        return this.deaths.reduce((a, b) => a + b, 0);
    },
    // Timer global : démarre quand le joueur entre dans le niveau 1
    startTimer() {
        if (!localStorage.getItem('eldenking_startTime')) {
            localStorage.setItem('eldenking_startTime', Date.now().toString());
        }
    },
    getElapsedTime() {
        const start = parseInt(localStorage.getItem('eldenking_startTime') || Date.now().toString());
        return Date.now() - start;
    },
    formatTime(ms) {
        const totalSec = Math.floor(ms / 1000);
        const hours = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
        if (mins > 0) return `${mins}m ${secs}s`;
        return `${secs}s`;
    },
};

// --- MUSIQUE DE FOND (Web Audio API) ---
const BGMusic = {
    ctx: null,
    gainNode: null,
    isPlaying: false,
    timers: [],

    start() {
        if (this.isPlaying) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = 0.08;
        this.gainNode.connect(this.ctx.destination);
        this.isPlaying = true;
        this.playLoop();
    },

    stop() {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        this.timers.forEach(t => clearTimeout(t));
        this.timers = [];
        if (this.gainNode) {
            this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
        }
        const oldCtx = this.ctx;
        setTimeout(() => oldCtx.close(), 500);
        this.ctx = null;
        this.gainNode = null;
    },

    playNote(freq, startTime, duration, type) {
        if (!this.ctx || !this.isPlaying) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.connect(noteGain);
        noteGain.connect(this.gainNode);
        osc.type = type || 'triangle';
        osc.frequency.value = freq;
        noteGain.gain.setValueAtTime(0.6, startTime);
        noteGain.gain.linearRampToValueAtTime(0, startTime + duration - 0.05);
        osc.start(startTime);
        osc.stop(startTime + duration);
    },

    playLoop() {
        if (!this.isPlaying || !this.ctx) return;
        const t = this.ctx.currentTime;
        const bpm = 70;
        const beat = 60 / bpm;

        // Mélodie médiévale (mode dorien — ambiance sombre)
        const melody = [
            { note: 294, time: 0, dur: beat },
            { note: 330, time: beat, dur: beat * 0.5 },
            { note: 349, time: beat * 1.5, dur: beat },
            { note: 392, time: beat * 2.5, dur: beat },
            { note: 440, time: beat * 3.5, dur: beat * 1.5 },
            { note: 392, time: beat * 5, dur: beat },
            { note: 349, time: beat * 6, dur: beat * 2 },
            { note: 330, time: beat * 8, dur: beat },
            { note: 294, time: beat * 9, dur: beat * 0.5 },
            { note: 330, time: beat * 9.5, dur: beat * 0.5 },
            { note: 349, time: beat * 10, dur: beat },
            { note: 294, time: beat * 11, dur: beat },
            { note: 262, time: beat * 12, dur: beat * 1.5 },
            { note: 294, time: beat * 13.5, dur: beat * 2.5 },
        ];

        // Basse (notes graves, longues)
        const bass = [
            { note: 147, time: 0, dur: beat * 4 },
            { note: 175, time: beat * 4, dur: beat * 4 },
            { note: 165, time: beat * 8, dur: beat * 4 },
            { note: 131, time: beat * 12, dur: beat * 4 },
        ];

        const loopDuration = beat * 16;

        melody.forEach(n => this.playNote(n.note, t + n.time, n.dur, 'triangle'));
        bass.forEach(n => this.playNote(n.note, t + n.time, n.dur, 'sine'));

        const timer = setTimeout(() => this.playLoop(), loopDuration * 1000);
        this.timers.push(timer);
    },
};

// --- SON DE SAUT (Web Audio API) ---
function playJumpSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
}

// --- MESSAGES DE MORT (par palier) ---
const DEATH_MESSAGES = [
    // 1–3 morts
    ['Un simple échauffement.', 'Tu découvres, c\'est normal.', 'Rien d\'inquiétant… pour l\'instant.'],
    // 4–7 morts
    ['Tu veux peut-être ralentir un peu.', 'Le piège était visible, non ?', 'Hmm… intéressant comme stratégie.'],
    // 8–12 morts
    ['Tu fais exprès ou… ?', 'On dirait que tu aimes ce piège.', 'Essaie quelque chose de différent, peut-être.'],
];

// --- COULEURS MÉDIÉVALES ---
const COLORS = {
    bgDark: '#0a0a0f',
    bgMedium: '#12121a',
    stone: 0x2a2a35,
    stoneLight: 0x3a3a48,
    gold: 0xd4a843,
    goldBright: 0xf0c850,
    goldDark: 0x8a6d2b,
    blood: 0x8b0000,
    bloodBright: 0xcc1111,
    doorGreen: 0x2d6e2d,
    doorGlow: 0x44aa44,
    textGold: '#d4a843',
    textLight: '#c0b8a0',
    textDark: '#666055',
    locked: 0x444444,
};

// --- PERSONNAGES ---
const CHARACTERS = [
    {
        name: 'Thomas',
        desc: 'Viking de Suède, épée fidèle',
        bodyColor: 0x5577aa,
        armorColor: 0x8899bb,
        accentColor: 0xaabbdd,
        headColor: 0xffcc88,
        weaponColor: 0xcccccc,
    },
    {
        name: 'Olivier',
        desc: 'Chasseur autochtone, arc mortel',
        bodyColor: 0x6b4226,
        armorColor: 0x8b5e3c,
        accentColor: 0xa0714f,
        headColor: 0xddbb88,
        weaponColor: 0x7a5230,
    },
    {
        name: 'James',
        desc: 'Ombre silencieuse, fusil redoutable',
        bodyColor: 0x2a4a2a,
        armorColor: 0x3d6b3d,
        accentColor: 0x55885a,
        headColor: 0xddbb88,
        weaponColor: 0x999999,
    },
    {
        name: 'Luc',
        desc: 'Soldat urbain, shotgun dévastateur',
        bodyColor: 0x333333,
        armorColor: 0x444444,
        accentColor: 0x555555,
        headColor: 0x8b6914,
        weaponColor: 0x666666,
    },
];

// --- NIVEAUX (8 niveaux) ---
// 0=vide, 1=mur, 2=pics, 3=spawn, 4=porte, 5=platforme H, 6=platforme V, 7=trou, 8=crusher
// Les niveaux utilisent un layout ouvert :
// - Pas de murs visibles sur les côtés/plafond
// - Le joueur est bloqué par les world bounds (murs invisibles)
// - Plancher en bas
// - Porte à atteindre
// Tableau des niveaux — chaque niveau est dans son propre fichier (js/levels/levelX.js)
const LEVELS = new Array(8);

// ============================================
// SCÈNE BOOT - Crée toutes les textures
// ============================================

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.load.audio('battleTheme', 'audio/battle_theme.m4a');
        this.load.audio('deathSound', 'audio/death_sound.m4a');
    }

    create() {
        // Créer les textures des 3 personnages
        CHARACTERS.forEach((char, i) => {
            this.createCharTexture(`char_${i}`, char);
            this.createCharTexture(`char_preview_${i}`, char, 3);
        });

        // Créer les textures de porte
        this.createDoorTexture();
        this.createGoldenDoorTexture();

        this.scene.start('TitleScene');
    }

    createDoorTexture() {
        const w = 36;
        const h = 48;
        const canvas = this.textures.createCanvas('woodDoor', w, h);
        const ctx = canvas.getContext();

        // Cadre en pierre
        ctx.fillStyle = '#3a3a48';
        ctx.fillRect(0, 0, w, h);

        // Arc en pierre (haut de la porte)
        ctx.fillStyle = '#2a2a35';
        ctx.beginPath();
        ctx.arc(w/2, 14, 14, Math.PI, 0, false);
        ctx.lineTo(w - 3, h);
        ctx.lineTo(3, h);
        ctx.closePath();
        ctx.fill();

        // Bois de la porte
        ctx.fillStyle = '#5a3a1a';
        ctx.beginPath();
        ctx.arc(w/2, 16, 11, Math.PI, 0, false);
        ctx.lineTo(w/2 + 11, h - 2);
        ctx.lineTo(w/2 - 11, h - 2);
        ctx.closePath();
        ctx.fill();

        // Planches verticales (lignes sombres)
        ctx.strokeStyle = '#4a2a10';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w/2, 8); ctx.lineTo(w/2, h - 2);
        ctx.moveTo(w/2 - 5, 10); ctx.lineTo(w/2 - 5, h - 2);
        ctx.moveTo(w/2 + 5, 10); ctx.lineTo(w/2 + 5, h - 2);
        ctx.stroke();

        // Barres horizontales en fer
        ctx.fillStyle = '#555555';
        ctx.fillRect(w/2 - 11, 22, 22, 2);
        ctx.fillRect(w/2 - 11, 36, 22, 2);

        // Poignée ronde
        ctx.fillStyle = '#888833';
        ctx.beginPath();
        ctx.arc(w/2 + 5, 30, 2, 0, Math.PI * 2);
        ctx.fill();

        // Rivets sur les barres
        ctx.fillStyle = '#777777';
        [22, 36].forEach(barY => {
            ctx.beginPath(); ctx.arc(w/2 - 9, barY + 1, 1, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(w/2 + 9, barY + 1, 1, 0, Math.PI * 2); ctx.fill();
        });

        canvas.refresh();
    }

    createGoldenDoorTexture() {
        const w = 36;
        const h = 48;
        const canvas = this.textures.createCanvas('goldenDoor', w, h);
        const ctx = canvas.getContext();

        // Cadre doré
        ctx.fillStyle = '#8a7a30';
        ctx.fillRect(0, 0, w, h);

        // Arc doré (haut de la porte)
        ctx.fillStyle = '#6a5a20';
        ctx.beginPath();
        ctx.arc(w/2, 14, 14, Math.PI, 0, false);
        ctx.lineTo(w - 3, h);
        ctx.lineTo(3, h);
        ctx.closePath();
        ctx.fill();

        // Or de la porte
        ctx.fillStyle = '#ccaa33';
        ctx.beginPath();
        ctx.arc(w/2, 16, 11, Math.PI, 0, false);
        ctx.lineTo(w/2 + 11, h - 2);
        ctx.lineTo(w/2 - 11, h - 2);
        ctx.closePath();
        ctx.fill();

        // Planches dorées
        ctx.strokeStyle = '#aa8820';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w/2, 8); ctx.lineTo(w/2, h - 2);
        ctx.moveTo(w/2 - 5, 10); ctx.lineTo(w/2 - 5, h - 2);
        ctx.moveTo(w/2 + 5, 10); ctx.lineTo(w/2 + 5, h - 2);
        ctx.stroke();

        // Barres en or
        ctx.fillStyle = '#ddbb44';
        ctx.fillRect(w/2 - 11, 22, 22, 2);
        ctx.fillRect(w/2 - 11, 36, 22, 2);

        // Poignée diamant
        ctx.fillStyle = '#ffee88';
        ctx.beginPath();
        ctx.arc(w/2 + 5, 30, 3, 0, Math.PI * 2);
        ctx.fill();

        // Couronne au-dessus de la porte
        ctx.fillStyle = '#ffdd44';
        ctx.beginPath();
        ctx.moveTo(w/2 - 6, 8);
        ctx.lineTo(w/2 - 4, 3);
        ctx.lineTo(w/2 - 1, 6);
        ctx.lineTo(w/2, 2);
        ctx.lineTo(w/2 + 1, 6);
        ctx.lineTo(w/2 + 4, 3);
        ctx.lineTo(w/2 + 6, 8);
        ctx.closePath();
        ctx.fill();

        // Rivets dorés
        ctx.fillStyle = '#ffcc55';
        [22, 36].forEach(barY => {
            ctx.beginPath(); ctx.arc(w/2 - 9, barY + 1, 1, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(w/2 + 9, barY + 1, 1, 0, Math.PI * 2); ctx.fill();
        });

        canvas.refresh();
    }

    createCharTexture(key, char, scale = 1) {
        const s = scale;
        const w = 32 * s;
        const h = 32 * s;
        const canvas = this.textures.createCanvas(key, w, h);
        const ctx = canvas.getContext();

        const hex = (c) => '#' + c.toString(16).padStart(6, '0');

        // Jambes
        ctx.fillStyle = hex(char.bodyColor);
        ctx.fillRect(8*s, 24*s, 5*s, 8*s);
        ctx.fillRect(19*s, 24*s, 5*s, 8*s);

        // Corps
        ctx.fillStyle = hex(char.armorColor);
        ctx.fillRect(9*s, 11*s, 14*s, 14*s);
        ctx.strokeStyle = hex(char.accentColor);
        ctx.lineWidth = s;
        ctx.strokeRect(9*s, 11*s, 14*s, 14*s);

        // Bras
        ctx.fillStyle = hex(char.bodyColor);
        ctx.fillRect(5*s, 13*s, 4*s, 10*s);
        ctx.fillRect(23*s, 13*s, 4*s, 10*s);

        // Tête
        ctx.fillStyle = hex(char.headColor);
        ctx.beginPath();
        ctx.arc(16*s, 8*s, 6*s, 0, Math.PI * 2);
        ctx.fill();

        // Yeux
        if (char === CHARACTERS[0]) {
            // Thomas: yeux bleus
            ctx.fillStyle = '#3388ff';
        } else {
            ctx.fillStyle = '#000';
        }
        ctx.beginPath();
        ctx.arc(13*s, 7*s, 1.2*s, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(19*s, 7*s, 1.2*s, 0, Math.PI * 2);
        ctx.fill();

        // Détail selon personnage
        if (char === CHARACTERS[0]) {
            // Thomas: cheveux blonds
            ctx.fillStyle = '#f0d060';
            // Cheveux sur le dessus de la tête
            ctx.beginPath();
            ctx.arc(16*s, 5*s, 7*s, Math.PI, 0, false);
            ctx.fill();
            // Mèches sur les côtés
            ctx.fillRect(9*s, 4*s, 3*s, 6*s);
            ctx.fillRect(20*s, 4*s, 3*s, 6*s);
            // Épée à droite
            ctx.fillStyle = hex(char.weaponColor);
            ctx.fillRect(27*s, 8*s, 2*s, 16*s);
            ctx.fillRect(25*s, 10*s, 6*s, 2*s); // garde
        } else if (char === CHARACTERS[1]) {
            // Olivier: chapeau de loup (fourrure grise avec oreilles)
            ctx.fillStyle = '#666666';
            // Base du chapeau (fourrure de loup sur la tête)
            ctx.beginPath();
            ctx.arc(16*s, 4*s, 8*s, Math.PI, 0, false);
            ctx.fill();
            // Oreilles de loup pointues
            ctx.fillStyle = '#555555';
            ctx.beginPath();
            ctx.moveTo(9*s, 4*s);
            ctx.lineTo(7*s, -4*s);
            ctx.lineTo(13*s, 1*s);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(23*s, 4*s);
            ctx.lineTo(25*s, -4*s);
            ctx.lineTo(19*s, 1*s);
            ctx.closePath();
            ctx.fill();
            // Intérieur des oreilles
            ctx.fillStyle = '#888888';
            ctx.beginPath();
            ctx.moveTo(9*s, 3*s);
            ctx.lineTo(8*s, -2*s);
            ctx.lineTo(12*s, 2*s);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(23*s, 3*s);
            ctx.lineTo(24*s, -2*s);
            ctx.lineTo(20*s, 2*s);
            ctx.closePath();
            ctx.fill();
            // Museau de loup au-dessus du front
            ctx.fillStyle = '#777777';
            ctx.beginPath();
            ctx.arc(16*s, 2*s, 4*s, Math.PI, 0, false);
            ctx.fill();
            // Yeux du loup (petits points)
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(13*s, 2*s, 1*s, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(19*s, 2*s, 1*s, 0, Math.PI * 2);
            ctx.fill();
            // Arc à flèche (à droite)
            ctx.strokeStyle = hex(char.weaponColor);
            ctx.lineWidth = 2*s;
            ctx.beginPath();
            ctx.arc(28*s, 16*s, 10*s, -Math.PI * 0.4, Math.PI * 0.4, false);
            ctx.stroke();
            // Corde de l'arc
            ctx.strokeStyle = '#ccccaa';
            ctx.lineWidth = 1*s;
            ctx.beginPath();
            ctx.moveTo(28*s + 10*s * Math.cos(-Math.PI * 0.4), 16*s + 10*s * Math.sin(-Math.PI * 0.4));
            ctx.lineTo(28*s + 10*s * Math.cos(Math.PI * 0.4), 16*s + 10*s * Math.sin(Math.PI * 0.4));
            ctx.stroke();
            // Flèche
            ctx.fillStyle = hex(char.weaponColor);
            ctx.fillRect(26*s, 15.5*s, 12*s, 1*s);
            // Pointe de flèche
            ctx.fillStyle = '#aaaaaa';
            ctx.beginPath();
            ctx.moveTo(38*s, 16*s);
            ctx.lineTo(36*s, 14*s);
            ctx.lineTo(36*s, 18*s);
            ctx.closePath();
            ctx.fill();
        } else if (char === CHARACTERS[2]) {
            // James: capuche
            ctx.fillStyle = hex(char.bodyColor);
            ctx.beginPath();
            ctx.moveTo(10*s, 8*s);
            ctx.lineTo(16*s, 0);
            ctx.lineTo(22*s, 8*s);
            ctx.fill();
            // Fusil à droite
            // Canon
            ctx.fillStyle = '#555555';
            ctx.fillRect(27*s, 12*s, 3*s, 18*s);
            // Bout du canon
            ctx.fillStyle = '#444444';
            ctx.fillRect(27*s, 10*s, 3*s, 3*s);
            // Crosse
            ctx.fillStyle = '#6b4226';
            ctx.beginPath();
            ctx.moveTo(27*s, 30*s);
            ctx.lineTo(30*s, 30*s);
            ctx.lineTo(32*s, 34*s);
            ctx.lineTo(25*s, 34*s);
            ctx.closePath();
            ctx.fill();
            // Gâchette
            ctx.fillStyle = '#777777';
            ctx.fillRect(28*s, 22*s, 1*s, 3*s);
        } else if (char === CHARACTERS[3]) {
            // Luc: bandana
            ctx.fillStyle = '#cc2222';
            ctx.fillRect(10*s, 3*s, 12*s, 3*s);
            // Noeud du bandana
            ctx.fillRect(22*s, 3*s, 3*s, 2*s);
            ctx.fillRect(24*s, 4*s, 2*s, 3*s);
            // Shotgun à droite (plus large qu'un fusil)
            // Double canon
            ctx.fillStyle = '#555555';
            ctx.fillRect(26*s, 10*s, 2*s, 16*s);
            ctx.fillRect(29*s, 10*s, 2*s, 16*s);
            // Bout des canons
            ctx.fillStyle = '#444444';
            ctx.fillRect(26*s, 8*s, 5*s, 3*s);
            // Pompe
            ctx.fillStyle = '#777777';
            ctx.fillRect(25*s, 18*s, 7*s, 3*s);
            // Crosse en bois
            ctx.fillStyle = '#6b4226';
            ctx.beginPath();
            ctx.moveTo(26*s, 26*s);
            ctx.lineTo(31*s, 26*s);
            ctx.lineTo(33*s, 33*s);
            ctx.lineTo(24*s, 33*s);
            ctx.closePath();
            ctx.fill();
            // Gâchette
            ctx.fillStyle = '#888888';
            ctx.fillRect(28*s, 23*s, 1*s, 3*s);
        }

        canvas.refresh();
    }
}

// ============================================
// SCÈNE TITRE
// ============================================

class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // Musique du menu (mélodie médiévale générée)
        BGMusic.start();

        // Fond avec dégradé simulé (bandes)
        for (let i = 0; i < h; i += 4) {
            const alpha = 0.02 + (i / h) * 0.05;
            this.add.rectangle(w/2, i, w, 4, 0x1a1a2e, alpha);
        }

        // Particules décoratives (cendres qui flottent)
        for (let i = 0; i < 30; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(0, h),
                Phaser.Math.Between(1, 2),
                COLORS.gold, 0.3
            );
            this.tweens.add({
                targets: particle,
                y: particle.y - Phaser.Math.Between(50, 150),
                x: particle.x + Phaser.Math.Between(-30, 30),
                alpha: 0,
                duration: Phaser.Math.Between(3000, 6000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 3000),
            });
        }

        // Ligne décorative haut
        this.add.rectangle(w/2, 120, 300, 1, COLORS.gold, 0.4);
        this.add.rectangle(w/2, 122, 200, 1, COLORS.gold, 0.2);

        // Titre principal
        this.add.text(w/2, 180, 'ELDEN', {
            fontSize: '72px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textGold,
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        this.add.text(w/2, 250, 'KING', {
            fontSize: '48px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textLight,
            stroke: '#000000',
            strokeThickness: 3,
            letterSpacing: 16,
        }).setOrigin(0.5);

        // Ligne décorative bas
        this.add.rectangle(w/2, 290, 300, 1, COLORS.gold, 0.4);
        this.add.rectangle(w/2, 292, 200, 1, COLORS.gold, 0.2);

        // Sous-titre
        this.add.text(w/2, 330, 'Traverse les ténèbres. Conquiers le trône.', {
            fontSize: '14px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textDark,
        }).setOrigin(0.5);

        // Bouton commencer (clignote)
        const startText = this.add.text(w/2, 440, '[ APPUIE SUR ESPACE ]', {
            fontSize: '18px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textGold,
        }).setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1,
        });

        // Version
        this.add.text(w/2, 530, 'v1.0', {
            fontSize: '11px',
            fontFamily: 'monospace',
            color: '#333',
        }).setOrigin(0.5);

        // Input
        this.input.keyboard.on('keydown-SPACE', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('CharSelectScene');
            });
        });

        this.cameras.main.fadeIn(800, 0, 0, 0);
    }
}

// ============================================
// SCÈNE SÉLECTION DE PERSONNAGE
// ============================================

class CharSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharSelectScene' });
    }

    create() {
        const w = this.cameras.main.width;
        this.selected = 0;

        // Titre
        this.add.text(w/2, 50, 'CHOISIS TON CHAMPION', {
            fontSize: '28px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textGold,
            stroke: '#000',
            strokeThickness: 2,
        }).setOrigin(0.5);

        this.add.rectangle(w/2, 75, 250, 1, COLORS.gold, 0.3);

        // Cadres des personnages
        this.frames = [];
        this.nameTexts = [];
        this.descTexts = [];

        this.spacing = 220;
        this.startX = w / 2 - this.spacing * 1.5;

        CHARACTERS.forEach((char, i) => {
            const cx = this.startX + i * this.spacing;
            const cy = 320;

            // Cadre
            const frame = this.add.rectangle(cx, cy, 160, 250, 0x111118, 0.8);
            frame.setStrokeStyle(2, COLORS.locked);
            this.frames.push(frame);

            // Personnage (preview agrandi)
            this.add.image(cx, cy - 30, `char_preview_${i}`);

            // Nom
            const nameText = this.add.text(cx, cy + 80, char.name, {
                fontSize: '20px',
                fontFamily: 'Georgia, serif',
                color: COLORS.textLight,
            }).setOrigin(0.5);
            this.nameTexts.push(nameText);

            // Description
            const descText = this.add.text(cx, cy + 105, char.desc, {
                fontSize: '12px',
                fontFamily: 'Georgia, serif',
                color: COLORS.textDark,
            }).setOrigin(0.5);
            this.descTexts.push(descText);
        });

        // Indicateur de sélection
        this.selectArrow = this.add.text(this.startX, 470, '▲', {
            fontSize: '24px',
            color: COLORS.textGold,
        }).setOrigin(0.5);

        // Instructions
        this.add.text(w/2, 620, '← →  Choisir     ESPACE  Confirmer     ESC  Retour', {
            fontSize: '13px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textDark,
        }).setOrigin(0.5);

        // Mettre à jour visuellement
        this.updateSelection();

        // Input
        this.input.keyboard.on('keydown-LEFT', () => {
            this.selected = (this.selected - 1 + CHARACTERS.length) % CHARACTERS.length;
            this.updateSelection();
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.selected = (this.selected + 1) % CHARACTERS.length;
            this.updateSelection();
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            SAVE.selectedChar = this.selected;
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.time.delayedCall(400, () => {
                this.scene.start('LevelMapScene');
            });
        });
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('TitleScene');
        });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    updateSelection() {
        const startX = this.startX;
        const spacing = this.spacing;

        // Mettre à jour les cadres
        this.frames.forEach((frame, i) => {
            if (i === this.selected) {
                frame.setStrokeStyle(2, COLORS.goldBright);
                frame.setFillStyle(0x1a1a28, 0.9);
            } else {
                frame.setStrokeStyle(2, COLORS.locked);
                frame.setFillStyle(0x111118, 0.8);
            }
        });

        // Noms
        this.nameTexts.forEach((text, i) => {
            text.setColor(i === this.selected ? COLORS.textGold : COLORS.textLight);
        });

        // Flèche
        this.selectArrow.setX(this.startX + this.selected * this.spacing);
    }
}

// ============================================
// SCÈNE CARTE DES NIVEAUX
// ============================================

class LevelMapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelMapScene' });
    }

    drawBackground() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const gfx = this.add.graphics();

        // --- CIEL dégradé (nuit) ---
        const skyColors = [0x0a0a1a, 0x0f1025, 0x151830, 0x1a2040, 0x1e2848];
        skyColors.forEach((color, i) => {
            const bandH = h / skyColors.length;
            gfx.fillStyle(color);
            gfx.fillRect(0, i * bandH, w, bandH + 1);
        });

        // --- ÉTOILES ---
        for (let i = 0; i < 60; i++) {
            const sx = Phaser.Math.Between(0, w);
            const sy = Phaser.Math.Between(10, 200);
            const size = Math.random() < 0.2 ? 2 : 1;
            const star = this.add.circle(sx, sy, size, 0xffffff, Math.random() * 0.5 + 0.2);
            if (Math.random() < 0.3) {
                this.tweens.add({
                    targets: star,
                    alpha: 0.1,
                    duration: Phaser.Math.Between(1500, 3000),
                    yoyo: true,
                    repeat: -1,
                });
            }
        }

        // --- MONTAGNES arrière-plan (lointaines, sombres) ---
        gfx.fillStyle(0x1a1a30);
        gfx.beginPath();
        gfx.moveTo(0, 350);
        gfx.lineTo(80, 180); gfx.lineTo(180, 280);
        gfx.lineTo(300, 140); gfx.lineTo(420, 260);
        gfx.lineTo(520, 160); gfx.lineTo(650, 300);
        gfx.lineTo(780, 120); gfx.lineTo(900, 250);
        gfx.lineTo(1020, 170); gfx.lineTo(1140, 290);
        gfx.lineTo(1280, 200);
        gfx.lineTo(1280, 350); gfx.lineTo(0, 350);
        gfx.closePath(); gfx.fillPath();

        // --- MONTAGNES premier plan (plus claires) ---
        gfx.fillStyle(0x222240);
        gfx.beginPath();
        gfx.moveTo(0, 400);
        gfx.lineTo(100, 280); gfx.lineTo(220, 340);
        gfx.lineTo(380, 240); gfx.lineTo(500, 330);
        gfx.lineTo(640, 260); gfx.lineTo(760, 350);
        gfx.lineTo(880, 270); gfx.lineTo(1000, 340);
        gfx.lineTo(1120, 250); gfx.lineTo(1280, 320);
        gfx.lineTo(1280, 400); gfx.lineTo(0, 400);
        gfx.closePath(); gfx.fillPath();

        // Neige sur les sommets
        gfx.lineStyle(2, 0xccccdd, 0.4);
        gfx.beginPath();
        gfx.moveTo(290, 145); gfx.lineTo(300, 140); gfx.lineTo(310, 148);
        gfx.moveTo(510, 165); gfx.lineTo(520, 160); gfx.lineTo(530, 168);
        gfx.moveTo(770, 125); gfx.lineTo(780, 120); gfx.lineTo(790, 128);
        gfx.moveTo(1010, 175); gfx.lineTo(1020, 170); gfx.lineTo(1030, 178);
        gfx.strokePath();

        // --- COLLINES herbe ---
        gfx.fillStyle(0x1a2a18);
        gfx.beginPath();
        gfx.moveTo(0, 450);
        gfx.lineTo(200, 390); gfx.lineTo(400, 420);
        gfx.lineTo(640, 380); gfx.lineTo(850, 410);
        gfx.lineTo(1050, 370); gfx.lineTo(1280, 400);
        gfx.lineTo(1280, 720); gfx.lineTo(0, 720);
        gfx.closePath(); gfx.fillPath();

        // --- Herbe plus claire par-dessus ---
        gfx.fillStyle(0x1f3320);
        gfx.beginPath();
        gfx.moveTo(0, 500);
        gfx.lineTo(300, 460); gfx.lineTo(600, 480);
        gfx.lineTo(900, 450); gfx.lineTo(1280, 470);
        gfx.lineTo(1280, 720); gfx.lineTo(0, 720);
        gfx.closePath(); gfx.fillPath();

        // --- RIVIÈRE (serpentine bleutée via fillPath) ---
        const riverPoints = [
            -10, 510, 100, 490, 250, 530, 400, 500,
            550, 540, 700, 490, 850, 530, 1000, 500,
            1150, 535, 1290, 510
        ];
        // Eau principale (forme épaisse)
        gfx.fillStyle(0x1a3355, 0.6);
        gfx.beginPath();
        gfx.moveTo(riverPoints[0], riverPoints[1] - 9);
        for (let i = 2; i < riverPoints.length; i += 2) {
            gfx.lineTo(riverPoints[i], riverPoints[i+1] - 9);
        }
        for (let i = riverPoints.length - 2; i >= 0; i -= 2) {
            gfx.lineTo(riverPoints[i], riverPoints[i+1] + 9);
        }
        gfx.closePath();
        gfx.fillPath();
        // Reflet clair au centre
        gfx.lineStyle(4, 0x2a5580, 0.4);
        gfx.beginPath();
        gfx.moveTo(riverPoints[0], riverPoints[1]);
        for (let i = 2; i < riverPoints.length; i += 2) {
            gfx.lineTo(riverPoints[i], riverPoints[i+1]);
        }
        gfx.strokePath();
        // Reflet brillant
        gfx.lineStyle(1, 0x4488bb, 0.3);
        gfx.beginPath();
        gfx.moveTo(riverPoints[0], riverPoints[1] - 3);
        for (let i = 2; i < riverPoints.length; i += 2) {
            gfx.lineTo(riverPoints[i], riverPoints[i+1] - 3);
        }
        gfx.strokePath();

        // --- ARBRES (sapins simples dispersés) ---
        const treePositions = [
            [60, 440], [170, 415], [350, 435], [480, 410],
            [620, 430], [790, 405], [950, 425], [1100, 400],
            [1220, 420], [130, 470], [430, 465], [730, 460],
            [1050, 455], [550, 475], [900, 468],
        ];
        treePositions.forEach(([tx, ty]) => {
            const treeH = Phaser.Math.Between(25, 45);
            // Tronc
            gfx.fillStyle(0x2a1a0a);
            gfx.fillRect(tx - 2, ty, 4, treeH * 0.4);
            // Feuillage (triangle)
            gfx.fillStyle(Phaser.Math.Between(0, 1) ? 0x1a3318 : 0x1f3a1c);
            gfx.fillTriangle(tx, ty - treeH, tx - treeH * 0.4, ty, tx + treeH * 0.4, ty);
        });

        // --- CHÂTEAU au niveau 10 (en haut à droite) ---
        const castleX = 1180;
        const castleY = 500;

        // Tour principale
        gfx.fillStyle(0x2a2a35);
        gfx.fillRect(castleX - 25, castleY - 60, 50, 80);
        // Créneaux tour principale
        for (let i = 0; i < 5; i++) {
            gfx.fillRect(castleX - 25 + i * 12, castleY - 72, 8, 12);
        }

        // Tours latérales
        gfx.fillStyle(0x333345);
        gfx.fillRect(castleX - 50, castleY - 40, 25, 60);
        gfx.fillRect(castleX + 25, castleY - 40, 25, 60);
        // Créneaux tours
        for (let i = 0; i < 3; i++) {
            gfx.fillRect(castleX - 50 + i * 9, castleY - 50, 6, 10);
            gfx.fillRect(castleX + 25 + i * 9, castleY - 50, 6, 10);
        }

        // Porte
        gfx.fillStyle(0x1a1210);
        gfx.fillRect(castleX - 8, castleY + 4, 16, 16);
        // Arc de la porte
        gfx.lineStyle(2, 0x3a3a48);
        gfx.beginPath();
        gfx.arc(castleX, castleY + 4, 8, Math.PI, 0, false);
        gfx.strokePath();

        // Drapeaux
        gfx.fillStyle(0xcc2222);
        gfx.fillTriangle(castleX - 2, castleY - 72, castleX - 2, castleY - 85, castleX + 10, castleY - 78);
        gfx.fillTriangle(castleX - 48, castleY - 50, castleX - 48, castleY - 63, castleX - 36, castleY - 56);
        gfx.fillTriangle(castleX + 48, castleY - 50, castleX + 48, castleY - 63, castleX + 36, castleY - 56);
        // Mâts
        gfx.lineStyle(1, 0x888888);
        gfx.lineBetween(castleX - 2, castleY - 72, castleX - 2, castleY - 86);
        gfx.lineBetween(castleX - 48, castleY - 50, castleX - 48, castleY - 64);
        gfx.lineBetween(castleX + 48, castleY - 50, castleX + 48, castleY - 64);

        // Fenêtres éclairées
        gfx.fillStyle(0xffaa33, 0.6);
        gfx.fillRect(castleX - 12, castleY - 40, 5, 7);
        gfx.fillRect(castleX + 7, castleY - 40, 5, 7);
        gfx.fillRect(castleX - 12, castleY - 20, 5, 7);
        gfx.fillRect(castleX + 7, castleY - 20, 5, 7);

        // Lueur dorée autour du château
        const glow = this.add.circle(castleX, castleY - 20, 70, COLORS.gold, 0.06);
        this.tweens.add({
            targets: glow,
            alpha: 0.02,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 2000,
            yoyo: true,
            repeat: -1,
        });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.selectedLevel = 0;

        // --- BACKGROUND MÉDIÉVAL ---
        this.drawBackground();

        // Titre
        this.add.text(w/2, 35, 'CARTE DU ROYAUME', {
            fontSize: '28px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textGold,
            stroke: '#000',
            strokeThickness: 3,
        }).setOrigin(0.5);
        this.add.rectangle(w/2, 58, 220, 1, COLORS.gold, 0.4);

        // Personnage choisi (petit rappel)
        this.add.image(50, 35, `char_${SAVE.selectedChar}`).setScale(1.2);
        this.add.text(75, 28, CHARACTERS[SAVE.selectedChar].name, {
            fontSize: '12px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textLight,
        });

        // Total de morts (haut droite)
        this.add.text(w - 10, 28, `☠ Total : ${SAVE.totalDeaths()}`, {
            fontSize: '14px',
            fontFamily: 'Georgia, serif',
            color: '#aa4444',
            stroke: '#000',
            strokeThickness: 2,
        }).setOrigin(1, 0);

        // --- NOEUDS DES NIVEAUX ---
        this.levelNodes = [];
        this.levelNames = [];

        const colSpacing = (w - 160) / 3;
        const mapStartX = 80;
        const rowY = [240, 500];

        for (let i = 0; i < 8; i++) {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const cx = mapStartX + col * colSpacing;
            const cy = rowY[row];
            const unlocked = (i + 1) <= SAVE.unlockedLevel;

            // Chemin entre niveaux (sentier)
            if (i < 7) {
                const nextCol = (i + 1) % 4;
                const nextRow = Math.floor((i + 1) / 4);
                const nx = mapStartX + nextCol * colSpacing;
                const ny = rowY[nextRow];
                // Sentier pointillé
                const pathGfx = this.add.graphics();
                pathGfx.lineStyle(3, unlocked ? 0x8a7a50 : 0x333333, unlocked ? 0.5 : 0.15);
                const steps = 20;
                for (let s = 0; s < steps; s += 2) {
                    const t1 = s / steps;
                    const t2 = (s + 1) / steps;
                    const x1 = cx + (nx - cx) * t1;
                    const y1 = cy + (ny - cy) * t1;
                    const x2 = cx + (nx - cx) * t2;
                    const y2 = cy + (ny - cy) * t2;
                    pathGfx.lineBetween(x1, y1, x2, y2);
                }
            }

            // Noeud du niveau
            const nodeGfx = this.add.graphics();
            if (i === 7) {
                // Niveau 8 = icône château spéciale (dernier niveau)
                nodeGfx.fillStyle(unlocked ? 0x3a2a1a : 0x1a1a1a, 0.95);
                nodeGfx.fillRect(cx - 20, cy - 25, 40, 45);
                // Tourelles
                nodeGfx.fillRect(cx - 28, cy - 18, 12, 38);
                nodeGfx.fillRect(cx + 16, cy - 18, 12, 38);
                // Créneaux
                nodeGfx.fillStyle(unlocked ? 0x4a3a2a : 0x222222);
                for (let c = 0; c < 4; c++) {
                    nodeGfx.fillRect(cx - 20 + c * 11, cy - 32, 7, 7);
                }
                nodeGfx.fillRect(cx - 26, cy - 24, 6, 6);
                nodeGfx.fillRect(cx + 20, cy - 24, 6, 6);
                // Porte
                nodeGfx.fillStyle(unlocked ? 0x1a0a00 : 0x111111);
                nodeGfx.fillRect(cx - 6, cy + 8, 12, 12);
                // Bordure dorée
                nodeGfx.lineStyle(2, unlocked ? COLORS.gold : COLORS.locked);
                nodeGfx.strokeRect(cx - 30, cy - 33, 60, 55);
            } else {
                // Noeud cercle normal
                nodeGfx.fillStyle(unlocked ? 0x2a2520 : 0x1a1a1a, 0.9);
                nodeGfx.fillCircle(cx, cy, 32);
                nodeGfx.lineStyle(2, unlocked ? COLORS.gold : COLORS.locked);
                nodeGfx.strokeCircle(cx, cy, 32);
            }

            // Zone cliquable (invisible)
            const hitZone = this.add.circle(cx, cy, 35, 0x000000, 0);
            hitZone.setInteractive({ useHandCursor: unlocked });
            this.levelNodes.push(hitZone);

            hitZone.on('pointerdown', () => {
                this.selectedLevel = i;
                this.updateMapSelection();
                if (unlocked) {
                    this.cameras.main.fadeOut(400, 0, 0, 0);
                    this.time.delayedCall(400, () => {
                        this.scene.start('GameScene', { level: i });
                    });
                }
            });
            if (unlocked) {
                hitZone.on('pointerover', () => {
                    this.selectedLevel = i;
                    this.updateMapSelection();
                });
            }

            // Icône couronne pour le dernier niveau
            if (i === 7) {
                this.add.text(cx, cy - 12, '♛', {
                    fontSize: '22px',
                    color: unlocked ? COLORS.textGold : '#333',
                }).setOrigin(0.5);
            }

            // Cadenas
            if (!unlocked) {
                this.add.text(cx, cy + 14, '🔒', { fontSize: '12px' }).setOrigin(0.5);
            }

            // Nom avec numéro à côté, plus bas pour ne pas être caché
            const label = i < 7 ? `${i + 1}. ${LEVELS[i].name}` : LEVELS[i].name;
            const levelName = this.add.text(cx, cy + 50, label, {
                fontSize: '12px',
                fontFamily: 'Georgia, serif',
                color: unlocked ? COLORS.textLight : '#444',
                stroke: '#000',
                strokeThickness: 2,
            }).setOrigin(0.5);
            this.levelNames.push(levelName);

            // Nombre de morts par niveau
            if (SAVE.deaths[i] > 0) {
                this.add.text(cx, cy + 66, `☠ ${SAVE.deaths[i]}`, {
                    fontSize: '11px',
                    fontFamily: 'Georgia, serif',
                    color: '#aa4444',
                    stroke: '#000',
                    strokeThickness: 2,
                }).setOrigin(0.5);
            }
        }

        // Sous-titre
        this.subtitleText = this.add.text(w/2, 630, '', {
            fontSize: '15px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textDark,
            fontStyle: 'italic',
            stroke: '#000',
            strokeThickness: 2,
        }).setOrigin(0.5);

        // Curseur de sélection
        this.cursor = this.add.circle(0, 0, 38);
        this.cursor.setStrokeStyle(3, COLORS.goldBright);
        this.cursor.setFillStyle(0x000000, 0);

        // Instructions
        this.add.text(w/2, 690, 'CLIC  Jouer     ESC  Retour', {
            fontSize: '13px',
            fontFamily: 'Georgia, serif',
            color: '#666',
            stroke: '#000',
            strokeThickness: 2,
        }).setOrigin(0.5);

        this.updateMapSelection();

        // Input
        this.input.keyboard.on('keydown-LEFT', () => {
            this.selectedLevel = Math.max(0, this.selectedLevel - 1);
            this.updateMapSelection();
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.selectedLevel = Math.min(7, this.selectedLevel + 1);
            this.updateMapSelection();
        });
        this.input.keyboard.on('keydown-UP', () => {
            if (this.selectedLevel >= 4) {
                this.selectedLevel -= 4;
                this.updateMapSelection();
            }
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            if (this.selectedLevel < 4) {
                this.selectedLevel += 4;
                this.updateMapSelection();
            }
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            if ((this.selectedLevel + 1) <= SAVE.unlockedLevel) {
                this.cameras.main.fadeOut(400, 0, 0, 0);
                this.time.delayedCall(400, () => {
                    this.scene.start('GameScene', { level: this.selectedLevel });
                });
            }
        });
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('CharSelectScene');
        });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    updateMapSelection() {
        const w = this.cameras.main.width;
        const colSpacing = (w - 160) / 3;
        const mapStartX = 80;
        const rowY = [240, 500];
        const col = this.selectedLevel % 4;
        const row = Math.floor(this.selectedLevel / 4);
        const cx = mapStartX + col * colSpacing;
        const cy = rowY[row];

        this.cursor.setPosition(cx, cy);

        const unlocked = (this.selectedLevel + 1) <= SAVE.unlockedLevel;
        this.cursor.setStrokeStyle(3, unlocked ? COLORS.goldBright : COLORS.locked);

        const level = LEVELS[this.selectedLevel];
        this.subtitleText.setText(unlocked ? `"${level.subtitle}"` : '???');
    }
}

// ============================================
// SCÈNE DE JEU
// ============================================

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        // Reset du compteur de morts et des messages si on change de niveau
        if (this._lastLevel !== undefined && this._lastLevel !== (data.level || 0)) {
            this._deathCount = 0;
            this._usedMessages = [];
        }
        this._lastLevel = data.level || 0;
        if (this._deathCount === undefined) this._deathCount = 0;
        if (!this._usedMessages) this._usedMessages = [];
        this.currentLevel = data.level || 0;
        this.isDead = false;
        // Démarrer le timer au premier niveau
        SAVE.startTimer();
        this.movingPlatforms = [];
        this.crushingWalls = [];
        this.wallGrid = {};       // Grille des murs indexée par "col,row"
        this.triggers = [];       // Zones de déclenchement de pièges
        this.triggeredTraps = {}; // Pièges déjà déclenchés (évite les doublons)
    }

    create() {
        // Groupes de physique
        this.walls = this.physics.add.staticGroup();
        this.spikes = this.physics.add.staticGroup();
        this.deathZones = this.physics.add.staticGroup();
        this.doors = this.physics.add.staticGroup();
        this.platformGroup = this.physics.add.group({ allowGravity: false, immovable: true });

        // Charger le niveau
        this.loadLevel(LEVELS[this.currentLevel]);

        // Charger les pièges scriptés du niveau
        const level = LEVELS[this.currentLevel];
        if (level.traps) {
            level.traps.forEach(trap => this.setupTrap(trap));
        }

        // Contrôles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        // Collisions
        this.physics.add.collider(this.player, this.walls);
        this.physics.add.collider(this.player, this.platformGroup);
        this.physics.add.overlap(this.player, this.spikes, () => this.die(), null, this);
        this.physics.add.overlap(this.player, this.deathZones, () => this.die(), null, this);
        this.physics.add.overlap(this.player, this.doors, () => this.win(), null, this);

        // UI - Nom du niveau
        // UI fixe à l'écran (ne bouge pas avec la caméra)
        const levelText = this.add.text(640, 80, LEVELS[this.currentLevel].name, {
            fontSize: '22px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textGold,
            stroke: '#000',
            strokeThickness: 3,
        }).setOrigin(0.5).setDepth(10).setScrollFactor(0);

        const subText = this.add.text(640, 108, LEVELS[this.currentLevel].subtitle, {
            fontSize: '13px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textDark,
            fontStyle: 'italic',
        }).setOrigin(0.5).setDepth(10).setScrollFactor(0);

        this.tweens.add({
            targets: [levelText, subText],
            alpha: 0,
            delay: 2000,
            duration: 500,
        });

        // Message spécial pour le dernier niveau
        if (this.currentLevel === LEVELS.length - 1 && this._deathCount === 0) {
            const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.7).setDepth(50).setScrollFactor(0);
            const msg1 = this.add.text(640, 280, 'Trouve la Porte Dorée', {
                fontSize: '32px',
                fontFamily: 'Georgia, serif',
                color: COLORS.textGold,
                stroke: '#000',
                strokeThickness: 4,
            }).setOrigin(0.5).setDepth(51).setScrollFactor(0).setAlpha(0);
            const msg2 = this.add.text(640, 330, 'pour conquérir le trône.', {
                fontSize: '20px',
                fontFamily: 'Georgia, serif',
                color: COLORS.textLight,
                fontStyle: 'italic',
                stroke: '#000',
                strokeThickness: 3,
            }).setOrigin(0.5).setDepth(51).setScrollFactor(0).setAlpha(0);
            const doorPreview = this.add.image(640, 400, 'goldenDoor').setDepth(51).setScrollFactor(0).setAlpha(0).setScale(2);
            const msg3 = this.add.text(640, 470, '[ ESPACE = Commencer ]', {
                fontSize: '16px',
                fontFamily: 'Georgia, serif',
                color: COLORS.textGold,
            }).setOrigin(0.5).setDepth(51).setScrollFactor(0).setAlpha(0);

            this.tweens.add({ targets: msg1, alpha: 1, y: 270, duration: 600, delay: 300, ease: 'Back.easeOut' });
            this.tweens.add({ targets: msg2, alpha: 1, delay: 700, duration: 500 });
            this.tweens.add({ targets: doorPreview, alpha: 1, delay: 1000, duration: 500 });
            this.tweens.add({
                targets: msg3, alpha: 1, delay: 1500, duration: 400,
                onComplete: () => {
                    this.tweens.add({ targets: msg3, alpha: 0.3, duration: 800, yoyo: true, repeat: -1 });
                }
            });

            // Geler le joueur pendant l'intro
            this.isDead = true;
            this.time.delayedCall(1500, () => {
                this.input.keyboard.once('keydown-SPACE', () => {
                    this.tweens.add({
                        targets: [overlay, msg1, msg2, doorPreview, msg3],
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                            overlay.destroy();
                            msg1.destroy();
                            msg2.destroy();
                            doorPreview.destroy();
                            msg3.destroy();
                        }
                    });
                    this.isDead = false;
                });
            });
        }

        // Compteur de morts (haut gauche)
        this.deathText = this.add.text(10, 10, `☠ Morts : ${this._deathCount}`, {
            fontSize: '16px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textLight,
            stroke: '#000',
            strokeThickness: 3,
        }).setDepth(10).setScrollFactor(0);

        // Indicateurs
        this.add.text(10, 695, `Niveau ${this.currentLevel + 1}/10`, {
            fontSize: '13px',
            fontFamily: 'Georgia, serif',
            color: '#555',
        }).setDepth(10).setScrollFactor(0);

        this.add.text(1270, 695, 'ESC = Carte', {
            fontSize: '12px',
            fontFamily: 'Georgia, serif',
            color: '#444',
        }).setOrigin(1, 0).setDepth(10).setScrollFactor(0);

        // Arrêter la musique du menu, lancer celle du jeu (fichier audio)
        BGMusic.stop();
        if (!this.battleMusic) {
            this.battleMusic = this.sound.add('battleTheme', { loop: true, volume: 0.3 });
        }
        if (!this.battleMusic.isPlaying) {
            this.battleMusic.play();
        }

        // ESC pour retour carte
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.battleMusic) this.battleMusic.stop();
            BGMusic.start();
            this.scene.start('LevelMapScene');
        });

        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    loadLevel(level) {
        const ts = CONFIG.tileSize;

        // Calculer la taille du monde en fonction de la carte (prendre la rangée la plus large)
        const mapCols = Math.max(...level.map.map(row => row.length));
        const mapRows = level.map.length;
        this.worldWidth = mapCols * ts;
        this.worldHeight = mapRows * ts;

        // Agrandir le monde physique et la caméra pour les niveaux larges
        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

        for (let row = 0; row < level.map.length; row++) {
            for (let col = 0; col < level.map[row].length; col++) {
                const tile = level.map[row][col];
                const x = col * ts + ts / 2;
                const y = row * ts + ts / 2;

                switch (tile) {
                    case 1: // Mur (pierre médiévale)
                        const wall = this.add.rectangle(x, y, ts, ts, COLORS.stone);
                        wall.setStrokeStyle(1, COLORS.stoneLight);
                        this.walls.add(wall);
                        wall.body.setSize(ts, ts);
                        wall.setOrigin(0.5);
                        this.wallGrid[`${col},${row}`] = wall;
                        break;

                    case 2: // Pics
                        const spike = this.add.polygon(x, y + 8, [
                            0, -16, 12, 16, -12, 16
                        ], COLORS.blood);
                        spike.setStrokeStyle(1, COLORS.bloodBright);
                        this.spikes.add(spike);
                        spike.body.setSize(20, 20);
                        spike.body.setOffset(-10, -10);
                        break;

                    case 3: // Spawn joueur
                        const charKey = `char_${SAVE.selectedChar}`;
                        this.player = this.physics.add.sprite(x, y, charKey);
                        this.player.setSize(26, 30);
                        this.player.setBounce(0);
                        this.player.setCollideWorldBounds(true);
                        // Murs invisibles gauche/droite seulement, pas en bas
                        this.physics.world.setBoundsCollision(true, true, true, false);
                        this.player.setDepth(5);
                        this.facingRight = true;
                        // Caméra suit le joueur (utile pour les niveaux larges)
                        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
                        // Centrer immédiatement la caméra sur le joueur (évite de montrer les zones cachées)
                        this.cameras.main.centerOn(x, y);
                        break;

                    case 4: // Porte
                        // Porte dorée pour le dernier niveau, bois sinon
                        const doorTexture = (this.currentLevel === LEVELS.length - 1) ? 'goldenDoor' : 'woodDoor';
                        this.add.image(x, y + 4, doorTexture);
                        // Hitbox invisible pour la collision
                        const door = this.add.rectangle(x, y, 30, 40, 0x000000, 0);
                        this.doors.add(door);
                        door.body.setSize(30, 40);
                        door.setOrigin(0.5);
                        // Lueur autour de la porte
                        const glow = this.add.circle(x, y, 28, COLORS.goldDark, 0.12);
                        this.tweens.add({
                            targets: glow,
                            alpha: 0.05,
                            scaleX: 1.3,
                            scaleY: 1.3,
                            duration: 1200,
                            yoyo: true,
                            repeat: -1,
                        });
                        break;

                    case 5: // Plateforme mouvante H
                        const platH = this.add.rectangle(x, y, ts * 2, 12, COLORS.goldDark);
                        platH.setStrokeStyle(1, COLORS.gold);
                        this.platformGroup.add(platH);
                        platH.body.setSize(ts * 2, 12);
                        platH.setOrigin(0.5);
                        this.tweens.add({
                            targets: platH,
                            x: x + 100,
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut',
                        });
                        this.movingPlatforms.push(platH);
                        break;

                    case 6: // Plateforme mouvante V
                        const platV = this.add.rectangle(x, y, ts * 2, 12, COLORS.stone);
                        platV.setStrokeStyle(1, COLORS.stoneLight);
                        this.platformGroup.add(platV);
                        platV.body.setSize(ts * 2, 12);
                        platV.setOrigin(0.5);
                        this.tweens.add({
                            targets: platV,
                            y: y - 200,
                            duration: 3000,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut',
                        });
                        this.movingPlatforms.push(platV);
                        break;

                    case 7: // Trou
                        const hole = this.add.rectangle(x, y, ts, ts, 0x000000);
                        this.deathZones.add(hole);
                        hole.body.setSize(ts, ts);
                        hole.setOrigin(0.5);
                        break;

                    case 8: // Mur qui écrase
                        const crusher = this.add.rectangle(x, y, ts, ts * 2, COLORS.blood);
                        crusher.setStrokeStyle(2, COLORS.bloodBright);
                        this.platformGroup.add(crusher);
                        crusher.body.setSize(ts, ts * 2);
                        crusher.setOrigin(0.5);
                        this.tweens.add({
                            targets: crusher,
                            y: y + 180,
                            duration: 1200,
                            hold: 400,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Cubic.easeIn',
                        });
                        this.crushingWalls.push(crusher);
                        break;
                }
            }
        }
    }

    // --- SYSTÈME DE PIÈGES SCRIPTÉS ---

    // Configure un piège défini dans le fichier du niveau
    setupTrap(trap) {
        const ts = CONFIG.tileSize;

        // Plateforme glissante : se déplace quand le joueur atterrit dessus
        if (trap.type === 'sliding_platform') {
            this.spawnSlidingPlatform(trap);
            return;
        }

        // Faux éléments visuels (pas de collision, pas de mort)
        if (trap.type === 'fake_tiles') {
            this.spawnFakeTiles(trap);
            return;
        }

        // Portail : téléporte le joueur à une destination
        if (trap.type === 'portal') {
            this.spawnPortal(trap);
            return;
        }

        // Porte dorée maudite : ressemble à la porte dorée mais relance le niveau
        if (trap.type === 'cursed_golden_door') {
            this.spawnCursedGoldenDoor(trap);
            return;
        }

        // Porte maudite : ressemble à une vraie porte mais relance le niveau (sans mort)
        if (trap.type === 'cursed_door') {
            this.spawnCursedDoor(trap);
            return;
        }

        // Bouton interactif : s'enfonce quand le joueur marche dessus, déclenche une action
        if (trap.type === 'button') {
            this.spawnButton(trap);
            return;
        }

        // Pluie acide : particules qui tombent du ciel et tuent au contact
        if (trap.type === 'acid_rain') {
            this.spawnAcidRain(trap);
            return;
        }

        // Cascade chronométrée : le sol disparaît colonne par colonne après un délai
        if (trap.type === 'timed_cascade_remove') {
            this.spawnTimedCascade(trap);
            return;
        }

        // Pics avec décalage en pixels (positionnement précis)
        if (trap.type === 'offset_spikes') {
            this.spawnOffsetSpikes(trap);
            return;
        }

        // Scie circulaire qui roule sur une plateforme
        if (trap.type === 'saw') {
            this.spawnSaw(trap);
            return;
        }

        // Mur qui se déplace horizontalement
        if (trap.type === 'moving_wall') {
            if (trap.triggerCol !== undefined) {
                // Mur déclenché quand le joueur atteint une colonne
                const triggerX = trap.triggerCol * ts;
                const triggerRow = trap.triggerRow || 0;
                this.triggers.push({
                    id: trap.id,
                    type: 'moving_wall_trigger',
                    x: triggerX,
                    y: triggerRow * ts,
                    w: ts,
                    h: ts,
                    delay: 0,
                    trap: trap,
                });
            } else {
                this.spawnMovingWall(trap);
            }
            return;
        }

        // Fausse porte (tue au contact)
        if (trap.type === 'fake_door') {
            this.spawnFakeDoor(trap);
            return;
        }

        // Porte qui fuit le joueur
        if (trap.type === 'fleeing_door') {
            this.spawnFleeingDoor(trap);
            return;
        }

        // Tapis roulant (pousse le joueur)
        if (trap.type === 'conveyor') {
            this.spawnConveyor(trap);
            return;
        }

        // Pancarte décorative (pas un piège, juste du visuel)
        if (trap.type === 'sign') {
            this.spawnSign(trap);
            return;
        }

        // Piston qui tombe du plafond et remonte en boucle
        if (trap.type === 'piston') {
            if (trap.triggerCol !== undefined) {
                // Piston déclenché quand le joueur atteint une colonne
                const triggerX = trap.triggerCol * ts;
                this.triggers.push({
                    id: trap.id,
                    type: 'piston_trigger',
                    x: triggerX,
                    y: 0,
                    w: ts,
                    h: 9999,
                    delay: trap.delay || 0,
                    trap: trap,
                });
            } else {
                this.spawnPiston(trap);
            }
            return;
        }

        const triggerX = trap.triggerCol * ts;
        const triggerW = (trap.triggerCols || 1) * ts;
        const triggerY = trap.triggerRow * ts;

        this.triggers.push({
            id: trap.id,
            type: trap.type,
            x: triggerX,
            y: triggerY,
            w: triggerW,
            h: ts,
            delay: trap.delay || 0,
            tiles: trap.removeTiles || [],
            spikeTiles: trap.spikeTiles || [],
            ceilingTiles: trap.ceilingTiles || [],
            fallingBlocks: trap.fallingBlocks || [],
            disappearDelay: trap.disappearDelay || 0,
            invisible: trap.invisible || false,
            triggerMaxY: trap.triggerMaxY,
            triggerDirection: trap.triggerDirection,
        });
    }

    // Séquence de rangées qui tombent avec intervalle décroissant et trous prédéfinis
    startFallingRowSequence(action) {
        const baseInterval = action.interval || 3000;
        const intervalDecrease = action.intervalDecrease || 0;
        const startCol = action.startCol || 0;
        const endCol = action.endCol || (LEVELS[this.currentLevel].map[0].length - 1);
        const gapWidth = action.gapWidth || 3;
        const gaps = action.gaps || [6];
        const floorRow = action.floorRow || (LEVELS[this.currentLevel].map.length - 1);
        const speed = action.speed || 500;
        let dropped = 0;

        const dropNext = () => {
            if (this.isDead || dropped >= gaps.length) return;
            const targetRow = floorRow - 1 - dropped;
            this.spawnFallingRow({
                startCol: startCol,
                endCol: endCol,
                gapCol: gaps[dropped],
                gapWidth: gapWidth,
                targetRow: targetRow,
                speed: speed + (dropped * 25),
            });
            dropped++;

            // Planifier la prochaine avec l'intervalle décroissant
            if (dropped < gaps.length) {
                const nextInterval = Math.max(baseInterval - (dropped * intervalDecrease), 500);
                this.time.delayedCall(nextInterval, dropNext);
            }
        };

        // Première rangée immédiate
        dropNext();
    }

    // Rangée piège : un faux trou qui se referme et un vrai trou qui s'ouvre au dernier moment
    spawnFallingRowTrick(action) {
        const ts = CONFIG.tileSize;
        const startCol = action.startCol || 0;
        const endCol = action.endCol || (LEVELS[this.currentLevel].map[0].length - 1);
        const fakeGapCol = action.fakeGapCol;   // le trou visible (piège)
        const realGapCol = action.realGapCol;   // le vrai trou (apparaît au dernier moment)
        const gapWidth = action.gapWidth || 3;
        const speed = action.speed || 400;
        const targetRow = action.targetRow;
        const targetY = targetRow * ts + ts / 2;
        const switchRowsBefore = action.switchRowsBefore || 2;
        const switchY = targetY - (switchRowsBefore * ts);

        const normalBlocks = [];   // blocs normaux (hors des deux trous)
        const realGapBlocks = [];  // blocs qui seront détruits (vrai trou)
        let switched = false;

        for (let col = startCol; col <= endCol; col++) {
            // Le faux trou — pas de bloc au début (le joueur se place ici)
            if (col >= fakeGapCol && col < fakeGapCol + gapWidth) continue;

            const x = col * ts + ts / 2;
            const block = this.add.rectangle(x, -ts, ts, ts, COLORS.stone);
            block.setStrokeStyle(1, COLORS.stoneLight);
            this.physics.add.existing(block);
            block.body.setAllowGravity(false);
            block.body.setVelocityY(speed);
            block.body.setBounce(0);
            block._col = col;
            block._isFalling = true;

            // Le bloc tue le joueur pendant qu'il tombe
            this.physics.add.overlap(this.player, block, () => {
                if (block._isFalling) this.die();
            }, null, this);

            // Séparer les blocs du vrai trou des autres
            if (col >= realGapCol && col < realGapCol + gapWidth) {
                realGapBlocks.push(block);
            } else {
                normalBlocks.push(block);
            }
        }

        const allBlocks = [...normalBlocks, ...realGapBlocks];

        // Vérifier chaque frame
        this.time.addEvent({
            delay: 16,
            loop: true,
            callback: () => {
                if (allBlocks.length === 0) return;
                const refBlock = normalBlocks[0];
                if (!refBlock || !refBlock.body) return;

                // Switch : quand les blocs arrivent à 2 rangées du sol
                if (!switched && refBlock.y >= switchY) {
                    switched = true;

                    // Détruire les blocs du vrai trou (ouvrir le passage)
                    realGapBlocks.forEach(b => {
                        b.destroy();
                    });

                    // Remplir le faux trou (fermer le piège)
                    for (let col = fakeGapCol; col < fakeGapCol + gapWidth; col++) {
                        const x = col * ts + ts / 2;
                        const fillBlock = this.add.rectangle(x, refBlock.y, ts, ts, COLORS.stone);
                        fillBlock.setStrokeStyle(1, COLORS.stoneLight);
                        this.physics.add.existing(fillBlock);
                        fillBlock.body.setAllowGravity(false);
                        fillBlock.body.setVelocityY(speed);
                        fillBlock.body.setBounce(0);
                        fillBlock._col = col;
                        fillBlock._isFalling = true;

                        this.physics.add.overlap(this.player, fillBlock, () => {
                            if (fillBlock._isFalling) this.die();
                        }, null, this);

                        normalBlocks.push(fillBlock);
                    }
                }

                // Atterrissage : quand les blocs atteignent la cible
                normalBlocks.forEach(b => {
                    if (!b._isFalling || !b.body) return;
                    if (b.y >= targetY) {
                        b._isFalling = false;
                        b.body.setVelocity(0);
                        b.body.setImmovable(true);
                        b.y = targetY;
                        b.body.position.y = targetY - ts / 2;
                        this.physics.add.collider(this.player, b);
                        this.wallGrid[`${b._col},${targetRow}`] = b;
                    }
                });
            }
        });
    }

    // Rangée de blocs qui tombe du ciel jusqu'à un étage cible
    spawnFallingRow(action) {
        const ts = CONFIG.tileSize;
        const startCol = action.startCol || 0;
        const endCol = action.endCol || (LEVELS[this.currentLevel].map[0].length - 1);
        const gapCol = action.gapCol;
        const gapWidth = action.gapWidth || 3;
        const speed = action.speed || 500;
        const targetRow = action.targetRow;
        const targetY = targetRow * ts + ts / 2;

        for (let col = startCol; col <= endCol; col++) {
            // Laisser le trou
            if (col >= gapCol && col < gapCol + gapWidth) continue;

            const x = col * ts + ts / 2;
            const startY = -ts;

            // Bloc qui descend à vitesse constante (pas de gravité)
            const block = this.add.rectangle(x, startY, ts, ts, COLORS.stone);
            block.setStrokeStyle(1, COLORS.stoneLight);
            this.physics.add.existing(block);
            block.body.setAllowGravity(false);
            block.body.setVelocityY(speed);
            block.body.setBounce(0);
            let isFalling = true;

            // Le bloc tue le joueur pendant qu'il tombe
            this.physics.add.overlap(this.player, block, () => {
                if (isFalling) this.die();
            }, null, this);

            // Vérifier chaque frame si le bloc a atteint sa cible
            this.time.addEvent({
                delay: 16,
                loop: true,
                callback: () => {
                    if (!isFalling || !block.body) return;
                    if (block.y >= targetY) {
                        isFalling = false;
                        // Fixer le bloc à sa position cible
                        block.body.setVelocity(0);
                        block.body.setImmovable(true);
                        block.y = targetY;
                        block.body.position.y = targetY - ts / 2;
                        // Le joueur peut marcher dessus
                        this.physics.add.collider(this.player, block);
                        this.wallGrid[`${col},${targetRow}`] = block;
                    }
                }
            });
        }
    }

    // Bouton interactif : s'enfonce quand le joueur marche dessus
    spawnButton(trap) {
        const ts = CONFIG.tileSize;
        const x = trap.col * ts + ts / 2;
        const floorY = trap.row * ts;  // haut de la tuile sol
        const btnWidth = ts * 0.6;
        const btnHeight = ts * 0.25;
        const pressedHeight = ts * 0.1;
        const color = trap.color || 0xcc3333;

        // Socle (partie fixe sous le bouton)
        const base = this.add.rectangle(x, floorY - 2, btnWidth + 4, 6, 0x555555);
        base.setDepth(2);

        // Bouton (partie qui s'enfonce)
        const btn = this.add.rectangle(x, floorY - btnHeight / 2 - 4, btnWidth, btnHeight, color);
        btn.setStrokeStyle(1, 0xffffff, 0.3);
        btn.setDepth(3);

        // Zone de détection (le joueur doit être au-dessus du bouton)
        const hitZone = this.add.rectangle(x, floorY - btnHeight - 4, btnWidth + 10, ts * 0.5, 0x000000, 0);
        this.physics.add.existing(hitZone, true);

        let pressed = false;

        this.physics.add.overlap(this.player, hitZone, () => {
            if (pressed || this.isDead) return;
            // Le joueur doit être au sol (pas en l'air)
            const onFloor = this.player.body.blocked.down || this.player.body.touching.down;
            if (!onFloor) return;

            pressed = true;

            // Animation : le bouton s'enfonce
            this.tweens.add({
                targets: btn,
                scaleY: pressedHeight / btnHeight,
                y: floorY - pressedHeight / 2 - 4,
                duration: 150,
                ease: 'Cubic.easeIn',
            });

            // Changement de couleur (gris = activé)
            this.time.delayedCall(150, () => {
                btn.setFillStyle(0x666666);
            });

            // Déclencher les actions du bouton
            if (trap.actions) {
                this.time.delayedCall(trap.actionDelay || 300, () => {
                    trap.actions.forEach(action => {
                        const actionDelay = action.delay || 0;
                        this.time.delayedCall(actionDelay, () => {
                            if (action.type === 'remove') {
                                action.tiles.forEach(t => this.removeSingleTile(t.col, t.row));
                            }
                            if (action.type === 'remove_column') {
                                action.tiles.forEach(t => this.removeTile(t.col, t.row));
                            }
                            if (action.type === 'falling_row') {
                                this.spawnFallingRow(action);
                            }
                            if (action.type === 'falling_row_sequence') {
                                this.startFallingRowSequence(action);
                            }
                            if (action.type === 'falling_row_trick') {
                                this.spawnFallingRowTrick(action);
                            }
                        });
                    });
                });
            }
        }, null, this);

        // Stocker la référence du bouton pour usage futur
        if (!this.buttons) this.buttons = {};
        this.buttons[trap.id] = { btn, base, hitZone, pressed: () => pressed };
    }

    // Pluie acide : particules qui tombent du ciel, passent à travers tout, tuent au contact
    spawnAcidRain(trap) {
        const startDelay = trap.startDelay || 0;
        const spawnInterval = trap.interval || 300;
        const speed = trap.speed || 400;
        const dropSize = trap.size || 4;
        const color = trap.color || 0x44ff44;
        const startCol = trap.startCol || 0;
        const endCol = trap.endCol || (LEVELS[this.currentLevel].map[0].length - 1);
        const ts = CONFIG.tileSize;
        const minX = startCol * ts;
        const maxX = (endCol + 1) * ts;

        this.time.delayedCall(startDelay, () => {
            this.time.addEvent({
                delay: spawnInterval,
                loop: true,
                callback: () => {
                    if (this.isDead) return;

                    // Position X aléatoire dans la zone
                    const x = Phaser.Math.Between(minX, maxX);

                    // Créer la goutte
                    const drop = this.add.circle(x, -10, dropSize, color, 0.8);
                    drop.setDepth(10);
                    this.physics.add.existing(drop);
                    drop.body.setAllowGravity(false);
                    drop.body.setVelocityY(speed);
                    drop.body.setCircle(dropSize);

                    // Pas de collision avec les murs (passe à travers tout)

                    // Tue le joueur au contact
                    this.physics.add.overlap(this.player, drop, () => {
                        this.die();
                    }, null, this);

                    // Détruire quand hors écran
                    this.time.delayedCall(8000, () => {
                        if (drop) drop.destroy();
                    });
                }
            });
        });
    }

    // Plateforme glissante : blocs qui se déplacent quand le joueur est dessus
    spawnSlidingPlatform(trap) {
        const ts = CONFIG.tileSize;
        const width = trap.width || 3;
        const startX = trap.startCol * ts + (width * ts) / 2;
        const destX = trap.destCol * ts + (width * ts) / 2;
        const y = trap.row * ts + ts / 2;
        const speed = trap.speed || 600;

        // Créer la plateforme (groupe de blocs visuels)
        const platform = this.add.rectangle(startX, y, width * ts, ts, COLORS.stone);
        platform.setStrokeStyle(1, COLORS.stoneLight);
        this.physics.add.existing(platform);
        platform.body.setImmovable(true);
        platform.body.setAllowGravity(false);

        // Le joueur peut marcher dessus
        this.physics.add.collider(this.player, platform);

        let sliding = false;

        // Vérifier si le joueur est dessus
        this.time.addEvent({
            delay: 16,
            loop: true,
            callback: () => {
                if (sliding || this.isDead || !this.player) return;
                // Le joueur est sur la plateforme
                const onPlatform = this.player.body.blocked.down &&
                    this.player.x >= platform.x - (width * ts) / 2 - 5 &&
                    this.player.x <= platform.x + (width * ts) / 2 + 5 &&
                    Math.abs(this.player.y + this.player.body.height / 2 - (platform.y - ts / 2)) < 5;

                if (onPlatform) {
                    sliding = true;
                    let lastX = platform.x;
                    // Glisser vers la destination
                    this.tweens.add({
                        targets: platform,
                        x: destX,
                        duration: Math.abs(startX - destX) / speed * 1000,
                        ease: 'Sine.easeInOut',
                        onUpdate: () => {
                            platform.body.position.x = platform.x - (width * ts) / 2;
                            // Déplacer le joueur avec la plateforme
                            if (this.player && !this.isDead) {
                                const deltaX = platform.x - lastX;
                                this.player.x += deltaX;
                            }
                            lastX = platform.x;
                        },
                    });
                }
            }
        });
    }

    // Faux éléments visuels : murs et pics décoratifs sans collision
    spawnFakeTiles(trap) {
        const ts = CONFIG.tileSize;
        (trap.walls || []).forEach(t => {
            const x = t.col * ts + ts / 2;
            const y = t.row * ts + ts / 2;
            const wall = this.add.rectangle(x, y, ts, ts, COLORS.stone);
            wall.setStrokeStyle(1, COLORS.stoneLight);
        });
        (trap.spikes || []).forEach(t => {
            const x = t.col * ts + ts / 2 + (t.offsetX || 0);
            const y = t.row * ts + ts / 2 + (t.offsetY || 0);
            const spike = this.add.polygon(x, y, [
                0, -16, 12, 16, -12, 16
            ], COLORS.blood);
            spike.setStrokeStyle(1, COLORS.bloodBright);
        });
    }

    // Portail : téléporte le joueur à une destination
    spawnPortal(trap) {
        const ts = CONFIG.tileSize;
        const x = trap.col * ts + ts / 2;
        const y = (trap.row || 18) * ts + ts / 2;
        const color = trap.color || 0x9944ff;
        const destCol = trap.destCol;
        const destRow = trap.destRow;

        // Visuel : ovale lumineux
        const glow = this.add.ellipse(x, y, 28, 40, color, 0.15);
        glow.setDepth(2);
        this.tweens.add({
            targets: glow,
            scaleX: 1.3,
            scaleY: 1.1,
            alpha: 0.08,
            duration: 1000,
            yoyo: true,
            repeat: -1,
        });

        const ring = this.add.ellipse(x, y, 24, 36, color, 0.4);
        ring.setStrokeStyle(2, color, 0.8);
        ring.setFillStyle(color, 0.1);
        ring.setDepth(3);
        this.tweens.add({
            targets: ring,
            angle: 360,
            duration: 4000,
            repeat: -1,
        });

        // Petites particules qui tourbillonnent
        for (let i = 0; i < 4; i++) {
            const p = this.add.circle(x, y, 2, color, 0.7);
            p.setDepth(3);
            this.tweens.add({
                targets: p,
                x: x + Math.cos(i * Math.PI / 2) * 14,
                y: y + Math.sin(i * Math.PI / 2) * 20,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                delay: i * 375,
            });
        }

        // Hitbox
        const hitZone = this.add.rectangle(x, y, 24, 36, 0x000000, 0);
        this.physics.add.existing(hitZone, true);

        let cooldown = false;

        this.physics.add.overlap(this.player, hitZone, () => {
            if (this.isDead || cooldown) return;
            cooldown = true;

            // Flash de téléportation
            this.cameras.main.flash(300, 100, 50, 180);

            // Téléporter le joueur
            const newX = destCol * ts + ts / 2;
            const newY = destRow * ts + ts / 2;
            this.player.setPosition(newX, newY);
            this.player.body.setVelocity(0);

            // Cooldown pour éviter la boucle infinie entre 2 portails proches
            this.time.delayedCall(500, () => {
                cooldown = false;
            });
        }, null, this);
    }

    // Porte dorée maudite : même visuel que la porte dorée, mais relance le niveau
    spawnCursedGoldenDoor(trap) {
        const ts = CONFIG.tileSize;
        const x = trap.col * ts + ts / 2;
        const y = (trap.row || 16) * ts + ts / 2;

        const doorImg = this.add.image(x, y - 3, 'goldenDoor');
        const glow = this.add.circle(x, y, 32, 0xddaa22, 0.15);
        this.tweens.add({
            targets: glow,
            alpha: 0.05,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 1000,
            yoyo: true,
            repeat: -1,
        });

        const hitZone = this.add.rectangle(x, y, 30, 40, 0x000000, 0);
        this.physics.add.existing(hitZone, true);

        this.physics.add.overlap(this.player, hitZone, () => {
            if (this.isDead) return;
            this.isDead = true;

            // Message "Porte Maudite"
            const cursedText = this.add.text(640, 340, 'Porte Maudite...', {
                fontSize: '28px',
                fontFamily: 'Georgia, serif',
                color: '#ffaa00',
                fontStyle: 'italic',
                stroke: '#000',
                strokeThickness: 4,
            }).setOrigin(0.5).setDepth(50).setScrollFactor(0).setAlpha(0);

            this.tweens.add({
                targets: cursedText,
                alpha: 1,
                y: 320,
                duration: 300,
                ease: 'Back.easeOut',
            });

            this.cameras.main.flash(300, 80, 50, 0);
            this.time.delayedCall(1200, () => {
                this.cameras.main.fadeOut(200, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.scene.start('GameScene', { level: this.currentLevel });
                });
            });
        }, null, this);
    }

    // Porte maudite : identique visuellement à la vraie porte, mais relance le niveau sans compter de mort
    spawnCursedDoor(trap) {
        const ts = CONFIG.tileSize;
        const x = trap.col * ts + ts / 2;
        const y = (trap.row || 16) * ts + ts / 2;

        // Visuel identique à la vraie porte
        const doorImg = this.add.image(x, y - 3, 'woodDoor');
        const glow = this.add.circle(x, y, 28, COLORS.goldDark, 0.12);
        this.tweens.add({
            targets: glow,
            alpha: 0.05,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 1200,
            yoyo: true,
            repeat: -1,
        });

        // Hitbox invisible
        const hitZone = this.add.rectangle(x, y, 30, 40, 0x000000, 0);
        this.physics.add.existing(hitZone, true);

        this.physics.add.overlap(this.player, hitZone, () => {
            if (this.isDead) return;
            this.isDead = true; // empêche les triggers multiples

            // Transition rapide et discrète — le joueur ne doit pas comprendre tout de suite
            this.cameras.main.fadeOut(200, 0, 0, 0);

            // Relance le même niveau après un court délai (sans compter de mort)
            this.time.delayedCall(300, () => {
                this.scene.start('GameScene', { level: this.currentLevel });
            });
        }, null, this);
    }

    // Cascade chronométrée : supprime le sol colonne par colonne après un délai initial
    spawnTimedCascade(trap) {
        const startDelay = trap.startDelay || 2000;
        const interval = trap.interval || 200;
        const tiles = trap.tiles || [];

        this.time.delayedCall(startDelay, () => {
            tiles.forEach((t, i) => {
                this.time.delayedCall(i * interval, () => {
                    this.removeSingleTile(t.col, t.row);
                });
            });
        });
    }

    // Supprime une seule tuile (sans affecter celles en dessous)
    removeSingleTile(col, row) {
        const key = `${col},${row}`;
        const wall = this.wallGrid[key];
        if (!wall) return;

        this.tweens.add({
            targets: wall,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => {
                this.walls.remove(wall, true, true);
            }
        });

        delete this.wallGrid[key];
    }

    // Crée un mur qui se déplace horizontalement et tue au contact
    spawnMovingWall(trap) {
        const ts = CONFIG.tileSize;
        const startX = trap.startCol * ts + ts / 2;
        const endX = trap.endCol * ts + ts / 2;
        const y = trap.row * ts;
        const height = ts * (trap.height || 2);
        const speed = trap.speed || 150;
        const oneWay = trap.oneWay || false;
        const direction = trap.direction || 'left';
        const vx = direction === 'left' ? -speed : speed;

        // Bloc même couleur que les murs
        const wall = this.add.rectangle(startX, y - height / 2, ts, height, COLORS.stone);
        wall.setStrokeStyle(1, COLORS.stoneLight);
        this.physics.add.existing(wall);
        wall.body.setImmovable(true);
        wall.body.setAllowGravity(false);
        wall.body.setVelocityX(vx);

        // Le bloc tue le joueur au contact
        this.physics.add.overlap(this.player, wall, () => this.die(), null, this);

        if (!oneWay) {
            // Faire rebondir entre startX et endX
            this.time.addEvent({
                delay: 16,
                loop: true,
                callback: () => {
                    if (wall.x <= Math.min(startX, endX)) {
                        wall.body.setVelocityX(speed);
                    } else if (wall.x >= Math.max(startX, endX)) {
                        wall.body.setVelocityX(-speed);
                    }
                }
            });
        } else {
            // One way : détruire quand sorti de l'écran
            this.time.addEvent({
                delay: 16,
                loop: true,
                callback: () => {
                    if (wall.x < -ts || wall.x > this.worldWidth + ts) {
                        wall.destroy();
                    }
                }
            });
        }
    }

    // Piston : bloc qui descend du plafond et remonte en boucle
    spawnPiston(trap) {
        const ts = CONFIG.tileSize;
        const x = trap.col * ts + ts / 2;
        const restOffset = trap.restOffset || 1.5;  // combien de blocs sous le plafond au repos
        const topY = trap.ceilingRow * ts + ts / 2 + ts * restOffset;
        const bottomY = (trap.floorRow || 11) * ts + ts / 2;
        const width = ts * (trap.width || 1);
        const height = ts * (trap.height || 2);
        const downSpeed = trap.downSpeed || 800;
        const upSpeed = trap.upSpeed || 400;
        const holdDown = trap.holdDown || 300;
        const holdUp = trap.holdUp || 500;

        // Bloc du piston (même couleur que le plafond/murs)
        const piston = this.add.rectangle(x, topY, width, height, COLORS.stone);
        piston.setStrokeStyle(1, COLORS.stoneLight);

        // Overlap pour tuer le joueur
        this.physics.add.existing(piston, true); // static body
        this.physics.add.overlap(this.player, piston, () => this.die(), null, this);

        // Animation piston en boucle
        const animatePiston = () => {
            // Descendre
            this.tweens.add({
                targets: piston,
                y: bottomY,
                duration: downSpeed,
                ease: 'Cubic.easeIn',
                onUpdate: () => {
                    // Sync le body avec la position visuelle
                    piston.body.position.x = piston.x - width / 2;
                    piston.body.position.y = piston.y - height / 2;
                },
                onComplete: () => {
                    // Attendre en bas
                    this.time.delayedCall(holdDown, () => {
                        // Remonter
                        this.tweens.add({
                            targets: piston,
                            y: topY,
                            duration: upSpeed,
                            ease: 'Cubic.easeOut',
                            onUpdate: () => {
                                piston.body.position.x = piston.x - width / 2;
                                piston.body.position.y = piston.y - height / 2;
                            },
                            onComplete: () => {
                                // Attendre en haut puis recommencer
                                this.time.delayedCall(holdUp, () => {
                                    animatePiston();
                                });
                            }
                        });
                    });
                }
            });
        };

        // Délai initial avant de commencer
        this.time.delayedCall(trap.delay || 0, () => {
            animatePiston();
        });
    }

    // Fausse porte — ressemble à la vraie mais tue au contact
    spawnFakeDoor(trap) {
        const ts = CONFIG.tileSize;
        const x = trap.col * ts + ts / 2;
        const y = (trap.row || 11) * ts + ts / 2 + 4 + (trap.offsetY || 0);

        // Visuel identique à la vraie porte
        this.add.image(x, y, 'woodDoor');
        const glow = this.add.circle(x, y - 4, 28, COLORS.goldDark, 0.12);
        this.tweens.add({
            targets: glow,
            alpha: 0.05,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 1200,
            yoyo: true,
            repeat: -1,
        });

        // Zone de mort invisible
        const killZone = this.add.rectangle(x, y, 30, 40, 0x000000, 0);
        this.physics.add.existing(killZone, true);
        this.physics.add.overlap(this.player, killZone, () => this.die(), null, this);
    }

    // Porte qui fuit le joueur — se déplace quand le joueur s'approche
    spawnFleeingDoor(trap) {
        const ts = CONFIG.tileSize;
        const x = trap.col * ts + ts / 2;
        const y = (trap.row || 11) * ts + ts / 2 + 4 + (trap.offsetY || 0);
        const fleeDistance = trap.fleeDistance || 5; // distance en tuiles avant de fuir
        const fleeTo = trap.fleeTo || { col: trap.col + 10, row: trap.row || 11 };

        // Visuel de la porte
        const doorImg = this.add.image(x, y, 'woodDoor');
        const glowDoor = this.add.circle(x, y - 4, 28, COLORS.goldDark, 0.12);
        this.tweens.add({
            targets: glowDoor,
            alpha: 0.05,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 1200,
            yoyo: true,
            repeat: -1,
        });

        // Hitbox de la porte (vraie porte qui complète le niveau)
        const doorHit = this.add.rectangle(x, y, 30, 40, 0x000000, 0);
        this.doors.add(doorHit);
        doorHit.body.setSize(30, 40);
        doorHit.setOrigin(0.5);

        // Séquence de fuites : la première + les suivantes
        const fleeSequence = [
            { col: fleeTo.col, row: fleeTo.row || 11, distance: fleeDistance },
            ...(trap.fleeSequence || []),
        ];
        let fleeIndex = 0;

        this.time.addEvent({
            delay: 16,
            loop: true,
            callback: () => {
                if (!this.player) return;

                // Toujours synchroniser le body statique avec la position visuelle
                doorHit.body.position.x = doorHit.x - 15;
                doorHit.body.position.y = doorHit.y - 20;

                // Détection manuelle : si le joueur touche la porte → victoire
                if (!this.isDead) {
                    const dx = Math.abs(this.player.x - doorHit.x);
                    const dy = Math.abs(this.player.y - doorHit.y);
                    if (dx < 20 && dy < 25) {
                        this.win();
                        return;
                    }
                }

                if (fleeIndex >= fleeSequence.length) return;
                const current = fleeSequence[fleeIndex];
                const distX = Math.abs(this.player.x - doorImg.x) / ts;
                const distY = Math.abs(this.player.y - doorImg.y) / ts;
                const dist = Math.sqrt(distX * distX + distY * distY);

                if (dist < (current.distance || fleeDistance)) {
                    const newX = current.col * ts + ts / 2;
                    const newY = (current.row || 11) * ts + ts / 2 + 4 + (trap.offsetY || 0);
                    fleeIndex++;

                    this.tweens.add({
                        targets: [doorImg, glowDoor, doorHit],
                        x: newX,
                        y: newY,
                        duration: 300,
                        ease: 'Back.easeIn',
                    });
                }
            }
        });
    }

    // Tapis roulant — pousse le joueur dans une direction
    spawnConveyor(trap) {
        const ts = CONFIG.tileSize;
        const startCol = trap.startCol;
        const endCol = trap.endCol;
        const row = trap.row || 12;
        const pushSpeed = trap.pushSpeed || 100;
        const direction = trap.direction || 'right';
        const hidden = trap.hidden || false;

        // Stocker les murs et flèches pour les révéler plus tard
        const walls = [];
        const arrows = [];

        for (let col = startCol; col <= endCol; col++) {
            const x = col * ts + ts / 2;
            const y = row * ts + ts / 2;
            const key = `${col},${row}`;
            const existingWall = this.wallGrid[key];

            if (!hidden) {
                // Mode visible : couleur différente + flèches
                if (existingWall) {
                    existingWall.setFillStyle(0x3a3a50);
                    existingWall.setStrokeStyle(1, 0x4a4a60);
                }
                const arrow = this.add.text(x, y, direction === 'right' ? '►' : '◄', {
                    fontSize: '14px',
                    color: '#5555aa',
                }).setOrigin(0.5).setAlpha(0.4);
                this.tweens.add({
                    targets: arrow,
                    x: arrow.x + (direction === 'right' ? 15 : -15),
                    alpha: 0,
                    duration: 800,
                    repeat: -1,
                });
            } else {
                // Mode caché : garder la même couleur, stocker pour révéler plus tard
                if (existingWall) walls.push(existingWall);
            }
        }

        // Zone de détection pour pousser le joueur
        const zoneX = startCol * ts;
        const zoneW = (endCol - startCol + 1) * ts;
        const zoneY = (row - 1) * ts;
        let revealed = false;

        this.time.addEvent({
            delay: 16,
            loop: true,
            callback: () => {
                if (!this.player || this.isDead) return;
                const px = this.player.x;
                const py = this.player.y;
                const onFloor = this.player.body.blocked.down || this.player.body.touching.down;

                if (onFloor && px >= zoneX && px <= zoneX + zoneW && py >= zoneY && py <= zoneY + ts * 2) {
                    // Révéler le tapis quand le joueur marche dessus
                    if (hidden && !revealed) {
                        revealed = true;
                        walls.forEach(w => {
                            w.setFillStyle(0x3a3a50);
                            w.setStrokeStyle(1, 0x4a4a60);
                        });
                    }
                    const push = direction === 'right' ? pushSpeed : -pushSpeed;
                    this.player.setVelocityX(this.player.body.velocity.x + push * 0.05);
                }
            }
        });
    }

    // Pancarte en bois avec texte
    spawnSign(trap) {
        const ts = CONFIG.tileSize;
        const x = trap.col * ts + ts / 2;
        const y = (trap.row || 11) * ts + (trap.offsetY || 0);

        // Poteau
        this.add.rectangle(x, y - 10, 4, 30, 0x5a3a1a);

        // Panneau en bois
        const panelW = ts * (trap.width || 2);
        const panel = this.add.rectangle(x, y - 30, panelW, 24, 0x6b4226);
        panel.setStrokeStyle(1, 0x8b5a2b);

        // Texte sur le panneau
        this.add.text(x, y - 30, trap.text || '!', {
            fontSize: trap.fontSize || '11px',
            fontFamily: 'Georgia, serif',
            color: '#ddd',
            stroke: '#000',
            strokeThickness: 1,
        }).setOrigin(0.5);
    }

    // Pics avec décalage en pixels pour positionnement précis
    spawnOffsetSpikes(trap) {
        const ts = CONFIG.tileSize;
        trap.spikes.forEach(s => {
            const x = s.col * ts + ts / 2 + (s.offsetX || 0);
            const y = s.row * ts + ts / 2 + (s.offsetY || 0);
            const spike = this.add.polygon(x, y, [
                0, -16, 12, 16, -12, 16
            ], COLORS.blood);
            spike.setStrokeStyle(1, COLORS.bloodBright);
            this.spikes.add(spike);
            spike.body.setSize(20, 20);
            spike.body.setOffset(-10, -10);
        });
    }

    // Scie circulaire qui roule sur une plateforme
    spawnSaw(trap) {
        const ts = CONFIG.tileSize;
        const startX = trap.startCol * ts + ts / 2;
        const endX = trap.endCol * ts + ts / 2;
        const y = trap.row * ts;
        const radius = trap.radius || 12;
        const speed = trap.speed || 60;

        // Créer la texture de scie (une seule fois)
        if (!this.textures.exists('sawBlade')) {
            const size = 32;
            const canvas = this.textures.createCanvas('sawBlade', size, size);
            const ctx = canvas.getContext();
            const cx = size / 2, cy = size / 2, r = size / 2 - 2;
            const teeth = 10;

            // Lame avec dents
            ctx.fillStyle = '#aaa';
            ctx.beginPath();
            for (let i = 0; i < teeth * 2; i++) {
                const angle = (i / (teeth * 2)) * Math.PI * 2;
                const dist = i % 2 === 0 ? r : r * 0.7;
                const px = cx + Math.cos(angle) * dist;
                const py = cy + Math.sin(angle) * dist;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();

            // Cercle intérieur
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
            ctx.stroke();

            // Trou central
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, Math.PI * 2);
            ctx.fill();

            canvas.refresh();
        }

        // Sprite de la scie
        const saw = this.physics.add.sprite(startX, y - radius, 'sawBlade');
        saw.setScale(radius * 2 / 32);
        saw.body.setCircle(16);
        saw.body.setImmovable(true);
        saw.body.setAllowGravity(false);
        saw.body.setVelocityX(speed);

        // Rotation continue
        this.tweens.add({
            targets: saw,
            angle: 360,
            duration: 600,
            repeat: -1,
        });

        // Tue au contact
        this.physics.add.overlap(this.player, saw, () => this.die(), null, this);

        // Va-et-vient entre startCol et endCol
        this.time.addEvent({
            delay: 16,
            loop: true,
            callback: () => {
                if (saw.x <= Math.min(startX, endX)) {
                    saw.body.setVelocityX(speed);
                } else if (saw.x >= Math.max(startX, endX)) {
                    saw.body.setVelocityX(-speed);
                }
            }
        });
    }

    // Supprime une colonne entière de murs (de row jusqu'en bas) pour créer un trou vers le vide
    removeTile(col, row) {
        const totalRows = LEVELS[this.currentLevel].map.length;
        for (let r = row; r < totalRows; r++) {
            const key = `${col},${r}`;
            const wall = this.wallGrid[key];
            if (!wall) continue;

            // Animation de disparition (léger délai par rangée pour l'effet cascade)
            const delay = (r - row) * 50;
            this.tweens.add({
                targets: wall,
                alpha: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                delay: delay,
                duration: 300,
                ease: 'Back.easeIn',
                onComplete: () => {
                    this.walls.remove(wall, true, true);
                }
            });

            delete this.wallGrid[key];
        }
    }

    // Fait apparaître des pics sur une tuile avec animation
    spawnSpike(col, row) {
        const ts = CONFIG.tileSize;
        const x = col * ts + ts / 2;
        const floorY = (row + 1) * ts; // haut du plancher (bas de la case)

        // Pic gris (triangle) — commence caché sous le sol
        const spike = this.add.polygon(x, floorY, [
            0, -20, 14, 0, -14, 0
        ], 0x888888);
        spike.setStrokeStyle(1, 0xaaaaaa);

        // Animation : monte du sol, pointe vers le haut
        this.tweens.add({
            targets: spike,
            y: floorY + 10,
            duration: 150,
            ease: 'Back.easeOut',
        });

        // Ajouter au groupe de pics après un petit délai (pour le visuel)
        this.time.delayedCall(100, () => {
            this.spikes.add(spike);
            spike.body.setSize(20, 20);
            spike.body.setOffset(-10, -10);
        });
    }

    // Fait tomber un bloc du plafond qui écrase le joueur
    dropCeiling(col, row) {
        const key = `${col},${row}`;
        const wall = this.wallGrid[key];
        if (!wall) return;

        const ts = CONFIG.tileSize;
        const x = wall.x;
        const y = wall.y;

        // Supprimer le mur statique
        this.walls.remove(wall, true, true);
        delete this.wallGrid[key];

        // Créer un nouveau bloc dynamique qui tombe (rapide)
        const block = this.add.rectangle(x, y, ts, ts, COLORS.stone);
        block.setStrokeStyle(1, COLORS.stoneLight);
        this.physics.add.existing(block);
        block.body.setVelocityY(1600);
        block.body.setBounce(0);
        let isFalling = true;

        // Le bloc tue le joueur SEULEMENT pendant qu'il tombe
        this.physics.add.overlap(this.player, block, () => {
            if (isFalling) this.die();
        }, null, this);

        // Le bloc s'arrête sur le plancher → devient solide
        this.physics.add.collider(block, this.walls, () => {
            if (!isFalling) return;
            isFalling = false;
            // Retirer le body dynamique et ajouter au groupe statique
            block.body.setVelocity(0);
            block.body.setAllowGravity(false);
            block.body.setImmovable(true);
            // Ajouter une collision solide avec le joueur
            this.physics.add.collider(this.player, block);
        });
    }

    // Crée un bloc qui tombe du plafond jusqu'à sa position cible, puis devient un mur solide
    // disappearDelay: si > 0, le bloc disparaît après ce délai (ms)
    spawnFallingBlock(col, targetRow, disappearDelay = 0, invisible = false) {
        const ts = CONFIG.tileSize;
        const x = col * ts + ts / 2;
        const endY = targetRow * ts + ts / 2;

        if (invisible) {
            // Bloc invisible : apparaît directement en place, pas d'animation, pas de visuel
            const wall = this.add.rectangle(x, endY, ts, ts, COLORS.stone);
            wall.setStrokeStyle(1, COLORS.stoneLight);
            wall.setAlpha(0); // invisible !
            this.walls.add(wall);
            wall.body.setSize(ts, ts);
            wall.setOrigin(0.5);
            this.wallGrid[`${col},${targetRow}`] = wall;

            if (disappearDelay > 0) {
                this.time.delayedCall(disappearDelay, () => {
                    // Suppression simple sans animation
                    const key = `${col},${targetRow}`;
                    const w = this.wallGrid[key];
                    if (w) {
                        this.walls.remove(w, true, true);
                        delete this.wallGrid[key];
                    }
                });
            }
        } else {
            // Bloc visible qui tombe du plafond
            const startY = 7 * ts + ts / 2;
            const block = this.add.rectangle(x, startY, ts, ts, COLORS.stone);
            block.setStrokeStyle(1, COLORS.stoneLight);

            this.tweens.add({
                targets: block,
                y: endY,
                duration: 400,
                ease: 'Bounce.easeOut',
                onComplete: () => {
                    block.destroy();
                    const wall = this.add.rectangle(x, endY, ts, ts, COLORS.stone);
                    wall.setStrokeStyle(1, COLORS.stoneLight);
                    this.walls.add(wall);
                    wall.body.setSize(ts, ts);
                    wall.setOrigin(0.5);
                    this.wallGrid[`${col},${targetRow}`] = wall;

                    if (disappearDelay > 0) {
                        this.time.delayedCall(disappearDelay, () => {
                            this.removeTile(col, targetRow);
                        });
                    }
                }
            });

            // Tuer le joueur si le bloc tombe dessus
            this.time.addEvent({
                delay: 16,
                repeat: 24,
                callback: () => {
                    if (this.isDead || !this.player) return;
                    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, block.x, block.y);
                    if (dist < ts * 0.7) this.die();
                }
            });
        }
    }

    // Vérifie si le joueur est sur une zone de trigger
    checkTriggers() {
        const px = this.player.x;

        this.triggers.forEach(trigger => {
            if (this.triggeredTraps[trigger.id]) return; // déjà déclenché

            // Le joueur passe dans la colonne du trigger
            // triggerMaxY : le trigger ne s'active que si le joueur est AU-DESSUS de cette ligne
            const py = this.player.y;
            if (trigger.triggerMaxY !== undefined && py > trigger.triggerMaxY) return;

            // triggerDirection : 'left' = seulement si le joueur va vers la gauche, 'right' = vers la droite
            if (trigger.triggerDirection) {
                const vx = this.player.body.velocity.x;
                if (trigger.triggerDirection === 'left' && vx >= 0) return;
                if (trigger.triggerDirection === 'right' && vx <= 0) return;
            }

            // Vérifier Y : le joueur doit être à ±2 tuiles de la hauteur du trigger
            const ts = CONFIG.tileSize;
            if (Math.abs(py - trigger.y) > ts * 2) return;

            if (px >= trigger.x && px <= trigger.x + trigger.w) {
                this.triggeredTraps[trigger.id] = true;

                this.time.delayedCall(trigger.delay, () => {
                    // Tuiles qui disparaissent
                    if (trigger.tiles) {
                        trigger.tiles.forEach(t => this.removeTile(t.col, t.row));
                    }
                    // Pics qui apparaissent
                    if (trigger.spikeTiles) {
                        trigger.spikeTiles.forEach(t => this.spawnSpike(t.col, t.row));
                    }
                    // Plafond qui tombe
                    if (trigger.ceilingTiles) {
                        trigger.ceilingTiles.forEach(t => this.dropCeiling(t.col, t.row));
                    }
                    // Blocs qui tombent depuis le haut (créés à la volée)
                    if (trigger.fallingBlocks && trigger.fallingBlocks.length > 0) {
                        trigger.fallingBlocks.forEach((t, i) => {
                            this.time.delayedCall(i * 150, () => {
                                this.spawnFallingBlock(t.col, t.row, trigger.disappearDelay || 0, trigger.invisible);
                            });
                        });
                    }
                    // Piston déclenché
                    if (trigger.type === 'piston_trigger' && trigger.trap) {
                        this.spawnPiston(trigger.trap);
                    }
                    // Mur déclenché
                    if (trigger.type === 'moving_wall_trigger' && trigger.trap) {
                        this.spawnMovingWall(trigger.trap);
                    }
                });
            }
        });
    }

    update() {
        if (this.isDead || !this.player) return;

        // Vérifier les pièges
        this.checkTriggers();

        // Mort si le joueur tombe hors du monde
        if (this.player.y > (this.worldHeight || 720) + 30) {
            this.die();
            return;
        }

        const onFloor = this.player.body.blocked.down || this.player.body.touching.down;

        // Mouvement
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.setVelocityX(-CONFIG.playerSpeed);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(CONFIG.playerSpeed);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }

        // Saut
        if ((this.cursors.up.isDown || this.wasd.up.isDown || this.wasd.space.isDown) && onFloor) {
            this.player.setVelocityY(LEVELS[this.currentLevel].jumpForce || CONFIG.jumpForce);
            playJumpSound();
        }

        // Sync plateformes mouvantes
        this.movingPlatforms.forEach(p => {
            if (p.body) {
                p.body.position.x = p.x - p.body.width / 2;
                p.body.position.y = p.y - p.body.height / 2;
            }
        });

        // Crushers
        this.crushingWalls.forEach(c => {
            if (c.body) {
                c.body.position.x = c.x - c.body.width / 2;
                c.body.position.y = c.y - c.body.height / 2;
                if (Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(), c.getBounds()
                )) {
                    this.die();
                }
            }
        });
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this._deathCount++;
        SAVE.addDeath(this.currentLevel);

        // Son de mort Minecraft
        this.sound.play('deathSound', { volume: 0.5 });

        // Mettre à jour le compteur
        this.deathText.setText(`☠ Morts : ${this._deathCount}`);

        this.player.setTint(0xff0000);
        this.player.body.setVelocity(0);
        this.player.body.setAllowGravity(false);

        this.tweens.add({
            targets: this.player,
            angle: 90,
            alpha: 0.5,
            y: this.player.y + 10,
            duration: 300,
        });

        this.cameras.main.shake(200, 0.01);

        // Message taquin selon le nombre de morts
        const dc = this._deathCount;
        let pool;
        if (dc <= 3) pool = DEATH_MESSAGES[0];
        else if (dc <= 7) pool = DEATH_MESSAGES[1];
        else if (dc <= 12) pool = DEATH_MESSAGES[2];

        if (pool) {
            // Choisir un message jamais vu sur ce niveau
            const available = pool.filter(m => !this._usedMessages.includes(m));
            if (available.length > 0) {
                const msg = available[Phaser.Math.Between(0, available.length - 1)];
                this._usedMessages.push(msg);
                const deathText = this.add.text(640, 360, msg, {
                    fontSize: '18px',
                    fontFamily: 'Georgia, serif',
                    color: COLORS.textLight,
                    fontStyle: 'italic',
                    stroke: '#000',
                    strokeThickness: 3,
                }).setOrigin(0.5).setDepth(20).setAlpha(0).setScrollFactor(0);

                this.tweens.add({
                    targets: deathText,
                    alpha: 1,
                    y: 340,
                    duration: 300,
                    ease: 'Back.easeOut',
                });
            }
        }

        this.time.delayedCall(CONFIG.deathDelay, () => {
            this.scene.start('GameScene', { level: this.currentLevel });
        });
    }

    win() {
        if (this.isDead) return;
        this.isDead = true;
        if (this.battleMusic) this.battleMusic.stop();
        BGMusic.start();

        // Débloquer le prochain niveau
        SAVE.unlock(this.currentLevel + 2);

        this.tweens.add({
            targets: this.player,
            y: this.player.y - 50,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 500,
            ease: 'Back.easeOut',
        });

        this.time.delayedCall(700, () => {
            if (this.currentLevel >= LEVELS.length - 1) {
                this.scene.start('VictoryScene');
            } else {
                this.scene.start('LevelCompleteScene', { level: this.currentLevel });
            }
        });
    }
}

// ============================================
// SCÈNE DE VICTOIRE FINALE
// ============================================

class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const totalDeaths = SAVE.totalDeaths();
        const elapsed = SAVE.getElapsedTime();
        const timeStr = SAVE.formatTime(elapsed);

        // Particules dorées (plus nombreuses pour la victoire)
        for (let i = 0; i < 60; i++) {
            const p = this.add.circle(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(0, h),
                Phaser.Math.Between(1, 4),
                COLORS.goldBright, 0.6
            );
            this.tweens.add({
                targets: p,
                y: p.y - Phaser.Math.Between(80, 250),
                alpha: 0,
                duration: Phaser.Math.Between(2000, 5000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 3000),
            });
        }

        // Couronne au-dessus du personnage
        const crown = this.add.text(w / 2, 155, '♛', {
            fontSize: '48px',
            color: COLORS.textGold,
        }).setOrigin(0.5).setAlpha(0);

        // Personnage
        const char = this.add.image(w / 2, 220, `char_preview_${SAVE.selectedChar}`).setAlpha(0).setScale(2);

        // Ligne décorative
        const line = this.add.rectangle(w / 2, 275, 300, 1, COLORS.gold, 0.5).setAlpha(0);

        // Titre
        const title1 = this.add.text(w / 2, 310, 'TU ES LE', {
            fontSize: '20px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textLight,
        }).setOrigin(0.5).setAlpha(0);

        const title2 = this.add.text(w / 2, 355, 'ELDEN KING', {
            fontSize: '56px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textGold,
            stroke: '#000',
            strokeThickness: 5,
        }).setOrigin(0.5).setAlpha(0);

        // Ligne décorative 2
        const line2 = this.add.rectangle(w / 2, 395, 250, 1, COLORS.gold, 0.5).setAlpha(0);

        // Stats
        const statsY = 430;
        const timeText = this.add.text(w / 2, statsY, `Temps total : ${timeStr}`, {
            fontSize: '16px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textLight,
        }).setOrigin(0.5).setAlpha(0);

        const deathText = this.add.text(w / 2, statsY + 30, `Morts : ${totalDeaths}`, {
            fontSize: '16px',
            fontFamily: 'Georgia, serif',
            color: '#aa4444',
        }).setOrigin(0.5).setAlpha(0);

        // Message selon le nombre de morts
        let verdict;
        if (totalDeaths === 0) verdict = 'Perfection absolue. Tu es une legende.';
        else if (totalDeaths <= 10) verdict = 'Le Roi est ne. Presque sans faille.';
        else if (totalDeaths <= 30) verdict = 'Un parcours digne d\'un vrai guerrier.';
        else if (totalDeaths <= 60) verdict = 'La couronne est meritee, malgre les cicatrices.';
        else if (totalDeaths <= 100) verdict = 'Tu as souffert... mais tu as persevere.';
        else verdict = 'Le chemin fut brutal, mais tu es toujours debout.';

        const verdictText = this.add.text(w / 2, statsY + 70, verdict, {
            fontSize: '14px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textGold,
            fontStyle: 'italic',
        }).setOrigin(0.5).setAlpha(0);

        // Continuer
        const restartText = this.add.text(w / 2, statsY + 120, '[ ESPACE = Carte ]', {
            fontSize: '16px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textGold,
        }).setOrigin(0.5).setAlpha(0);

        // Animations séquentielles
        this.tweens.add({ targets: char, alpha: 1, y: 215, duration: 800, ease: 'Back.easeOut', delay: 300 });
        this.tweens.add({ targets: crown, alpha: 1, y: 150, duration: 600, ease: 'Bounce.easeOut', delay: 800 });
        // Couronne qui flotte
        this.tweens.add({ targets: crown, y: 145, duration: 1500, yoyo: true, repeat: -1, delay: 1500, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: line, alpha: 0.5, delay: 1200, duration: 400 });
        this.tweens.add({ targets: title1, alpha: 1, delay: 1400, duration: 500 });
        this.tweens.add({ targets: title2, alpha: 1, delay: 1700, duration: 600, ease: 'Back.easeOut' });
        this.tweens.add({ targets: line2, alpha: 0.5, delay: 2200, duration: 400 });
        this.tweens.add({ targets: timeText, alpha: 1, delay: 2500, duration: 400 });
        this.tweens.add({ targets: deathText, alpha: 1, delay: 2800, duration: 400 });
        this.tweens.add({ targets: verdictText, alpha: 1, delay: 3200, duration: 500 });
        this.tweens.add({
            targets: restartText, alpha: 1, delay: 3800, duration: 400,
            onComplete: () => {
                this.tweens.add({ targets: restartText, alpha: 0.3, duration: 1000, yoyo: true, repeat: -1 });
            }
        });

        // Input (après l'animation)
        this.time.delayedCall(3800, () => {
            this.input.keyboard.on('keydown-SPACE', () => {
                this.scene.start('LevelMapScene');
            });
        });

        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }
}

// ============================================
// SCÈNE DE NIVEAU COMPLÉTÉ
// ============================================

class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelCompleteScene' });
    }

    init(data) {
        this.completedLevel = data.level || 0;
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const levelNum = this.completedLevel + 1;
        const levelName = LEVELS[this.completedLevel].name;

        // Particules dorées
        for (let i = 0; i < 25; i++) {
            const p = this.add.circle(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(0, h),
                Phaser.Math.Between(1, 3),
                COLORS.goldBright, 0.4
            );
            this.tweens.add({
                targets: p,
                y: p.y - Phaser.Math.Between(60, 150),
                alpha: 0,
                duration: Phaser.Math.Between(2000, 4000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000),
            });
        }

        // Titre
        const title = this.add.text(w / 2, h / 2 - 80, `Niveau ${levelNum} complété`, {
            fontSize: '36px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textGold,
            stroke: '#000',
            strokeThickness: 4,
        }).setOrigin(0.5).setAlpha(0);

        // Ligne décorative
        const line = this.add.rectangle(w / 2, h / 2 - 40, 200, 1, COLORS.gold, 0.5).setAlpha(0);

        // Nom du niveau
        const name = this.add.text(w / 2, h / 2 - 10, levelName, {
            fontSize: '20px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textLight,
            fontStyle: 'italic',
        }).setOrigin(0.5).setAlpha(0);

        // Personnage
        const char = this.add.image(w / 2, h / 2 + 60, `char_preview_${SAVE.selectedChar}`).setAlpha(0);

        // Continuer
        const continueText = this.add.text(w / 2, h / 2 + 140, '[ ESPACE = Continuer ]', {
            fontSize: '16px',
            fontFamily: 'Georgia, serif',
            color: COLORS.textGold,
        }).setOrigin(0.5).setAlpha(0);

        // Animations d'entrée
        this.tweens.add({ targets: title, alpha: 1, y: h / 2 - 90, duration: 600, ease: 'Back.easeOut' });
        this.tweens.add({ targets: line, alpha: 0.5, delay: 300, duration: 400 });
        this.tweens.add({ targets: name, alpha: 1, delay: 400, duration: 400 });
        this.tweens.add({ targets: char, alpha: 1, delay: 500, duration: 400 });
        this.tweens.add({
            targets: continueText,
            alpha: 1,
            delay: 800,
            duration: 400,
            onComplete: () => {
                this.tweens.add({ targets: continueText, alpha: 0.3, duration: 1000, yoyo: true, repeat: -1 });
            }
        });

        // Input
        this.time.delayedCall(800, () => {
            this.input.keyboard.on('keydown-SPACE', () => {
                this.cameras.main.fadeOut(400, 0, 0, 0);
                this.time.delayedCall(400, () => {
                    this.scene.start('LevelMapScene');
                });
            });
        });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}

// ============================================
// LANCER LE JEU
// ============================================

// Le jeu est lancé dans main.js (après le chargement des niveaux)
