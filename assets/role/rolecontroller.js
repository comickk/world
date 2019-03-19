cc.Direct = cc.Enum({
	UP: 1,
	RIGHTUP: -1,
	RIGHT: -1,
	RIGHTDOWN: -1,
	DOWN: -1,
	LEFTDOWN: -1,
	LEFT: -1,
	LEFTUP: -1,
});

var State = cc.Enum({
	IDLE: 1,
	STAND: -1,
	WALK: -1,

	ATTACK: 100,
	SHOOT: -1,
	CONJURE: -1,

	MINING: 200,
	LUMBERING: -1,

	PICK: 300,
	THROW: -1,

	CREATE: 400,
	BUILD: -1,
	FIX: -1,
});

var getMapPos = function(v2) {
	v2.x = Math.floor((v2.x + 1600) / 32);
	v2.y = Math.floor((1600 - v2.y) / 32);

	return v2;
};

var Communicaton = require('Communicaton');

var _state = State.IDLE; //人物状态
var _moveState = [0, 0, 0, 0, 0, 0, 0, 0, 0];

/**
 * 人物控制
 * 操作
 *    |--- 移动
 *    |--- 互动
 *          |--- 攻击
 *                |--- 近战
 *                |--- 射击
 *                |--- 施法
 *          |--- 收集(有收集动作 采矿  伐木等)
 *          |--- 拾取(无收集动作)
 *          |--- 简易制作(无需工作台,使用自身装备工具)
 *          |--- 高级制作(需要特定工作台)
 *          |--- 建造
 *          |--- 维修
 */
cc.Class({
	extends: cc.Component,

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
	},

	// onLoad() {
	// },
	// onDestroy() {
	// },

	start() {
		this._collider = this._map.getChildByName('collinor').getComponent(cc.TiledLayer);
		_state = State.IDLE;
	},

	// update (dt) {},

	setMoveState(dir, value) {
		//检查有效性
		if (dir < cc.Direct.UP || dir > cc.Direct.LEFTUP) return;

		_moveState[dir] = value;
		
		//禁止同时按下  左右  或  上下
		if ((_moveState[cc.Direct.UP] && _moveState[cc.Direct.DOWN]) ||
			(_moveState[cc.Direct.LEFT] && _moveState[cc.Direct.RIGHT])
		) {
			_moveState[dir] = 0;
		}
		
		this.roleMove();
	},

	roleMove() {
		if (_moveState[cc.Direct.UP] == 0 &&
			_moveState[cc.Direct.DOWN] == 0 &&
			_moveState[cc.Direct.LEFT] == 0 &&
			_moveState[cc.Direct.RIGHT] == 0) {
			//_state = State.STAND;
			return;
		}		
		
		if (_state == State.WALK) return;

		_state = State.WALK;
		

		//取得地图坐标
		var mapPos = getMapPos(this.node.position);

		var finished = cc.callFunc(function() {
			_state = State.STAND;
			this.roleMove();
		}, this);

		//检查斜向移动
		var pos = cc.v2(0, 0);
		var pos2 = cc.v2(0, 0);

		var anim = 'walk_down';
		var speed = 32;

		if (_moveState[cc.Direct.UP]) {
			pos.y = speed;
			pos2.y = -speed;
			mapPos.y--;
			anim = 'walk_up';
		}

		if (_moveState[cc.Direct.DOWN]) {
			pos.y = -speed;
			pos2.y = speed;
			mapPos.y++;
			anim = 'walk_down';
		}

		if (_moveState[cc.Direct.LEFT]) {
			pos.x = -speed;
			pos2.x = speed;
			mapPos.x--;
			anim = 'walk_left';
		}

		if (_moveState[cc.Direct.RIGHT]) {
			pos.x = speed;
			pos2.x = -speed;
			mapPos.x++;
			anim = 'walk_right';
		}

		var timelen = 0.5;
		if (pos.x && pos.y) timelen *= 1.44;

		//检查通过性
		if (this._collider.getTiledTileAt(mapPos.x, mapPos.y, true).gid) return;

		this.node.runAction(cc.sequence(cc.moveBy(timelen, pos), finished));
		//this.node.runAction(cc.moveBy(timelen, pos));
		this._map.runAction(cc.moveBy(timelen, pos2));

		this._bodyAnim.play(anim);

		Communicaton.speak({ who: 'me', dir: _moveState, speed: speed, anim: anim, state: _state });
	},

	roleStop() {
		_state = State.IDLE;
		//this._gowhere = 0;

		//this.node.stopAllActions();
		//this._map.stopAllActions();
	},
});
