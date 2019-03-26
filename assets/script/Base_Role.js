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
    //力量strength
    //敏捷agility
    //智力intellect
    //
  
    //-----抗性-----resistance
    //物理 physics
    //火  FIRE
    //冰  ice
    //电  electricity
    //风   wind
    //毒   poison
    },
    
});
