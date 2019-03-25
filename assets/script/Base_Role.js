/**
 角色基类
 被玩家角色  NPC  动物  怪物 继承

*/
//var gd = require('GameData');
cc.Class({
    
    extends: cc.Component,

	properties: {
    _id:null,
    _rolename:null,

    _roletype:null,
    _profession:null,

    //-----状态类-----
    //生命
    _health:null,
    //耐力
    //法力
    //饥饿
    //水份
    //体温

    //-----体质类-----
    //力量
    //敏捷
    //智力
    //
  
    //-----抗性-----
    //物理
    //火
    //冰
    //电
    //风
    //毒
    },
    
});
