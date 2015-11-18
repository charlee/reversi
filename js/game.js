'use strict';


define([
    'lib/phaser',
    'lib/q',
    'lib/lodash',
    'consts/color',
    'consts/player',
    'players/humanPlayer',
    'players/computerPlayer',
    'gameboard'
], function(Phaser,
    $q,
    _,
    COLOR,
    PLAYER,
    HumanPlayer,
    ComputerPlayer,
    GameBoard
) {


    function Game() {
        Phaser.State.call(this);
    }

    Game.prototype = _.create(Phaser.State.prototype, {

        constructor: Game,

        preload: function() {
            this.game.load.spritesheet('piece', 'img/piece.png', 64, 64);
            this.game.load.image('board', 'img/board.png');
            this.game.load.image('background', 'img/bg-tile.jpg');
            this.game.load.image('marker', 'img/marker.png');
        },

        init: function(params) {
            this.boardX = this.game.world.centerX - 300;
            this.boardY = this.game.world.centerY - 300;

            this.startX = this.boardX + 55;
            this.startY = this.boardY + 54;
            this.cellSize = 61;

            this.gameBoard = new GameBoard();
            this.pieces = [];
            for (var i = 0; i < 8; i++) {
                this.pieces.push([]);
            }

            // get human's color choice
            this.humanColor = params.humanColor;

            // set white first
            this.currentColor = COLOR.WHITE;
        },

        create: function() {
            var root = this;

            this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
            this.game.add.image(this.boardX, this.boardY, 'board');

            this.playableMarkers = this.game.add.group();

            this.initGame();

            // init player objects
            var humanPlayer = new HumanPlayer(),
                computerPlayer = new ComputerPlayer();

            humanPlayer.setGameBoard(this.gameBoard);
            computerPlayer.setGameBoard(this.gameBoard);

            this.game.input.onTap.add(function(pointer) {
                var x = Math.floor((pointer.x - root.startX) / root.cellSize),
                    y = Math.floor((pointer.y - root.startY) / root.cellSize);
                humanPlayer.click(x, y);
            });

            this.players = {};
            this.players[COLOR.WHITE] = (this.humanColor == COLOR.WHITE) ? humanPlayer : computerPlayer;
            this.players[COLOR.BLACK] = (this.humanColor == COLOR.WHITE) ? computerPlayer : humanPlayer;

            this.players[COLOR.WHITE].setColor(COLOR.WHITE);
            this.players[COLOR.BLACK].setColor(COLOR.BLACK);

            this.doGameLoop();
        },

        currentPlayer: function() {
            return this.players[this.currentColor];
        },

        /**
         * init game state
         */
        initGame: function() {

            this.gameBoard.empty();
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    if (this.pieces[x][y]) this.pieces[x][y].kill();
                    this.pieces[x][y] = null;
                }
            }
            
            this.addPiece(3, 3, COLOR.WHITE);
            this.addPiece(4, 4, COLOR.WHITE);
            this.addPiece(3, 4, COLOR.BLACK);
            this.addPiece(4, 3, COLOR.BLACK);
        },

        opponentColor: function() {
            return (this.currentColor == COLOR.BLACK) ? COLOR.WHITE : COLOR.BLACK;
        },

    
        /**
         * Main game loop
         */
        doGameLoop: function() {
            var root = this;

            var currentPlayable = this.gameBoard.playable(this.currentColor),
                opponentPlayable = this.gameBoard.playable(this.opponentColor()),

                changePlayer = function() {
                    console.log('change playter after 1s');
                    window.setTimeout(function() {
                        console.log('change player');
                        root.currentColor = root.opponentColor();
                        root.doGameLoop();
                    }, 1000);
                };

            if (currentPlayable || opponentPlayable) {

                if (currentPlayable) {
                    this.showMarkers();
                    this.playTurn().then(changePlayer);
                } else {
                    this.skipTurn().then(changePlayer);
                }


            } else {
                // TODO: show result screen
            }
        },

        showMarkers: function() {
            this.playableMarkers.removeAll();
            var playableCells = this.gameBoard.playableCells(this.currentColor);
            for (var i = 0; i < playableCells.length; i++) {
                this.addMarker(playableCells[i].x, playableCells[i].y);
            }
        },

        skipTurn: function(player) {
            var deferred = $q.defer();

            window.setTimeout(function() {
                console.log("skipped turn for " + (player == PLAYER.HUMAN) ? 'human' : 'computer');
                deferred.resolve();
            }, 1000);

            return deferred.promise;
        },

        playTurn: function() {
            var deferred = $q.defer(),
                root = this;

            // wait for human input
            this.currentPlayer().getMove().then(function(pos) {
                root.addPiece(pos.x, pos.y, root.currentColor);
                deferred.resolve();
            });

            return deferred.promise;
        },

        skipTurn: function() {
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

            this.pieces[x][y] = piece;
            var flipables = this.gameBoard.add(x, y, color, true);
            for (var i = 0; i < flipables.length; i++) {
                var pos = flipables[i];
                this.pieces[pos.x][pos.y].flip();

                // TODO: add callback when animation ends
            }


            return piece;
        },

        /**
         * Add a playable marker to the board
         */
        addMarker: function(x, y) {
            var posX = this.cellSize * x + this.startX,
                posY = this.cellSize * y + this.startY;

            var marker = this.game.add.sprite(posX, posY, 'marker');
            this.playableMarkers.add(marker);

            return marker;
        }
    });

    GameBoard.copy = function(gameBoard) {
        var board = new GameBoard();
        board.pieces = _.clone(gameBoard.pieces, true);

        return board;
    };

    return Game;

});
