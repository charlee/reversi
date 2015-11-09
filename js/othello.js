'use strict';

requirejs.config({

    paths: {
        'lib/phaser': '../node_modules/phaser/dist/phaser',
        'lib/lodash': '../node_modules/lodash/index',
        'lib/q': '../node_modules/q/q',
    },


    shim: {
        'lib/phaser': {
            exports: 'Phaser'
        }
    },
});

require(['lib/phaser', 'lib/lodash', 'title', 'game'], function(Phaser, _, Title, Game) {

    var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game-canvas');

    game.state.add('title', Title);
    game.state.add('game', Game);

    // start game
    game.state.start('title');
});


