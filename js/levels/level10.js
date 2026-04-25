// Niveau 8 - Le Trône
// Prouve que tu es le Roi
// Légende : 0=vide, 1=mur, 2=pics, 3=spawn, 4=porte, 5=plateforme H, 6=plateforme V, 7=trou, 8=crusher
// Grille : 64 colonnes x 36 lignes
// 3 chemins : haut (piège), milieu (piège), bas (vrai chemin caché)

LEVELS[7] = {
    name: "Le Trône",
    subtitle: "Prouve que tu es le Roi",
    map: [
        //                                                                 col:60
        //       5    10   15   20   25   30   35   40   45   50   55   60  63
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 1
        [0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 2
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 3
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 4
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 5
        // --- CHEMIN DU HAUT (rows 6-11) ---
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 6   plafond chemin haut
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 7
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 8
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 9
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 10
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 11  sol chemin haut
        // --- ZONE INTERMÉDIAIRE (montée vers chemin haut) ---
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 12  marche vers haut
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 13  marche vers haut
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 14
        // --- CHEMIN DU MILIEU (rows 15-20) - le chemin "évident" ---
        [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 15  plafond chemin milieu
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 16
        [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 17
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 18  spawn
        [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 19  sol chemin milieu (trou cols 13-14 = accès au bas)
        // --- ZONE INTERMÉDIAIRE ---
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 20
        [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 21  carré pics - haut
        [0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 22  portail bleu dest (espace pour apparaître)
        [0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 23  espace de chute
        [0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 24  espace de chute
        [0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 25  espace (pics via trap)
        [0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 26  carré pics - bas (pics via trap)
        [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 27  sol sous les pics (trou cols 13-14)
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 28
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 29
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 30
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 31
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 32
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 33
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 34
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 35
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 36
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 37
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0], // 38  VRAIE porte
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 39 sol chemin du bas
    ],

    traps: [
        // Pluie acide sur toute la map
        {
            id: 'acid_rain',
            type: 'acid_rain',
            startDelay: 2000,
            interval: 200,
            speed: 300,
            size: 3,
            color: 0x44ff44,
        },

        // --- PORTES MAUDITES (fausses portes aux bouts des mauvais chemins) ---

        // Fausse porte dorée — fin du chemin du haut (piège ultime)
        {
            id: 'cursed_golden_door_top',
            type: 'cursed_golden_door',
            col: 62,
            row: 10,
        },

        // --- PIÈGES CHEMIN DU HAUT (chemin 3) ---

        // Mur qui avance depuis la gauche — déclenché quand le joueur atteint la rangée
        {
            id: 'moving_wall_top',
            type: 'moving_wall',
            startCol: 2,
            endCol: 62,
            row: 15,
            height: 3,
            speed: 100,
            oneWay: true,
            direction: 'right',
            triggerCol: 5,
            triggerRow: 14,
        },
        // Plateforme qui s'effondre au milieu du chemin
        {
            id: 'top_floor_drop1',
            type: 'step_remove',
            triggerCol: 30, triggerRow: 14, triggerCols: 1, delay: 0,
            removeTiles: [
                { col: 32, row: 15 },
                { col: 33, row: 15 },
                { col: 34, row: 15 },
            ],
        },
        // Piston 1 — premier tiers du chemin
        {
            id: 'piston_top1',
            type: 'piston',
            col: 20,
            ceilingRow: 11,
            floorRow: 14.5,
            width: 1,
            height: 2,
            downSpeed: 300,
            upSpeed: 500,
            holdDown: 200,
            holdUp: 600,
            delay: 0,
        },
        // Piston 2 — deuxième tiers du chemin
        {
            id: 'piston_top2',
            type: 'piston',
            col: 45,
            ceilingRow: 11,
            floorRow: 14.5,
            width: 1,
            height: 2,
            downSpeed: 250,
            upSpeed: 500,
            holdDown: 150,
            holdUp: 400,
            delay: 0,
        },

        // --- PIÈGES CHEMIN DU MILIEU ---

        // Scie chemin du milieu — aller-retour sur tout le corridor
        {
            id: 'saw_mid',
            type: 'saw',
            startCol: 5,
            endCol: 60,
            row: 19,
            radius: 12,
            speed: 200,
        },

        // Scie chemin du milieu 2 — 2x plus rapide
        {
            id: 'saw_mid2',
            type: 'saw',
            startCol: 5,
            endCol: 60,
            row: 19,
            radius: 12,
            speed: 400,
        },

        // Pics dans le carré bleu (avec offset pour ajuster)
        {
            id: 'blue_box_spikes',
            type: 'offset_spikes',
            spikes: [
                { col: 6, row: 25, offsetX: 13, offsetY: 20 },
                { col: 7, row: 25, offsetX: 13, offsetY: 20 },
                { col: 8, row: 25, offsetX: 13, offsetY: 20 },
            ],
        },

        // Pics sous le sol du chemin milieu (même offset que la cage)
        {
            id: 'floor_spikes',
            type: 'offset_spikes',
            spikes: [
                { col: 12, row: 26, offsetX: 13, offsetY: 20 },
                { col: 15, row: 26, offsetX: 13, offsetY: 20 },
                { col: 16, row: 26, offsetX: 13, offsetY: 20 },
                { col: 17, row: 26, offsetX: 13, offsetY: 20 },
                { col: 18, row: 26, offsetX: 13, offsetY: 20 },
                { col: 19, row: 26, offsetX: 13, offsetY: 20 },
                { col: 20, row: 26, offsetX: 13, offsetY: 20 },
                { col: 21, row: 26, offsetX: 13, offsetY: 20 },
                { col: 22, row: 26, offsetX: 13, offsetY: 20 },
                { col: 23, row: 26, offsetX: 13, offsetY: 20 },
                { col: 24, row: 26, offsetX: 13, offsetY: 20 },
                { col: 25, row: 26, offsetX: 13, offsetY: 20 },
                { col: 26, row: 26, offsetX: 13, offsetY: 20 },
                { col: 27, row: 26, offsetX: 13, offsetY: 20 },
                { col: 28, row: 26, offsetX: 13, offsetY: 20 },
                { col: 29, row: 26, offsetX: 13, offsetY: 20 },
                { col: 30, row: 26, offsetX: 13, offsetY: 20 },
                { col: 31, row: 26, offsetX: 13, offsetY: 20 },
                { col: 32, row: 26, offsetX: 13, offsetY: 20 },
                { col: 33, row: 26, offsetX: 13, offsetY: 20 },
                { col: 34, row: 26, offsetX: 13, offsetY: 20 },
                { col: 35, row: 26, offsetX: 13, offsetY: 20 },
                { col: 36, row: 26, offsetX: 13, offsetY: 20 },
                { col: 37, row: 26, offsetX: 13, offsetY: 20 },
                { col: 38, row: 26, offsetX: 13, offsetY: 20 },
                { col: 39, row: 26, offsetX: 13, offsetY: 20 },
                { col: 40, row: 26, offsetX: 13, offsetY: 20 },
                { col: 41, row: 26, offsetX: 13, offsetY: 20 },
                { col: 42, row: 26, offsetX: 13, offsetY: 20 },
                { col: 43, row: 26, offsetX: 13, offsetY: 20 },
                { col: 44, row: 26, offsetX: 13, offsetY: 20 },
                { col: 45, row: 26, offsetX: 13, offsetY: 20 },
                { col: 46, row: 26, offsetX: 13, offsetY: 20 },
                { col: 47, row: 26, offsetX: 13, offsetY: 20 },
                { col: 48, row: 26, offsetX: 13, offsetY: 20 },
                { col: 49, row: 26, offsetX: 13, offsetY: 20 },
                { col: 50, row: 26, offsetX: 13, offsetY: 20 },
                { col: 51, row: 26, offsetX: 13, offsetY: 20 },
                { col: 52, row: 26, offsetX: 13, offsetY: 20 },
                { col: 53, row: 26, offsetX: 13, offsetY: 20 },
                { col: 54, row: 26, offsetX: 13, offsetY: 20 },
                { col: 55, row: 26, offsetX: 13, offsetY: 20 },
                { col: 56, row: 26, offsetX: 13, offsetY: 20 },
                { col: 57, row: 26, offsetX: 13, offsetY: 20 },
                { col: 58, row: 26, offsetX: 13, offsetY: 20 },
                { col: 59, row: 26, offsetX: 13, offsetY: 20 },
                { col: 60, row: 26, offsetX: 13, offsetY: 20 },
                { col: 61, row: 26, offsetX: 13, offsetY: 20 },
                { col: 62, row: 26, offsetX: 13, offsetY: 20 },
                { col: 63, row: 26, offsetX: 13, offsetY: 20 },
            ],
        },

        // Faux pics et murs aux cols 13-14 (visuels seulement, le joueur passe à travers)
        {
            id: 'fake_passage',
            type: 'fake_tiles',
            walls: [
                { col: 13, row: 27 },
                { col: 14, row: 27 },
            ],
            spikes: [
                { col: 13, row: 26, offsetX: 13, offsetY: 20 },
                { col: 14, row: 26, offsetX: 13, offsetY: 20 },
            ],
        },

        // --- PORTAILS ---

        // Portail bleu (piège) : près du spawn → dans le carré de pics (mort instantanée)
        {
            id: 'portal_blue_trap',
            type: 'portal',
            col: 5,
            row: 18,
            destCol: 7,
            destRow: 22,
            color: 0x4444ff,
        },

        // Sol qui tombe — chemin milieu (tous les 3 blocs, 2 tombent, trigger 1 avant)
        {
            id: 'mid_floor_drop1',
            type: 'step_remove',
            triggerCol: 15, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 16, row: 19 }, { col: 17, row: 19 }],
        },
        {
            id: 'mid_floor_drop2',
            type: 'step_remove',
            triggerCol: 18, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 19, row: 19 }, { col: 20, row: 19 }],
        },
        {
            id: 'mid_floor_drop3',
            type: 'step_remove',
            triggerCol: 21, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 22, row: 19 }, { col: 23, row: 19 }],
        },
        {
            id: 'mid_floor_drop4',
            type: 'step_remove',
            triggerCol: 24, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 25, row: 19 }, { col: 26, row: 19 }],
        },
        {
            id: 'mid_floor_drop5',
            type: 'step_remove',
            triggerCol: 27, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 28, row: 19 }, { col: 29, row: 19 }],
        },
        {
            id: 'mid_floor_drop6',
            type: 'step_remove',
            triggerCol: 30, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 31, row: 19 }, { col: 32, row: 19 }],
        },
        {
            id: 'mid_floor_drop7',
            type: 'step_remove',
            triggerCol: 33, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 34, row: 19 }, { col: 35, row: 19 }],
        },
        {
            id: 'mid_floor_drop8',
            type: 'step_remove',
            triggerCol: 36, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 37, row: 19 }, { col: 38, row: 19 }],
        },
        {
            id: 'mid_floor_drop9',
            type: 'step_remove',
            triggerCol: 39, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 40, row: 19 }, { col: 41, row: 19 }],
        },
        {
            id: 'mid_floor_drop10',
            type: 'step_remove',
            triggerCol: 42, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 43, row: 19 }, { col: 44, row: 19 }],
        },
        {
            id: 'mid_floor_drop11',
            type: 'step_remove',
            triggerCol: 45, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 46, row: 19 }, { col: 47, row: 19 }],
        },
        {
            id: 'mid_floor_drop12',
            type: 'step_remove',
            triggerCol: 48, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 49, row: 19 }, { col: 50, row: 19 }],
        },
        {
            id: 'mid_floor_drop13',
            type: 'step_remove',
            triggerCol: 51, triggerRow: 18, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 52, row: 19 }, { col: 53, row: 19 }],
        },

        // Plateforme glissante : cols 12-14 glisse vers cols 1-3 quand le joueur atterrit
        {
            id: 'sliding_platform_bottom',
            type: 'sliding_platform',
            startCol: 12,
            width: 3,
            row: 39,
            destCol: 1,
            speed: 800,
        },

        // Portail jaune : coin gauche chemin bas → chemin 3 (escalier/haut)
        {
            id: 'portal_yellow',
            type: 'portal',
            col: 10,
            row: 36,
            destCol: 3,
            destRow: 1,
            color: 0xffcc00,
        },

        // Portail rouge : fin du chemin milieu → début du chemin haut (row 11)
        {
            id: 'portal_mid_end',
            type: 'portal',
            col: 62,
            row: 18,
            destCol: 9,
            destRow: 10,
            color: 0xff3333,
        },

        // --- PIÈGES CHEMIN DU BAS (le vrai chemin) ---

        // Quelques pics au sol
        {
            id: 'trap_bottom_spikes1',
            type: 'step_spikes',
            triggerCol: 20,
            triggerRow: 38,
            triggerCols: 1,
            delay: 0,
            spikeTiles: [
                { col: 22, row: 38 },
                { col: 23, row: 38 },
            ],
        },
        {
            id: 'trap_bottom_spikes2',
            type: 'step_spikes',
            triggerCol: 35,
            triggerRow: 38,
            triggerCols: 1,
            delay: 0,
            spikeTiles: [
                { col: 37, row: 38 },
                { col: 38, row: 38 },
            ],
        },
        // Sol qui s'effondre — chemin du bas
        {
            id: 'bottom_floor_drop1',
            type: 'step_remove',
            triggerCol: 25, triggerRow: 38, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 27, row: 39 }, { col: 28, row: 39 }],
        },
        {
            id: 'bottom_floor_drop2',
            type: 'step_remove',
            triggerCol: 40, triggerRow: 38, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 42, row: 39 }, { col: 43, row: 39 }],
        },
        {
            id: 'bottom_floor_drop3',
            type: 'step_remove',
            triggerCol: 52, triggerRow: 38, triggerCols: 1, delay: 0,
            removeTiles: [{ col: 54, row: 39 }, { col: 55, row: 39 }],
        },
        // Scie rapide — chemin du bas
        {
            id: 'saw_bottom',
            type: 'saw',
            startCol: 30,
            endCol: 58,
            row: 39,
            radius: 12,
            speed: 350,
        },
    ],
};
