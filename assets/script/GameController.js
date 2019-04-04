var _self = null;
var Communicaton = require('Communicaton');
var gd = require('GameData');
var _roles = new Map();

var getCanvasPos = function(v2) {
	v2.x = v2.x * 32 - 1600 + 16;
	v2.y = 1600 - v2.y * 32 - 16;
	return v2;
};

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
			case cc.macro.KEY.up:
				break;
			case cc.macro.KEY.s:
			case cc.macro.KEY.down:
				dir = gd.Direct.DOWN;
				break;
			case cc.macro.KEY.a:
			case cc.macro.KEY.left:
				dir = gd.Direct.LEFT;
				break;
			case cc.macro.KEY.d:
			case cc.macro.KEY.right:
				dir = gd.Direct.RIGHT;
				break;
			case cc.macro.KEY.space: //做动作,动作类型根据当前装备物品
				_self.doSomeThing(_self.id);
				return;
			default:
				return;
		}
		if (_self) _self.setMoveState(dir, 1);
	},

	onKeyUp(event) {
		var dir = gd.Direct.UP;
		switch (event.keyCode) {
			case cc.macro.KEY.w:
			case cc.macro.KEY.up:
				break;
			case cc.macro.KEY.s:
			case cc.macro.KEY.down:
				dir = gd.Direct.DOWN;
				break;
			case cc.macro.KEY.a:
			case cc.macro.KEY.left:
				dir = gd.Direct.LEFT;
				break;
			case cc.macro.KEY.d:
			case cc.macro.KEY.right:
				dir = gd.Direct.RIGHT;
				break;
			default:
				return;
		}
		if (_self) _self.setMoveState(dir, 0);
	},

	//生成角色(玩家 npc)
	createRole(id,type, x, y) {
		if(!id || !type) return;		
		switch (type) {
			case gd.RoleType.SELF:
				var role = cc.instantiate(this._role);
				role.parent = this._rolelayer;
				role.setPosition(-48, -48);

				_self = role.getComponent('rolecontroller');

				_roles.set(id, _self);
				_self.id = id; //Math.round(Math.random() * 10000);
				_self._map = this._map;
				_self._collider = this._map.getChildByName('collinor').getComponent(cc.TiledLayer);

				_self.setCommunicator(Communicaton);
				break;
			case gd.RoleType.PLAYER:
				var role = cc.instantiate(this._role);
				role.parent = this._rolelayer;

				if (x && y) {
					var v = getCanvasPos(cc.v2(x, y));
					role.setPosition(v.x, v.y);
				} else role.setPosition(-48, -48);

				_roles.set(id, role.getComponent('rolecontroller'));
				break;
			default:
				return;
		}
	},

	//回收角色
	recoveryRole(id) {
		if(!id) return;
		if (_roles.has(id)) {
			var role = _roles.get(id);
			_roles.delete(id);

			role.node.destroy();
		}
	},

	moveRole(id,x,y,anim,timelen){
		if(!id || !x || !y || anim || !timelen) return;
		if (id - 0 != _self.id - 0 && _roles.has(who)) {
			var otherrole = _roles.get(id);
			var v = getCanvasPos(cc.v2(x, y));

			otherrole.otherMove(v, anim, timelen);			
		}
	},	

	listen(data) {
		cc.log(data);
		var obj = JSON.parse(data);
		switch (obj.title) {
			case 'hello':				
				this.createRole(obj.id,obj.type,obj.x,obj.y);
				break;

			case 'move':
				this.moveRole(obj.who,obj.x,obj.y,obj.anim,obj.timelen);			
				break;

			case 'quit':
				this.recoveryRole(obj.who);
				break;
		}
	},
});
