const questionOne = function questionOne(arr) {
    let sum = 0;

    arr.forEach((i) => {
        sum += i * i
    });

    return sum;
}

const questionTwo = function questionTwo(num) {
    if (num < 1) return 0;

    let prev = 1, val = 1;

    for (let i = 2; i < num; i++) {
        val += prev;
        prev = val - prev;
    }

    return val;
}

const questionThree = function questionThree(text) {
    const vowels = /[AEIOUaeiou]/g;
    let chars = text.match(vowels);

    return (chars == null) ? 0 : chars.length;
}

const questionFour = function questionFour(num) {
    if (num < 0) return NaN;

    let val = 1;

    for (let i = 2; i <= num; i++)
        val *= i;

    return val;
}

module.exports = {
    firstName: "ADRIAN",
    lastName: "GOMES",
    studentId: "10445395",
    questionOne,
    questionTwo,
    questionThree,
    questionFour
};
