// ============================================
// ELDEN KING - Lancement du jeu
// Ce fichier doit être chargé EN DERNIER
// (après game.js et tous les fichiers de niveaux)
// ============================================

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: COLORS.bgDark,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: CONFIG.gravity },
            // debug: true,
        },
    },
    scene: [BootScene, TitleScene, CharSelectScene, LevelMapScene, GameScene, LevelCompleteScene, VictoryScene],
});
