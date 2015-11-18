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

        /**
         * evaluate function for current board
         */
        evaluate: function() {
            var myPieceCount = this.board.count(this.color),
                opponentPieceCount = this.board.count(COLOR.oppositeColor(this.color));

            return myPieceCount - opponentPieceCount;
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
            for (var i = 0; i < moves.length; i++) {
                var move = moves[i];

                // save game state
                this.boardStack.push(this.board);
                this.board = new GameBoard.copy(this.board);

                this.board.add(move.x, move.y, color, true);

                var value = -this.alphaBeta(depth - 1, -beta, -alpha, COLOR.oppositeColor(color));

                // restore game state
                this.board = this.boardStack.pop();

                if (value >= beta) { return beta; }
                if (value > alpha) {
                    alpha = value;
                    if (initial) result = move;
                }
            }

            if (initial) {
                return move;
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

