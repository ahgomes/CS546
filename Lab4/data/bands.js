const mongoCollections = require('../config/mongoCollections');
const bands = mongoCollections.bands;
const { ObjectId } = require('mongodb');

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

const check_array_nonempty = (arr, name) => {
    if (!Array.isArray(arr) || arr.length < 1)
        throw `Error: "${name}" must be a valid array.`
    return arr.map((a, i) => check_string_nonempty(a, `${name}[${i}]`))
};

async function create(name, genre, website, recordLabel, bandMembers, yearFormed) {
    if (!name || !genre || !website || !recordLabel
            || !bandMembers || !yearFormed) {
        throw 'Error: Missing some of 6 arguments.';
    }

    let bname = check_string_nonempty(name, 'name');
    let bwebsite = check_string_nonempty(website, 'website');
    let brecordLabel = check_string_nonempty(recordLabel, 'recordLabel');

    if (!(/http:\/\/www\.\w{5,}\.com/ig.test(bwebsite)))
        throw 'Error: Invalid website.';

    let bgenre = check_array_nonempty(genre, 'genre');
    let bbandMembers = check_array_nonempty(bandMembers, 'bandMembers');

    if (typeof yearFormed != 'number' || yearFormed < 1900 || yearFormed > 2022)
        throw 'Error: Invalid year provided.';

    const band_collection = await bands();

    let new_band = { name: bname, genre: bgenre, website: bwebsite,
        recordLabel: brecordLabel, bandMembers: bbandMembers,
        yearFormed: yearFormed, };


    const insert_info = await band_collection.insertOne(new_band);
    if (!insert_info.acknowledged || !insert_info.insertedId)
        throw 'Error: Unable to add band';
    const band = await this.get(insert_info.insertedId.toString());

    return band;
}

async function getAll() {
    const band_collection = await bands();
    const band_list = await band_collection.find({}).toArray();
    if (!band_list) return []
    return band_list.map(band => {
        band._id = band._id.toString()
        return band
    });
}

async function get(id) {
    let bid = check_string_nonempty(id);

    if (!ObjectId.isValid(bid))
        throw 'Error: Invalid object ID.';

    const band_collection = await bands();
    const band = await band_collection.findOne({ _id: ObjectId(id) });
    if (band === null)
        throw 'Error: Band not found.';

    band._id = band._id.toString()
    return band
}

async function remove(id) {
    let band = await get(id);

    const band_collection = await bands();
    const delete_info = await band_collection.deleteOne({ _id: ObjectId(id) });

    if (delete_info.deletedCount === 0)
        throw 'Error: Unable to delete band.';

    return `${band.name} has been successfully deleted!`;
}

async function rename(id, newName) {
    let band = await get(id);
    let new_name = check_string_nonempty(newName, 'newName');

    const band_collection = await bands();
    const update_info = await band_collection.updateOne(
        { _id: ObjectId(id) }, { $set: {name: new_name}});
    if (update_info.modifiedCount === 0)
        throw 'Error: Unable to update band.';

    return get(id);
}

module.exports = {
  description: 'Band Module',
  create,
  getAll,
  get,
  remove,
  rename,
};
