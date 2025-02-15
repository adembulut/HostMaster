const ipService = require('@static/js/ip/ipService')
const fileService = require('@static/js/file/fileService')

const hostFilePath = "/etc/hosts";

function readHosts(callback) {
    fileService.readFile(hostFilePath, (lines) => {
        callback(readLines(lines))
    });
}

async function writeFile(data) {
    return await fileService.writeFile(hostFilePath, data);
}

function readLines(lines) {
    let map = new Map();
    lines.forEach(x => {
        x = x.replace(/\s+/g, ' ').trim();
        let regex = /\b(\d{1,3}\.){3}\d{1,3}\b/g;
        let matches = x.match(regex);
        if ((matches === null || matches.length === 0) && !x.startsWith("::1")) {
            return false;
        }
        let dns;
        let ip;
        if (x.startsWith("::1")) {
            ip = "::1";
        } else {
            ip = matches[0];
        }
        dns = x.replace(ip, "").replace("#", "").trim();
        let line = x;

        let ipItem = ipService.parseIp(ip, line, dns);
        if (map.has(dns)) {
            map.get(dns).push(ipItem);
        } else {
            map.set(dns, [ipItem]);
        }
    });
    let list = [];
    map.forEach(function (x, y) {
        list.push({dns: y, ipList: x});
    });

    return list;
}

function getHostsLinesFromJson(data) {
    let broadcast = [];
    let otherList = [];
    data.forEach(function (item) {
        item.ipList.forEach(x => {
            if (x.env === "broadcast") {
                broadcast.push(x);
            } else {
                otherList.push(x);
            }
        })
    });
    broadcast.sort(compareItem);
    broadcast.push('');
    otherList.sort(compareItem);
    let result = broadcast.concat(otherList);

    let lines = [];
    result.forEach(x => {
        if (x === '') {
            lines.push('\n');
        } else {
            let line = x.active === "false" ? "#" : "";
            let ipTab = x.ip;
            if (x.ip.length <= 11) {
                ipTab += "\t\t\t";
            } else if (x.ip.length < 15) {
                ipTab += "\t\t";
            } else {
                ipTab += "\t";
            }

            line += ipTab;
            line += x.dns + "\n"
            lines.push(line);
        }
    });
    return lines;
}

function compareItem(a, b) {
    if (a.dns < b.dns) return -1;
    if (a.dns > b.dns) return 1;

    if (a.env < b.env) return -1;
    if (a.env > b.env) return 1;

    return a.ip.localeCompare(b.ip, undefined, {numeric: true});
}

module.exports = {
    readHosts: readHosts,
    writeFile: writeFile,
    getHostsLinesFromJson: getHostsLinesFromJson,
};
