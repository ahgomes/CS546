const check_string_nonempty = (string, name) => {
    if (string == undefined || typeof string != 'string')
        throw 'Error: No string provided'
            + ((name) ? ` for "${name}".` : '.');

    let str = string.trim();
    if (str.length < 1)
        throw 'Error: provided string'
            + ((name) ? ` for "${name}" is empty.` : ' is empty.');

    return str;
}

function camelCase(string) {
    let words = check_string_nonempty(string).split(' ');
    let camelled = words[0].toLowerCase();

    for (let i = 1; i < words.length; i++)
        camelled += words[i].charAt(0).toUpperCase()
            + words[i].slice(1).toLowerCase();

    return camelled;
}

function replaceChar(string) {
    let str = check_string_nonempty(string);
    let count = 0;
    let start = new RegExp(str.charAt(0), 'ig');

    str = str.replaceAll(start, ((c) => {
      	let rep = c;
        if (count == 0) rep = c;
        else if (count % 2 == 1) rep = '*';
        else if (count % 2 == 0) rep = '$';
      	count++;
      	return rep;
    }));

    return str;
}

function mashUp(string1, string2) {
    let str1 = check_string_nonempty(string1, 'string1');
    let str2 = check_string_nonempty(string2, 'string2');
    if (str1.length < 2)
        throw 'Error: "string1" must be at least 2 characters.';
    if (str2.length < 2)
        throw 'Error: "string2" must be at least 2 characters.';

    return str2.slice(0,2) + str1.slice(2) + ' '
        + str1.slice(0,2) + str2.slice(2);
}

module.exports = {
  description: 'String Utils Module',
  camelCase,
  replaceChar,
  mashUp,
};
