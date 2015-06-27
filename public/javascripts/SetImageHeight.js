define(['jquery'], function ($) {
    return function () {
        var imageWidth = $('#slider .slide img').width();
        var viewPortWidth = $(window).width();
        var centerImage = ( imageWidth/2 ) - ( viewPortWidth/2 );
        $('#slider .slide img').css('left', -centerImage);
    };
});