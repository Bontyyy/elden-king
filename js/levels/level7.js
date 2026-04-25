// Niveau 7 - L'Ascension
// Monte ou tombe
// Légende : 0=vide, 1=mur, 2=pics, 3=spawn, 4=porte, 5=plateforme H, 6=plateforme V, 7=trou, 8=crusher
// Grille : 16 colonnes x 48 lignes (très haut, étroit)
// Concept : appuie sur le bouton → des rangées de blocs tombent du ciel avec un trou
//           le joueur doit se placer dans le trou, monter sur l'étage, et recommencer

LEVELS[6] = {
    name: "L'Ascension",
    subtitle: "Monte ou tombe",
    map: [
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 0
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 1
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 2
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 3
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 4
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 5
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 6
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 7
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 8
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 9
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 10
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 11
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 12
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 13
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 14
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 15
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 16
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 17
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 18
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 19
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 20
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 21
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 22
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 23
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 24
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 25
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 26
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 27
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 28
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 29
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 30
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 31
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4,0], // 32  mur + porte (extérieur)
        [1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1], // 33  plateforme porte
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 34
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 35
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 36
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 37
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 38
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 39
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 40
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 41
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 42
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 43
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 44
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 45
        [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 46  spawn
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 47  sol
    ],

    traps: [
        // Bouton qui déclenche la première rangée
        {
            id: 'button1',
            type: 'button',
            col: 8,
            row: 47,
            color: 0xcc3333,
            actionDelay: 300,
            actions: [
                {
                    type: 'falling_row_sequence',
                    startCol: 1,
                    endCol: 14,
                    gapWidth: 2,
                    interval: 3000,
                    intervalDecrease: 100,
                    gaps: [6, 10, 3, 8, 1, 11, 5, 9, 2, 7],
                },
                // Rangée piège 1 (30s après le bouton)
                {
                    type: 'falling_row_trick',
                    startCol: 1,
                    endCol: 14,
                    gapWidth: 2,
                    fakeGapCol: 7,
                    realGapCol: 11,
                    targetRow: 36,
                    speed: 267,
                    switchRowsBefore: 2,
                    delay: 25500,
                },
                // Rangée piège 2
                {
                    type: 'falling_row_trick',
                    startCol: 1,
                    endCol: 14,
                    gapWidth: 2,
                    fakeGapCol: 10,
                    realGapCol: 3,
                    targetRow: 35,
                    speed: 267,
                    switchRowsBefore: 2,
                    delay: 27500,
                },
            ],
        },
        // Piège : marcher sur col 13 fait disparaître les blocs 14-15-16 de la plateforme
        {
            id: 'trap_platform_drop',
            type: 'step_remove',
            triggerCol: 15,
            triggerRow: 32,
            triggerCols: 1,
            delay: 0,
            removeTiles: [
                { col: 16, row: 33 },
                { col: 17, row: 33 },
                { col: 18, row: 33 },
            ],
        },
        // Bouton sur la plateforme qui ouvre le passage vers la porte
        {
            id: 'button_door',
            type: 'button',
            col: 13,
            row: 33,
            color: 0x33cc33,
            actions: [
                {
                    type: 'remove',
                    tiles: [
                        { col: 14, row: 32 },
                        { col: 15, row: 32 },
                        { col: 15, row: 31 },
                        { col: 15, row: 30 },
                        { col: 15, row: 29 },
                    ],
                },
            ],
        },
    ],
};
