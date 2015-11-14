'use strict';

define(['lib/lodash', 'lib/q', './player', '../gameboard'], function(_, $q, Player, gameBoard) {

    function ComputerPlayer() {
        Player.call(this);
    }

    ComputerPlayer.prototype = _.create(Player.prototype, {

        constructor: ComputerPlayer,

        getMove: function(color) {
            var deferred = $q.defer();
            
            console.log('computer turn');
            window.setTimeout(function() {
                deferred.resolve({ x: 1, y: 2 });
            }, 1000);

            return deferred.promise;


        }


    });

    return ComputerPlayer;

});

