var utils = require('utils');

exports.create = function (elem, o, done) {
    var ctx = {
        picker: $(elem)
    };
    var values;
    if (o.value) {
        values = Array.isArray(o.value) ? o.value : [o.value];
        values.forEach(function (value) {
            $('input[value="' + utils.sanitize(value) + '"]', ctx.picker).prop('checked', true);
        });
    }
    if (o.change) {
        ctx.picker.on('change', 'input', o.change);
    }
    done(null, ctx);
};

exports.find = function (ctx, done) {
    var values = [];
    $.each($('input:checked', ctx.picker), function () {
        values.push($(this).val());
    });
    done(null, values);
};
