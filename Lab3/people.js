const axios = require('axios');

const get_people = async _ => {
   const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/a1196cbf008e85a8e808dc60d4db7261/raw/9fd0d1a4d7846b19e52ab3551339c5b0b37cac71/people.json');
   return data;
};

const check_string_nonempty = (string, name) => {
    if (string == undefined || typeof string != 'string')
        throw 'Error: No string provided'
            + ((name) ? ` for "${name}".` : '.');

    let str = string.trim();
    if (str.length < 1)
        throw 'Error: Provided string'
            + ((name) ? ` for "${name}" is empty.` : ' is empty.');

    return str;
};

async function getPersonByName(firstName, lastName) {
    let fname = check_string_nonempty(firstName, 'firstName');
    let lname = check_string_nonempty(lastName, 'lastName');

    let ppl = await get_people();
    for (let person of ppl) {
        if (person.first_name == fname && person.last_name == lname)
            return person;
    }

    throw 'Error: Person not found.';
}

async function getPersonById(id) {
    let valid_str = check_string_nonempty(id);
    let ppl = await get_people();

    for (let person of ppl) {
        if (person.id === valid_str)
            return person;
    }

    throw 'Error: Person not found.';
}

async function sameEmail(emailDomain) {
    let valid_str = check_string_nonempty(emailDomain);

    let last_dot = valid_str.lastIndexOf('.');
    if (!/\w+\.\w+/ig.test(valid_str))
        throw 'Error: Invalid domain.'
    else if (valid_str.length - last_dot < 3)
        throw 'Error: Invalid domain.';
    else {
        let pattern = /^[A-Z]{2,}$/ig;
        if (!pattern.test(valid_str.substring(last_dot + 1)))
            throw 'Error: Invalid domain.';
    }

    let ppl = await get_people();
    let domain = valid_str.toUpperCase();
    let same = [];

    for (let person of ppl) {
        let p_domain = person.email.substring(person.email.indexOf('@') + 1);
        if (domain === p_domain.toUpperCase())
            same.push(person);
    }

    if (same.length < 2)
        throw 'Error: Two or more people with this domain not found.'

    return same;
}

async function manipulateIp() {
    let ppl = await get_people();
    let names_n_ips = ppl.map(({ first_name, last_name, ip_address }) => {

        let ip = ip_address
            .replaceAll('.', '')
            .trim()
            .split('')
            .sort()
            .join('') * 1;

        return { firstName: first_name, lastName: last_name, ip: ip }
    });

    let max, min = max = names_n_ips[0];
    let sum = names_n_ips[0].ip;
    let i = 1;
    for (; i < names_n_ips.length; ++i) {
        let curr = names_n_ips[i];
        if (curr > max)
            max = curr;
        else if (curr < min)
            min = curr;
        sum += curr.ip;
    }

    delete max.ip;
    delete min.ip;

    return { highest: max, lowest: min, average: Math.floor(sum / i)}
}

async function sameBirthday(month, day) {
    if (month == undefined)
        throw 'Error: Missing month.';
    if (day == undefined)
        throw 'Error: Missing day.';

    let m = month * 1, d = day * 1;
    if (isNaN(m)) throw 'Error: Invalid type for month.';
    if (isNaN(d)) throw 'Error: Invalid type for day.';

    if (m < 1 || m > 12) throw 'Error: Invalid month.';
    if (d < 1 || d > 31) throw 'Error: Invalid day.';
    if (d > 28 && m == 2) throw 'Error: Invalid day.';
    if (d > 30 && (m == 9 || m == 4 || m == 6 || m == 11))
        throw 'Error: Invalid day.';

    let ppl = await get_people();

    let same = [];

    // ppl = ppl.sort((a, b) => {
    //     let ab = a.date_of_birth.split('/');
    //     let bb = b.date_of_birth.split('/');
    //     if ((ab[0] - bb[0]) == 0) {
    //         return ab[1] - bb[1];
    //     }
    //     return ab[0] - bb[0];
    // });
    //
    // console.log(ppl.map(({date_of_birth}) => date_of_birth));

    for (let person of ppl) {
        let bday = person.date_of_birth.split('/');
        if (bday[0] == m && bday[1] == d) {
            let {first_name, last_name} = person;
            same.push(first_name + ' ' + last_name);
        }
    }

    if (same.length < 1)
        throw 'Error: Person not found with this birthday.';

    return same;
}

module.exports = {
  description: 'People Module',
  get_people,
  check_string_nonempty,
  getPersonByName,
  getPersonById,
  sameEmail,
  manipulateIp,
  sameBirthday,
};
