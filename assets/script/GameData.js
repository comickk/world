/**游戏数据类
 * 全局枚举
 */
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
var GameData ={
    // Action:cc.Enum({
    //     IDLE:1,
    //     ATTACK:-1,//近身攻击
    //     SHOOT:-1,
    // }),

    RoleType:cc.Enum({
        SELF:1,
        PLAYER:-1,
        HUMAN:-1,
        ANIMAL:-1,   
        MONSTER:-1,
    }),

    //职业
    Profession:cc.Enum({
        MASSES:1,   //群众  不可互动 无攻击性  不会反击
        PEDLAR:-1, //小贩  可互动 无攻击性  不会反击
        SOLDIER:-1, //士兵  不可互动  无攻击性  会反击
                    //黑市商人 可互动 无攻击性  会反击
        CRIMINAL:-1,//罪犯    不可互动   攻击性   会反击
    }),

    Direct :cc.Enum({
        UP: 1,
        RIGHTUP: -1,
        RIGHT: -1,
        RIGHTDOWN: -1,
        DOWN: -1,
        LEFTDOWN: -1,
        LEFT: -1,
        LEFTUP: -1,
    }),
    
    State :cc.Enum({
        IDLE: 1,
        STAND: -1,
        WALK: -1,
    
        //------战斗-------
        ATTACK: 100,    //近身攻击
        SHOOT: -1,      //射击
        CONJURE: -1,    //施法
    
        //-------采集-----------
        MINING: 200,    //采矿
        LUMBERING: -1,  //伐木
    

        PICK: 300,     //捡
        THROW: -1,     //扔
    
        //------生产--------
        CREATE: 400,   //制造
        BUILD: -1,     //建造
        FIX: -1,       //修理

        //-----状态-------
        EAT:500,    //吃
        CURE:-1,    //治疗
    }),

    //道具类
        //工具
        //装备
        //消耗品
    

};
module.exports = GameData;