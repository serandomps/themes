var dust = require('dust')();

var handlers = {
    radios: require('./blocks/radios'),
    select: require('./blocks/select'),
    text: require('./blocks/text'),
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
    return chunk.map(function(chunk) {
        var block = params.block;
        dust.render('themes-blocks-' + block, format(block, params), function (err, out) {
            if (err) {
                return chunk.setError(err);
            }
            chunk.write(out).end();
        });
    });
};

dust.loadSource(dust.compile(require('./blocks/checkbox.html'), 'themes-blocks-checkbox'));
dust.loadSource(dust.compile(require('./blocks/checkboxes.html'), 'themes-blocks-checkboxes'));
dust.loadSource(dust.compile(require('./blocks/email.html'), 'themes-blocks-email'));
dust.loadSource(dust.compile(require('./blocks/password.html'), 'themes-blocks-password'));
dust.loadSource(dust.compile(require('./blocks/radios.html'), 'themes-blocks-radios'));
dust.loadSource(dust.compile(require('./blocks/select.html'), 'themes-blocks-select'));
dust.loadSource(dust.compile(require('./blocks/select-options.html'), 'themes-blocks-select-options'));
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
