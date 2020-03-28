var dust = require('dust')();
var utils = require('utils');

var BINARY_API = utils.resolve('www:///apis/v/binaries');

var resolution = '288x162';

exports.create = function (elem, o, done) {
    var binaries = {};
    var max = o.max || 1;
    var values = o.value || [];
    var pending = 0;
    values.forEach(function (value) {
        binaries[value] = {};
    });
    var uploader = $('.themes-blocks-uploads-uploader', elem).fileupload({
        url: BINARY_API,
        type: 'POST',
        dataType: 'json',
        formData: [{
            name: 'data',
            value: JSON.stringify({
                type: 'image'
            })
        }],
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 5000000, // 5 MB
        disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
        previewMaxWidth: 288,
        previewMaxHeight: 162,
        maxNumberOfFiles: max,
        getNumberOfFiles: function () {
            return Object.keys(binaries).length;
        },
        previewCrop: true
    }).on('fileuploaddone', function (e, data) {
        utils.loaded();
        var file = data.files[0];
        var err = file.error;
        if (err) {
            return console.error(err);
        }
        var binary = data.result;
        binaries[binary.id] = {};
        utils.cdn('images', '/images/' + resolution + '/' + binary.id, function (err, url) {
            if (err) {
                return console.error(err);
            }
            dust.render('themes-blocks-uploads-preview', {
                id: binary.id,
                url: url,
                size: 3
            }, function (err, out) {
                if (err) {
                    return console.error(err);
                }
                $('.themes-blocks-uploads', elem).append($(out));
                console.log('successfully uploaded', data.result);
            });
        });
    }).on('fileuploadadd', function (e, xhr) {
        var total = Object.keys(binaries).length + pending;
        if (total < max) {
            pending++
            return utils.loading();
        }
        utils.loaded();
        xhr.abort();
        $('.invalid-feedback', elem).html('Only ' + max + ' files can be uploaded');
    }).on('fileuploadalways', function (e, data) {
        pending = 0;
        utils.loaded();
    }).on('fileuploadchunkalways', function (e, data) {
        pending = 0;
        utils.loaded();
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');

    $(elem).on('click', '.remove-file', function () {
        var el = $(this);
        var id = el.data('id');
        delete binaries[id];
        el.closest('.themes-blocks-upload').remove();
        return false;
    });

    done(null, {
        binaries: binaries,
        uploader: uploader
    });
};

exports.find = function (ctx, done) {
    done(null, Object.keys(ctx.binaries));
};
