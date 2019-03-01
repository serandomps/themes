var dust = require('dust')();

exports.create = function (elem, o, done) {
    $(elem).on('click', '.themes-blocks-steps .nav-link', function (e) {
        e.preventDefault();
        var next = $(this);
        var parent = next.closest('.themes-blocks-steps');
        var prev = $('.nav-link.active', parent);
        var name = prev.data('name');
        o.step(name, function (err, errors) {
            if (err) {
                return console.error(err);
            }
            if (errors) {
                prev.removeClass('text-success').addClass('text-danger');
                return next.tab('show');
            }
            prev.removeClass('text-danger').addClass('text-success');
            next.removeClass('text-danger text-success').tab('show');
        });
    });

    $(elem).on('click', '.themes-blocks-steps .themes-blocks-steps-actions .next', function (e) {
        e.preventDefault();
        var thiz = $(this);
        var current = thiz.closest('.tab-pane');
        var name = current.data('name');
        var parent = current.closest('.themes-blocks-steps');
        var all = $('.tab-pane', parent);
        var index = all.index(current[0]);
        var next = index + 1;
        o.step(name, function (err, errors) {
            if (err) {
                return console.error(err);
            }
            var handler = $('.nav-item:eq(' + index + ') a', parent);
            if (errors) {
                return handler.removeClass('text-success').addClass('text-danger');
            }
            handler.removeClass('text-danger').addClass('text-success');
            if (next < all.length) {
                return $('.nav-item:eq(' + next + ') a', parent).removeClass('text-danger text-success').tab('show');
            }
            o.create(elem);
        });
    });

    $(elem).on('click', '.themes-blocks-steps .themes-blocks-steps-actions .previous', function (e) {
        e.preventDefault();
        var thiz = $(this);
        var current = thiz.closest('.tab-pane');
        var parent = current.closest('.themes-blocks-steps');
        var index = $('.tab-pane', parent).index(current[0]);
        $('.nav-item:eq(' + (index - 1) + ') a', parent).removeClass('text-danger text-success').tab('show');
    });
    done();
};
