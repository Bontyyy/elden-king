// Niveau 3 - Le Gouffre
// Le vide appelle
// Légende : 0=vide, 1=mur, 2=pics, 3=spawn, 4=porte, 5=plateforme H, 6=plateforme V, 7=trou, 8=crusher
// Grille : 64 colonnes x 18 lignes (2x plus large que les niveaux 1-2)

LEVELS[2] = {
    name: "Le Gouffre",
    subtitle: "Le vide appelle",
    map: [
        //                                                               |--- zone 2 (col 32+) ---|
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    ],

    traps: [
        // Mur qui va de droite à gauche — le joueur doit sauter par-dessus
        {
            id: 'wall1',
            type: 'moving_wall',
            startCol: 33,     // part du bout droit de l'écran
            endCol: 0,
            row: 12,          // posé sur le plancher (ligne 12)
            height: 1.5,      // 1.5 blocs de haut
            speed: 150,       // vitesse constante
            oneWay: true,     // traverse sans revenir
            direction: 'left', // va de droite à gauche
        },
        // Piston qui descend du plafond et remonte en boucle
        {
            id: 'piston1',
            type: 'piston',
            col: 15,            // colonne du piston
            ceilingRow: 6,      // position haute (plafond)
            floorRow: 10.5,       // position basse (un peu au-dessus du sol)
            width: 1,           // 1 bloc de large
            height: 2,          // 2 blocs de haut
            downSpeed: 300,     // vitesse de descente (ms)
            upSpeed: 600,       // vitesse de remontée (ms)
            holdDown: 200,      // temps d'attente en bas (ms)
            holdUp: 400,        // temps d'attente en haut (ms)
            delay: 0,           // commence immédiatement
        },
        // Piège : marche sur le 2e bloc → les 3e, 4e et 5e tombent
        {
            id: 'trap1',
            type: 'step_remove',
            triggerCol: 2,
            triggerRow: 11,
            triggerCols: 2,
            delay: 0,
            removeTiles: [
                { col: 2, row: 12 },
                { col: 3, row: 12 },
                { col: 4, row: 12 },
            ],
        },
        // Piston au 28e bloc
        {
            id: 'piston2',
            type: 'piston',
            triggerCol: 26,     // se déclenche quand le joueur atteint la col 26
            col: 28,
            ceilingRow: 6,
            floorRow: 10.5,
            width: 1,
            height: 2,
            downSpeed: 300,
            upSpeed: 600,
            holdDown: 200,
            holdUp: 400,
            delay: 0,
        },
        // Pancarte d'avertissement après le piston
        {
            id: 'sign1',
            type: 'sign',
            col: 30,
            row: 11,
            text: '⚠ DANGER',
            width: 2.5,
            offsetY: 34,
        },
        // Pancarte danger après le dernier trou
        {
            id: 'sign2',
            type: 'sign',
            col: 52,
            row: 11,
            text: '⚠ DANGER',
            width: 2.5,
            offsetY: 34,
        },
        // Piège : col 42 trigger → les col 44-46 (plancher + en dessous) tombent
        {
            id: 'trap_fall2',
            type: 'step_remove',
            triggerCol: 42,
            triggerRow: 11,
            triggerCols: 1,
            delay: 200,
            removeTiles: [
                { col: 44, row: 12 },
                { col: 45, row: 12 },
                { col: 46, row: 12 },
                { col: 44, row: 13 },
                { col: 45, row: 13 },
                { col: 46, row: 13 },
                { col: 44, row: 14 },
                { col: 45, row: 14 },
                { col: 46, row: 14 },
                { col: 44, row: 15 },
                { col: 45, row: 15 },
                { col: 46, row: 15 },
                { col: 44, row: 16 },
                { col: 45, row: 16 },
                { col: 46, row: 16 },
            ],
        },
        // 2 secondes après, les colonnes réapparaissent
        {
            id: 'trap_fall2_rebuild',
            type: 'step_falling_blocks',
            triggerCol: 42,
            triggerRow: 11,
            triggerCols: 1,
            delay: 2200,
            fallingBlocks: [
                { col: 44, row: 12 },
                { col: 45, row: 12 },
                { col: 46, row: 12 },
                { col: 44, row: 13 },
                { col: 45, row: 13 },
                { col: 46, row: 13 },
                { col: 44, row: 14 },
                { col: 45, row: 14 },
                { col: 46, row: 14 },
                { col: 44, row: 15 },
                { col: 45, row: 15 },
                { col: 46, row: 15 },
                { col: 44, row: 16 },
                { col: 45, row: 16 },
                { col: 46, row: 16 },
            ],
        },
    ],
};