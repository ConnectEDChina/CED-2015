define(function (require) {

    var $ = require('jquery'),
        bootstrap = require('bootstrap'),
        owl = require('owl.carousel'),
        bt_select = require('bootstrap-select'),
        wechat = require('wechat_barcode'),
        centerSlider = require('centerSlider'),
        analytics = require('analytics');
        

    $(document).ready(function($) {

        //  Owl Carousel
        if ($('.owl-carousel').length > 0) {
            // Set carousel width
            $('#slider').width($(window).width());
            $("#slider").owlCarousel({
                center: true,
                autoplay: true,
                autoplayTimeout: 5000,
                mouseDrag: true,
                items: 1,
                responsiveClass: true,
                responsiveBaseElement: ".slide",
                dots: false,
                animateOut: 'fadeOut',
                navigationText: ["",""],
                loop: true,
                lazyLoad: true
            });
        }

        centerSlider();

        //  Tabs height animation
        if ( $(window).width() > 980 ) {
            $('.tab-content').height( $('.tab-content .tab-pane').height() + 20 );
            $('.tab-content').addClass('inherit');
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var _height = $( $(this).attr('href') + '.tab-pane .panel-group' ).height() + 20;
                $('.tab-content').css('height', _height);
                $('.tab-content').css('overflow', 'visible');
            });
        }

        // bootstrap select
        
        $('.selectpicker').selectpicker({
            style: 'btn-default'
        });
    });


    $(window).on('resize', function(){
        // Set carousel width
        $('#slider').width($(window).width());
        centerSlider();
    });

    var requestSent = false;

    $('#signup_submit_ID').on('click', function() {
        require(['CED-validate'], function (vldt) {
            vldt($('#sign-up-form'));

            $('#success_info').addClass('hidden');

            var validateRes = $('#sign-up-form').valid();

            if (validateRes) {

                var intention = $('#signup_intention_ID');
                if (intention.val() === ""){
                    // popup modal for ticket error
                    $('#intention_error').modal('show');
                    return;                
                }

                if (!requestSent) {
                    requestSent = true;
                    $.ajax({
                        type: 'POST',
                        url: '/submitSignUpForm',
                        data: $('#sign-up-form').serialize()
                    })
                    .done(function() {
                        $('#sign-up-form')[0].reset();
                        $('#success_info_chn').removeClass('hidden');
                    })
                    .fail(function() {
                        console.log("error submit signup");
                    })
                    .always(function() {
                        requestSent = false;
                    });
                }
            }
        });
    });
});