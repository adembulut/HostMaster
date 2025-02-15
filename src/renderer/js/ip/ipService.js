const config = require('@src/config')

const parseIp = (ip, line, dns) => {
    let commented = line.trim().startsWith("#");

    return {
        "ip": ip,
        env: getIpEnvironment(ip),
        active: !commented,
        dns: dns
    };
}

function getIpEnvironment(ip) {
    for (const [key, values] of Object.entries(config.ip.env)) {
        for (let x of values) {
            if (ip.startsWith(x)) {
                return key;
            }
        }
    }
    return "unknown";
}

module.exports = {
    parseIp: parseIp
}