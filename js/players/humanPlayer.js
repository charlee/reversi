'use strict';

define(['lib/lodash', 'lib/q', './player', '../gameboard'], function(_, $q, Player, gameBoard) {

    function HumanPlayer() {
        Player.call(this);
    }

    HumanPlayer.prototype = _.create(Player.prototype, {

        constructor: HumanPlayer,

        getMove: function(color) {
            var root = this,
                deferred = $q.defer();

            var playableCells = gameBoard.playableCells(color);
            console.log(playableCells);
            
            console.log('human turn');

            this.setOnClickHandler(function(pos) {
                console.log(pos);
                for (var i = 0; i < playableCells.length; i++) {
                    if (playableCells[i].x == pos.x && playableCells[i].y == pos.y) {
                        root.setOnClickHandler(null);
                        deferred.resolve(pos);
                        return;
                    }
                }
            });

            return deferred.promise;

        },

        setOnClickHandler: function(f) {
            this.onClickHandler = f;
        },

        /**
         * Should be called when board is clicked to notify human player to go
         */
        click: function(x, y) {
            if (this.onClickHandler) this.onClickHandler({ x: x, y: y });
        }

    });

    return HumanPlayer;

});
