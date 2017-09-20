(function () {
    
    function _init() {
        
        // Transition
        new MODALit({
            el: '.demo-transition',
            title: 'Transition',
            action: {
                label: 'Close'
            }
        });

        // Position
        new MODALit({
            el: '.demo-position',
            title: 'Position',
            action: {
                label: 'Close'
            },
            transition: 'zoom'
        });

        // Sizes
        new MODALit({
            el: '.demo-size',
            title: 'Sizes',
            footer: 'false',
            action: {
                label: 'Close'
            },
            transition: 'zoom'
        });

        // Media
        new MODALit({
            el: '.demo-media',
            footer: false,
            transition: 'zoom'
        });

        // Gallery
        new MODALit({
            el: '.demo-gallery',
            slider: true,
            width: 'large',
            navi: true,
            footer: false,
            transition: 'zoom'
        });

        // Confirm
        new MODALit({
            el: '.demo-confirm',
            title: 'Confirm',
            content: 'Are you sure?',
            action: {
                fn: function () {
                    alert('Actioned!');
                }
            },
            cancel: {
                fn: function () {
                    alert('Canceled!');
                }
            },
            width: 'small',
            transition: 'zoom'
        });

        // Nested
        new MODALit({
            el: '#btn-nested1',
            footer: false,
            width: 'full',
            target: '#nested',
            transition: 'zoom'
        });
        new MODALit({
            el: '#btn-nested2',
            title: 'Nested Dialog',
            content: 'Are you satisfied with this?',
            transition: 'slideUp'
        });

        // Body Scrolling - prevent
        new MODALit({
            el: '#prevent',
            title: 'Try to scroll down the page!',
            content: 'Prevent body scrolling. (default)',
            transition: 'zoom'
        });
        // Body Scrolling - scrollable
        new MODALit({
            el: '#scrollable',
            title: 'Try to scroll down the page!',
            content: 'Scrollable body.',
            fixed: false,
            transition: 'zoom'
        });

        // Backdrop
        new MODALit({
            el: '#overlay',
            title: 'Disabled backdrop <small class="meta">(Background overlay)</small>',
            content: 'Click the Esc key!',
            transition: 'slideUp',
            backdrop: false
        });

        // Custome Style
        var css = new MODALit({
            el: '#btnCss',
            width: 'small',
            content: '<p>Dou you like it?</p>',
            action: {
                fn: function () {
                    alert('Thanks!')
                    this.hide()
                },
                label: '👍🏻 Like'
            },
            cancel: {
                label: '👎🏻 Dislike',
                fn: function () {
                    alert('Ooops..');
                }
            },
            transition: 'flip'
        })
        css.modal.id = "modalCss";

        // Login form
        var form = document.forms.login,
            animationName = function () {
                var div = document.createElement("div"),
                    obj = {
                        "animation": "animationend",
                        "OAnimation": "oAnimationEnd",
                        "MozAnimation": "animationend",
                        "MsAnimation": "msAnimationEnd",
                        "WebkitAnimation": "webkitAnimationEnd"
                    },
                    names = Object.keys(obj),
                    len = names.length;

                for (var i = 0; i < len; i++) {
                    if (div.style[names[i]] !== undefined) {
                        return obj[names[i]];
                    }
                }
                return null;
            },
            animationEnd = animationName(),
            invalid = {},
            error = function (e) {
                var classie = e.firstElementChild.classList;
                classie.add('error');
                if (animationEnd) {
                    e.addEventListener(animationEnd, function (evt) {
                        classie.remove('error');
                    });
                } else {
                    setTimeout(function () {
                        classie.remove('error');
                    }, 400);
                }
            },
            action = function (e) {
                ['id', 'pswd'].forEach(function (name) {
                    var ipt = form[name],
                        classie = ipt.classList;
                    if ((name === 'id' && ipt.value !== 'admin') || (name === 'pswd' && ipt.value !== '1234')) {
                        classie.remove('valid');
                        classie.add('invalid');
                        invalid[name] = true;
                    } else {
                        classie.add('valid');
                        classie.remove('invalid');
                        delete invalid[name];
                    }
                });

                if (Object.keys(invalid).length) {
                    return error(this.modal);
                }
                alert('Success!');
                this.hide();
                cancel();
            },
            cancel = function () {
                [form.id, form.pswd].forEach(function (e) {
                    e.classList.remove('valid');
                    e.classList.remove('invalid');
                });
                form.reset();
            },
            login = new MODALit({
                el: '#btnLogin',
                action: {
                    fn: action,
                    label: 'Login'
                },
                cancel: {
                    fn: cancel
                },
                dismiss: {
                    backdrop: false
                },
                transition: 'zoom'
            });

        // Sidebar
        var sidebar = new MODALit({
            el: '#btnNav',
            width: 'full',
            title: 'MENU',
            content: '<ul><li><a href="#">HOME</a></li><li><a href="#">PRODUCTS</a></li><li><a href="#">ABOUT</a></li><li><a href="#">CONTACT</a></li></ul>',
            position: 'left top',
            footer: false,
            backdrop: false,
            transition: 'slideRight'
        });
        sidebar.modal.id = 'sidebar';

        // Scroll
        var scrl = new MODALit({
                target: '#scroller',
                backdrop: false,
                position: 'right bottom',
                cancel: {
                    fn: function () {
                        this.view = true;
                    }
                },
                transition: 'slideUp'
            }),
            pos = 0,
            timer = null,
            ofs = function () {
                var rect = document.getElementById('scroll').getBoundingClientRect();
                pos = rect.top + rect.height + window.pageYOffset - window.innerHeight + 100;
            },
            _onScroll = function () {
                if (!scrl.view) {
                    var scrlTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
                        hidden = scrl.modal.getAttribute('aria-hidden');
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        if (scrlTop > pos) {
                            hidden === 'true' && scrl.show(scrl.modal);
                        } else {
                            hidden === 'false' && scrl.hide();
                        }
                    }, 50)
                }
            };
        ofs();
        window.addEventListener('resize', ofs);
        window.addEventListener('scroll', _onScroll);
    }

    onload = _init;

}).call(this);
