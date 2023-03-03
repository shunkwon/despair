const fs = require("fs")

let data = fs.readFileSync("./test.txt").toString()


let handledData = data.split(/(?<=\})/).map(v => JSON.parse(v))
let o = []

for (let j = handledData.length - 2; j >= 0; j--) {
    if (handledData[j].tokenBalance !== handledData[j + 1].tokenBalance) {
        o.unshift(handledData[j])
    }
}

let cha = []
for (let i = 1; i < o.length; i++) {

    cha.push({
        pre: {
            year: o[i - 1].year,
            month: o[i - 1].month,
            day: o[i - 1].day,
            hour: o[i - 1].hour,
            minute: o[i - 1].minute
        },
        cur: {
            year: o[i].year,
            month: o[i].month,
            day: o[i].day,
            hour: o[i].hour,
            minute: o[i].minute
        },
        tokenBalance: o[i].tokenBalance - o[i - 1].tokenBalance,
        ethusd: o[i].ethusd - o[i - 1].ethusd,
    })
}

for (let item of cha) {
    console.log(JSON.stringify(item, ["tokenBalance", "ethusd", "pre", "cur", "year", "month", "day", "hour", "minute"], 4))
}


// fs.writeFileSync("./data.json", JSON.stringify(cha))
let res = cha.reduce((pre, cur) => {
    let { tokenBalance, ethusd } = cur
    return pre + tokenBalance * Math.abs(ethusd)
}, 0)