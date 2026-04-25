// Niveau 2 - Les Crocs
// Attention où tu marches
// Légende : 0=vide, 1=mur, 2=pics, 3=spawn, 4=porte, 5=plateforme H, 6=plateforme V, 7=trou, 8=crusher
// Grille : 32 colonnes x 18 lignes

LEVELS[1] = {
    name: "Les Crocs",
    subtitle: "Attention où tu marches",
    map: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],

    // Pièges scriptés !
    traps: [
        // Piège 1 : marche sur le 5e bloc (col 4) → les blocs 7 à 13 (col 6 à 12) disparaissent
        {
            id: 'trap1',
            type: 'step_remove',
            triggerCol: 4,       // 5e bloc (index 4)
            triggerRow: 11,
            triggerCols: 1,
            delay: 200,
            removeTiles: [
                { col: 6, row: 12 },
                { col: 7, row: 12 },
                { col: 8, row: 12 },
                { col: 9, row: 12 },
                { col: 10, row: 12 },
                { col: 11, row: 12 },
                { col: 12, row: 12 },
            ],
        },
        // Piège 2 : 10 secondes après, des blocs tombent du plafond pour combler le trou
        {
            id: 'trap2',
            type: 'step_falling_blocks',
            triggerCol: 4,       // même trigger que le piège 1
            triggerRow: 11,
            triggerCols: 1,
            delay: 10000,        // 10 secondes après le déclenchement
            disappearDelay: 400, // chaque bloc disparaît très vite après être posé
            fallingBlocks: [
                { col: 6, row: 12 },
                { col: 7, row: 12 },
                { col: 8, row: 12 },
                { col: 9, row: 12 },
                { col: 10, row: 12 },
                { col: 11, row: 12 },
                { col: 12, row: 12 },
            ],
        },
        // Piège 3 : 2 blocs après le trou → le sol tombe encore (col 15 à 21)
        {
            id: 'trap3',
            type: 'step_remove',
            triggerCol: 14,
            triggerRow: 11,
            triggerCols: 1,
            delay: 200,
            removeTiles: [
                { col: 15, row: 12 },
                { col: 16, row: 12 },
                { col: 17, row: 12 },
                { col: 18, row: 12 },
                { col: 19, row: 12 },
                { col: 20, row: 12 },
                { col: 21, row: 12 },
            ],
        },
        // Piège 4 : blocs invisibles qui retombent après 2 secondes
        {
            id: 'trap4',
            type: 'step_falling_blocks',
            triggerCol: 14,
            triggerRow: 11,
            triggerCols: 1,
            delay: 2000,
            invisible: true,
            fallingBlocks: [
                { col: 15, row: 12 },
                { col: 16, row: 12 },
                { col: 17, row: 12 },
                { col: 18, row: 12 },
                { col: 19, row: 12 },
                { col: 20, row: 12 },
                { col: 21, row: 12 },
            ],
        },
        // Piège 5 : 2 blocs normaux (22-23) puis col 24 à 28 tombent
        {
            id: 'trap5',
            type: 'step_remove',
            triggerCol: 23,
            triggerRow: 11,
            triggerCols: 1,
            delay: 200,
            removeTiles: [
                { col: 24, row: 12 },
                { col: 25, row: 12 },
                { col: 26, row: 12 },
                { col: 27, row: 12 },
                { col: 28, row: 12 },
            ],
        },
        // Piège 6 : 2 sec après, blocs invisibles remplacent le trou
        {
            id: 'trap6',
            type: 'step_falling_blocks',
            triggerCol: 23,
            triggerRow: 11,
            triggerCols: 1,
            delay: 2000,
            invisible: true,
            fallingBlocks: [
                { col: 24, row: 12 },
                { col: 28, row: 12 },
            ],
        },
    ],
};
