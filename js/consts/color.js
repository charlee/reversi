'use strict';

define([], function() {
    return {
        BLACK: 'b',
        WHITE: 'w',
        EMPTY: 'e',

        oppositeColor: function(color) {
            return (color == this.BLACK) ? this.WHITE : this.BLACK;
        }
    };
});

