'use strict';

define(['lib/lodash', 'lib/q', './player'], function(_, $q, Player) {

    function ComputerPlayer() {
        Player.call(this);
    }

    ComputerPlayer.prototype = _.create(Player.prototype, {

        constructor: ComputerPlayer,

        getMove: function(color) {

        }


    });

    return ComputerPlayer;

});

