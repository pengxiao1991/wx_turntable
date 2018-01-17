
class GlobalEmitter {  
    /** 监听器 */  
    private static listeners = {};  
  
    /**   
     * 注册事件  
     * @param name 事件名称  
     * @param callback 回调函数  
     * @param target 上下文  
     * @param justOnce 是否执行一次，默认false
     */  
    public static on(name: string, callback: Function, target: any , justOnce : boolean = false) {  
        
        if (!GlobalEmitter.listeners[name]) {
            GlobalEmitter.listeners[name] = [];  
        } 
        GlobalEmitter.listeners[name].push({'name': name , 'callback' : callback , 'target' : target , 'justOnce' : justOnce}); 
    }

    /**   
     * 注册事件(只执行一次)  
     * @param name 事件名称  
     * @param callback 回调函数  
     * @param target 上下文  
     */  
    public static once(name: string, callback: Function, target: any) {  
        GlobalEmitter.on(name , callback , target, true)
    }  
  
    /**  
     * 移除事件 (1、如果传递了callback，则只删除事件对应的callBack函数，并不删除监听器，但是事件没有回调函数了，也将删除事件本身)
     *         (2、若不传递，则删除所有) 
     * @param name 事件名称  
     * @param callback 回调函数(只能传具名函数)
     */ 
    public static remove(name: string , callback? : Function) { 
        
        let events = GlobalEmitter.listeners[name]
        if (!events) {
            // throw(name+'事件没有注册，无法调用remove方法');
            return;
        }
        if (callback) { 
            let length = events.length; 
            for (let i = 0; i < length; i++) {  
                let event = events[i];  
                if (callback == event['callback']){  
                    events.splice(i, 1);  
                    break;  
                }  
            }
            //事件里面没有一个回调函数了，存在也没有意义了
            if (events.length == 0) {  
                delete GlobalEmitter.listeners[name];  
            } 
        } else {
            delete GlobalEmitter.listeners[name];  
        }
    }
  
    /**  
     * 发送事件  
     * @param name 事件名称  
     */  
    public static emit(name: string, ...args: any[]) {
        let events: {}[] = GlobalEmitter.listeners[name]
        if (!events) {
            console.error(name+'事件没有注册，无法调用emit方法');
            return;
        }
        events.forEach((event)=>{
            if (event['callback']) {
                event['callback'].call(event['target'], ...args);
                if (event['justOnce']) {
                    GlobalEmitter.remove(event['name'],event['callback'])  
                }  
            }
        })
    }  
}  