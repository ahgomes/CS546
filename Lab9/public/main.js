const form = document.querySelector('#checker');
const input = form.querySelector('#num');
const error = form.querySelector('.error');
const attempts = document.querySelector('#attempts');

form.addEventListener('submit', e => {
    e.preventDefault();
    let n = input.value;
    input.value = '';

    if (n == '') {
        error.style.visibility = 'visible';
        return;
    } else error.style.visibility = 'hidden';

    add_attempt(n, is_prime(n));

});

const is_prime = n => {
    if (n <= 3) return n > 1;
    if ((n % 2 === 0) || (n % 3 === 0)) return false;

    for (let i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0)
            return false;
    }

    return true;
};

const add_attempt = (num, is_prime) => {
    let li = document.createElement('li');
    if (is_prime) {
        li.innerHTML = `${num} is a prime number`;
        li.classList.add('is-prime');
    } else {
        li.innerHTML = `${num} is a NOT prime number`;
        li.classList.add('not-prime');
    }
    attempts.appendChild(li);
};
