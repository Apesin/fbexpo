(function ($) {

    var pluginName = 'flipclock';

    var methods = {
        pad: function (n) {
            return (n < 10) ? n : n;
        },
        calculateTimeRemaining: function (endTime) {
            var now = new Date();
            var end = new Date(endTime);
            var diff = Math.floor((end - now) / 1000);
        
            if (diff < 0) {
                diff = 0;
            }
        
            var days = Math.floor(diff / (24 * 60 * 60));
            var hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
            var minutes = Math.floor((diff % (60 * 60)) / 60);
        
            return {
                'D': { 'd2': this.pad(Math.floor(days / 10)), 'd1': this.pad(days % 10) },
                'h': { 'd2': this.pad(Math.floor(hours / 10)), 'd1': this.pad(hours % 10) },
                'm': { 'd2': this.pad(Math.floor(minutes / 10)), 'd1': this.pad(minutes % 10) },
                's': { 'd2': '0', 'd1': '0' } 
            };
        },
        
        play: function (c) {
            $('body').removeClass('play');
            var a = $('ul' + c + ' section.active');
            if (a.html() == undefined) {
                a = $('ul' + c + ' section').eq(0);
                a.addClass('ready')
                    .removeClass('active')
                    .next('section')
                    .addClass('active')
                    .closest('body')
                    .addClass('play');
            } else if (a.is(':last-child')) {
                $('ul' + c + ' section').removeClass('ready');
                a.addClass('ready').removeClass('active');
                a = $('ul' + c + ' section').eq(0);
                a.addClass('active')
                    .closest('body')
                    .addClass('play');
            } else {
                $('ul' + c + ' section').removeClass('ready');
                a.addClass('ready')
                    .removeClass('active')
                    .next('section')
                    .addClass('active')
                    .closest('body')
                    .addClass('play');
            }
        },
        ul: function (c, d2, d1, label) {
            return '<ul class="flip ' + c + '" style="font-size:80px;">' + this.li('d2', d2) + this.li('d1', d1) + '<p style="font-size:30px;">' + label + '</p></ul>';
        },
        li: function (c, n) {
            return '<li class="' + c + '"><section class="ready"><div class="up">'
                + '<div class="shadow"></div>'
                + '<div class="inn"></div></div>'
                + '<div class="down">'
                + '<div class="shadow"></div>'
                + '<div class="inn"></div></div>'
                + '</section><section class="active"><div class="up">'
                + '<div class="inn">' + n + '</div></div>'
                + '<div class="down">'
                + '<div class="shadow"></div>'
                + '<div class="inn">' + n + '</div></div>'
                + '</section></li>';
        }
    };

    function Plugin(element, countdownTime) {
        this.element = element;
        this.countdownTime = countdownTime;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var t;

            if (this.countdownTime) {
                t = methods.calculateTimeRemaining(this.countdownTime);
            } else {
                t = methods.calculateTimeRemaining(new Date());
            }

            $(this.element)
                .addClass('flipclock')
                .html(
                    methods.ul('day', t.D.d2, t.D.d1, 'Days')
                    + methods.ul('hour', t.h.d2, t.h.d1, 'Hours')
                    + methods.ul('minute', t.m.d2, t.m.d1, 'Minutes')
                    + '<audio id="flipclick">'
                    + '<source src="" type="audio/mpeg"/>'
                    + '</audio>'
                );

            setInterval($.proxy(this.refresh, this), 1000);
        },
        refresh: function () {
            var el = $(this.element);
            var t;

            if (this.countdownTime) {
                t = methods.calculateTimeRemaining(this.countdownTime);
            } else {
                t = methods.calculateTimeRemaining(new Date());
            }

            // second sound
            setTimeout(function () {
                document.getElementById('flipclick').play()
            }, 500);

            // second first digit
            el.find(".second .d1 .ready .inn").html(t.s.d1);
            methods.play('.second .d1');
            // second second digit
            if ((t.s.d1 === '0')) {
                el.find(".second .d2 .ready .inn").html(t.s.d2);
                methods.play('.second .d2');
                // minute first digit
                if ((t.s.d2 === '0')) {
                    el.find(".minute .d1 .ready .inn").html(t.m.d1);
                    methods.play('.minute .d1');
                    // minute second digit
                    if ((t.m.d1 === '0')) {
                        el.find(".minute .d2 .ready .inn").html(t.m.d2);
                        methods.play('.minute .d2');
                        // hour first digit
                        if ((t.m.d2 === '0')) {
                            el.find(".hour .d1 .ready .inn").html(t.h.d1);
                            methods.play('.hour .d1');
                            // hour second digit
                            if ((t.h.d1 === '0')) {
                                el.find(".hour .d2 .ready .inn").html(t.h.d2);
                                methods.play('.hour .d2');
                                // day first digit
                                if ((t.h.d2 === '0')) {
                                    el.find(".day .d1 .ready .inn").html(t.D.d1);
                                    methods.play('.day .d1');
                                    // day second digit
                                    if ((t.D.d1 === '0')) {
                                        el.find(".day .d2 .ready .inn").html(t.D.d2);
                                        methods.play('.day .d2');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
    };

    $.fn[pluginName] = function (countdownTime) {
        return this.each(function () {
            if (!$(this).data('plugin_' + pluginName)) {
                $(this).data('plugin_' + pluginName,
                    new Plugin(this, countdownTime));
            }
        });
    };

})(typeof jQuery !== 'undefined' ? jQuery : Zepto);

// Example usage with countdown time
