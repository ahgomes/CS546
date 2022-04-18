const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const salt_rounds = 16;

const validate = (username, password) => {
    if (!username) throw 'Error: Missing username.';
    if (!password) throw 'Error: Missing password.';

    let u = username.trim(),
        p = password.trim();

    if (u.length < 1) throw 'Error: Username is empty.';
    if (u.length < 4) throw 'Error: Username is too short.';
    if (u.match(/\W/g))
        throw 'Error: Username must only contain alphanumeric characters.';
    if (p.length < 1) throw 'Error: Password is empty.';
    if (p.length < 6) throw 'Error: Password is too short.';
    u = u.toLowerCase();
    return {uname: u, pswd: p};
}

async function createUser(username, password) {
    let {uname, pswd} = validate(username, password);

    const user_collection = await users();
    const user = await user_collection.findOne({ username: uname });
    if (user != null)
        throw 'Error: Username already in use.';
    const hash = await bcrypt.hash(pswd, salt_rounds);

    const insert_info = await user_collection.insertOne({
        username: uname, password: hash });
    if (!insert_info.acknowledged || !insert_info.insertedId)
        throw 'Error: Unable to add user.';

    return { userInserted: true };
}

async function checkUser(username, password) {
    let {uname, pswd} = validate(username, password);
    const user_collection = await users();
    const user = await user_collection.findOne({ username: uname });
    if (user === null)
        throw 'Error: Either the username or password is invalid.';

    let compare = false;
    try {
        compare = await bcrypt.compare(pswd, user.password);
    } catch {}

    if (compare) return { authenticated: true };
    else throw 'Error: Either the username or password is invalid.';
}

module.exports = {
  description: 'Users Module',
  validate,
  createUser,
  checkUser,
};
