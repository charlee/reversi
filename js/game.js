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
            this.game.load.image('msgboard', 'img/message-board.png');
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

            var textStyle = { font: '24px Arial', fill: '#000000', align: 'left' };
            if (this.humanColor == COLOR.WHITE) {
                this.game.add.text(this.boardX + 64, 30, 'Player', textStyle);
                this.game.add.text(this.boardX + 426, 30, 'Computer', textStyle);
            } else {
                this.game.add.text(this.boardX + 64, 30, 'Computer', textStyle);
                this.game.add.text(this.boardX + 466, 30, 'Player', textStyle);
            }
            this.game.add.sprite(this.boardX, 16, 'piece', 0);
            this.game.add.sprite(this.boardX + 550, 16, 'piece', 24);
            this.whiteCount = this.game.add.text(this.boardX + 220, 30, '2', textStyle);
            this.blackCount = this.game.add.text(this.boardX + 360, 30, '2', textStyle);

            this.doGameLoop();
        },

        currentPlayer: function() {
            return this.players[this.currentColor];
        },

        /**
         * init game state
         */
        initGame: function() {
            
            var boardSetup = [
                '........',
                '........',
                '........',
                '...bw...',
                '...wb...',
                '........',
                '........',
                '........',
            ];

            this.gameBoard.empty();
            for (var y = 0; y < 8; y++) {
                for (var x = 0; x < 8; x++) {
                    if (this.pieces[x][y]) this.pieces[x][y].kill();
                    var ch = boardSetup[y].charAt(x);
                    if (ch == '.') {
                        this.pieces[x][y] = null;
                    } else {
                        this.addPiece(x, y, ch, false);
                    }
                }
            }

            // set white first
            this.currentColor = COLOR.WHITE;
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
                    // update score
                    root.whiteCount.text = root.gameBoard.count(COLOR.WHITE);
                    root.blackCount.text = root.gameBoard.count(COLOR.BLACK);
                    
                    // change to next player
                    window.setTimeout(function() {
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
                var whiteCount = this.gameBoard.count(COLOR.WHITE),
                    blackCount = this.gameBoard.count(COLOR.BLACK);
                this.showMsg('Game end, ' + ((whiteCount > blackCount) ? 'WHITE wins!' : (whiteCount < blackCount) ? 'BLACK wins!' : 'tie!'));
            }
        },

        showMarkers: function() {
            this.playableMarkers.removeAll();
            var playableCells = this.gameBoard.playableCells(this.currentColor);
            for (var i = 0; i < playableCells.length; i++) {
                this.addMarker(playableCells[i].x, playableCells[i].y);
            }
        },

        skipTurn: function() {
            var msg = 'No valid move for ' + ((this.currentColor == COLOR.WHITE) ? 'white': 'black') + ', skip turn';
            return this.showMsg(msg);
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
        addPiece: function(x, y, color, checkFlip) {

            // set default value
            if (checkFlip == null) checkFlip = true;

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

            if (checkFlip) {
                var flipables = this.gameBoard.add(x, y, color, true);
                for (var i = 0; i < flipables.length; i++) {
                    var pos = flipables[i];
                    this.pieces[pos.x][pos.y].flip();

                    // TODO: add callback when animation ends
                }
            } else {
                this.gameBoard.add(x, y, color, false);
            }

            return piece;
        },

        /**
         * Show message box
         */
        showMsg: function(msg, timeout) {
            
            if (!timeout) timeout = 2000;
            var deferred = $q.defer();

            var msgbox = this.game.add.sprite(206, 200, 'msgboard'),
                msg = this.game.add.text(260, 260, msg);

            window.setTimeout(function() {
                msgbox.kill();
                msg.kill();
                deferred.resolve();
            }, timeout);

            return deferred.promise;
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
