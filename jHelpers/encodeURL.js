function encodeURL(url) {
    var encodedUrl = url.replace(/\\/g,'%5C').replace(/\//g,'%2F').replace(/\./g,'%2E').replace(/\,/g,'%2C')
                        .replace(/\[/g,'%5B').replace(/\]/g,'%5D').replace(/\&/g,'%26').replace(/\@/g,'%40')
                        .replace(/\(/g,'%28').replace(/\)/g,'%29').replace(/\$/g,'%24').replace(/\%/g,'%25')
                        .replace(/\{/g,'%7B').replace(/\}/g,'%7D').replace(/\!/g,'%21').replace(/\?/g,'%3F')
                        .replace(/\</g,'%3C').replace(/\>/g,'%3E').replace(/\*/g,'%2A').replace(/\+/g,'%2B')
                        .replace(/\"/g,'%22').replace(/\'/g,'%27').replace(/\^/g,'%5E').replace(/\`/g,'%60')
                        .replace(/\:/g,'%3A').replace(/\;/g,'%3B').replace(/\=/g,'%3D').replace(/\|/g,'%7C')
                        .replace(/\_/g,'%5F').replace(/\-/g,'%2D').replace(/\#/g,'%23');
    return encodedUrl;
}











