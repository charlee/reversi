'use strict';

define(['consts/dir', 'consts/color'], function(DIR, COLOR) {
    
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
        playable: function(color) {
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    if (this._cellPlayable(x, y, color)) {
                        return true;
                    };
                }
            }

            return false;
        },

        /**
         * Get all playable cells
         */
        playableCells: function(color) {
            var result = [];
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    if (this._cellPlayable(x, y, color)) {
                        result.push({ x: x, y: y });
                    };
                }
            }

            return result;
        },

        /**
         * Chec if cell (x, y) is playable by color
         */
        _cellPlayable: function(x, y, color) {
            if (this.pieces[x][y]) return false;
            else {
                var dirs = _.values(DIR);
                for (var i = 0; i < dirs.length; i++) {
                    if (this._checkDir(x, y, dirs[i], color)) {
                        return true;
                    }
                }
            }

            return false;
        },

        /**
         * Check (x, y) to see if color is playable on direction `dir`
         */
        _checkDir: function(x, y, dir, color) {
            var dx = 0, dy = 0;
            switch (dir) {
                case DIR.UP: dx = 0, dy = -1; break;
                case DIR.UPRIGHT: dx = 1, dy = -1; break;
                case DIR.RIGHT: dx = 1, dy = 0; break;
                case DIR.DOWNRIGHT: dx = 1, dy = 1; break;
                case DIR.DOWN: dx = 0, dy = 1; break;
                case DIR.DOWNLEFT: dx = -1, dy = 1; break;
                case DIR.LEFT: dx = -1, dy = 0; break;
                case DIR.UPLEFT: dx = -1, dy = -1; break;
            }

            x += dx; y += dy;
            var dc = this._validColor(x, y);
            if (dc == COLOR.oppositeColor(color)) {
                // adjacent color is opponent's color, check following cells
                while (true) {
                    x += dx; y += dy;
                    dc = this._validColor(x, y);
                    if (dc == color) {
                        // found own piece, playable
                        return true;
                    } else if (dc == null) {
                        // got invalid cell not playable
                        return false;
                    } else {
                        // else continue to check next cell
                    }
                }
            } else {
                // adjacent color is not opponent, can't play this cell
                return false;
            }
        },

        /**
         * Vaildate cooridate (x, y) and return its color if possilbe
         */
        _validColor: function(x, y) {
            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (this.pieces[x][y]) return this.pieces[x][y].color;
                else return COLOR.EMPTY;
            } else {
                return null;
            }
        }
    };


    return GameBoard.getInstance();
});
