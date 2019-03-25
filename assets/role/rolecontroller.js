
var getMapPos = function(v2) {
	v2.x = Math.floor((v2.x + 1600) / 32);
	v2.y = Math.floor((1600 - v2.y) / 32);

	return v2;
};


var gd = require('GameData');
var _state = gd.State.IDLE; //人物状态
var _moveState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var _comm =null;

cc.Class({
	extends:  require('Base_Role'),//cc.Component,

	properties: {
		_bodyAnim: {
			type: cc.Animation,
			default: null,
			visible: true,
		},

		_map: {
			type: cc.Node,
			default: null,
			visible: true,
		},

		_collider: cc.TiledLayer,		
		
		id: {
			get: function () {
				return this._id;
			},
			set:function(value){
				this._id = value;
			}
		}		
    
	},

	 //onLoad() {		
		//Communicaton.init();
	//	this._id = Math.round(Math.random()*10000);
	// },
	// onDestroy() {
	// },

	start() {
		//this._collider = this._map.getChildByName('collinor').getComponent(cc.TiledLayer);
		_state = gd.State.IDLE;
	},

	// update (dt) {},

	setCommunicator(comm){
		if(!comm || _comm) return;
		_comm = comm;
		_comm.turnOn(this._id);
	},
	
	setMoveState(dir, value) {
		//检查有效性
		if (dir < gd.Direct.UP || dir > gd.Direct.LEFTUP) return;

		_moveState[dir] = value;
		
		//禁止同时按下  左右  或  上下
		if ((_moveState[gd.Direct.UP] && _moveState[gd.Direct.DOWN]) ||
			(_moveState[gd.Direct.LEFT] && _moveState[gd.Direct.RIGHT])
		) {
			_moveState[dir] = 0;
		}
		
		this.roleMove();
	},
	
	//做某个动作
	doWhat(who,what,obj){

	},

	//非自己角色的移动
	otherMove(pos,anim,timelen){	

		this.node.runAction(cc.moveTo(timelen, pos));
		this._bodyAnim.play(anim);
	},

	roleMove() {
		//cc.log(_moveState +'   '+_state);
		if (_moveState[gd.Direct.UP] == 0 &&
			_moveState[gd.Direct.DOWN] == 0 &&
			_moveState[gd.Direct.LEFT] == 0 &&
			_moveState[gd.Direct.RIGHT] == 0) {
			//_state = State.STAND;
			return;
		}		
		
		if (_state == gd.State.WALK) return;

		_state = gd.State.WALK;
		

		//取得地图坐标
		var mapPos = getMapPos(this.node.position);

		var finished = cc.callFunc(function() {
			_state = gd.State.STAND;
			this.roleMove();
		}, this);

		//检查斜向移动
		var pos = cc.v2(0, 0);
		var pos2 = cc.v2(0, 0);

		var anim = 'walk_down';
		var speed = 32;

		if (_moveState[gd.Direct.UP]) {
			pos.y = speed;
			pos2.y = -speed;
			mapPos.y--;
			anim = 'walk_up';
		}

		if (_moveState[gd.Direct.DOWN]) {
			pos.y = -speed;
			pos2.y = speed;
			mapPos.y++;
			anim = 'walk_down';
		}

		if (_moveState[gd.Direct.LEFT]) {
			pos.x = -speed;
			pos2.x = speed;
			mapPos.x--;
			anim = 'walk_left';
		}

		if (_moveState[gd.Direct.RIGHT]) {
			pos.x = speed;
			pos2.x = -speed;
			mapPos.x++;
			anim = 'walk_right';
		}

		var timelen = 0.5;
		if (pos.x && pos.y) timelen *= 1.44;

		//检查通过性		
		if (this._collider.getTiledTileAt(mapPos.x, mapPos.y, true).gid) {
			_state = gd.State.STAND;
			return;
		}
		
		this.node.runAction(cc.sequence(cc.moveBy(timelen, pos), finished));
		//this.node.runAction(cc.moveBy(timelen, pos));
		this._map.runAction(cc.moveBy(timelen, pos2));

		this._bodyAnim.play(anim);
		
		_comm.speak({ title:'move?',who: this.id, x:mapPos.x,y:mapPos.y,dir: _moveState, speed: speed, anim: anim,timelen:timelen, state: _state });
	},

	roleStop() {
		_state = gd.State.IDLE;
		//this._gowhere = 0;

		//this.node.stopAllActions();
		//this._map.stopAllActions();
	},	
});
