'use strict';

define(['lib/lodash', 'lib/q', './player', 'gameboard', 'consts/color'], function(_, $q, Player, GameBoard, COLOR) {

    var AI = {
        board: null,

        /**
         * init, copy from game board
         */
        init: function(board) {
            this.board = GameBoard.copy(board);
            this.boardStack = [];
        },

        score: [
            [ 20, -3, 11, 8, 8, 11, -3, 20 ],
            [ -3, -7, -4, 1, 1, -4, -7, -3 ],
            [ 11, -4,  2, 2, 2,  2, -4, 11 ],
            [  8,  1,  2, -3, -3, 2, 1,  8 ],
            [  8,  1,  2, -3, -3, 2, 1,  8 ],
            [ 11, -4,  2, 2, 2,  2, -4, 11 ],
            [ -3, -7, -4, 1, 1, -4, -7, -3 ],
            [ 20, -3, 11, 8, 8, 11, -3, 20 ],
        ],

        /**
         * evaluate function for current board
         */
        evaluate: function() {
            
            var myColor = this.color,
                opColor = COLOR.oppositeColor(this.color),
                myCount = 0,
                myScore = 0,
                opCount = 0,
                opScore = 0;

            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    var c = this.board.pieces[x][y];
                    if (c == myColor) {
                        myCount++;
                        myScore += this.score[x][y];
                    } else if (c == opColor) {
                        opCount++;
                        opScore += this.score[x][y];
                    }
                }
            }
            var countValue = 100 * (myCount - opCount) / (myCount + opCount);
            var scoreValue = myScore - opScore;

            var myValidMoves = this.board.playableCells(this.color),
                opponentValidMoves = this.board.playableCells(COLOR.oppositeColor(this.color)),
                myMoveCount = myValidMoves.length,
                opMoveCount = opponentValidMoves.length;
            var mobilityValue = (myMoveCount + opMoveCount == 0) ? 0 :              // avoid div by 0
                                100 * (myValidMoves.length - opponentValidMoves.length) / (myValidMoves.length + opponentValidMoves.length);

            return 10 * countValue + 40 * scoreValue + 10 * mobilityValue;
        },

        /**
         * find best move
         */
        alphaBeta: function(depth, alpha, beta, color, initial) {
            
            var result = null;

            // default value
            if (!color) color = this.color;

            // recursive exit
            if (depth == 0) {
                return this.evaluate();
            }

            var moves = this.board.playableCells(color);
            if (initial) console.log(moves);

            if (moves.length) {
                for (var i = 0; i < moves.length; i++) {
                    var move = moves[i];

                    // save game state
                    this.boardStack.push(this.board);
                    this.board = new GameBoard.copy(this.board);

                    this.board.add(move.x, move.y, color, true);

                    var value = -this.alphaBeta(depth - 1, -beta, -alpha, COLOR.oppositeColor(color));

                    // restore game state
                    this.board = this.boardStack.pop();

                    if (initial) {
                        console.log('score for (' + move.x + ', ' + move.y + ') = ' + value);
                    }

                    if (value >= beta) { 
                        if (initial) {
                            return result;
                        }
                        return beta;
                    }
                    if (value > alpha) {
                        alpha = value;
                        if (initial) {
                            result = move;
                            console.log('found better move (' + move.x + ', ' + move.y + '), score=' + value);
                        }
                    }
                }
            } else {
                // if no valid moves, skip this player
                var value = -this.alphaBeta(depth - 1, -beta, -alpha, COLOR.oppositeColor(color));
                if (value >= beta) { return beta; }
                if (value > alpha) { alpha = value; }
            }

            if (initial) {
                return result;
            } else {
                return alpha;
            }
        },
    };

    function ComputerPlayer() {
        Player.call(this);
    }

    ComputerPlayer.prototype = _.create(Player.prototype, {

        constructor: ComputerPlayer,

        getMove: function(color) {
            var deferred = $q.defer();

            if (!color) color = this.color;

            AI.init(this.gameBoard);
            

            var move = AI.alphaBeta(5, -Infinity, Infinity, this.color, true);

            window.setTimeout(function() {
                console.log('computer: (' + move.x + ', ' + move.y + ')');
                deferred.resolve(move);
            }, 100);

            return deferred.promise;
        }

    });

    return ComputerPlayer;

});

