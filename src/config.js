const config = {
    hostFile: "/etc/hosts",
    ip: {
        env: {
            "loopback": [
                {value: "127.0.0.0/8", type: "range"},
                {value: "::1", type: "equals"}
            ],
            "broadcast": [
                {value: "255.255.255.255", type: "equals"}
            ],
            "devel": [
                {value: "10.1.10.0/24", type: "range"},
                {value: "10.90.128.0/24", type: "range"},
                {value: "10.90.129.0/24", type: "range"},
                {value: "10.90.140.0/24", type: "range"},
                {value: "10.90.142.0/24", type: "range"},
                {value: "10.90.143.0/24", type: "range"},
                {value: "10.90.147.0/24", type: "range"},
                {value: "10.90.159.0/24", type: "range"},
                {value: "10.90.161.0/24", type: "range"},
                {value: "10.90.246.0/24", type: "range"},
                {value: "10.90.240.0/24", type: "range"},
            ],
            "prod": [
                {value: "9.1.1.0/24", type: "range"},
                {value: "10.90.183.0/24", type: "range"},
                {value: "10.90.192.0/24", type: "range"},
                {value: "10.90.193.0/24", type: "range"},
                {value: "10.90.200.0/24", type: "range"},
                {value: "10.90.202.0/24", type: "range"},
                {value: "10.90.203.0/24", type: "range"},
                {value: "10.90.207.0/24", type: "range"},
                {value: "10.90.230.0/24", type: "range"},
                {value: "10.90.231.0/24", type: "range"},
                {value: "10.90.233.0/24", type: "range"},
                {value: "10.90.235.0/24", type: "range"},
                {value: "10.90.254.0/24", type: "range"},
                {value: "10.90.255.0/24", type: "range"},
            ]
        }
    }
};


module.exports = config;