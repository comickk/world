/**
 * 通信器组件
 * 发送  接收
 */
var _sendee = null;
var _state = 0; //0关

var Communicaton = {
	//接收者
	//_sendee:null,

	//讲
	speak(msg) {
		if (!_state || !_sendee) return false;

		// 将消息传输到 接收者(服务器  其它玩家  自己)
	},

	//听
	listen(msg) {},

	//开
	turnOn() {
		//初始化网络

		_state = 1;
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
};
module.exports = Communicaton;
