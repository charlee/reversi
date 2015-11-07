'use strict';

(function() {

    var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game-canvas');

    game.state.add('title', OthelloGame.Title);
    game.state.add('game', OthelloGame.Game);

    // start game
    game.state.start('title');

})();
