var dust = require('dust')();
var utils = require('utils');

exports.create = function (elem, o, done) {
    var picker = $('select', elem).selectpicker();
    if (o.value) {
        picker.selectpicker('val', utils.sanitize(o.value));
    }
    if (!o.change) {
        return done(null, {
            picker: picker
        });
    }
    picker.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
        var thiz = this;
        setTimeout(function () {
            o.change.call(thiz, e, clickedIndex, isSelected, previousValue);
        }, 0);
    });
    done(null, {
        picker: picker
    });
};

exports.find = function (ctx, done) {
    done(null, ctx.picker.val());
};

exports.update = function (ctx, o, done) {
    if (!o.options) {
        ctx.picker.selectpicker('val', utils.sanitize(o.value));
        return done();
    }
    dust.render('themes-blocks-select-options', o.options, function (err, out) {
        if (err) {
            return done(err);
        }
        ctx.picker.html(out).selectpicker('refresh');
        if (o.value) {
            ctx.picker.selectpicker('val', utils.sanitize(o.value));
        }
        done();
    });
};

exports.remove = function (ctx, done) {
    done();
};
