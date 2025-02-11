import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import '@fortawesome/fontawesome-free/css/all.min.css';




let prodPrefixes = [
    "9.1.1.",
    "10.90.183.",
    "10.90.192.",
    "10.90.193.",
    "10.90.200.",
    "10.90.202.",
    "10.90.203.",
    "10.90.207.",
    "10.90.230.",
    "10.90.231.",
    "10.90.233.",
    "10.90.235.",
    "10.90.254.",
    "10.90.255."
];

let devPrefixes = [
    "10.1.10.",
    "10.90.128.",
    "10.90.129.",
    "10.90.140.",
    "10.90.142.",
    "10.90.143.",
    "10.90.147.",
    "10.90.159.",
    "10.90.161.",
    "10.90.246.",
    "10.90.240."
];

$(document).ready(function () {
    readHosts(function (json) {
        initTable(json);
    });

    $('#showHosts').on("click", function () {
        let data = generateJson();
        let lines = getHostsLinesFromJson(data);
        showData(lines.join(''));
    });

    $('#backupAndSaveHosts').on("click", async () => {
        const searchTerm = $('#dnsList').DataTable().search();
        if (searchTerm) {
            alert('Please remove search criteria and try again!');
            return;
        }


        let data = generateJson();
        let lines = getHostsLinesFromJson(data);

        const filePath = "/etc/hosts";
        const newData = lines.join("");

        const result = await window.electronAPI.writeFile(filePath, newData);
        if (result.success === true) {
            alert(result.message);
        } else {
            alert(result.error);
        }
    });

    $('#showJson').on("click", () => {
        let data = generateJson();
        showData(JSON.stringify(data));
    });
    $('#reload').on('click',()=>{
        if(confirm("Do you confirm reload page?")){
            location.reload();
        }
    })
});


function readHosts(callback) {
    window.electronAPI.readFile("/etc/hosts")
        .then(data => {
            let lines = data.split("\n");
            callback(readLines(lines));
        })
        .catch(error => {
            alert('File not read!:' + error);
        });
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

        let ipItem = parseIp(ip, line, dns);
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

function showData(content) {
    $('#output').text(content);
    // $('#outputModal').modal('show');
    let myModal = new bootstrap.Modal(document.getElementById('outputModal'));
    myModal.show();
}

function generateJson() {
    const items = document.querySelectorAll(".ip-item");
    const groupedData = {};

    items.forEach(item => {
        const dns = item.dataset.dns;
        const ip = item.dataset.ip;
        const active = item.dataset.active;
        const env = item.dataset.env;

        if (!groupedData[dns]) {
            groupedData[dns] = {dns, ipList: []};
        }

        groupedData[dns].ipList.push({ip, active, env, dns});
    });

    return Object.values(groupedData);
}

/**
 * Generates an HTML table using the provided data and processes IP addresses.
 *
 * @param {Array<{dns: string, ipList: Array<{active: string, env: string}>}>} data - The data to be added to the table. Each item contains DNS name and a list of IP addresses.
 * {Object} item - Each element in the `data` array. Each item has the following fields:
 *  - {string} dns - The DNS name.
 *  - {Array<{active: string, env: string}>} ipList - A list of IP addresses. Each item in the list has the following fields:
 *    - {string} active - Indicates whether the IP address is active (e.g., `"true"` or `"false"`).
 *    - {string} env - The environment type of the IP address (e.g., `'broadcast'`).
 *
 * @returns {void} This function does not return any value, it only updates the table.
 */
function initTable(data) {
    $(data).each(function (i, item) {
        let tr = $('<tr>');
        tr.append($('<td style="text-align: left; white-space: nowrap">' + item.dns + '</td>'));
        let selectedAddress = null;
        let envs = [];
        let protectedDomain = false;
        $(item.ipList).each(function (j, ipItem) {
            if (ipItem.active === "true") {
                selectedAddress = ipItem;
            }
            envs.push(generateEnvIpAddress(ipItem, i));
            if (ipItem.env === 'broadcast') {
                protectedDomain = true;
            }
        });

        let selectedEnv = selectedAddress != null ? selectedAddress.env : '';
        tr.append($('<td> <span class="env-item" data-dns="' + item.dns + '" data-env="' + selectedEnv + '">' + selectedEnv + '</span></td>'));

        let ipTd = $('<td style="text-align: left; width: 100%">');
        envs.forEach(x => {
            if (protectedDomain) {
                x.dataset.protected = "true";
            }
            ipTd.append(x);
        });
        tr.append(ipTd);
        $('#dnsList tbody').append(tr);
    })

    $('#dnsList').dataTable({
        paging:false,
        pageLength:10000,
        responsive:true,
        searching:true
    });
    $('#dt-search-0').focus();

}

function generateEnvIpAddress(ipModel, idx) {
    let span = document.createElement("div");
    span.dataset.rowid = idx;
    span.className = "ip-item";
    span.innerText = ipModel.ip;
    span.dataset.dns = ipModel.dns;
    span.dataset.active = ipModel.active;
    span.dataset.env = ipModel.env;
    span.dataset.ip = ipModel.ip;
    span.style.cursor = "pointer";

    function clickHandler() {
        changeValue(ipModel, idx);
    }

    span.addEventListener("click", clickHandler);
    return span;
}

function changeValue(ipModel, idx) {
    let all = $('div[data-rowid="' + idx + '"]');
    let selected = $('div[data-rowid="' + idx + '"][data-ip="' + ipModel.ip + '"]');

    let selectedModel = fetchIpModelFromDiv(selected[0]);
    if (selected[0].dataset.protected === "true") {
        alert("Broadcast addresses! Not changeable!");
        return false;
    }
    let ipCount = 0;
    all.each((i, item) => {
        if (item.dataset.ip === selectedModel.ip) {
            ipCount++;
        }
    });
    if (ipCount > 1) {
        if (confirm("Do you confirm remove duplicate ip address?")) {
            all.each((i, item) => {
                if (item !== selected[0] && item.dataset.ip === selectedModel.ip) {
                    $(item).remove();
                }
            });
        }
    }

    if (all.length > 1) {
        all.each(function (i, x) {
            let ipModel = fetchIpModelFromDiv(x);
            ipModel.active = "false";
            setIpModelToDiv(ipModel, x);
        });
        selectedModel.active = "true";
        setIpModelToDiv(selectedModel, selected[0]);
    } else {
        selectedModel.active = selectedModel.active === "true" ? "false" : "true";
        setIpModelToDiv(selectedModel, selected[0]);
    }
}

function fetchIpModelFromDiv(element) {
    return {
        ip: element.dataset.ip,
        dns: element.dataset.dns,
        active: element.dataset.active,
        env: element.dataset.env
    }
}

function setIpModelToDiv(ipModel, element) {
    element.dataset.ip = ipModel.ip;
    element.dataset.dns = ipModel.dns;
    element.dataset.active = ipModel.active;
    element.dataset.env = ipModel.env;

    if (ipModel.active === "true") {
        let elementLabel = $('span.env-item[data-dns="' + ipModel.dns + '"]')[0];
        elementLabel.dataset.env = ipModel.env;
        elementLabel.innerText = ipModel.env;
    }
}
