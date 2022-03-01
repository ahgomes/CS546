const bands = require("./data/bands");
const mongoCollections = require('./config/mongoCollections');
const bc = mongoCollections.bands;

const is_equal_arr = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length != arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (Array.isArray(arr1[i])) {
            if (!is_equal_arr(arr1[i], arr2[i])) return false;
        } else if (typeof arr1[i] == 'object') {
            if (!is_equal_obj(arr1[i], arr2[i])) return false;
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
            if (!is_equal_arr(el1, el2))
                return false;
        } else if (typeof el1 == 'object') {
            if (!is_equal_obj(el1, el2)) return false;
        } else if (!Object.is(el1, el2)) return false;
    }

    return true;
}

let passed = 0;
let tested = 0;

async function test(tests, name) {
    console.log(`TESTING ${name} ...`);

    let err_count = 0;
    let test_count = tests.length;

    for (let i = 0; i < tests.length; i++) {
        let t = tests[i];
        let result;
        try {
            result = await t.func.apply(null, t.args);
            //console.log(i, result);
            if (Object.is(result, t.exp)) continue;
            if (Array.isArray(result)) {
                if (is_equal_arr(result, t.exp)) continue;
            } else if (typeof result == 'object') {
                if (is_equal_obj(result, t.exp)) continue;
            }
        } catch (e) {
            //console.log(i, e);
            if (Object.is(e, t.exp)) continue;
            result = e;
        }

        console.log(`- TEST ${name}#${i+1} FAILED`);
        console.log(`  RECEIVED: ${JSON.stringify(result)} | EXPECTED: ${JSON.stringify(t.exp)}`);
        ++err_count;
    }

    passed += test_count - err_count;
    tested += test_count;

    if (err_count) {
        console.log(`* ${name} failed ${err_count}/${test_count}`);
        return false;
    }

    console.log('* PASSED');
    return true;
}

let err_tests = [
    {func: bands.create, args: [],
        exp: 'Error: Missing some of 6 arguments.'},
    {func: bands.create, args: ["Pink Floyd",
        ["Progressive Rock", "Psychedelic rock", "Classic Rock"],
        "pinkfloyd.com",
        "EMI",
        ["Roger Waters", "David Gilmour", "Nick Mason",
            "Richard Wright", "Sid Barrett" ],
        1965 ],
        exp: 'Error: Invalid website.'},
    {func: bands.create, args: ["Pink Floyd",
        ["Progressive Rock", "Psychedelic rock", "Classic Rock"],
        "http://www.p.com",
        "EMI",
        ["Roger Waters", "David Gilmour", "Nick Mason",
            "Richard Wright", "Sid Barrett" ],
        1965 ],
        exp: 'Error: Invalid website.'},
    {func: bands.create, args: ["Pink Floyd",
        ["Progressive Rock", "Psychedelic rock", "Classic Rock"],
        "http://www.pinkfloyd.org",
        "EMI",
        ["Roger Waters", "David Gilmour", "Nick Mason",
            "Richard Wright", "Sid Barrett" ],
        1965 ],
        exp: 'Error: Invalid website.'},
    {func: bands.create, args: ["Pink Floyd",
        ["Progressive Rock", "Psychedelic rock", "Classic Rock"],
        "http://www.pinkfloyd.com",
        "EMI",
        ["Roger Waters", "David Gilmour", "Nick Mason",
            "Richard Wright", "Sid Barrett" ],
        1813 ],
        exp: 'Error: Invalid year provided.'},
        {func: bands.create, args: ["Pink Floyd",
            [],
            "http://www.pinkfloyd.com",
            "EMI",
            ["Roger Waters", "David Gilmour", "Nick Mason",
                "Richard Wright", "Sid Barrett" ],
            1965 ],
            exp: 'Error: "genre" must be a valid array.'},
        {func: bands.create, args: ["Pink Floyd",
            ["    "],
            "http://www.pinkfloyd.com",
            "EMI",
            ["Roger Waters", "David Gilmour", "Nick Mason",
                "Richard Wright", "Sid Barrett" ],
            1965 ],
            exp: 'Error: Provided string for "genre[0]" is empty.'},
        {func: bands.create, args: ["Pink Floyd",
            ["Progressive Rock", 5, "Psychedelic rock", "Classic Rock"],
            "http://www.pinkfloyd.com",
            "EMI",
            ["Roger Waters", "David Gilmour", "Nick Mason",
                "Richard Wright", "Sid Barrett" ],
            1965 ],
            exp: 'Error: No string provided for "genre[1]".'},
        {func: bands.create, args: ["Pink Floyd",
            {1: "Progressive Rock", 2: "Psychedelic rock", 3: "Classic Rock" },
            "http://www.pinkfloyd.com",
            "EMI",
            ["Roger Waters", "David Gilmour", "Nick Mason",
                "Richard Wright", "Sid Barrett" ],
            1965 ],
            exp: 'Error: "genre" must be a valid array.'},
        {func: bands.get, args: ['asdfasdf'], exp: 'Error: Invalid object ID.'}
];

async function other_tests() {
    const band_collection = await bc();
    band_collection.deleteMany({});

    console.log(await bands.getAll()); // []
    let band1 = await bands.create("Pink Floyd", ["Progressive Rock", "Psychedelic rock", "Classic Rock"], "http://www.pinkfloyd.com", "EMI", ["Roger Waters", "David Gilmour", "Nick Mason", "Richard Wright", "Sid Barrett" ], 1965);
    console.log(band1);
    let band2 = await bands.create("Pink Floyd", ["Progressive Rock", "Psychedelic rock", "Classic Rock"], "http://www.pinkfloyd.com", "EMI", ["Roger Waters", "David Gilmour", "Nick Mason", "Richard Wright", "Sid Barrett" ], 1965);
    console.log(await bands.getAll());
    let band3 = await bands.create("Pink Floyd", ["Progressive Rock", "Psychedelic rock", "Classic Rock"], "http://www.pinkfloyd.com", "EMI", ["Roger Waters", "David Gilmour", "Nick Mason", "Richard Wright", "Sid Barrett" ], 1965);
    console.log(band3);
    console.log(await bands.rename(band1._id, 'New Name'));
    band1 = await bands.get(band1._id);
    console.log(band1);
    await bands.remove(band2._id)
    console.log(await bands.getAll());

}

async function main() {
    await test(err_tests, 'Error Tests');

    console.log('-------');
    console.log(`PASSED ${passed}/${tested} tests!`);

    await other_tests();
    console.log('DONE!');

    process.exit();
}

main();
