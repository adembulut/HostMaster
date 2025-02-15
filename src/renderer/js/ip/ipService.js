const ipConfig = require('@src/renderer/js/ip/ipConfig');

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
    if ("127.0.0.1" === ip) {
        return "local";
    } else if ("255.255.255.255" === ip || "::1" === ip) {
        return "broadcast";
    }
    return getConfigBasedEnvironments(ip);
}

function getConfigBasedEnvironments(ip) {
    for (let x of ipConfig.prodPrefixes) {
        if (ip.startsWith(x)) {
            return "prod";
        }
    }
    for (let x of ipConfig.devPrefixes) {
        if (ip.startsWith(x)) {
            return "dev";
        }
    }
    return "unknown";
}

module.exports = {
    parseIp:parseIp
}