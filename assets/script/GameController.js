
var _rolecontroller =null;
cc.Class({
    extends: cc.Component,

    properties: {
        _map: {
			type: cc.Node,
			default: null,
            visible: true,
            displayName:'地图'
		},
        _role:{
            default:null,
            visible:true,
            type:cc.Node,
            displayName:'玩家角色',
        },       
    },

    
    onLoad() {
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        
        _rolecontroller = this._role.getComponent('rolecontroller');
        cc.log(_rolecontroller);
	},	

	onDestroy() {
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    
    start() {
	
    },
    

    onKeyDown(event) {		
		var dir =cc.Direct.UP;
		switch (event.keyCode) {
			case cc.macro.KEY.w:
				break;
			case cc.macro.KEY.s:
				dir = cc.Direct.DOWN;	
				break;
			case cc.macro.KEY.a:
				dir = cc.Direct.LEFT;
				break;
			case cc.macro.KEY.d:
				dir = cc.Direct.RIGHT;				
				break;
		}
		if(_rolecontroller)
		    _rolecontroller.setMoveState(dir,1);
	},

	onKeyUp(event) {
        var dir =cc.Direct.UP;
		switch (event.keyCode) {
			case cc.macro.KEY.w:
				break;
			case cc.macro.KEY.s:
				dir = cc.Direct.DOWN;	
				break;
			case cc.macro.KEY.a:
				dir = cc.Direct.LEFT;
				break;
			case cc.macro.KEY.d:
				dir = cc.Direct.RIGHT;				
				break;
		}
		if(_rolecontroller)
		    _rolecontroller.setMoveState(dir,0);
	},
    
});
