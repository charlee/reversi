'use strict';

define(['lib/lodash', 'lib/q', './player'], function(_, $q, Player) {

    function HumanPlayer() {
        Player.call(this);
    }

    HumanPlayer.prototype = _.create(Player.prototype, {

        constructor: HumanPlayer,

        getMove: function(color) {

        }


    });

    return HumanPlayer;

});
