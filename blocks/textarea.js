exports.create = function (elem, o, done) {
    var ctx = {
        picker: $(elem)
    };
    var el = $('textarea', ctx.picker);
    if (o.value) {
        el.val(o.value);
    } else {
        ctx.reset = true;
    }
    if (o.change) {
        ctx.picker.on('change', 'input', o.change);
    }
    ctx.summernote = el.summernote({
        tabsize: 2,
        height: 200,
        placeholder: el.attr('placeholder'),
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['height', ['height']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'listStyles', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ]
    });
    done(null, ctx);
};

exports.find = function (ctx, done) {
    done(null, $('textarea', ctx.picker).summernote('code'));
};

exports.ready = function (ctx, done) {
    if (ctx.reset) {
        ctx.summernote.summernote('reset');
    }
    done();
};
