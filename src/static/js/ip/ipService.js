const {devPrefixes, prodPrefixes} = require("./ipConfig");

function parseIp(ip, line, dns) {
    let commented = line.trim().startsWith("#");
    let obj = {
        "ip": ip,
        env: null,
        active: !commented ? "true" : "false",
        dns: dns
    }

    if ("127.0.0.1" === ip) {
        obj.env = "local";
        return obj;
    } else if ("255.255.255.255" === ip || "::1" === ip) {
        obj.env = "broadcast";
        return obj;
    }
    prodPrefixes.forEach(x => {
        if (ip.startsWith(x)) {
            obj.env = "prod"
        }
    })
    devPrefixes.forEach(x => {
        if (ip.startsWith(x)) {
            obj.env = "dev";
        }
    });

    if (obj.env === null) {
        obj.env = "unknown";
    }
    return obj;
}

module.exports = {
    parseIp: parseIp
}