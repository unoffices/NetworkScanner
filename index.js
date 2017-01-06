var ping = require('ping');
var baseIP = '10.30.0.';
var dns = require('dns');
var hosts = [];
var aliveHosts = [];
for (var x = 1; x != 265; x++){
    hosts.push(baseIP + x);
}


hosts.forEach(function(host){
    ping.sys.probe(host, function (isAlive) {
       // var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        if (isAlive){
            aliveHosts.push(host);
            reverseLookup(host);
        }
        //console.log(msg);
    });
});


function reverseLookup(ip) {
	dns.reverse(ip, function(err,domains){
		if(err!=null){
            console.log(err.message);
            return;
        }	

		domains.forEach(function(domain){
			dns.lookup(domain,function(err, address, family){
				console.log(domain,'[',address,']');
				console.log('reverse:',ip==address);
			});
		});
	});
}