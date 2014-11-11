(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery, window, document);
    }
}(function($, window, document, undefined) {

    var isIE6 = !!(document.all && !window.XMLHttpRequest),

        pluginName = 'validate',

        defaults = {};


    var valid = {
        email: {
            reg: /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i,
            err: '邮箱格式不正确'
        },
        zh: {
            reg: /[\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FBF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]+/g,
            err: '必须为中文'
        },
        mobile: {
            reg: /^1[3|4|5|8][0-9]\d{8}$/,
            err: '手机格式不正确'
        },
        len: {
            reg: /(len)\[(\d+)-(\d+)\]/g,
            err: "长度为"
        }
    };

    //validate 构造函数

    function validate(element, options) {

        this.element = element;

        this.$element = $(this.element);

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;

        this._name = pluginName;

        this.$body = $('body');

        this.levelOneIndex = 0;

        this.levelTwoIndex = [];

        if(typeof options ==="undefined"){

            this.init();

        }else{

            this[options]();

        }

    }


    //validate 原型

    validate.prototype = {
        init: function() {
            var _this = this;
            var _element = _this.$element;

            _element.find('.required').on({
                focus: function(event) {

                    var $this = $(this);

                    var $context = $this.parents().eq(0);

                    if(!$context.find('.valid-loading').hasClass('none')){

                        return false;
                    }

                    if (!parseInt($this.attr("data-status"))) {

                        $context.find('.valid-tip').removeClass('none');

                    }

                    $context.find('.valid-error,.valid-success').addClass('none');

                },
                blur: function(event) {
                    var $this = $(this);
                    var $context = $this.parents().eq(0);
                    var _name = $this.attr("data-name") ? $this.attr("data-name") : '';
                    var _value = this.value;
                    var lenArr = [];

                    $context.find('.valid-tip').addClass('none');

                    if (!$this.val()) {
                        $context.find('.valid-error').html(_name + "不能为空").removeClass('none');
                        $this.attr("data-status", 0);
                        return false;
                    }

                    splitValid($this.attr('data-valid'), $this, $context);


                }
            });
        },
        generator: function() {
            console.log(this);
        }
    }

    function splitValid(validStr, target, context) {
        var lenArr = [],
            validArr = validStr.split("|"),
            _name = target.attr('data-name') ? target.attr('data-name') : '',
            _result = false;

        for (var i = 0, len = validArr.length; i <= len; i++) {

            if (valid[validArr[i]]) {

                if (!valid[validArr[i]].reg.test(target[0].value)) {

                    context.find('.valid-error').html(valid[validArr[i]].err).removeClass('none');

                    target.attr("data-status", 0);

                    return false;

                } else {

                    _result = true;

                };

            }

            if (/len/.test(validArr[i])) {

                lenArr = validArr[i].replace("len[", "").replace("]", "").split("~");

                if (target[0].value.length < Number(lenArr[0]) || target[0].value.length > Number(lenArr[1])) {

                    context.find('.valid-error').html(_name + "长度为" + lenArr[0] + "-" + lenArr[1] + "位").removeClass('none');

                    target.attr("data-status", 0);

                    return false;

                } else {

                    _result = true;

                }

            }

            if (validArr[i] === "ajax") {

                var postName = target.attr("name");

                _result = false;

                context.find('.valid-loading').removeClass('none');

                if (!target.data("limit")) {

                    target.data("limit",1);

                    $.get(target.attr("data-validUrl"), {

                        postName: target.val()

                    }, function(data) {

                        target.data("limit",0);
                        
                        context.find('.valid-loading').addClass('none');

                        if (!data.status) {

                            context.find('.valid-error').html(data.info).removeClass('none');

                            target.attr("data-status", 0);

                        } else {

                            target.attr("data-status", 1);

                            context.find('.valid-success').removeClass('none');

                            _result = true;
                        }

                    }, "json");

                }

            }

        }

        if (_result) {

            target.attr("data-status", 1);

            context.find('.valid-success').removeClass('none');
        }

    }


    $.fn[pluginName] = function(options) {

        return this.each(function() {

            if (!$.data(this, pluginName)) {

                $.data(this, pluginName, new validate(this, options));

            }
        });
    };

}));
