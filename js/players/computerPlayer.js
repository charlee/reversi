'use strict';

define(['lib/lodash', 'lib/q', './player'], function(_, $q, Player) {

    var AI = {
        board: null,

        /**
         * init, copy from game board
         */
        init: function() {

            console.log(this.board);
        },

        validMoves: function() {
        },

        /**
         * evaluate function for current board
         */
        evaluate: function() {
            return 0;
        },

        /**
         * find best move
         */
        negaMax: function(depth) {
        },
    };

    function ComputerPlayer() {
        Player.call(this);
    }

    ComputerPlayer.prototype = _.create(Player.prototype, {

        constructor: ComputerPlayer,

        getMove: function(color) {
            var deferred = $q.defer();

            AI.init();
            
            var playableCells = this.gameBoard.playableCells(color);

            console.log('computer turn');

            window.setTimeout(function() {
                deferred.resolve(playableCells[0]);
            }, 100);

            return deferred.promise;
        }

    });

    return ComputerPlayer;

});

