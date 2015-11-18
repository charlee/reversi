'use strict';

/**
 * Base class for players
 */

define([], function() {

    function Player() {
    }


    Player.prototype = {
        constructor: Player,
        getMove: function(color) {
        },

        setGameBoard: function(gameBoard) {
            this.gameBoard = gameBoard;
        },

        setColor: function(color) {
            this.color = color;
        },
    };


    return Player;
});
