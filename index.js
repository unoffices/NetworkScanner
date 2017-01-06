var ping = require('ping');
var redis = require('redis');
var redisClient = redis.createClient();
var slack = require('slack-notify')(process.env.SLACK_WEBHOOK_URL);


var baseIP = '192.168.1.';
var hosts = [];
var aliveHosts = [];

for (var x = 1; x != 255; x++) {
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
        'ip': '192.168.1.15'
    }
]

function GetByIp(arr, value) {
    var result = arr.filter(function (o) {
        return o.ip == value;
    });
    return result ? result[0] : null;

}

hosts.forEach(function (host) {
    var _self = this;
    _self.msg = '';
    ping.sys.probe(host, function (isAlive) {
        redisClient.get(host, function (err, reply) {
            var msg = ''
            var name = GetByIp(devices, host);

            if (name != undefined) {
                msg = isAlive ? name.name + " " + host + ' is alive \n' : name.name + " " + host + ' is dead\n';
            } else {
                msg = isAlive ? "unkown " + host + " is alive\n" : '';
            }
            if (reply != isAlive) {
                if (msg != '') {
                    slack.alert(msg, function (err) {
                        console.log(err);
                    });
                }
            }
            redisClient.set(host, isAlive);
        })

    });
});


