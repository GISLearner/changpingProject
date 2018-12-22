
//utils通用方法入口
(function (window, document) {

    var version = "1.0.0",
    utils = function (selector) {
        return new utils.fn.init(selector);
    }

    utils.fn = utils.prototype = {
        version: version,
        constructor: utils,
        //selector: null,
        init: function (selector) {
            if ((typeof selector) === "string") {
                if (options.targetId.indexOf('.') > -1) {
                    this.selector = document.querySelectorAll(selector);//含.
                }
                else if (options.targetId.indexOf('#') > -1) {
                    this.selector = document.getElementById(selector);//含#
                }
                else {
                    this.selector = document.getElementById(selector);
                }
            } else {
                this.selector = selector;
            }
            return this;
        },
        test: function (param) {
            return this;
        }
    }

    utils.fn.extend = utils.extend = function () {
        var target, sources;
        var arg0 = arguments[0];
        if (arg0.length == 0) return this;

        if (arguments.length == 1) {
            target = this;
            sources = [arg0];
        } else {
            target = arg0;
            sources = slice.call(arguments, 1);
        }
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            for (var key in source) {
                target[key] = source[key];
            }
        }
        return target;
    }

    utils.fn.init.prototype = utils.fn;
    window.$utils = window.utils = utils;
})(window, document)