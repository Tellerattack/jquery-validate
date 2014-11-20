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

    var isIE6 = !!(document.all && !window.XMLHttpRequest);

    var valid = {
        email: {
            reg: /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i,
            err: '邮箱格式不正确'
        },
        zh: {
            reg: /^[\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FBF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]+$/,
            err: '必须为中文'
        },
        num: {
            reg: /^\d+$/g,
            err: "必须为数字"
        },
        mobile: {
            reg: /^1[3|4|5|8][0-9]\d{8}$/,
            err: '手机格式不正确'
        },
        len: {
            reg: /(len)\[(\d+)-(\d+)\]/,
            err: "长度不符合要求"
        },
        password: {
            reg: /^[\s|\S]{6,16}$/,
            err: "密码长度为6-16位"
        }
    };


    var methods = {
        //初始化
        init: function(options) {

            return this.each(function() {

                var setting = $.extend(true, {
                    element: this,
                    loadingSrc: "images/loading.gif"
                }, {
                    regular: valid
                }, options);

                var _element = $(this);

                var message = null;

                _element.find('.required').on({

                    focus: function(event) {

                        var $this = $(this);

                        var $context = $this.parents().eq(0);

                        var $tip = $context.find('.valid-tip');


                        message = {
                            success: $this.attr("data-success") || '',
                            error: $this.attr("data-error") || '',
                            loading: $this.attr("data-loading") || '',
                            init: $this.attr("data-tip") || ''
                        }

                        //当ajax验证时，阻塞其他行为
                        if ($tip.hasClass('loading')) {return false;}

                        //不知道干嘛的~写晕了的一段
                        // if ($this.attr("data-valid").indexOf("password") !== -1) {
                        //     console.log($this);
                        //     $this.attr("data-status", 0);

                        //     showTip($tip);
                        // }

                        if (!parseInt($this.attr("data-status"))) {

                            $tip.html(message.init);

                            showTip("init", $tip);

                        }

                    },

                    blur: function(event) {
                        var $this = $(this);
                        var $context = $this.parents().eq(0);
                        var _name = $this.attr("data-name") ? $this.attr("data-name") : '';
                        var _value = this.value;
                        var lenArr = [];
                        var $tip = $context.find('.valid-tip');

                        //判断是否要做密码配对
                        if ($this.attr('data-target') && $this.val()) {

                            var password = $(setting.element).find('input[data-target]');

                            var obj = $("#" + password.attr("data-target"));

                            var objTip = obj.parents().eq(0).find('.valid-tip');


                            if (password[0].value !== password[1].value) {


                                objTip.html("确认密码与密码不一致");

                                obj.attr("data-status", 0);

                                showTip("error", objTip);

                                //如果当前element和目标element一致时

                                if ($this.attr('data-target') === $this.attr('id')) {

                                    return false;

                                }

                            } else {

                                obj.attr("data-status", 1);

                                objTip.html("");

                                showTip("success", objTip);

                            }


                        }

                        //判断是否为空

                        if (!$this.val()) {

                            $context.find('.valid-tip').html(_name + "不能为空");

                            showTip('error', $tip);

                            $this.attr("data-status", 0);

                            return false;
                        }


                        //判断验证状态是否为1
                        if (Number($this.attr('data-status'))) {

                            return false;
                        }


                        if ($this.attr('data-valid')) {

                            splitValid($this.attr('data-valid'), $this, $context, setting);

                        } else {
                            $tip.html('');
                            showTip('success', $tip);

                            $this.attr("data-status", 1);
                        }

                        setting.onBlur ? setting.onBlur() : false;
                    },change: function(event) {
                        var $this = $(this);
                        var $context = $this.parents().eq(0);
                        var $tip = $context.find('.valid-tip');

                        showTip($tip);

                        $this.attr("data-status", 0);

                        setting.onChange ? setting.onChange() : false;
                    }

                });

            });
        },
        generator: function(options) {

            var result = true;

            this.find('.required').each(function(index, el) {

                var $context = $(el).parents().eq(0);

                var $tip = $context.find('.valid-tip');

                var message = {
                    success: $(el).attr("data-success") || '',
                    error: $(el).attr("data-error") || '',
                    loading: $(el).attr("data-loading") || '',
                    init: $(el).attr("data-tip") || ''
                };

                if (typeof $(el).attr("data-status") === "undefined" || !Number($(el).attr("data-status"))) {

                    if (!$tip.hasClass('loading')) {

                        if(!$tip.html()){
                            $tip.html(message.init);
                        }

                        showTip('error', $tip);
                    }

                    result = false;
                }
            });

            return result;
        }
    };

    function splitValid(validStr, target, context, setting) {

        var lenArr = [],

            validArr = validStr.split("|"),

            _name = target.attr('data-name') ? target.attr('data-name') : '',

            _result = false,

            reg = null,

            _success = '',

            $tip = context.find('.valid-tip');

        for (var i = 0, len = validArr.length; i < len; i++) {

            if (valid[validArr[i]]) {


                if (!valid[validArr[i]].reg.test(target[0].value)) {

                    $tip.html(valid[validArr[i]].err);

                    showTip("error", $tip);

                    target.attr("data-status", 0);

                    return false;

                } else {
                    _result = true;
                }

                if (validArr[i] === 'password') {

                    var password = $(setting.element).find('input[data-target]');

                    var obj = $("#" + password.attr("data-target"));

                    var objTip = obj.parents().eq(0).find('.valid-tip');


                    if (password[0].value !== password[1].value) {

                        objTip.html("确认密码与密码不一致");

                        obj.attr("data-status", 0);

                        showTip("error", objTip);

                    }

                }

            }

            if (/len/.test(validArr[i])) {

                lenArr = validArr[i].replace("len[", "").replace("]", "").split("~");

                if (target[0].value.length < Number(lenArr[0]) || target[0].value.length > Number(lenArr[1])) {

                    $tip.html(_name + "长度为" + lenArr[0] + "-" + lenArr[1] + "位");

                    showTip("error", $tip);

                    target.attr("data-status", 0);

                    return false;

                } else {

                    _result = true;

                }

            }

            if (validArr[i] === "ajax") {

                var postName = target.attr("name") || "validname";

                _result = false;

                showTip("loading", $tip, setting.loadingSrc);

                if (!target.data("limit")) {

                    target.data("limit", 1);

                    $.post(target.attr("data-validUrl") + '?' + postName + '=' + target.val(), function(data) {

                        target.data("limit", 0);

                        showTip($tip);

                        setting.success ? setting.success() : false;

                        if (!data.status) {

                            $tip.html(data.info);

                            showTip("error", $tip);

                            target.attr("data-status", 0);

                        } else {

                            _result = true;

                            target.attr("data-status", 1);
                            $tip.html("");
                            showTip("success", $tip);
                        }

                    }, "json");

                }

            }

        }

        if (_result) {

            target.attr("data-status", 1);

            _success = target.attr('data-success') || '';

            $tip.html(_success);

            showTip("success", $tip);
        }

    }

    function showTip(target, tip, loadingSrc) {


        if (target === "loading") {

            tip.html('<img src="' + loadingSrc + '">');

        }

        if (arguments.length < 2) {

            target.removeClass('success error loading').addClass('none').html('');

            return false;
        }

        tip.removeClass('success error loading').addClass('none');

        if (target === "init") {

            tip.removeClass('success error loading').removeClass('none');

            return false;
        }

        //tip.addClass('loading');

        tip.addClass(target).removeClass('none');
    }

    $.fn.validate = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.validate Plugin');
            return this;
        }
        return method.apply(this, arguments);
    }

}))