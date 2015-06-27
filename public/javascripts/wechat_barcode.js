// Wechat popover
define(['jquery', 'bootstrap'], function ($) {
    $('#wechat').popover({
        title: "WeChat Barcode",
        delay: { "show": 500, "hide": 100 },
        container: 'body',
        content: "<img src='/images/wechat_barcode.jpg' height='200' width='200'>",
        html: true,
        placement: 'top',
        trigger: 'hover'
    });
});
