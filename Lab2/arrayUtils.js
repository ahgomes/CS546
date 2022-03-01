const check_array_nonempty = (arr) => {
    if (!Array.isArray(arr)) throw 'Error: No array provided.';
    if (arr.length < 1) throw 'Error: Provided array is empty.';
}

function mean(array) {
    check_array_nonempty(array);

    let sum = 0;
    array.forEach((el) => {
        if (typeof el != 'number')
            throw 'Error: Array elements must be numbers.';
        sum += el;
    });

    return sum / array.length;
}

function medianSquared(array) {
    check_array_nonempty(array);
    array.forEach((el) => {
        if (typeof el != 'number')
            throw 'Error: Array elements must be numbers.';
    });
    array.sort();

    let med;
    let len = array.length;

    if (array.length % 2 == 1)
        med = array[Math.floor(len / 2)];
    else {
        let high = array[len / 2];
        let low = array[len / 2 - 1];
        med = (high + low) / 2
    }

    return med * med;
}

function maxElement(array) {
    check_array_nonempty(array);

    let max = array[0];
    let index = 0;

    array.forEach((n, i) => {
        if (typeof n != 'number')
            throw 'Error: Array elements must be numbers.';
        if (n > max) {
            max = n;
            index = i;
        }
    });

    return { [max] : index }
}

function fill(end, value) {
    if (end == undefined)
        throw 'Error: Missing "end" parameter.';
    if (typeof end != 'number')
        throw 'Error: Parameter "end" is not a number.'
    if (end < 1)
        throw 'Error: Parameter "end" must be greater than 0.'

    if (value == undefined)
        return Array.from({length: end}, (_, i) => i);
    return Array.from({length: end}, () => value);
}

function countRepeating(array) {
    if (!Array.isArray(array)) throw 'Error: No array provided.';
    if (array.length < 1) return {};

    let elems = {};

    array.forEach((el) => {
        if (typeof el == 'number') el = el.toString();
        if (elems[el] === undefined)
            elems[el] = 1;
        else elems[el]++;
    });

    let repeats = {};

    for (let [key, value] of Object.entries(elems))
        if (value > 1) repeats[key] = value;

    return repeats;
}

function isEqual(arrayOne, arrayTwo) {
    if (!Array.isArray(arrayOne))
        throw 'Error: "arrayOne" not an array.';
    if (!Array.isArray(arrayTwo))
        throw 'Error: "arrayTwo" not an array.';

    if (arrayOne.length != arrayTwo.length) return false;
    arrayOne.sort();
    arrayTwo.sort();

    for (let i = 0; i < arrayOne.length; i++) {
        if (Array.isArray(arrayOne[i])) {
            if (!isEqual(arrayOne[i], arrayTwo[i])) return false;
        } else if (arrayOne[i] != arrayTwo[i]) return false;
    }

    return true;
}

module.exports = {
  description: 'Array Utils Module',
  check_array_nonempty,
  mean,
  medianSquared,
  maxElement,
  fill,
  countRepeating,
  isEqual,
};
