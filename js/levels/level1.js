// Niveau 1 - L'Éveil
// Apprends à survivre
// Légende : 0=vide, 1=mur, 2=pics, 3=spawn, 4=porte, 5=plateforme H, 6=plateforme V, 7=trou, 8=crusher
// Grille : 32 colonnes x 18 lignes

LEVELS[0] = {
    name: "L'Éveil",
    subtitle: "Apprends à survivre",
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
        // Piège 1 : le sol disparaît
        // Marche sur le 3e carré → les 4e et 5e carrés du plancher tombent
        {
            id: 'trap1',
            type: 'step_remove',
            triggerCol: 2,
            triggerRow: 11,
            triggerCols: 1,
            delay: 200,
            removeTiles: [
                { col: 3, row: 12 },
                { col: 4, row: 12 },
            ],
        },
        // Piège 2 : pics surprise
        // Marche sur le 8e carré → des pics sortent sur les 9e et 10e carrés
        {
            id: 'trap2',
            type: 'step_spikes',
            triggerCol: 7,
            triggerRow: 11,
            triggerCols: 1,
            delay: 100,
            spikeTiles: [
                { col: 8, row: 11 },
                { col: 9, row: 11 },
            ],
        },
        // Piège 3 : le plafond tombe !
        // Arrive à l'avant-dernière colonne → le plafond tombe sur toi et la colonne d'après
        {
            id: 'trap3',
            type: 'step_ceiling_fall',
            triggerCol: 28,
            triggerRow: 11,
            triggerCols: 1,
            delay: 100,
            ceilingTiles: [
                { col: 28, row: 6 },   // 2 blocs avant la porte
                { col: 29, row: 6 },   // 1 bloc avant la porte
            ],
        },
    ],
};
