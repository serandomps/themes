var dust = require('dust')();

exports.format = function (data) {
    return data;
};

exports.create = function (elem, o, done) {
    var picker = $('select', elem).selectpicker();
    if (o.value) {
        picker.selectpicker('val', o.value);
    }
    picker.on('change', o.change);
    done(null, {
        picker: picker
    });
};

exports.find = function (ctx, done) {
    done(null, ctx.picker.val());
};

exports.update = function (ctx, o, done) {
    if (!o.options) {
        return ctx.picker.selectpicker('val', o.value);
    }
    dust.render('themes-blocks-select-options', o.options, function (err, out) {
        if (err) {
            return done(err);
        }
        ctx.picker.html(out).selectpicker('refresh');
        if (o.value) {
            ctx.picker.selectpicker('val', o.value);
        }
        done();
    });
};

exports.remove = function (ctx, done) {
    done();
};
