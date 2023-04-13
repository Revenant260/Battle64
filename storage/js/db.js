const fs = require('fs');
const pot = require('../vars/index.json')
const path = require('path');

module.exports.write = function (location, data, id) {

}

module.exports.read = function (location, data, id) {

}

module.exports.delete = function (location, data, id) {

}

module.exports.login = function (location, data, id) {
    var filePath = path.join(__dirname, `../battle_64/${location}/${id.split(":")[3]}.json`);
    if (fs.existsSync(path)) {
        console.log('File exists!');
      } else {
        console.log('File does not exist.');
        fs.writeFile(filePath, "", (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('File created successfully');
        });
      }
    const list = userprf(data, id, location, filePath);
}
function userprf(data, id, location, path) {
    const userp = {
        "usern": data.user,
        "id": id,
        "psw": data.pass
    }
    fs.writeFile(path, JSON.stringify(userp), (err) => {
        if (err) {
            console.log('Error writing file:', err);
        } else {
            console.log('Data saved successfully');
        }
    });
    return userp
}