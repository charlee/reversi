'use strict';


define(['lib/phaser', 'lib/q', 'lib/lodash', 'consts/color', 'consts/player', 'gameboard'], function(Phaser, $q, _, COLOR, PLAYER, gameBoard) {


    function Game() {
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

            this.humanColor = params.humanColor;
            this.computerColor = -this.humanColor;
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

            gameBoard.empty();
            
            this.addPiece(3, 3, COLOR.WHITE);
            this.addPiece(4, 4, COLOR.WHITE);
            this.addPiece(3, 4, COLOR.BLACK);
            this.addPiece(4, 3, COLOR.BLACK);
        },

    
        /**
         * Main game loop
         */
        doGameLoop: function() {
            var root = this;

            var playable= gameBoard.playable();

            if (playable.length > 0) {

                if (this.currentPlayer == PLAYER.HUMAN) {
                    if (_.includes(playable, PLAYER.HUMAN)) {
                        this.humanTurn().then(function() {
                            root.currentPlayer = PLAYER.COMPUTER;
                            root.doGameLoop();
                        });

                    } else {
                        this.skipTurn(PLAYER.COMPUTER);
                    }

                } else {

                    if (_.includes(playable, PLAYER.COMPUTER)) {

                        this.computerTurn().then(function() {
                            root.currentPlayer = PLAYER.HUMAN;
                            root.doGameLoop();
                        });

                    } else {
                        this.skipTurn(PLAYER.COMPUTER);
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
                frame = (color == COLOR.WHITE) ? 0 : 24;


            var piece = this.game.add.sprite(posX, posY, 'piece', frame);
            piece.animations.add('flip-to-black', _.range(0, 23), 24, false);
            piece.animations.add('flip-to-white', _.range(24, 47), 24, false);

            piece.color = color;

            piece.flipToBlack = function() {
                this.animations.play('flip-to-black');
                this.color = COLOR.BLACK;
            }

            piece.flipToWhite = function() {
                this.animations.play('flip-to-white');
                this.color = COLOR.WHITE;
            }

            piece.flip = function() {
                if (this.color == COLOR.WHITE) this.flipToBlack();
                else this.flipToWhite();
            }

            gameBoard.add(x, y, piece);

            return piece;
        }
    });

    return Game;

});
