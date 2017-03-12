function compareStrings (string1, string2, ignoreCase, useLocale) {
    if (ignoreCase) {
        if (useLocale) {
            string1 = string1.toLocaleLowerCase();
            string2 = string2.toLocaleLowerCase();
        }
        else {
            string1 = string1 === undefined ? '' : string1.toLowerCase();
            string2 = string2 === undefined ? '' : string2.toLowerCase();
        }
    }

    return string1 === string2;
}

module.exports = compareStrings;