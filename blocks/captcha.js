var dust = require('dust')();
var captcha = require('captcha');

exports.create = function (elem, o, done) {
    var el = $('.holder', elem);
    var ctx = {
        picker: elem
    };
    captcha.render(el, {
        success: function () {
            ctx.verified = true;
            if (o.success) {
                o.success();
            }
        }
    }, function (err, id) {
        if (err) {
            return done(err);
        }
        ctx.id = id;
        done(null, ctx);
    });
};

exports.find = function (ctx, done) {
    captcha.response(ctx.id, function (err, xcaptcha) {
        if (err) {
            return done(err);
        }
        if (!xcaptcha) {
            return done();
        }
        done(null, xcaptcha);
    });
};

exports.remove = function (ctx, done) {
    done();
};
