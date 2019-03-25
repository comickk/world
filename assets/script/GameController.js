var _rolecontroller = null;
var Communicaton = require('Communicaton');
var gd = require('GameData');
var _roles = new Map();

var getCanvasPos = function(v2) {
	v2.x = v2.x*32-1600+16;
	v2.y = 1600-v2.y*32 -16;
	return v2;
}

cc.Class({
	extends: cc.Component,

	properties: {
		_map: {
			type: cc.Node,
			default: null,
			visible: true,
			displayName: '地图',
		},
		_role: {
			default: null,
			visible: true,
			type: cc.Prefab,
			displayName: '玩家角色',
		},

		_rolelayer: cc.TiledLayer, //地图角色层
	},

	onLoad() {
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
		
		// Communicaton.turnOn();
		// Communicaton.setListener(this);
		//_roles = new [];
	},

	onDestroy() {
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
	},

	start() {
		this._rolelayer = this._map.getChildByName('role'); 
		//.getComponent(cc.TiledLayer);
		//this.playerLogin(0);

		Communicaton.turnOn();
		Communicaton.setListener(this);
	},

	onKeyDown(event) {
		var dir = gd.Direct.UP;
		switch (event.keyCode) {
			case cc.macro.KEY.w:
				break;
			case cc.macro.KEY.s:
				dir = gd.Direct.DOWN;
				break;
			case cc.macro.KEY.a:
				dir = gd.Direct.LEFT;
				break;
			case cc.macro.KEY.d:
				dir = gd.Direct.RIGHT;
				break;
			case cc.macro.KEY.space://做动作,动作类型根据当前装备物品
				break;
			default:
				return;
		}
		if (_rolecontroller) _rolecontroller.setMoveState(dir, 1);
	},

	onKeyUp(event) {
		var dir = gd.Direct.UP;
		switch (event.keyCode) {
			case cc.macro.KEY.w:
				break;
			case cc.macro.KEY.s:
				dir = gd.Direct.DOWN;
				break;
			case cc.macro.KEY.a:
				dir = gd.Direct.LEFT;
				break;
			case cc.macro.KEY.d:
				dir = gd.Direct.RIGHT;
				break;
			default:
				return;
		}
		if (_rolecontroller) _rolecontroller.setMoveState(dir, 0);
	},

	playerLogin(obj) {
		//cc.log(obj);
		if (!_rolecontroller) {
			//没有角色
			
			var role = cc.instantiate(this._role);
			role.parent = this._rolelayer;
			role.setPosition(-48, -48);

			_rolecontroller = role.getComponent('rolecontroller');
			
			
			_roles.set(obj.id,_rolecontroller);
			_rolecontroller.id = obj.id//Math.round(Math.random() * 10000);
			_rolecontroller._map = this._map;
			_rolecontroller._collider = this._map.getChildByName('collinor').getComponent(cc.TiledLayer);
			
			_rolecontroller.setCommunicator(Communicaton);			
		} else {
			//已有角色
			if (obj.id != _rolecontroller.id) {	//角色id 不是自己
				var role = cc.instantiate(this._role);
				role.parent = this._rolelayer;
				
				if(obj.x && obj.y){
					var v = getCanvasPos(cc.v2(obj.x,obj.y));
					role.setPosition(v.x,v.y);
				}else{
					role.setPosition(-48, -48);
				}			

				_roles.set(obj.id,role.getComponent('rolecontroller'));
			}
		}
		//cc.log(_roles);
	},

	playerLogout(id){
		//if(id-0 == _rolecontroller.id-0){}
		if( _roles.has(id)){	
			var role = _roles.get(id);
			_roles.delete(id);

			role.node.destroy();
		}
	},
	
	listen(data) {
		cc.log(data);
		var obj = JSON.parse(data);
		switch (obj.title) {
			case 'hello':
				this.playerLogin(obj);
				break;
			case 'move':				
				
				if(obj.who-0 != _rolecontroller.id-0 && _roles.has(obj.who)){					
					var otherrole = _roles.get(obj.who); 
					var v = getCanvasPos(cc.v2(obj.x,obj.y));
					
					otherrole.otherMove(v,obj.anim,obj.timelen);
					//otherrole.node.setPosition(v.x,v.y);
				}				
				//role.setPosition(obj.x,obj.y);
				break;

			case 'quit':
				this.playerLogout(obj.who);
				break;
		}
	},
});
