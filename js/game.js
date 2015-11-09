'use strict';

(function() {

    var WHITE = 1,
        BLACK = 2;

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
    }

    var Game = function() {
        Phaser.State.call(this);
    }

    Game.prototype = _.create(Phaser.State.prototype, {

        constructor: Game,

        preload: function() {
            this.game.load.spritesheet('piece', 'img/piece.png', 64, 64);
            this.game.load.image('board', 'img/board.png');
            this.game.load.image('background', 'img/bg-tile.jpg');
        },

        init: function(params) {
            this.boardX = this.game.world.centerX - 300;
            this.boardY = this.game.world.centerY - 300;

            this.startX = this.boardX + 55;
            this.startY = this.boardY + 54;
            this.cellSize = 61;

            this.gameBoard = new GameBoard();

            this.playerColor = (params.player == 'white') ? WHITE: BLACK;
        },

        create: function() {
            this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
            this.game.add.image(this.boardX, this.boardY, 'board');

            this.initGame();

            this.doGameLoop();
        },

        /**
         * init game state
         */
        initGame: function() {

            this.gameBoard.empty();
            
            this.addPiece(3, 3, WHITE);
            this.addPiece(4, 4, WHITE);
            this.addPiece(3, 4, BLACK);
            this.addPiece(4, 3, BLACK);
        },

    
        /**
         * Main game loop
         */
        doGameLoop: function() {
            var root = this;

            var playable= this.gameBoard.playable();

            if (playable.length > 0) {

                if (this.currentPlayer == 'human') {
                    if (_.includes(playable, 'human')) {
                        this.humanTurn().then(function() {
                            root.currentPlayer = 'computer';
                            root.doGameLoop();
                        });

                    } else {
                        this.skipTurn('human');
                    }

                } else {

                    if (_.includes(playable, 'computer')) {

                        this.computerTurn().then(function() {
                            root.currentPlayer = 'human';
                            root.doGameLoop();
                        });

                    } else {
                        this.skipTurn('computer');
                    }
                }

            } else {
                // TODO: show result screen
            }
        },

        humanTurn: function() {
            
            var deferred = Q.defer();

            // wait for human input
            window.setTimeout(function() {
                console.log('human turn over');
                deferred.resolve();

            }, 1000);

            return deferred.promise;
        },

        computerTurn: function() {
            var deferred = Q.defer();

            // wait for human input
            window.setTimeout(function() {
                console.log('computer turn over');
                deferred.resolve();

            }, 1000);

            return deferred.promise;
        },

        /**
         * add a piece to the board
         */
        addPiece: function(x, y, color) {
            var posX = this.cellSize * x + this.startX,
                posY = this.cellSize * y + this.startY,
                frame = (color == WHITE) ? 0 : 24;


            var piece = this.game.add.sprite(posX, posY, 'piece', frame);
            piece.animations.add('flip-to-black', _.range(0, 23), 24, false);
            piece.animations.add('flip-to-white', _.range(24, 47), 24, false);

            piece.color = color;

            piece.flipToBlack = function() {
                this.animations.play('flip-to-black');
                this.color = BLACK;
            }

            piece.flipToWhite = function() {
                this.animations.play('flip-to-white');
                this.color = WHITE;
            }

            piece.flip = function() {
                if (this.color == WHITE) this.flipToBlack();
                else this.flipToWhite();
            }

            this.gameBoard.add(x, y, piece);

            return piece;
        }
    });

    OthelloGame.Game = Game;
})();
