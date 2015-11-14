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
    gameBoard
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

            this.game.input.onTap.add(function(pointer) {
                var x = Math.floor((pointer.x - root.startX) / root.cellSize),
                    y = Math.floor((pointer.y - root.startY) / root.cellSize);
                humanPlayer.click(x, y);
            });

            this.players = {};
            //this.players[COLOR.WHITE] = (this.humanColor == COLOR.WHITE) ? humanPlayer : computerPlayer;
            //this.players[COLOR.BLACK] = (this.humanColor == COLOR.WHITE) ? computerPlayer : humanPlayer;
            this.players[COLOR.WHITE] = humanPlayer;
            this.players[COLOR.BLACK] = humanPlayer;

            this.doGameLoop();
        },

        currentPlayer: function() {
            return this.players[this.currentColor];
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

        opponentColor: function() {
            return (this.currentColor == COLOR.BLACK) ? COLOR.WHITE : COLOR.BLACK;
        },

    
        /**
         * Main game loop
         */
        doGameLoop: function() {
            var root = this;

            var currentPlayable = gameBoard.playable(this.currentColor),
                opponentPlayable = gameBoard.playable(this.opponentColor()),

                changePlayer = function() {
                    root.currentColor = root.opponentColor();
                    root.doGameLoop();
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
            var playableCells = gameBoard.playableCells(this.currentColor);
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
            this.currentPlayer().getMove(this.currentColor).then(function(pos) {
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

            gameBoard.add(x, y, piece);

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

    return Game;

});
