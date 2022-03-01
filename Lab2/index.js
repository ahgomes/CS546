const arr_utils = require('./arrayUtils.js');
const str_utils = require('./stringUtils.js');
const obj_utils = require('./objUtils.js');

const is_equal_arr = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length != arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (Array.isArray(arr1[i])) {
            if (!is_equal_arr(arr1[i], arr2[i])) return false;
        } else if (arr1[i] != arr2[i]) return false;
    }


    return true;
}

const is_equal_obj = (obj1, obj2) => {
    if (obj1 == undefined || obj2 == undefined) return false;
    if (obj1 == null || obj2 == null) return false;

    let keys_1 = Object.keys(obj1).sort(),
        keys_2 = Object.keys(obj2).sort();
    if (!is_equal_arr(keys_1, keys_2)) return false;

    for (let i = 0; i < keys_1.length; i++) {
        let el1 = obj1[keys_1[i]],
            el2 = obj2[keys_2[i]];
        if (Array.isArray(el1)) {
            if (!arr_utils.isEqual(el1, el2))
                return false;
        } else if (typeof el1 == 'object') {
            if (!isDeepEqual(el1, el2)) return false;
    } else if (!Object.is(el1, el2)) {
            return false;
        }
    }

    return true;
}

let passed = 0;
let tested = 0;

function test(tests, name) {
    console.log(`TESTING ${name} ...`);

    let err_count = 0;
    let test_count = tests.length;

    tests.forEach((t, i) => {
        let result;
        try {
            result = t.func.apply(null, t.args);
            if (Object.is(result, t.exp)) return;
            if (Array.isArray(result)) {
                if (is_equal_arr(result, t.exp)) return;
            } else if (typeof result == 'object') {
                if (is_equal_obj(result, t.exp)) return;
            }
        } catch (e) {
            if (Object.is(e, t.exp)) return;
            result = e;
        }

        console.log(`- TEST ${name}#${i+1} FAILED`);
        console.log(`  RECEIVED: ${JSON.stringify(result)} | EXPECTED: ${JSON.stringify(t.exp)}`);
        ++err_count;

    });

    passed += test_count - err_count;
    tested += test_count;

    if (err_count) {
        console.log(`* ${name} failed ${err_count}/${test_count}`);
        return false;
    }

    console.log('* PASSED');
    return true;
}

let arr_tests = [
    {func: arr_utils.mean, args: [[1, 2, 3]], exp: 2},
    {func: arr_utils.mean, args: [[]],
        exp: 'Error: Provided array is empty.'},
    {func: arr_utils.mean, args: ['banana'],
        exp: 'Error: No array provided.'},
    {func: arr_utils.mean, args: [["guitar", 1, 3, "apple"]],
        exp: 'Error: Array elements must be numbers.'},
    {func: arr_utils.mean, args: [], exp: 'Error: No array provided.'},
    /*6*/{func: arr_utils.medianSquared, args: [[4, 1, 2]], exp: 4},
    {func: arr_utils.medianSquared, args: [[]],
        exp: 'Error: Provided array is empty.'},
    {func: arr_utils.medianSquared, args: ['banana'],
        exp: 'Error: No array provided.'},
    {func: arr_utils.medianSquared, args: [1,2,3],
        exp: 'Error: No array provided.'},
    {func: arr_utils.medianSquared, args: [],
        exp: 'Error: No array provided.'},
    /*11*/{func: arr_utils.medianSquared, args: [["guitar", 1, 3, "apple"]],
        exp: 'Error: Array elements must be numbers.'},
    {func: arr_utils.maxElement, args: [],
        exp: 'Error: No array provided.'},
    {func: arr_utils.maxElement, args: [[]],
        exp: 'Error: Provided array is empty.'},
    {func: arr_utils.maxElement, args: [[5, 6, 7]], exp: {'7': 2}},
    {func: arr_utils.maxElement, args: [[-2, 10, 2]], exp: {'10': 1}},
    {func: arr_utils.maxElement, args: [5, 6, 7],
        exp: 'Error: No array provided.'},
    {func: arr_utils.maxElement, args: ['test'],
        exp: 'Error: No array provided.'},
    {func: arr_utils.maxElement, args: [[1,2,"nope"]],
        exp: 'Error: Array elements must be numbers.'},
    {func: arr_utils.fill, args: [6], exp: [0, 1, 2, 3, 4, 5]},
    {func: arr_utils.fill, args: [3, 'Welcome'],
        exp: ['Welcome', 'Welcome', 'Welcome']},
    {func: arr_utils.fill, args: [3, 2], exp: [2, 2, 2]},
    {func: arr_utils.fill, args: [],
        exp: 'Error: Missing "end" parameter.'},
    {func: arr_utils.fill, args: ['test'],
        exp: 'Error: Parameter "end" is not a number.'},
    {func: arr_utils.fill, args: [0],
        exp: 'Error: Parameter "end" must be greater than 0.'},
    {func: arr_utils.fill, args: [-4],
        exp: 'Error: Parameter "end" must be greater than 0.'},
    {func: arr_utils.countRepeating,
        args: [[7, '7', 13, true, true, true, "Hello","Hello", "hello"]],
        exp: {"7": 2, true: 3, "Hello": 2,}},
    {func: arr_utils.countRepeating, args: ["foobar"],
        exp: 'Error: No array provided.'},
    {func: arr_utils.countRepeating, args: [],
        exp: 'Error: No array provided.'},
    {func: arr_utils.countRepeating, args: [[]], exp: {}},
    {func: arr_utils.countRepeating, args: [{a: 1, b: 2, c: "Patrick"}],
        exp: 'Error: No array provided.'},
    {func: arr_utils.isEqual, args: [[1, 2, 3], [3, 1, 2]], exp: true},
    {func: arr_utils.isEqual,
        args: [[ 'Z', 'R', 'B', 'C', 'A' ], ['R', 'B', 'C', 'A', 'Z']],
        exp: true},
    {func: arr_utils.isEqual, args: [[1, 2, 3], [4, 5, 6]], exp: false},
    {func: arr_utils.isEqual, args: [[1, 3, 2], [1, 2, 3, 4]],
        exp: false},
    {func: arr_utils.isEqual, args: [[1, 2], [1, 2, 3]], exp: false},
    {func: arr_utils.isEqual,
        args: [[[ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ]], [[ 3, 1, 2 ], [ 5, 4, 6 ], [ 9, 7, 8 ]]],
        exp: true},
    {func: arr_utils.isEqual,
        args: [[[ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ]], [[ 3, 1, 2 ], [ 5, 4, 11 ], [ 9, 7, 8 ]]],
        exp: false},
    {func: arr_utils.isEqual, args: [],
        exp: 'Error: "arrayOne" not an array.'},
    {func: arr_utils.isEqual, args: [[]],
        exp: 'Error: "arrayTwo" not an array.'},
    {func: arr_utils.isEqual, args: [[], []], exp: true},
    {func: arr_utils.isEqual, args: ['test', []],
        exp: 'Error: "arrayOne" not an array.'},
];

let str_tests = [
    {func: str_utils.camelCase, args: ['my function rocks'],
        exp: "myFunctionRocks"},
    {func: str_utils.camelCase, args: [],
        exp: 'Error: No string provided.'},
    {func: str_utils.camelCase, args: ['FOO BAR'],
        exp: "fooBar"},
    {func: str_utils.camelCase, args: ["How now brown cow"],
        exp: "howNowBrownCow"},
    {func: str_utils.camelCase, args: [''],
        exp: 'Error: provided string is empty.'},
    {func: str_utils.camelCase, args: [123],
        exp: 'Error: No string provided.'},
    {func: str_utils.camelCase, args: [["Hello", "World"]],
        exp: 'Error: No string provided.'},
    {func: str_utils.replaceChar, args: ["Daddy"], exp: "Da*$y"},
    {func: str_utils.replaceChar, args: ["Mommy"], exp: "Mo*$y"},
    {func: str_utils.replaceChar,
        args: ["Hello, How are you? I hope you are well"],
        exp: "Hello, *ow are you? I $ope you are well"},
    {func: str_utils.replaceChar, args: ["babbbbble"],
        exp: "ba*$*$*le"},
    {func: str_utils.replaceChar, args: [''],
        exp: 'Error: provided string is empty.'},
    {func: str_utils.replaceChar, args: [123],
        exp: 'Error: No string provided.'},
    {func: str_utils.mashUp, args: ["Patrick", "Hill"],
        exp: "Hitrick Pall"},
    {func: str_utils.mashUp, args: ["hello", "world"],
        exp: "wollo herld"},
    {func: str_utils.mashUp, args: ["Patrick", ""],
        exp: 'Error: provided string for "string2" is empty.'},
    {func: str_utils.mashUp, args: [],
        exp: 'Error: No string provided for "string1".'},
    {func: str_utils.mashUp, args: [1, "hey"],
        exp: 'Error: No string provided for "string1".'},
    {func: str_utils.mashUp, args: ["John"],
        exp: 'Error: No string provided for "string2".'},
    {func: str_utils.mashUp, args: ["h", "Hello"],
        exp: 'Error: "string1" must be at least 2 characters.'},
    {func: str_utils.mashUp, args: ["h", "e"],
        exp: 'Error: "string1" must be at least 2 characters.'},
];

const first = { x: 2, y: 3};
const second = { a: 70, x: 4, z: 5 };
const third = { x: 0, y: 9, q: 10 };
const forth = { a: {sA: "Hello", sB: "There", sC: "Class"},
    b: 7, c: true, d: "Test"};
const fifth  = { c: true, b: 7, d: "Test",
    a: {sB: "There", sC: "Class", sA: "Hello"}};

let obj_tests = [
    {func: obj_utils.makeArrays, args: [[first, second, third]],
        exp: [ ['x',2],['y',3], ['a',70], ['x', 4], ['z', 5], ['x',0], ['y',9], ['q',10] ]},
    {func: obj_utils.makeArrays, args: [[second, third]],
        exp: [ ['a',70], ['x', 4], ['z', 5], ['x',0], ['y',9], ['q',10] ]},
    {func: obj_utils.makeArrays, args: [[third, first, second]],
        exp: [  ['x',0], ['y',9], ['q',10], ['x',2],['y',3], ['a',70], ['x', 4], ['z', 5] ]},
    {func: obj_utils.isDeepEqual, args: [first, second], exp: false},
    {func: obj_utils.isDeepEqual, args: [third, third], exp: true},
    {func: obj_utils.isDeepEqual, args: [forth, fifth], exp: true},
    {func: obj_utils.isDeepEqual, args: [{}, {}], exp: true},
    {func: obj_utils.isDeepEqual, args: [],
        exp: 'Error: isDeepEqual requires two object parameters.'},
    {func: obj_utils.isDeepEqual, args: [1, {a: 1}],
        exp: 'Error: "obj1" must be an object.'},
    {func: obj_utils.isDeepEqual, args: [{a: 1}, {a: 2}], exp: false},
    {func: obj_utils.isDeepEqual, args: [{a: 1}, {b: 1}], exp: false},
    {func: obj_utils.isDeepEqual, args: [[1, 2, 3], [1, 2, 3]],
        exp: 'Error: "obj1" must be an object.'},
    {func: obj_utils.isDeepEqual, args: ['foo', 'bar'],
        exp: 'Error: "obj1" must be an object.'},
    {func: obj_utils.isDeepEqual, args: [{}, 'bar'],
        exp: 'Error: "obj2" must be an object.'},
    {func: obj_utils.isDeepEqual, args: [{a: undefined}, {a: null}],
        exp: false},
    {func: obj_utils.computeObject, args: [],
        exp: 'Error: expected 2 parameters "(object, function)".'},
    {func: obj_utils.computeObject, args: [1, 1],
        exp: 'Error: expected object for "object".'},
    {func: obj_utils.computeObject, args: [{}, 1],
        exp: 'Error: expected function for "func".'},
    {func: obj_utils.computeObject,
        args: [{ a: 3, b: 7, c: 5 }, n => n * 2],
        exp: { a: 6, b: 14, c: 10 }},
    {func: obj_utils.computeObject,
        args: [{ a: 'aa', b: 7, c: 5 }, n => n * 2],
        exp: 'Error: object must contain only number values.'},
];


test(arr_tests, 'Array Tests');
test(str_tests, 'String Tests');
test(obj_tests, 'Object Tests');


console.log('-------');
console.log(`PASSED ${passed}/${tested} tests!`);
