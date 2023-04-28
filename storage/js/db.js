const fs = require('fs');
const pot = require('../vars/index.json')
const path = require('path');
const active = []
const filterWords = pot.filter
const filterRegex = new RegExp(filterWords.join('|'), 'gi');

var crypto = require('crypto');

module.exports.login = function (data, id) {
    var user = profile(data, id)
    var use = files(loc(id).user, user)
    if (!use) return
    if (use.pass !== user.pass) return
    if (use.user !== user.user) return
    delete user.pass
    delete user.id
    user.session = generate_key()
    active[id] = user.session
    console.log(active)
    return user
}
module.exports.active = function (data, id) {
    console.log(JSON.parse(data))
    if (!active[id]) return
    var use = files(loc(id).user, JSON.parse(data).id)
    var chat = files(loc(use.room).chat, [`Welcome to ${use.room}`])
    if (chat) {
        use.log = chat
    }
    return use
}
module.exports.msgs = function (data, id) {
    if (!active[id]) return
    var user = JSON.parse(data.use)
    user.msg = `${user.user}@${user.room}: ${filterText(data.msg)}`
    const datas = fs.readFileSync(loc(user.room).chat, 'utf8');
    var logs = JSON.parse(datas)
    logs.push(user.msg)
    fs.writeFileSync(loc(user.room).chat, JSON.stringify(logs) ,'utf8')
    return user
}
var profile = function (data, id) {
    var profile = {}
    profile.user = data.user
    profile.pass = crypto.createHmac('sha256', data.pass).digest("base64url")
    profile.room = pot.static.room
    profile.id = id
    return profile
}
var generate_key = function () {
    return crypto.randomBytes(16).toString('base64');
};
function filterText(text) {
    return text.replace(filterRegex, '****');
}
var files = function (data, res) {
    try {
        const datas = fs.readFileSync(data, 'utf8');
        return JSON.parse(datas)
    } catch (err) {
        fs.writeFileSync(data, JSON.stringify(res), "utf8")
    }
}

var loc = function (loc) {
    var tmp = {}
    tmp.user = path.join(__dirname + `/battle_64/${pot.loactions_db.user_loc}/${loc}.json`)
    tmp.chat = path.join(__dirname + `/battle_64/${pot.loactions_db.chat_loc}/${loc}.json`)
    tmp.cdir = path.join(__dirname + `/battle_64/${pot.loactions_db.chat_loc}/`)
    tmp.udir = path.join(__dirname + `/battle_64/${pot.loactions_db.user_loc}/`)
    return tmp
}