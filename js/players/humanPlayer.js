'use strict';

define(['lib/lodash', 'lib/q', './player'], function(_, $q, Player ) {

    function HumanPlayer() {
        Player.call(this);
    }

    HumanPlayer.prototype = _.create(Player.prototype, {

        constructor: HumanPlayer,

        getMove: function(color) {
            var root = this,
                deferred = $q.defer();

            if (!color) color = this.color;

            var playableCells = this.gameBoard.playableCells(color);
            

            this.setOnClickHandler(function(pos) {
                for (var i = 0; i < playableCells.length; i++) {
                    if (playableCells[i].x == pos.x && playableCells[i].y == pos.y) {
                        root.setOnClickHandler(null);
                        console.log('human: (' + pos.x + ', ' + pos.y + ')');
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
