// Niveau 6 - Couloir Maudit
// Cours ou meurs
// Légende : 0=vide, 1=mur, 2=pics, 3=spawn, 4=porte, 5=plateforme H, 6=plateforme V, 7=trou, 8=crusher
// Grille : 48 colonnes x 22 lignes (étendu vers le bas pour la porte maudite souterraine)
// Le sol s'effondre colonne par colonne 1 seconde après le spawn

LEVELS[5] = {
    name: "Couloir Maudit",
    subtitle: "Cours ou meurs",
    map: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 1
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 2
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 3   plateforme (porte maudite 11)
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 4
        [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 5   plateforme très haute (porte maudite 8)
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0], // 6   marche → porte maudite 11
        [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0], // 7   plateforme (porte maudite 7)
        [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0], // 8
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0], // 9   marche → porte maudite 7
        [0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 10  plateforme haute (porte maudite 2)
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0], // 11  marche → porte maudite 7
        [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0], // 12  marche 3 → porte haute
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0], // 13  plateforme moyenne (porte maudite 3)
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 14  marche 2 → porte haute
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 15  marche 1 → porte haute + marche → porte mi-hauteur
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 16  spawn
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 17  sol
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 18
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0], // 19  VRAIE porte (cachée sous le sol)
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,0], // 20  plateformes souterraines
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 21
        [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 22  plateforme souterraine profonde (porte maudite 10)
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 23
    ],

    traps: [
        // Porte maudite 1 — au sol, mi-chemin
        {
            id: 'cursed_door_mid',
            type: 'cursed_door',
            col: 24,
            row: 16,
        },
        // Porte maudite 2 — en hauteur (plateforme row 10)
        {
            id: 'cursed_door_high',
            type: 'cursed_door',
            col: 11,
            row: 9,
        },
        // Porte maudite 3 — mi-hauteur (plateforme row 13)
        {
            id: 'cursed_door_medium',
            type: 'cursed_door',
            col: 35,
            row: 12,
        },
        // Porte maudite 4 — sous le sol (plateforme row 20, accessible quand le sol tombe)
        {
            id: 'cursed_door_underground',
            type: 'cursed_door',
            col: 21,
            row: 19,
        },

        // Porte maudite 5 — au sol, plus loin (col 38)
        {
            id: 'cursed_door_far',
            type: 'cursed_door',
            col: 38,
            row: 16,
        },
        // Porte maudite 6 — souterraine droite (plateforme row 20)
        {
            id: 'cursed_door_underground2',
            type: 'cursed_door',
            col: 40,
            row: 19,
        },
        // Porte maudite 7 — très haut à droite (plateforme row 7)
        {
            id: 'cursed_door_top_right',
            type: 'cursed_door',
            col: 42,
            row: 6,
        },

        // Porte maudite 8 — très haute début (plateforme row 5)
        {
            id: 'cursed_door_veryhigh',
            type: 'cursed_door',
            col: 5,
            row: 4,
        },
        // Porte maudite 9 — au sol début (col 15)
        {
            id: 'cursed_door_early',
            type: 'cursed_door',
            col: 15,
            row: 16,
        },
        // Porte maudite 10 — souterraine profonde (plateforme row 22)
        {
            id: 'cursed_door_deep',
            type: 'cursed_door',
            col: 13,
            row: 21,
        },

        // Porte maudite 11 — haute au milieu (plateforme row 3)
        {
            id: 'cursed_door_mid_high',
            type: 'cursed_door',
            col: 29,
            row: 2,
        },
        // Porte maudite 12 — au sol milieu (col 28)
        {
            id: 'cursed_door_mid_floor',
            type: 'cursed_door',
            col: 28,
            row: 16,
        },
        // Porte maudite 13 — souterraine milieu (plateforme row 20)
        {
            id: 'cursed_door_mid_under',
            type: 'cursed_door',
            col: 30,
            row: 19,
        },

        // Porte maudite 14 — à la place de l'ancienne vraie porte (piège ultime)
        {
            id: 'cursed_door_fake_real',
            type: 'cursed_door',
            col: 46,
            row: 16,
        },

        // Pluie acide — commence 1 seconde après le spawn
        {
            id: 'acid_rain',
            type: 'acid_rain',
            startDelay: 1000,
            interval: 250,
            speed: 350,
            size: 3,
            color: 0x44ff44,
        },

        // Le sol s'effondre de gauche à droite, 1 seconde après le spawn
        // Chaque colonne tombe avec 200ms d'intervalle
        {
            id: 'floor_cascade',
            type: 'timed_cascade_remove',
            startDelay: 1000,
            interval: 200,
            tiles: [
                { col: 0, row: 17 },
                { col: 1, row: 17 },
                { col: 2, row: 17 },
                { col: 3, row: 17 },
                { col: 4, row: 17 },
                { col: 5, row: 17 },
                { col: 6, row: 17 },
                { col: 7, row: 17 },
                { col: 8, row: 17 },
                { col: 9, row: 17 },
                { col: 10, row: 17 },
                { col: 11, row: 17 },
                { col: 12, row: 17 },
                { col: 13, row: 17 },
                { col: 14, row: 17 },
                { col: 15, row: 17 },
                { col: 16, row: 17 },
                { col: 17, row: 17 },
                { col: 18, row: 17 },
                { col: 19, row: 17 },
                { col: 20, row: 17 },
                { col: 21, row: 17 },
                { col: 22, row: 17 },
                { col: 23, row: 17 },
                { col: 24, row: 17 },
                { col: 25, row: 17 },
                { col: 26, row: 17 },
                { col: 27, row: 17 },
                { col: 28, row: 17 },
                { col: 29, row: 17 },
                { col: 30, row: 17 },
                { col: 31, row: 17 },
                { col: 32, row: 17 },
                { col: 33, row: 17 },
                { col: 34, row: 17 },
                { col: 35, row: 17 },
                { col: 36, row: 17 },
                { col: 37, row: 17 },
                { col: 38, row: 17 },
                { col: 39, row: 17 },
                { col: 40, row: 17 },
                { col: 41, row: 17 },
                { col: 42, row: 17 },
                { col: 43, row: 17 },
                { col: 44, row: 17 },
                { col: 45, row: 17 },
                { col: 46, row: 17 },
                { col: 47, row: 17 },
            ],
        },
    ],
};
