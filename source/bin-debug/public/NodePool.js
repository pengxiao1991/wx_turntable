var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// TypeScript file
/**
 * NodePool
 */
var NodePool = (function () {
    function NodePool(Node, max) {
        this.Node = null;
        this.max = 0;
        this.pool = {
            free: [],
            busy: []
        };
        this.Node = Node;
        this.max = max;
        this.init();
    }
    Object.defineProperty(NodePool.prototype, "length", {
        get: function () {
            return this.pool.free.length + this.pool.busy.length;
        },
        enumerable: true,
        configurable: true
    });
    NodePool.prototype.init = function () {
        for (var i = 0; i < this.max; i++) {
            this.pool.free.push(new this.Node());
        }
    };
    /**
    * 从对象池中获取一个对象，当没有可用的对象时候创建新的对象
    * */
    NodePool.prototype.get = function () {
        if (this.pool.free.length > 0) {
            var obj = this.pool.free.pop();
            this.pool.busy.push(obj);
            return obj;
        }
        else {
            var newObj = new this.Node();
            this.max++;
            this.pool.busy.push(newObj);
            return newObj;
        }
    };
    //释放对象池中的对象
    NodePool.prototype.free = function (obj) {
        var elementIndex = this.pool.busy.indexOf(obj);
        if (elementIndex > -1) {
            this.pool.busy.splice(elementIndex, 1);
            this.pool.free.unshift(obj);
        }
    };
    //销毁对象池，释放所有对象
    NodePool.prototype.destory = function (fn) {
        if (!!fn) {
            fn(this.pool);
        }
        this.max = 0;
        this.pool.free = [];
        this.pool.busy = [];
    };
    // 还原对象池为初始状态
    NodePool.prototype.restore = function () {
        var _this = this;
        this.pool.busy.forEach(function (item) {
            _this.free(item);
        });
    };
    return NodePool;
}());
__reflect(NodePool.prototype, "NodePool");
