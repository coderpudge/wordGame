
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Button)
    button :cc.Button = null;
    id : null;

    onLoad() {
        // init logic
        // var self = this;
        // this.button.node.on(cc.Node.EventType.TOUCH_START, function (event) {
        //     cc.log("onclick",self.id)
        //     // var touches = event.getTouches();
        //     // var touchLoc = touches[0].getLocation();
        //     // cc.log(touchLoc);
        //     // self.robControl();
        // }, self);
        this.button.node.on(cc.Node.EventType.TOUCH_START, this.onclick.bind(this));
    }
    init(Label,id){
        this.label.string = Label;
        this.id = id;
        cc.log("button"+this.id)
    }
    onclick(data){
        cc.log("onclick",this.id,data)
        let event = new cc.Event.EventCustom('storyChoose', true);
        event.setUserData({"id":this.id});
        this.node.dispatchEvent( event );
    }
}
