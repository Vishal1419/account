function encodeURL(url) {
    var encodedUrl = url.replace(/\./g,'\\\.').replace(/\\/g,'\\\\').replace(/\//g,'\\\/').replace(/\+/g,'\\\+').replace(/\*/g,'\\\*')
                        .replace(/\?/g,'\\\?').replace(/\[/g,'\\\[').replace(/\]/g,'\\\]').replace(/\^/g,'\\\^')
                        .replace(/\$/g,'\\\$').replace(/\(/g,'\\\(').replace(/\)/g,'\\\)').replace(/\=/g,'\\\=')
                        .replace(/\!/g,'\\\!').replace(/\{/g,'\\\{').replace(/\}/g,'\\\}').replace(/\|/g,'\\\|')
                        .replace(/\:/g,'\\\:').replace(/\</g,'\\\<').replace(/\>/g,'\\\>').replace(/\-/g,'\\\-');
    return encodedUrl;
}

module.exports = encodeURL;