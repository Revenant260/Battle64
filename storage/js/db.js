const fs = require('fs');
const pot = require('../vars/index.json')
const shop = require('./battle_64/shop/items.json')
const path = require('path');
const active = []
const filterWords = pot.filter
const filterRegex = new RegExp(filterWords.join('|'), 'gi');
const delay = 30 * 60 * 1000;

var crypto = require('crypto');
module.exports.login = function (data, id) {
    var user = profile(data, id)
    var use = files(loc(id).user, user)
    if (!use) return "Fail"
    if (use.pass !== user.pass) return "Fail"
    if (use.user !== user.user) return "Fail"
    delete user.pass
    delete user.id
    user.session = generate_key()
    active[id] = user.session
    /*
    setTimeout(() => {
        delete active[id]
    }, delay)
    */
    console.log(active)
    return user
}
module.exports.active = function (data, id) {
    console.log(JSON.parse(data))
    if (!active[id]) return "Fail"
    var use = files(loc(id).user, JSON.parse(data).id)
    var chat = files(loc(use.room).chat, [`Welcome to ${use.room}`])
    if (chat) {
        use.log = chat
    }
    return use
}
module.exports.msgs = function (data, id) {
    if (!active[id]) return "Fail"
    var user = JSON.parse(data.use)
    const datas = fs.readFileSync(loc(user.room).chat, 'utf8');
    var logs = JSON.parse(datas)
    var tracker = exps(data, id, 5)
    user.msg = `[${user.user}][LVL:${tracker.lvl}]@[${user.room}]: ${filterText(data.msg)}`
    logs.push(user.msg)
    fs.writeFileSync(loc(user.room).chat, JSON.stringify(logs), 'utf8')
    user.trk = tracker.msg
    delete tracker.msg
    fs.writeFileSync(loc(id).oc, JSON.stringify(tracker), 'utf8')
    var tcm = Array.from(data.msg)[0];
    if (tcm === "@") {
        var cmds = filterText(data.msg).split(" ")
        user.cmd = comands(cmds, id)
    }
    return user
}

var comands = function (data, id) {
    var oc = files(loc(id).oc)
    if (data[0] === "@help") return '@stats | @spar | @inv - inv eqp | shows active gear'
    if (data[0] === "@stats") {
        var msg = ""
        msg += `EXP:(${oc.exp}) LVL:(${oc.lvl}) NXTLVL:(${oc.gap}) GOLD:(${oc.gold})<br/>`
        msg += `HP:(${oc.bstats.hp}) DMG:(${oc.bstats.dmg}) STR:(${oc.bstats.str}) DEF:(${oc.bstats.def}) SPD:(${oc.bstats.spd})`
        return msg
    }

    if (data[0] === "@shop") {
        if (!data[1]) return `@shop weapons | defence | spells | stats | support | upgrades`

        var vendor = shop[data[1]]
        if (!data[2]) {
            if (vendor) {
                let message = `Here are the items available in our ${data[1]} shop:<br/><br/>`;
                for (const id in vendor) {
                    if (vendor.hasOwnProperty(id)) {
                        const items = vendor[id];
                        message += `[${id}]:${items.name}<br/>Damage: ${items.dmg}<br/>Price: ${items.price}<br/>`;
                    }
                }
                return message
            } else {
                console.log(`No one is selling from ${data[1]}.`);
            }
        } else {
            if (oc.gold < vendor[data[2]].price) return "Not enough Gold!"
            oc.gold -= vendor[data[2]].price
            const itemId = Object.keys(oc.inv.stash).length + 1
            oc.inv.stash[itemId] = vendor[data[2]]
            fs.writeFileSync(loc(id).oc, JSON.stringify(oc), 'utf8')
            return `[Purchase]:${vendor[data[2]].name}<br/>Damage: ${vendor[data[2]].dmg}<br/>Price: ${vendor[data[2]].price}<br/>`
        }
    }

    if (data[0] === "@inv") {
        var inv = oc.inv.stash
        if (!data[1]) {
            let message = "Stash:<br/><br/>";
            for (const id in inv) {
                if (inv.hasOwnProperty(id)) {
                    const items = inv[id];
                    message += `[${id}]:${items.name}<br/>Damage: ${items.dmg}<br/>Price: ${items.price}<br/>`;
                }
            }
            return message
        } else {
            if (data[1] === "eqp") {
                if (!data[2]) return `WPN:${oc.inv.WPN.name} Dmg:${oc.inv.WPN.dmg}<br/>DEF:${oc.inv.DEF.name} Arm:${oc.inv.DEF.armor}<br/>MGC: ${oc.inv.MGC.name} Dmg:${oc.inv.MGC.dmg}`
                oc.inv[inv[data[2]].type] = inv[data[2]]
                delete inv[data[2]]
                fs.writeFileSync(loc(id).oc, JSON.stringify(oc), 'utf8')
                return "Equiped!"
            }
        }
    }

    if (data[0] === "@spar") {
        let user = oc.bstats
        user.use = files(loc(id).user, user)
        let enemy = bttlb()
        enemy.str += oc.lvl
        var btlog = simulateBattle(user, enemy)
        delete enemy
        return btlog
    }
}

function getHealthBar(currentHealth, maxHealth) {
    if (currentHealth < 0) currentHealth = 0
    const barLength = 25; // length of the health bar
    const filledLength = Math.round((currentHealth / maxHealth) * barLength);
    const filled = '█'.repeat(filledLength);
    const empty = '▒'.repeat(barLength - filledLength);
    const healthBar = `${filled}${empty}`;
    return healthBar;
}

function simulateBattle(user, enemy) {
    var pHP = user.hp;
    var eHP = enemy.hp;
    var patk = user.str * (Math.random() + 1) - enemy.def 
    var eatk = enemy.str * (Math.random() + 1) - user.def 
    var round = 1;
    var bttlog = []
    bttlog.push(`Spar Match Begin!`)
    while (pHP > 0 && eHP > 0) {
        let fatk, satk, fiatk, seatk;
        if (user.spd >= enemy.spd) {
            fatk = user.use.user;
            satk = "Enemy";
            fiatk = patk;
            seatk = eatk;
        } else {
            fatk = "Enemy";
            satk = user.use.user;
            fiatk = eatk;
            seatk = patk;
        }
        eHP -= fiatk;
        if (eHP <= 0) break;
        pHP -= seatk;
        if (pHP <= 0) break;
        bttlog.push(`${user.use.user} HP:${getHealthBar(pHP, user.hp)} VS EHP:${getHealthBar(eHP, enemy.hp)}`)
        round++;
    }
    bttlog.push(`${user.use.user} HP:${getHealthBar(pHP, user.hp)} VS EHP:${getHealthBar(eHP, enemy.hp)}`)
    if (pHP <= 0) {
        bttlog.push("You were defeated!")
    } else {
        bttlog.push("You are victorious!")
    } return bttlog
}


const expPerLvlMultiplier = 1.2;
var exps = function (data, id, amount) {
    var user = stats(data, id)
    var use = files(loc(id).oc, user)
    use.exp += amount;
    while (use.exp >= use.gap) {
        use.lvl++;
        use.msg = `Congratulations, you've leveled up to level ${use.lvl}, and got ${use.exp} gold!`
        use.gold += use.exp
        use.exp -= use.gap;
        use.gap = Math.floor(use.gap * expPerLvlMultiplier);
    }
    return use
}

var bttlb = function () {
    const hp = Math.floor(Math.random() * (100 - 50 + 1) + 50);
    const dmg = Math.floor(Math.random() * (20 - 10 + 1) + 10);
    const str = Math.floor(Math.random() * (20 - 10 + 1) + 10)
    const def = Math.floor(Math.random() * (10 - 5 + 1) + 5);
    const spd = Math.floor(Math.random() * (10 - 1 + 1) + 1);

    return { hp, dmg, def, str, spd };
}

var inv = function () {
    var ocinv = {}
    ocinv.smax = 50
    ocinv.WPN = {}
    ocinv.DEF = {}
    ocinv.MGC = {}
    ocinv.stash = {}
    return ocinv
}

var stats = function () {
    var oc = {}
    oc.exp = 0
    oc.lvl = 0
    oc.gap = 100
    oc.gold = 500
    oc.inv = inv()
    oc.bstats = bttlb()
    return oc
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
        return res
    }
}

var loc = function (loc) {
    var tmp = {}
    tmp.user = path.join(__dirname + `/battle_64/${pot.loactions_db.user_loc}/${loc}.json`)
    tmp.chat = path.join(__dirname + `/battle_64/${pot.loactions_db.chat_loc}/${loc}.json`)
    tmp.oc = path.join(__dirname + `/battle_64/${pot.loactions_db.oc_loc}/${loc}.json`)
    tmp.cdir = path.join(__dirname + `/battle_64/${pot.loactions_db.chat_loc}/`)
    tmp.udir = path.join(__dirname + `/battle_64/${pot.loactions_db.user_loc}/`)
    return tmp
}