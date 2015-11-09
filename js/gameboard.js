'use strict';

define(['constants'], function(constants) {
    
    var instance = null;

    function GameBoard() {
        if (instance != null) {
            throw new Error('Cannot instantiate more than one GameBoard, use GameBoard.getInstance()');
        }

        this.initialize();
    }

    GameBoard.getInstance = function() {
        if (instance === null) {
            instance = new GameBoard();
        }

        return instance;
    }

    GameBoard.prototype = {
        constructor: GameBoard,

        initialize: function() {
            this.pieces = [];
            for (var i = 0; i < 8; i++) {
                this.pieces.push([]);
            }
        },

        empty: function() {
            for (var i = 0; i < this.pieces.length; i++) {
                for (var j = 0; j < this.pieces.length; j++) {
                    if (this.pieces[i][j] && this.pieces[i][j] instanceof Phaser.Sprite) {
                        this.pieces[i][j].kill();
                        this.pieces[i][j] = null;
                    }
                }
            }
        },

        setPlayerColor: function(color) {
            this.playerColor = color;
        },

        add: function(x, y, piece) {
            this.pieces[x][y] = piece;
        },
        
        /**
         * Test if the board is playable.
         * @return Array of whom can play the next step.
         */
        playable: function() {
            return true;
        },

        _cellPlayable: function(x, y, color) {
            if (this.pieces[x][y]) return false;
            else {
                
            }
        },
    };


    return GameBoard.getInstance();
});
