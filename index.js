var dust = require('dust')();

var handlers = {
    editor: require('./blocks/editor'),
    radios: require('./blocks/radios'),
    select: require('./blocks/select'),
    steps: require('./blocks/steps'),
    text: require('./blocks/text'),
    textarea: require('./blocks/textarea'),
    uploads: require('./blocks/uploads')
};

var format = function (block, data) {
    var handler = handlers[block];
    if (!handler || !handler.format) {
        return data;
    }
    return handler.format(data);
};

dust.helpers.blocks = function (chunk, context, bodies, params) {
    return chunk.map(function (chunk) {
        var block = params.block;
        dust.render('themes-blocks-' + block, format(block, params), function (err, out) {
            if (err) {
                return chunk.setError(err);
            }
            chunk.write(out).end();
        });
    });
};

var findStep = function (context, chunk, params) {
    var i;
    var step;
    var steps = context.steps || (context.steps = []);
    for (i = 0; i < steps.length; i++) {
        if (steps[i].name === params.name) {
            step = steps[i];
            break;
        }
    }
    if (step) {
        return step;
    }
    step = {
        name: params.name,
        title: params.title,
        params: params,
        chunk: chunk,
        body: ''
    };
    context.steps.push(step);
    return step;
};

dust.helpers.step = function (chunk, context, bodies, params) {
    var step = findStep(context, chunk, params);
    return chunk.tap(function (data) {
        step.body += data;
    }).render(bodies.block, context).untap();
};

dust.helpers.steps = function (chunk, context, bodies, params) {
    var block = bodies.block;
    return chunk.map(function (chunk) {
        var tid = 0;
        var bodies = [];
        var headers = [];
        chunk = chunk.render(block, context);
        var steps = context.steps;
        delete context.steps;
        steps.forEach(function (step) {
            bodies.push({
                tid: tid,
                name: step.params.name,
                title: step.params.title,
                body: step.body,
                active: step.params.active,
                back: step.params.back
            });
            headers.push({
                tid: tid,
                name: step.params.name,
                title: step.params.title,
                icon: step.params.icon,
                active: step.params.active,
                back: step.params.back
            });
            tid++;
        });
        var size = headers.length;
        if (size) {
            headers[0].first = true;
            bodies[0].first = true;
            headers[size - 1].last = true;
            bodies[size - 1].last = true;
        }
        context = context.push({
            headers: headers,
            bodies: bodies
        });
        chunk.partial('themes-blocks-steps', context, context).end();
    });
};

dust.loadSource(dust.compile(require('./blocks/button.html'), 'themes-blocks-button'));
dust.loadSource(dust.compile(require('./blocks/checkbox.html'), 'themes-blocks-checkbox'));
dust.loadSource(dust.compile(require('./blocks/checkboxes.html'), 'themes-blocks-checkboxes'));
dust.loadSource(dust.compile(require('./blocks/editor.html'), 'themes-blocks-editor'));
dust.loadSource(dust.compile(require('./blocks/email.html'), 'themes-blocks-email'));
dust.loadSource(dust.compile(require('./blocks/feedback.html'), 'themes-blocks-feedback'));
dust.loadSource(dust.compile(require('./blocks/password.html'), 'themes-blocks-password'));
dust.loadSource(dust.compile(require('./blocks/radios.html'), 'themes-blocks-radios'));
dust.loadSource(dust.compile(require('./blocks/select.html'), 'themes-blocks-select'));
dust.loadSource(dust.compile(require('./blocks/select-options.html'), 'themes-blocks-select-options'));
dust.loadSource(dust.compile(require('./blocks/steps.html'), 'themes-blocks-steps'));
dust.loadSource(dust.compile(require('./blocks/text.html'), 'themes-blocks-text'));
dust.loadSource(dust.compile(require('./blocks/textarea.html'), 'themes-blocks-textarea'));
dust.loadSource(dust.compile(require('./blocks/uploads.html'), 'themes-blocks-uploads'));
dust.loadSource(dust.compile(require('./blocks/uploads-preview.html'), 'themes-blocks-uploads-preview'));

var contexts = [];

var findContext = function (elem) {
    var i;
    var context;
    var length = contexts.length;
    for (i = 0; i < length; i++) {
        context = contexts[i];
        if (context.elem === elem) {
            return context;
        }
    }
    return null;
};

exports.clean = function (done) {
    async.each(contexts, function (ctx, eachDone) {
        var handler = handlers[ctx.block];
        var act = handler.remove;
        if (!act) {
            return eachDone();
        }
        act(ctx.oo, eachDone);
    }, done);
};

exports.blocks = function (block, action, elem, o, done) {
    var handler = handlers[block];
    if (!handler) {
        return done();
    }
    var act = handler[action];
    if (!act) {
        return done();
    }
    elem = elem[0];
    if (action === 'create') {
        return act(elem, o, function (err, ctx) {
            if (err) {
                return done(err);
            }
            contexts.push({
                elem: elem,
                block: block,
                ctx: ctx
            });
            done();
        });
    }
    done = done || o;
    var context = findContext(elem);
    if (!context) {
        return done(new Error('!ctx'));
    }
    if (action === 'find') {
        return act(context.ctx, done);
    }
    act(context.ctx, o, done);
};
