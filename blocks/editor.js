exports.create = function (elem, o, done) {
    var ctx = {
        picker: $(elem)
    };
    var el = $('.editor', ctx.picker);
    ctx.editor = ace.edit(el[0]);
    ctx.editor.setOptions({
        maxLines: Infinity,
        showLineNumbers: false,
        theme: 'ace/theme/textmate',
        mode: 'ace/mode/json',
        //readOnly: true,
        // showGutter: false,
        highlightActiveLine: false,
        showPrintMargin: false
    });
    if (o.value) {
        ctx.editor.setValue(JSON.stringify(o.value, null, 2), -1);
    }
    done(null, ctx);
};

exports.find = function (ctx, done) {
    done(null, ctx.editor.getValue());
};
