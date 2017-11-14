
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    tittle: cc.Label = null;

    @property(cc.RichText)
    content: cc.RichText = null;

    @property(cc.Node)
    btnNode : cc.Node;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {

    // }

    // start () {

    // }

    // update (dt) {}
    init(tittle,content,chooses){
        this.tittle.string = tittle;
        var tmp ="";
        for (let i = 0; i < content.length; i++) {
            tmp += content[i].detail + "\t\n";
            
        }
        this.content.string = tmp;

        let chooseLen = chooses.length;
        for (let i = 0; i < chooses.length; i++) {
            var node = new cc.Node('btn'+i);
            let btn = node.addComponent(cc.Button);
            // btn.
            btn.node.setPosition(i*100,0)
            node.parent = this.btnNode;
            // var btn = new cc.Button();
            // this.btnNode.addChild(btn);
            // btn.setPosition(i*100,0);

            // var clickEventHandler = new cc.Component.EventHandler();
            // clickEventHandler.target = this.btnNode; //这个 node 节点是你的事件处理代码组件所属的节点
            // clickEventHandler.component = "MyComponent";//这个是代码文件名
            // clickEventHandler.handler = "callback";
            // clickEventHandler.customEventData = "foobar";
    
            // var button = node.getComponent(cc.Button);
            // button.clickEvents.push(clickEventHandler);
        }
    
       
    }
    // callback: function (event, customEventData) {
    //     //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
    //     var node = event.target;
    //     var button = node.getComponent(cc.Button);
    //     //这里的 customEventData 参数就等于你之前设置的 "foobar"
    // }
}
