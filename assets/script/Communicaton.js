/**
 * 通信器组件
 * 发送  接收
 */
var _sendee = null;
var _listener =null;
var _state = 0; //0关
var _ws = null;

var Communicaton = {
	//接收者
	//_sendee:null,
	

	//开
	turnOn(id) {
		//初始化网络
		if(_state) return;

		this.setSendee('ws://192.168.0.126:8080/ws');
		
		var self = this;

		_ws = new WebSocket(_sendee);
		_ws.onopen = function(event) {
			console.log('Send Text WS was opened.');

			if (_ws.readyState === WebSocket.OPEN) {				
				_state = 1;
				self.speak({title:'hello?',id:0});
				console.log('WebSocket Open');
			} else {
				console.log("WebSocket instance wasn't ready...");
			}
		};

		_ws.onmessage = function(event) {
			//console.log('response text msg: ' + event.data);
			self.listen(event.data);
		};

		_ws.onerror = function(event) {
			console.log('Send Text fired an error');
		};

		_ws.onclose = function(event) {
			_state =0;
			console.log('WebSocket instance closed.');
		};
	},

	//关
	turnOff() {
		_state = 0;
	},

	//设置接收人
	setSendee(who) {
		if (!who) return false;
		_sendee = who;
	},
	
	setListener(who){
		if (!who) return false;
		_listener = who;
	},

	//讲
	speak(msg) {
		if (!_state || !_sendee) return false;
		//msg = msg.toString();
		//console.log(msg);
		_ws.send(JSON.stringify(msg));
		// 将消息传输到 接收者(服务器  其它玩家  自己)
	},

	//听
	listen(msg) {
		//console.log(msg);
		if(_listener)
			_listener.listen(msg);
	},

	init(){
		url = "127.0.0.1:8080/ws";
		
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 ){
				console.log('init end');
			}
				//fun(xhr.status,xhr.responseText,self);		
		};
		xhr.open('GET', url, true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
		xhr.send();
	}
};
module.exports = Communicaton;
