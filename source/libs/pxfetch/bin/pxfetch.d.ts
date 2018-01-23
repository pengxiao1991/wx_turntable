declare class Pxfetch {
    constructor();
    static fetchPrefilter(func:Function):void;
    static fetchSuccess(func:Function):void;
    static fetchError(func:Function):void;
    static fetchNetworkError(func:Function):void;
    static pxfetch(param:any,timeout?:any):any;    
    
}