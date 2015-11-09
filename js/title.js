'use strict';

(function() {


    if (!window.OthelloGame) { window.OthelloGame = {}; }

    var Title = function() {
        Phaser.State.call(this);
    }

    Title.prototype = _.create(Phaser.State.prototype, {
        
        constructor: Title,
        preload: function() {
            this.game.load.image('title-img', 'img/title.png');
            this.game.load.spritesheet('start-button', 'img/start-button.png', 335, 74);
        },

        init: function() {
        },

        create: function() {

            var root = this;

            this.game.add.image(0, 0, 'title-img');
            this.game.add.text(this.game.world.centerX - 200, 50, "Othello", { font: "120px Arial", fill: "#ffffff", align: "center" });
            this.game.add.button(this.game.world.centerX - 178, 490, 'start-button', function() {
                root.state.start('game', true, false, { player: 'white' });    
            }, this, 1, 0, 2);
            this.game.add.button(this.game.world.centerX - 178, 580, 'start-button', function() {
                root.state.start('game', true, false, { player: 'black' });    
            }, this, 4, 3, 5);
        },

    });

    OthelloGame.Title = Title;

})();
