var dust = require('dust');

var blocks = [
    'checkbox',
    'email',
    'password',
    'radio',
    'select',
    'text',
    'textarea'
];

blocks.forEach(function (name) {
    dust.loadSource(dust.compile(require('./' + name), 'blocks-' + name));
});
