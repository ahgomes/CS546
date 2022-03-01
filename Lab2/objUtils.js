const arr_utils = require('./arrayUtils.js');

function makeArrays(objects) {
    arr_utils.check_array_nonempty(objects);
    if (objects.length < 2)
        throw 'Error: "objects" array must have at least 2 elements.';

    let arr = [];

    objects.forEach((o) => {
        if (typeof o != 'object')
            throw 'Error: array elements must be objects.';
        let entries = Object.entries(o);
        if (entries.length == 0)
            throw 'Error: a provided object is empty.';
        entries.forEach((e) => arr.push(e));
    });

    return arr;
}

function isDeepEqual(obj1, obj2) {
    if (obj1 == undefined || obj2 == undefined)
        throw 'Error: isDeepEqual requires two object parameters.';
    if (Array.isArray(obj1) || typeof obj1 != 'object')
        throw 'Error: "obj1" must be an object.';
    if (Array.isArray(obj2) || typeof obj2 != 'object')
        throw 'Error: "obj2" must be an object.';

    let keys_1 = Object.keys(obj1).sort(),
        keys_2 = Object.keys(obj2).sort();
    if (!arr_utils.isEqual(keys_1, keys_2)) return false;

    for (let i = 0; i < keys_1.length; i++) {
        let el1 = obj1[keys_1[i]],
            el2 = obj2[keys_2[i]];
        if (Array.isArray(el1)) {
            if (!arr_utils.isEqual(el1, el2))
                return false;
        } else if (typeof el1 == 'object') {
            if (!isDeepEqual(el1, el2))
                return false;
        } else if (!Object.is(el1, el2))
            return false;
    }

    return true;
}


function computeObject(object, func) {
    if (object == undefined || func == undefined)
        throw 'Error: expected 2 parameters "(object, function)".';
    if (typeof object != 'object')
        throw 'Error: expected object for "object".';
    if (typeof func != 'function')
        throw 'Error: expected function for "func".';

    let computed = {};
    let entries = Object.entries(object);

    entries.forEach(([key, val]) => {
        if (typeof val != 'number')
            throw 'Error: object must contain only number values.'
        computed[key] = func(val);
    });

    return computed;
}

module.exports = {
  description: 'Object Utils Module',
  makeArrays,
  isDeepEqual,
  computeObject,
};
