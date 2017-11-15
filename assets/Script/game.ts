// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    curTime = 1;
    @property(cc.Label)
    labelTime: cc.Label = null;
    @property(cc.Node)
    content : cc.Node;
    @property([cc.Label])
    attrs : cc.Label[]=[];
    // 剧情数据
    storyData = null;
    curStoryId = 1;

    userData = {
        "role":{
            "attr1":"10",
            "attr2":"10",
            "attr3":"10",
            "attr4":"10",
            "attr5":"10",
            "attr6":"10",
            "attr7":"10"
        },
        "story":{}
    };

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.node.on('storyChoose', function (event) {
        //     console.log(event.detail.msg);
        //   });
        this.getUserData();
        var self = this;
        this.content.on('storyChoose', function (event) {
            var data = event.getUserData()
            cc.log("onevent:",data.id);
            //记录用户选择
            self.userData.story[self.curStoryId]=data.id;
            event.stopPropagation();
            // 更新用户属性
            self.updateAttr(self.curStoryId,data.id);
            self.curStoryId++;
            // 显示下个剧情
            self.showStory();
        })
        this.labelTime.string="第1天0时1分"
        this.schedule(this.timeUpdate,1)
        this.updateAttr(self.curStoryId,null);
        this.loadStory();
    }
    timeUpdate(dt){
        this.curTime += dt;
        this.curTime = this.curTime - this.curTime%1;
        let day = Math.ceil(this.curTime/(60*24));
        let hours = Math.floor((this.curTime-(day-1)*24*60)/60);
        let min = this.curTime - (day-1)*24*60 - hours*60;
        
        this.labelTime.string = "第"+day+"天" +hours+"时"+min+"分";
        // cc.log(this.curTime,this.labelTime.string);
    }

    start () {
        cc.log("start");
    }
    // 加载剧情配置
    loadStory(){
        cc.log("enter load");
        var self = this;
       
        cc.loader.load(cc.url.raw("resources/story.json"), function (errors, results) {
            if (errors) {
                for (var i = 0; i < errors.length; i++) {
                    cc.log('Error url [' + errors[i] + ']: ' + results.getError(errors[i]));
                }
            }else{
                cc.log("load success")
                self.storyData = results;
                cc.log(JSON.stringify(this.storyData));
                self.showStory();   
            }
        });

    }
    // 显示剧情
    showStory(){
        var self = this;
        self.content.removeAllChildren();
        cc.loader.loadRes("prefab/storyItem",function(error,results){
            if( error ) { cc.log( '載入Prefab失敗, 原因:' + error ); return; }
            if( !( results instanceof cc.Prefab ) ) { cc.log( '你載入的不是Prefab, 你做了什麼事?' ); return; } //這個是型別的檢查
            
            var newMyPrefab = cc.instantiate( results );
            
            var newMyPrefabScript = newMyPrefab.getComponent( 'storyItem' );
            
           
            var itemData = self.storyData[self.curStoryId];
            if (itemData == null) {
                self.curStoryId =1;
                itemData = self.storyData[self.curStoryId];
            }
            var tmp ="";
            for (let i = 0; i < itemData.content.length; i++) {
                tmp += itemData.content[i].detail + "\t\n"; 
            }

            let tittleLineHeight = 100;
            let wordLen = tmp.length;
            cc.log(self.content.width , newMyPrefabScript.content.node.width)
            let contentLineWordCount =Math.ceil(newMyPrefabScript.content.maxWidth / newMyPrefabScript.content.fontSize); //(每行文字个数)
            let contentLineHeight = newMyPrefabScript.content.lineHeight; //每行字体高度
            let contentLineLen = Math.ceil(wordLen / contentLineWordCount) + itemData.content.length-1;
            let btnLineHeigh = newMyPrefabScript.btnNode.height;
            let scrollHeight = tittleLineHeight + contentLineLen*contentLineHeight + btnLineHeigh;
            cc.log("lineheight:",contentLineHeight,"contentLineWordCount:",contentLineWordCount,"content linelen:",contentLineLen,"scroll:",scrollHeight);
            let btnPosY = tittleLineHeight + contentLineLen*contentLineHeight;
            self.content.setContentSize(self.content.getContentSize().width, scrollHeight);
            newMyPrefabScript.init(itemData.tittle,itemData.content,itemData.choose,btnPosY);
            self.content.addChild(newMyPrefab);
            var btnNodePos = newMyPrefabScript.btnNode.getPosition();
            newMyPrefabScript.btnNode.y = -btnPosY;
        })
    }

    //更新属性
    updateAttr(storyId,bId){
        if ( bId != null) {
            let effectAttrs = this.storyData[storyId].effect[bId].attr;
            for (let i = 0; i < effectAttrs.length; i++) {
                let attrId = effectAttrs[i].attrId;
                let value = effectAttrs[i].value;
                this.userData.role["attr"+attrId] =Number(this.userData.role["attr"+attrId])+ Number(value);
            }
        }
        
        for (let i = 0; i < this.attrs.length; i++) {
            this.attrs[i].string = this.userData.role["attr"+(i+1)];
            
        }
    }
    //获取用户数据 取档
    getUserData(){
        let data = JSON.parse(cc.sys.localStorage.getItem('userData'));
        if (data != null) {
            this.userData = data;
        }
    }
    //保存用户数据 存档
    setUserData(){
        cc.sys.localStorage.setItem('userData', JSON.stringify(this.userData));
    }
    update (dt) {

    }
}
