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
    // 剧情数据
    storyData = null;
    curStoryId = 1;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.node.on('storyChoose', function (event) {
        //     console.log(event.detail.msg);
        //   });
        this.node.on('storyChoose', function (event) {
            cc.log("onevent:",event);
            event.stopPropagation();
        })
        this.labelTime.string="第1天0时1分"
        this.schedule(this.timeUpdate,1)
        this.loadStory();
    }
    timeUpdate(dt){
        this.curTime += dt;
        this.curTime = this.curTime - this.curTime%1;
        let day = Math.ceil(this.curTime/(60*24));
        let hours = Math.floor((this.curTime-(day-1)*24*60)/60);
        let min = this.curTime - (day-1)*24*60 - hours*60;
        
        this.labelTime.string = "第"+day+"天" +hours+"时"+min+"分";
        cc.log(this.curTime,this.labelTime.string);
    }

    start () {
        cc.log("start");
    }
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

                cc.loader.loadRes("prefab/storyItem",function(error,results){
                    if( error ) { cc.log( '載入Prefab失敗, 原因:' + error ); return; }
                    if( !( results instanceof cc.Prefab ) ) { cc.log( '你載入的不是Prefab, 你做了什麼事?' ); return; } //這個是型別的檢查
                    var newMyPrefab = cc.instantiate( results );
                    
                    var newMyPrefabScript = newMyPrefab.getComponent( 'storyItem' );
                    

                    var itemData = self.storyData[self.curStoryId];
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
           
        });

    }

    update (dt) {

    }
}
