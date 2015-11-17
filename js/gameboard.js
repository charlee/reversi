'use strict';

define(['consts/dir', 'consts/color'], function(DIR, COLOR) {
    
    var instance = null;

    function GameBoard() {
        this.initialize();
    }

    GameBoard.prototype = {
        constructor: GameBoard,

        initialize: function() {
            this.pieces = [];
            for (var x = 0; x < 8; x++) {
                this.pieces[x] = [];
                for (var y = 0; y < 8; y++) {
                    this.pieces[x][y] = COLOR.EMPTY;;
                }
            }
        },

        empty: function() {
            this.initialize();
        },

        add: function(x, y, color, checkFlip) {

            this.pieces[x][y] = color;

            if (checkFlip) {
                // find flipable pieces
                var dirs = _.values(DIR),
                    flipablePieces = [];

                for (var i = 0; i < dirs.length; i++) {
                    var flipables = this._checkDir(x, y, dirs[i], color);
                    if (flipables) {
                        for (var j = 0; j < flipables.length; j++) {
                            flipablePieces.push(flipables[j]);
                        }
                    }
                }
                return flipablePieces;
            }
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
            if (this.pieces[x][y] == COLOR.WHITE || this.pieces[x][y] == COLOR.BLACK) return false;
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
            var flipables = [];

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
                    // push current checked cell
                    flipables.push({ x: x, y: y });

                    // move to next
                    x += dx; y += dy;

                    dc = this._validColor(x, y);
                    if (dc == color) {
                        // found own piece, playable
                        return flipables;
                    } else if (dc == null) {
                        // got invalid cell not playable
                        return null;
                    } else {
                        // else continue to check next cell
                    }
                }
            } else {
                // adjacent color is not opponent, can't play this cell
                return null;
            }
        },

        /**
         * Vaildate cooridate (x, y) and return its color if possilbe
         */
        _validColor: function(x, y) {
            return (x >= 0 && x < 8 && y >= 0 && y < 8) ? this.pieces[x][y] : null;
        }
    };


    return GameBoard;
});
