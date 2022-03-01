const lab1 = require("./lab1");

let passed = 0;
let tested = 0;

function test(tests, name) {
    console.log(`TESTING ${name} ...`);

    let err_count = 0;
    let test_count = tests.length;

    tests.forEach((t, i) => {
        if (isNaN(t[0]) && isNaN(t[1])) return;
        if (t[0] === t[1]) return;
        console.log(`- TEST ${name}#${i+1} FAILED`);
        console.log(`  RECEIVED: ${t[0]} | EXPECTED: ${t[1]}`);
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

let q1_tests = [
    [lab1.questionOne([1, 2, 3]), 14],
    [lab1.questionOne([5, 3, 10]), 134],
    [lab1.questionOne([2, 1, 2]), 9],
    [lab1.questionOne([5, 10, 9]), 206],
    [lab1.questionOne([0, 0, 0]), 0],
    [lab1.questionOne([-3, 1, -1]), 11],
];

let q2_tests = [
    [lab1.questionTwo(7), 13],
    [lab1.questionTwo(0), 0],
    [lab1.questionTwo(-5), 0],
    [lab1.questionTwo(1), 1],
    [lab1.questionTwo(2), 1],
    [lab1.questionTwo(11), 89],
];

let q3_tests = [
    [lab1.questionThree('qwerty'), 1],
    [lab1.questionThree(''), 0],
    [lab1.questionThree('     '), 0],
    [lab1.questionThree('bcdfghjkl'), 0],
    [lab1.questionThree('aAaaaEeioUUuIOyY'), 14],
    [lab1.questionThree("Mr. and Mrs. Dursley, of number four, Privet Drive, were  proud  to  say  that  they  were  perfectly  normal,  thank you  very  much. They  were  the  last  people  youd  expect  to  be  involved in anything strange or mysterious, because they just didn't hold with such nonsense. \n Mr. Dursley was the director of a firm called Grunnings, which  made  drills.  He  was  a  big,  beefy  man  with  hardly  any  neck,  although he did have a very large mustache. Mrs. Dursley was thin and blonde and had nearly twice the usual amount of neck, which came in very useful as she spent so much of her time craning over garden fences, spying on the neighbors. The Dursleys had a small son  called  Dudley  and  in  their  opinion there  was no finer boy anywhere."), 196],
];

let q4_tests = [
    [lab1.questionFour(10), 3628800],
    [lab1.questionFour(-1), NaN],
    [lab1.questionFour(0), 1],
    [lab1.questionFour(1), 1],
    [lab1.questionFour(2), 2],
    [lab1.questionFour(5), 120],
]

test(q1_tests, 'Q1');
test(q2_tests, 'Q2');
test(q3_tests, 'Q3');
test(q4_tests, 'Q4');

console.log('-------');
console.log(`PASSED ${passed}/${tested} tests!`);
