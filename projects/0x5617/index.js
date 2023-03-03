const fs = require("fs")



function main() {
    // 读取文件
    let data = readPrimitiveFile("./test.txt")
        // 文件转化
    let handledData = getHandledData(data)
        // 对数据进行去重
    let cleanedHandleData = getCleanedHandleData(handledData)
        // 最终处理
    let finnalHandleData = getLastHandleData(cleanedHandleData)

    // log out
    // logData(finnalHandleData)

    // 盈亏平衡计算
    let result = getPNL(finnalHandleData)

    console.log(result)
}

function readPrimitiveFile(path) {
    return fs.readFileSync(path).toString()
}

function getHandledData(data) {
    return data.split(/(?<=\})/).map(v => JSON.parse(v))
}

function getCleanedHandleData(data) {
    let o = []

    let left = 0
    let right = 1
    while (right < data.length) {
        o.push(data[left])
        while (right < data.length && data[right].tokenBalance === data[left].tokenBalance) right++;
        left = right
    }
    return o
}

function getLastHandleData(data) {
    let cha = []
    for (let i = 1; i < data.length; i++) {

        cha.push({
            pre: {
                year: data[i - 1].year,
                month: data[i - 1].month,
                day: data[i - 1].day,
                hour: data[i - 1].hour,
                minute: data[i - 1].minute
            },
            cur: {
                year: data[i].year,
                month: data[i].month,
                day: data[i].day,
                hour: data[i].hour,
                minute: data[i].minute
            },
            balanceDiff: data[i].tokenBalance - data[i - 1].tokenBalance,
            ethusd: data[i - 1].ethusd,
        })
    }
    return cha
}


function logData(data) {
    for (let item of data) {
        console.log(JSON.stringify(item, ["balanceDiff", "ethusd", "pre", "cur", "year", "month", "day", "hour", "minute"], 4))
    }
}

function getPNL(data) {
    let res = 0

    for (let m = 1; m < data.length; m++) {
        res += (data[m].ethusd - data[m - 1].ethusd) * data[m].balanceDiff
    }
    return res
}


main()