var dust = require('dust')();

dust.loadSource(dust.compile(require('./blocks/checkbox'), 'themes-blocks-checkbox'));
dust.loadSource(dust.compile(require('./blocks/checkboxes'), 'themes-blocks-checkboxes'));
dust.loadSource(dust.compile(require('./blocks/email'), 'themes-blocks-email'));
dust.loadSource(dust.compile(require('./blocks/password'), 'themes-blocks-password'));
dust.loadSource(dust.compile(require('./blocks/radios'), 'themes-blocks-radios'));
dust.loadSource(dust.compile(require('./blocks/select'), 'themes-blocks-select'));
dust.loadSource(dust.compile(require('./blocks/select-options'), 'themes-blocks-select-options'));
dust.loadSource(dust.compile(require('./blocks/text'), 'themes-blocks-text'));
dust.loadSource(dust.compile(require('./blocks/textarea'), 'themes-blocks-textarea'));
dust.loadSource(dust.compile(require('./blocks/uploads'), 'themes-blocks-uploads'));
dust.loadSource(dust.compile(require('./blocks/uploads-preview'), 'themes-blocks-uploads-preview'));
