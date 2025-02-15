const $ = require('jquery');
const bootstrap = require('bootstrap');
const hostFileService = require('../../static/js/host/hostFileService');
require('bootstrap/dist/css/bootstrap.min.css');
require('@fortawesome/fontawesome-free/css/all.min.css');
require('datatables.net-responsive-dt');

$(document).ready(function () {
    hostFileService.readHosts(function (json) {
        initTable(json);
    });

    $('#showHosts').on("click", function () {
        let data = generateJson();
        let lines = hostFileService.getHostsLinesFromJson(data);
        showData(lines.join(''));
    });

    $('#backupAndSaveHosts').on("click", async () => {
        const searchTerm = $('#dnsList').DataTable().search();
        if (searchTerm) {
            alert('Please remove search criteria and try again!');
            return;
        }


        let data = generateJson();
        let lines = hostFileService.getHostsLinesFromJson(data);
        const newData = lines.join("");

        const result = await hostFileService.writeFile(newData);
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
    $('#reload').on('click', () => {
        if (confirm("Do you confirm reload page?")) {
            location.reload();
        }
    })
});


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
        paging: false,
        pageLength: 10000,
        responsive: true,
        searching: true
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
