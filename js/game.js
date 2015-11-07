'use strict';

(function() {

    if (!window.OthelloGame) { window.OthelloGame = {}; }

    function GameBoard() {
        this.pieces = [];
        for (var i = 0; i < 8; i++) {
            this.pieces.push([]);
        }
    }

    GameBoard.prototype = {
        constructor: GameBoard,
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

        add: function(x, y, piece) {
            this.pieces[x][y] = piece;
        }
    }

    var Game = function() {
        Phaser.State.call(this);
    }

    Game.prototype = _.create(Phaser.State.prototype, {

        constructor: Game,

        WHITE: 1,
        BLACK: 2,

        preload: function() {
            this.game.load.spritesheet('piece', 'img/piece.png', 64, 64);
            this.game.load.image('board', 'img/board.png');
            this.game.load.image('background', 'img/bg-tile.jpg');
        },

        init: function() {
            this.boardX = this.game.world.centerX - 300;
            this.boardY = this.game.world.centerY - 300;

            this.startX = this.boardX + 55;
            this.startY = this.boardY + 54;
            this.cellSize = 61;

            this.gameBoard = new GameBoard();
        },

        create: function() {
            this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
            this.game.add.image(this.boardX, this.boardY, 'board');

            this.initGame();
        },

        /**
         * init game state
         */
        initGame: function() {

            this.gameBoard.empty();
            
            this.addPiece(3, 3, this.WHITE);
            this.addPiece(4, 4, this.WHITE);
            this.addPiece(3, 4, this.BLACK);
            this.addPiece(4, 3, this.BLACK);
        },


        addPiece: function(x, y, color) {
            var posX = this.cellSize * x + this.startX,
                posY = this.cellSize * y + this.startY,
                frame = (color == this.WHITE) ? 0 : 24;


            var piece = this.game.add.sprite(posX, posY, 'piece', frame);
            piece.animations.add('flip-to-black', _.range(0, 23), 24, false);
            piece.animations.add('flip-to-white', _.range(24, 47), 24, false);

            piece.color = color;

            piece.flipToBlack = function() {
                this.animations.play('flip-to-black');
                this.color = this.BLACK;
            }

            piece.flipToWhite = function() {
                this.animations.play('flip-to-white');
                this.color = this.WHITE;
            }

            piece.flip = function() {
                if (this.color == this.WHITE) this.flipToBlack();
                else this.flipToWhite();
            }

            this.gameBoard.add(x, y, piece);

            return piece;
        }
    });

    OthelloGame.Game = Game;
})();
