'use strict';

define(['lib/phaser', 'lib/lodash', 'consts/color'], function(Phaser, _, COLOR) {

    function Title() {
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
            this.game.add.text(this.game.world.centerX - 200, 50, "Reversi", { font: "120px Arial", fill: "#ffffff", align: "center" });
            this.game.add.button(this.game.world.centerX - 178, 490, 'start-button', function() {
                root.state.start('game', true, false, { humanColor: COLOR.WHITE });    
            }, this, 1, 0, 2);
            this.game.add.button(this.game.world.centerX - 178, 580, 'start-button', function() {
                root.state.start('game', true, false, { humanColor: COLOR.BLACK });    
            }, this, 4, 3, 5);
        },

    });

    return Title;
});

