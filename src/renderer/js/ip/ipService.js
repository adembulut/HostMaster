const config = require('@src/config')

const parseIp = (ip, line, dns) => {
    let commented = line.trim().startsWith("#");

    return {
        "ip": ip,
        env: getIpEnvironment(ip),
        active: !commented,
        valid: isValidIp(ip),
        dns: dns
    };
}

function getIpEnvironment(ip) {
    if (!isValidIp(ip)) {
        return "NOT_VALID";
    }
    for (const [key, values] of Object.entries(config.ip.env)) {
        for (let x of values) {
            if (x.type === "equals" && ip === x.value) {
                return key;
            } else if (x.type === "range" && isIpInRange(ip, x.value)) {
                return key;
            } else if (x.type === "startsWith" && ip.startsWith(x.value)) {
                return key;
            } else if (x.type === "endsWith" && ip.endsWith(x.value)) {
                return key;
            }
        }
    }
    return "unknown";
}

function isValidIp(ip) {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
}


function ipToLong(ip) {
    const parts = ip.split('.');
    return (parseInt(parts[0]) << 24) | (parseInt(parts[1]) << 16) | (parseInt(parts[2]) << 8) | parseInt(parts[3]);
}

function isIpInRange(ip, range) {
    const [rangeIp, subnet] = range.split('/');
    const ipLong = ipToLong(ip);
    const rangeLong = ipToLong(rangeIp);
    const subnetMask = 0xFFFFFFFF << (32 - parseInt(subnet));

    return (ipLong & subnetMask) === (rangeLong & subnetMask);
}

module.exports = {
    parseIp: parseIp
}