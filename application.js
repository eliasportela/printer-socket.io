const socket = require('socket.io-client')('https://softcomanda.herokuapp.com/1');

module.exports = {

	start() {

		socket.on('connect', function(){

		});

		socket.on('new_menu', function(data){
			console.log('new_menu');
		});
		
		socket.on('disconnect', function(){

		});
	}

}