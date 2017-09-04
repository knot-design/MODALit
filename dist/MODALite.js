/*
 Modalite v0.1.5
 https://knot-design.jp/MODALite/

 Author: Yuji Hisamatsu (https://github.com/knot-design)

 Copyright (C) 2017 Knot Design
 Licensed under the MIT license (MIT)

*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else {
        // Global
        root.MODALite = factory();
    }
})(this, function () {

    'use strict';

    var d = document,
        m = MODALite.prototype,
        _getElements = function (str, e, i) {
            e = e || d;
            e = !str.match(/\s/) && str[0].match(/(#|\.)/) ? (str[0] === '#' ? e.getElementById(str.slice(1)) : e.getElementsByClassName(str.slice(1))) : e.querySelectorAll(str);
            return i && e.length !== void 0 ? e[0] : e;
        },
        _calc = function (e) {
            var h = 0,
                dialog = e.firstElementChild,
                content = _getElements('.content', dialog, 1);
            if (e.getAttribute('data-modal-media') === 'ajax') {
                content.style.height = 'auto';
                [].forEach.call(dialog.children, function (c) {
                    h += c.tagName.match(/(header|footer)/i) ? c.clientHeight : 0;
                });
                var height = dialog.offsetHeight - h;
                if (content.clientHeight > height) {
                    content.style.height = height + 'px';
                }
            }
            if ((e.getAttribute('data-modal-width') !== 'full') && /^(centered|left|right)$/.test(e.getAttribute('data-modal-position'))) {
                dialog.style.marginTop = -(dialog.offsetHeight / 2) + 'px';
            }
        },
        _merge = function (obj1, obj2) {
            for (var p in obj2) {
                try {
                    if (obj2[p].constructor === Object) {
                        obj1[p] = _merge(obj1[p], obj2[p]);
                    } else {
                        if (obj1[p] === void 0)
                            obj1[p] = obj2[p];
                    }
                } catch (e) {
                    obj1[p] = obj2[p];
                }
            }
            return obj1;
        },
        _set = function (e, opts) {
            var content, footer, media = [],
                target = e && e.getAttribute('data-target') ? e.getAttribute('data-target') : opts.target,
                modal = target ? _getElements(target, 0, 1) : '',
                src = e && e.getAttribute('data-src') ? e.getAttribute('data-src') : opts.src;
            if (!modal) {
                modal = d.createElement('div');
                d.body.appendChild(modal);
                e && ['title', 'content', 'footer'].forEach(function (name) {
                    if (e.getAttribute('data-' + name) !== null)
                        opts[name] = e.getAttribute('data-' + name);
                });
                var header = opts.title ? '<header><h3>' + opts.title + '</h3></header>' : '';
                if (src) {
                    media = _media(src);
                    content = media[0] || '<span class="loader"></span>';
                    opts.footer = media[1] !== 'ajax' ? false : opts.footer;
                    modal.setAttribute('data-modal-media', media[1]) ;
                    if (media[1] === 'video')
                        modal.setAttribute('data-modal-iframe', true);
                } else {
                    content = opts.content;
                }
                content = content ? '<div class="content">' + content + '</div>' : '';
                if (opts.footer) {
                    var dismiss = opts.action.fn ? opts.cancel : opts.action;
                    footer = '<footer><button type="button" data-modal-btn="dismiss" class="' + dismiss.class + '">' + dismiss.label + '</button>%%</footer>';
                    footer = footer.replace('%%', opts.action.fn ? '<button type="button" data-modal-btn="action" class="' + opts.action.class + '">' + opts.action.label + '</button>' : '');
                } else {
                    footer = '<span data-modal-btn="dismiss"></span>';
                }
                modal.innerHTML = '<div class="dialog">' + header + content + footer + '</div>';
            }
            ['transition', 'position', 'width'].forEach(function (name) {
                opts[name] = e && e.getAttribute('data-' + name) !== null ? e.getAttribute('data-' + name) : opts[name];
                if (opts[name])
                    modal.setAttribute("data-modal-" + name, opts[name]);
            });
            modal.classList.add('modalite');
            modal.setAttribute("aria-hidden", "true");
            opts.backdrop && modal.classList.add('backdrop');
            media[1] === 'ajax' && _request(src, function (response) {
                _getElements('.content', modal, 1).innerHTML = response;
                _calc(modal);
            });
            _calc(modal);
            return modal;
        },
        _media = function (url) {
            var youtube = url.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/),
                vimeo = url.match(/\/\/(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/),
                dailymotion = url.match(/.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/),
                video = url.match(/^.+.(mp4|m4v|ogg|ogv|webm)$/),
                image = url.match(/^.+.(jpg|jpeg|gif|png|svg)$/i);
            if (video) {
                return ['<video src="' + url + '" width="640" height="360" controls="true"></video>', 'embed'];
            } else if (image) {
                return ['<img src="' + url + '">', 'image'];
            } else {
                if (youtube && youtube[1].length === 11) {
                    url = '//www.youtube.com/embed/' + youtube[1];
                } else if (vimeo && vimeo[3].length) {
                    url = '//player.vimeo.com/video/' + vimeo[3];
                } else if (dailymotion && dailymotion[2].length) {
                    url = '//www.dailymotion.com/embed/video/' + dailymotion[2];
                } else {
                    return [null, 'ajax'];
                }
                return ['<iframe src="' + url + '" allowfullscreen="true" width="640" height="360"></iframe>', 'video'];
            }
        },
        _request = function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url);
            xhr.onload = function () {
                xhr.status == 200 ? callback(xhr.responseText) : console.error("Request Error: " + xhr.status);
            };
            xhr.send();
        },
        defaults = {
            backdrop: true,
            fixed: 'fixed',
            position: 'centered',
            footer: true,
            action: {
                label: 'OK',
                class: 'btn primary'
            },
            cancel: {
                label: 'Cancel',
                class: 'btn light'
            },
            dismiss: {
                backdrop: true,
                esc: true
            }
        };

    function MODALite(opts) {
        var element = !opts.el || typeof (opts.el) === "string" ? _getElements(opts.el || '[data-toggle="modal"]') : opts.el,
            cnt = element.length;
        if (cnt < 2) {
            element = cnt === 0 ? 0 : element[0];
            cnt = 0;
        }
        this.options = _merge(opts, defaults);
        cnt ? [].forEach.call(element, this.init.bind(this)) : this.init(element);
    }

    m.init = function (e) {
        this.modal = _set(e, this.options);
        e && e.addEventListener("click", this.show.bind(this, this.modal));
    };

    m.show = function (modal, e) {
        var queue = null,
            opts = this.options;
        this.listner = {};
        this.btn = {
            trigger: e && (e.currentTarget || e.target),
            action: _getElements('[data-modal-btn="action"]', modal, 1),
            cancel: _getElements('[data-modal-btn="dismiss"]', modal, 1)
        }
        this.btn.trigger && this.btn.trigger.classList.add('active');
        modal.setAttribute("aria-hidden", "false");
        if (opts.action.fn) {
            this.listner.action = opts.action.fn.bind(this);
            this.btn.action.addEventListener("click", this.listner.action);
        }
        if (opts.cancel.fn) {
            this.listner.cancel = opts.cancel.fn.bind(this);
            this.btn.cancel.addEventListener("click", this.listner.cancel);
        }
        modal.addEventListener("click", this.hide.bind(this));
        opts.dismiss.esc && d.addEventListener('keyup', function (e) {
            if (e.keyCode === 27) {
                this.hide();
            }
        }.bind(this));
        window.addEventListener('resize', function () {
            clearTimeout(queue);
            queue = setTimeout(_calc.bind(null, modal), 200);
        });
        _calc(modal);
        this.modal = modal;
        opts.backdrop && opts.fixed && d.body.classList.add(opts.fixed);
    };

    m.hide = function (e) {
        var opts = this.options,
            flg = !e || (opts.dismiss.backdrop && !this.modal.firstElementChild.contains(e.target) || this.btn.cancel.contains(e.target) ? true : false);
        if (flg) {
            this.modal.setAttribute("aria-hidden", "true");
            this.btn.trigger && this.btn.trigger.classList.remove('active');
            opts.fixed && opts.backdrop && d.body.classList.remove(opts.fixed);
            if (this.listner.action) {
                this.btn.action.removeEventListener("click", this.listner.action);
            }
            if (this.listner.cancel) {
                this.btn.cancel.removeEventListener("click", this.listner.cancel);
            }
        }
    };

    return MODALite;

});
