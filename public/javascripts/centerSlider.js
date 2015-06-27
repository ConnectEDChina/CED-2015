define(['setImageHeight'], function (setImageHeight) {
    return function () {
        if ( $(window).width() <= 1024) {
            var imageWidth = $('#slider .slide img').width();
            var imageHeight = $('#slider .slide img').height();
            // var ratio = imageWidth / imageHeight;
            var ratio = 2.08333;
            $('#slider .slide').height( $(window).width() / ratio );
            $('#slider').height( $('#slider .slide').height() + $('.overlay').height() );
        }
        setImageHeight();
    };
});