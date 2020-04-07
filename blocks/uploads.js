var dust = require('dust')();
var utils = require('utils');

var BINARY_API = utils.resolve('www:///apis/v/binaries');

var resolution = '288x162';

exports.create = function (elem, o, done) {
    var max = o.max || 1;
    var pending = 0;
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
        maxFileSize: 10 * 1024 * 1024,
        disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
        previewMaxWidth: 288,
        previewMaxHeight: 162,
        maxNumberOfFiles: max,
        getNumberOfFiles: function () {
            return $('.themes-blocks-upload', elem).length;
        },
        previewCrop: true,
        messages: {
            maxNumberOfFiles: 'Only ' + max + ' files can be uploaded.',
            acceptFileTypes: 'Type of the selected file is not allowed.',
            maxFileSize: 'Size of the selected file is larger than the max allowed.',
            minFileSize: 'Size of the selected file is smaller than the min allowed.',
            uploadedBytes: 'Size of the selected file is larger than the max allowed.'
        }
    }).on('fileuploaddone', function (e, data) {
        utils.loaded();
        var file = data.files[0];
        var err = file.error;
        if (err) {
            return console.error(err);
        }
        var binary = data.result;
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
        var total = $('.themes-blocks-upload', elem).length + pending;
        if (total < max) {
            pending++
            return utils.loading();
        }
        utils.loaded();
        xhr.abort();
        $('.invalid-feedback', elem).html('Only ' + max + ' files can be uploaded.');
    }).on('fileuploadalways', function (e, data) {
        pending = 0;
        utils.loaded();
    }).on('fileuploadchunkalways', function (e, data) {
        pending = 0;
        utils.loaded();
    }).on('fileuploadprocessfail', function (e, data) {
        pending = 0;
        utils.loaded();
        var file = data.files[data.index];
        if (!file) {
            return;
        }
        $('.invalid-feedback', elem).html(file.error);
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');

    $(elem).on('click', '.remove-file', function () {
        $(this).closest('.themes-blocks-upload').remove();
        return false;
    });

    $('.themes-blocks-uploads', elem).sortable();
    $('.themes-blocks-uploads', elem).disableSelection();

    done(null, {
        elem: elem,
        uploader: uploader
    });
};

exports.find = function (ctx, done) {
    var uploads = [];
    $('.themes-blocks-upload', ctx.elem).each(function () {
        uploads.push($(this).data('id'));
    });
    done(null, uploads);
};
