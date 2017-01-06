var ping = require('ping');
var baseIP = '192.168.1.';
var dns = require('dns');
var hosts = [];
var aliveHosts = [];

for (var x = 1; x != 100; x++) {
    hosts.push(baseIP + x);
}

var devices = [
    {
        'name': 'Router',
        'ip': '192.168.1.1'
    }, {
        'name': 'File Server',
        'ip': '192.168.1.2'
    },
    {
        'name': 'Ethernet via power',
        'ip': '192.168.1.3'
    },
    {
        'name': 'Ethernet via power',
        'ip': '192.168.1.4'
    },
    {
        'name': 'Media Server',
        'ip': '192.168.1.5'
    },
    {
        'name': 'Youview',
        'ip': '192.168.1.6'
    },
    {
        'name': 'Ethernet via power',
        'ip': '192.168.1.7'
    },
    {
        'name': 'Chromecast',
        'ip': '192.168.1.8'
    },
    {
        'name': 'Ethernet via power',
        'ip': '192.168.1.10'
    },
    {
        'name': 'Bed Room Tv',
        'ip': '192.168.1.11'
    },
    {
        'name': 'Dev Server',
        'ip': '192.168.1.18'
    },
	{
		'name': "Jenni's iPhone",
		'ip':'192.168.1.15'
	}
]



hosts.forEach(function (host) {
    ping.sys.probe(host, function (isAlive) {
	var name = GetByIp(devices, host);
	var msg ='';
	//console.log(name);
        if (name != undefined){
		msg = isAlive ? name.name + " " + host + ' is alive' : name.name + " " + host + ' is dead'; 
	}else{
		msg = isAlive ? "unkown " + host + " is alive" : '';
	}	
	if (msg != '') console.log(msg);
    });
});


function GetByIp(arr, value)
{
	var result = arr.filter(function(o) {
		return o.ip == value;
	});
	return result ? result[0]: null;

}
