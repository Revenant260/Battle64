const fs = require('fs');
const pot = require('../vars/index.json')
const path = require('path');

module.exports.login = function (location, data, id) {
    const directoryPath = path.join(__dirname, `../battle_64/${location}/${id}`)
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath)
        var profile = {
            user: data.user,
            pass: data.pass,
            room: pot.static.room,
            session: Date.now(),
            ban: []
        }
        const send = JSON.stringify(profile)
        const filePath = path.join(__dirname, `../battle_64/${location}/${id}/${data.user}.json`)
        const buffer = Buffer.from(JSON.stringify(profile));

        fs.writeFile(filePath, buffer, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        return profile
    } else {
        const filePath = path.join(__dirname, `../battle_64/${location}/${id}/${data.user}.json`)
        fs.readFile(filePath, 'utf8', function readFileCallback(err, datas) {
            var obj = JSON.parse(datas);
            if (data.pass === obj.pass) {
                obj.session = Date.now()
                const buffer = Buffer.from(JSON.stringify(obj));
                fs.writeFile(filePath, buffer, (err) => {
                    if (err) throw err;
                    console.log(obj.user + ` has logged in!`);
                });
            }
        })
    }
}

module.exports.session = function (location, data, id) {
    const directoryPath = path.join(__dirname, `../battle_64/${location}/${id}`)
    const user = fs.readdirSync(directoryPath)[0].split(".")[0]
    var filePath = path.join(__dirname, `../battle_64/${location}/${id}/${user}.json`)
    var file = fs.readFileSync(filePath, 'utf8')
    var obj = JSON.parse(file);
    var gate = Date.now() - obj.session
    if (gate > 1000000) return `[admin@${obj.room}]: Please login to continue`
    filePath = path.join(__dirname, `../battle_64/${pot.loactions_db.chat_loc}/${obj.room}.json`)
    var chat = fs.readFileSync(filePath, 'utf8')
    var logs = JSON.parse(chat);
    obj.msg = `[admin@${obj.room}]: ${obj.user} has joined the chat`
    logs.push(obj.msg)
    const buffer = Buffer.from(JSON.stringify(logs));
    fs.writeFile(filePath, buffer, (err) => {
        if (err) throw err;
        console.log(`Chat saved`);
    });
    obj.log = logs
    return obj
}

const filterWords = pot.filter
const filterRegex = new RegExp(filterWords.join('|'), 'gi');

const MAX_MESSAGES_PER_SECOND = 5;
const messageCountMap = new Map();
module.exports.msgs = function (location, data, id) {
    const directoryPath = path.join(__dirname, `../battle_64/${location}/${id}`)
    const user = fs.readdirSync(directoryPath)[0].split(".")[0]
    var filePath = path.join(__dirname, `../battle_64/${location}/${id}/${user}.json`)
    var file = fs.readFileSync(filePath, 'utf8')
    var obj = JSON.parse(file);
    var gate = Date.now() - obj.session
    if (gate > 1000000) return `[admin@${obj.room}]: Please login to continue`
    var rate = isRateLimited(obj.user)
    if (rate) return `[admin@${obj.room}]: You are sending msgs to quick`
    var filter = filterText(data);
    obj.msg = `[${obj.user}@${obj.room}]: ${filter}`
    filePath = path.join(__dirname, `../battle_64/${pot.loactions_db.chat_loc}/${obj.room}.json`)
    var chat = fs.readFileSync(filePath, 'utf8')
    var logs = JSON.parse(chat);
    logs.push(obj.msg)
    const buffer = Buffer.from(JSON.stringify(logs));
    fs.writeFile(filePath, buffer, (err) => {
        if (err) throw err;
        console.log(`Chat saved`);
    });
    return obj
}

function isRateLimited(userId) {
  const messageCountObj = messageCountMap.get(userId) || { count: 0, lastMessageTime: 0 };
  const { count, lastMessageTime } = messageCountObj;
  const now = Date.now();
  if (count >= MAX_MESSAGES_PER_SECOND * (now - lastMessageTime) / 1000) {
    return true;
  }
  messageCountMap.set(userId, { count: count + 1, lastMessageTime: now });
  return false;
}

function filterText(text) {
    return text.replace(filterRegex, '****');
}