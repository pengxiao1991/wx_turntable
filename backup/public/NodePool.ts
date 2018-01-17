// TypeScript file
/**
 * NodePool
 */
class NodePool <N> {
    constructor(Node:{new(): N; },max:number) {
        this.Node = Node;
        this.max = max;
        this.init();
    }
    
   
    private Node:{new(): N; } = null;
    private max:number = 0;
    private pool = {
        free:[],
        busy:[]
    };
    private _length : number;
    public get length() : number {
        return this.pool.free.length + this.pool.busy.length;
    }
    
    private init():void {
        for(let i=0; i<this.max; i++){
            this.pool.free.push(new this.Node());
        }
    }
     /**
     * 从对象池中获取一个对象，当没有可用的对象时候创建新的对象
     * */
    public get():N{
        if(this.pool.free.length > 0) {
            let obj = this.pool.free.pop();
            this.pool.busy.push(obj);
            return obj;
        }
        else {
            let newObj = new this.Node();
            this.max++;
            this.pool.busy.push(newObj);
            return newObj;
        }
    }

    //释放对象池中的对象
    public free(obj:N):void {
        var elementIndex = this.pool.busy.indexOf(obj);
        if(elementIndex > -1){
            this.pool.busy.splice(elementIndex,1);
            this.pool.free.unshift(obj);
        }
    }
    //销毁对象池，释放所有对象
    public destory(fn?:Function):void {
        if (!!fn) {
            fn(this.pool);   
        }
        this.max = 0;
        this.pool.free = [];
        this.pool.busy = [];
    }

    // 还原对象池为初始状态
    public restore():void {
        this.pool.busy.forEach((item) => {
            this.free(item);
        });
    }
}

