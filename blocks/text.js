var utils = require('utils');

exports.create = function (elem, o, done) {
    var ctx = {
        picker: $(elem)
    };
    if (o.hasOwnProperty('value')) {
        $('input', ctx.picker).val(utils.sanitize(o.value) || '');
    }
    if (o.change) {
        ctx.picker.on('change', 'input', o.change);
    }
    done(null, ctx);
};

exports.find = function (ctx, done) {
    done(null, $('input', ctx.picker).val());
};
