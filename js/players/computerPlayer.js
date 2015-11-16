'use strict';

define(['lib/lodash', 'lib/q', './player', '../gameboard'], function(_, $q, Player, gameBoard) {

    function ComputerPlayer() {
        Player.call(this);
    }

    ComputerPlayer.prototype = _.create(Player.prototype, {

        constructor: ComputerPlayer,

        getMove: function(color) {
            var deferred = $q.defer();
            
            var playableCells = gameBoard.playableCells(color);

            console.log('computer turn');

            window.setTimeout(function() {
                deferred.resolve(playableCells[0]);
            }, 100);

            return deferred.promise;
        }

    });

    return ComputerPlayer;

});

