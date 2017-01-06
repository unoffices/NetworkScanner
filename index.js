#!/usr/bin/env node
var ping = require('ping');
var redis = require('redis');
var redisClient = redis.createClient();
var slack = require('slack-notify')(process.env.SLACK_WEBHOOK_URL);
var fs = require('fs');


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

var count = 0;
hosts.forEach(function (host) {

    var _self = this;
    _self.msg = '';
    ping.sys.probe(host, function (isAlive) {
        redisClient.get(host, function (err, reply) {
            var msg = ''
            var name = GetByIp(devices, host);

            if (name != undefined) {
                msg = isAlive ? name.name + " " + host + ' is alive' : name.name + " " + host + ' is dead';
            } else {
                msg = isAlive ? "unkown " + host + " is alive" : '';
            }
            if (msg != '') {
                console.log(msg);
            }
            if (reply != isAlive.toString()) {
                if (msg != '') {
                    slack.alert(msg, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
            redisClient.set(host, isAlive);
            count++;
            if (count == hosts.length) {
                var currentdate = new Date();
                var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth() + 1) + "/"
                    + currentdate.getFullYear() + " @ "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds() + "\n";
                fs.appendFile('logs.txt', datetime, function (err) {
                    process.exit();
                });

            }
        })

    });

});


