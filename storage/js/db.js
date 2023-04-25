const fs = require('fs');
const fsPromises = require('fs').promises
const pot = require('../vars/index.json')
const path = require('path');
const active = []

module.exports.login = function (data, id) {
    var user = userp(data, id)
    active.push(user.session)
    var bridge = JSON.stringify(user)
    return bridge
}

module.exports.session = function (data, id) {
    var user = JSON.parse(data)
    if (!active.includes(user.session)) return "Failed login"
    user.msg = `admin@${user.room}: Welcome ${user.user}`
    var log = chats(user)
    user.log = log
    return user
}

module.exports.msgs = function (data, id) {
    var user = JSON.parse(data.use)
    user.msg = `${user.user}@${user.room}: ${data.msg}`
    var log = chats(user)
    return user
}


function chats(data) {
    var looc = locl(pot.loactions_db.chat_loc, data.room)
    var dir = path.join(__dirname, looc.chat)
    if (!fs.existsSync(dir)) {
        var file = path.join(__dirname, looc.chat)
        fs.writeFileSync(file, Buffer.from(JSON.stringify([])))
        return
    }
    var file = path.join(__dirname, looc.chat)
    var log = fs.readFileSync(file)
    var logs = JSON.parse(log)
    logs.push(data.msg)
    var file = path.join(__dirname, looc.chat)
    fs.writeFileSync(file, Buffer.from(JSON.stringify(logs)))
    return logs
}

function read(data) {
    var looc = locl(pot.loactions_db.user_loc, data.user, data.user)
    var file = path.join(__dirname, looc.file)
    var user = fs.readFileSync(file)
    return user
}

function write(data) {
    var looc = locl(pot.loactions_db.user_loc, data.user, data.user)
    var file = path.join(__dirname, looc.file)
    fs.writeFileSync(file, Buffer.from(JSON.stringify(data)))
}

function locl(loc, loc2, loc3) {
    var tmp = {}
    if (loc3) {
        tmp.file = `../battle_64/${loc}/${loc2}/${loc3}.json`
    }
    tmp.chat = `../battle_64/${loc}/${loc2}.json`
    tmp.dir = `../battle_64/${loc}/${loc2}/`
    return tmp
}

function userp(data, id) {
    var profile = {
        user: data.user,
        pass: data.pass,
        room: pot.static.room,
        session: Date.now(),
    }
    var looc = locl(pot.loactions_db.user_loc, data.user, data.user)
    var dir = path.join(__dirname, looc.dir)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
        profile.pass = id
        return profile
    }
    var file = path.join(__dirname, looc.file)
    fs.writeFileSync(file, Buffer.from(JSON.stringify(profile)))
    return profile
}
