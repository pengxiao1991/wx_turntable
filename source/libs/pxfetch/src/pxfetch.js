var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fetch = {};
(function (self, belong) {
    'use strict';
    /*if (self.fetch) {
      return
    }*/
    var support = {
        searchParams: 'URLSearchParams' in self,
        iterable: 'Symbol' in self && 'iterator' in Symbol,
        blob: 'FileReader' in self && 'Blob' in self && (function () {
            try {
                new Blob();
                return true;
            }
            catch (e) {
                return false;
            }
        })(),
        formData: 'FormData' in self,
        arrayBuffer: 'ArrayBuffer' in self
    };
    if (support.arrayBuffer) {
        var viewClasses = [
            '[object Int8Array]',
            '[object Uint8Array]',
            '[object Uint8ClampedArray]',
            '[object Int16Array]',
            '[object Uint16Array]',
            '[object Int32Array]',
            '[object Uint32Array]',
            '[object Float32Array]',
            '[object Float64Array]'
        ];
        var isDataView = function (obj) {
            return obj && DataView.prototype.isPrototypeOf(obj);
        };
        var isArrayBufferView = ArrayBuffer.isView || function (obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
        };
    }
    function normalizeName(name) {
        if (typeof name !== 'string') {
            name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
            throw new TypeError('Invalid character in header field name');
        }
        return name.toLowerCase();
    }
    function normalizeValue(value) {
        if (typeof value !== 'string') {
            value = String(value);
        }
        return value;
    }
    // Build a destructive iterator for the value list
    function iteratorFor(items) {
        var iterator = {
            next: function () {
                var value = items.shift();
                return { done: value === undefined, value: value };
            }
        };
        if (support.iterable) {
            iterator[Symbol.iterator] = function () {
                return iterator;
            };
        }
        return iterator;
    }
    function Headers(headers) {
        this.map = {};
        if (headers instanceof Headers) {
            headers.forEach(function (value, name) {
                this.append(name, value);
            }, this);
        }
        else if (Array.isArray(headers)) {
            headers.forEach(function (header) {
                this.append(header[0], header[1]);
            }, this);
        }
        else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function (name) {
                this.append(name, headers[name]);
            }, this);
        }
    }
    Headers.prototype.append = function (name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ',' + value : value;
    };
    Headers.prototype['delete'] = function (name) {
        delete this.map[normalizeName(name)];
    };
    Headers.prototype.get = function (name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null;
    };
    Headers.prototype.has = function (name) {
        return this.map.hasOwnProperty(normalizeName(name));
    };
    Headers.prototype.set = function (name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
    };
    Headers.prototype.forEach = function (callback, thisArg) {
        for (var name in this.map) {
            if (this.map.hasOwnProperty(name)) {
                callback.call(thisArg, this.map[name], name, this);
            }
        }
    };
    Headers.prototype.keys = function () {
        var items = [];
        this.forEach(function (value, name) { items.push(name); });
        return iteratorFor(items);
    };
    Headers.prototype.values = function () {
        var items = [];
        this.forEach(function (value) { items.push(value); });
        return iteratorFor(items);
    };
    Headers.prototype.entries = function () {
        var items = [];
        this.forEach(function (value, name) { items.push([name, value]); });
        return iteratorFor(items);
    };
    if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
    }
    function consumed(body) {
        if (body.bodyUsed) {
            return Promise.reject(new TypeError('Already read'));
        }
        body.bodyUsed = true;
    }
    function fileReaderReady(reader) {
        return new Promise(function (resolve, reject) {
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject(reader.error);
            };
        });
    }
    function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise;
    }
    function readBlobAsText(blob) {
        //alert('FileReader == '+(typeof FileReader));
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob, 'utf-8');
        return promise;
    }
    function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);
        for (var i = 0; i < view.length; i++) {
            chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join('');
    }
    function bufferClone(buf) {
        if (buf.slice) {
            return buf.slice(0);
        }
        else {
            var view = new Uint8Array(buf.byteLength);
            view.set(new Uint8Array(buf));
            return view.buffer;
        }
    }
    function Body() {
        this.bodyUsed = false;
        this._initBody = function (body) {
            this._bodyInit = body;
            if (!body) {
                this._bodyText = '';
            }
            else if (typeof body === 'string') {
                this._bodyText = body;
            }
            else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                this._bodyBlob = body;
            }
            else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                this._bodyFormData = body;
            }
            else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this._bodyText = body.toString();
            }
            else if (support.arrayBuffer && support.blob && isDataView(body)) {
                this._bodyArrayBuffer = bufferClone(body.buffer);
                // IE 10-11 can't handle a DataView body.
                this._bodyInit = new Blob([this._bodyArrayBuffer]);
            }
            else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                this._bodyArrayBuffer = bufferClone(body);
            }
            else {
                throw new Error('unsupported BodyInit type');
            }
            if (!this.headers.get('content-type')) {
                //console.log(this.headers.get('content-type'),'123');
                if (typeof body === 'string') {
                    this.headers.set('content-type', 'text/plain;charset=UTF-8');
                }
                else if (this._bodyBlob && this._bodyBlob.type) {
                    this.headers.set('content-type', this._bodyBlob.type);
                }
                else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                    this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                }
            }
        };
        if (support.blob) {
            this.blob = function () {
                var rejected = consumed(this);
                if (rejected) {
                    return rejected;
                }
                if (this._bodyBlob) {
                    return Promise.resolve(this._bodyBlob);
                }
                else if (this._bodyArrayBuffer) {
                    return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                }
                else if (this._bodyFormData) {
                    throw new Error('could not read FormData body as blob');
                }
                else {
                    return Promise.resolve(new Blob([this._bodyText]));
                }
            };
            this.arrayBuffer = function () {
                if (this._bodyArrayBuffer) {
                    return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
                }
                else {
                    return this.blob().then(readBlobAsArrayBuffer);
                }
            };
        }
        this.text = function () {
            var rejected = consumed(this);
            if (rejected) {
                return rejected;
            }
            if (this._bodyBlob) {
                return readBlobAsText(this._bodyBlob);
            }
            else if (this._bodyArrayBuffer) {
                return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
            }
            else if (this._bodyFormData) {
                throw new Error('could not read FormData body as text');
            }
            else {
                return Promise.resolve(this._bodyText);
            }
        };
        if (support.formData) {
            this.formData = function () {
                return this.text().then(decode);
            };
        }
        this.json = function () {
            return this.text().then(JSON.parse);
        };
        return this;
    }
    // HTTP methods whose capitalization should be normalized
    var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
    function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return (methods.indexOf(upcased) > -1) ? upcased : method;
    }
    function Request(input, options) {
        options = options || {};
        var body = options.body;
        if (input instanceof Request) {
            if (input.bodyUsed) {
                throw new TypeError('Already read');
            }
            this.url = input.url;
            this.credentials = input.credentials;
            if (!options.headers) {
                this.headers = new Headers(input.headers);
            }
            this.method = input.method;
            this.mode = input.mode;
            if (!body && input._bodyInit != null) {
                body = input._bodyInit;
                input.bodyUsed = true;
            }
        }
        else {
            this.url = String(input);
        }
        this.credentials = options.credentials || this.credentials || 'omit';
        if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || 'GET');
        this.mode = options.mode || this.mode || null;
        this.referrer = null;
        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
            throw new TypeError('Body not allowed for GET or HEAD requests');
        }
        this._initBody(body);
    }
    Request.prototype.clone = function () {
        return new Request(this, { body: this._bodyInit });
    };
    function decode(body) {
        var form = new FormData();
        body.trim().split('&').forEach(function (bytes) {
            if (bytes) {
                var split = bytes.split('=');
                var name = split.shift().replace(/\+/g, ' ');
                var value = split.join('=').replace(/\+/g, ' ');
                form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
        });
        return form;
    }
    function parseHeaders(rawHeaders) {
        var headers = new Headers();
        rawHeaders.split(/\r?\n/).forEach(function (line) {
            var parts = line.split(':');
            var key = parts.shift().trim();
            if (key) {
                var value = parts.join(':').trim();
                headers.append(key, value);
            }
        });
        return headers;
    }
    Body.call(Request.prototype);
    function Response(bodyInit, options) {
        if (!options) {
            options = {};
        }
        this.type = 'default';
        this.status = 'status' in options ? options.status : 200;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = 'statusText' in options ? options.statusText : 'OK';
        this.headers = new Headers(options.headers);
        this.url = options.url || '';
        this._initBody(bodyInit);
    }
    Body.call(Response.prototype);
    Response.prototype.clone = function () {
        return new Response(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
        });
    };
    Response.error = function () {
        var response = new Response(null, { status: 0, statusText: '' });
        response.type = 'error';
        return response;
    };
    var redirectStatuses = [301, 302, 303, 307, 308];
    Response.redirect = function (url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError('Invalid status code');
        }
        return new Response(null, { status: status, headers: { location: url } });
    };
    belong.Headers = Headers;
    belong.Request = Request;
    belong.Response = Response;
    belong.fetch = function (input, init, timeout) {
        return new Promise(function (resolve, reject) {
            var request = new Request(input, init);
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var options = {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: parseHeaders(xhr.getAllResponseHeaders() || '')
                };
                options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
                var body = 'response' in xhr ? xhr.response : xhr.responseText;
                resolve(new Response(body, options));
            };
            xhr.timeout = timeout || 5000; //5秒超时时间
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.ontimeout = function () {
                XMLHttpRequest.prototype.abort.call(xhr);
                reject(new TypeError('Timeout request failed'));
            };
            xhr.open(request.method, request.url, true);
            if (request.credentials === 'include') {
                xhr.withCredentials = true;
            }
            /*if ('responseType' in xhr && support.blob) {
              xhr.responseType = 'blob'
            }*/
            xhr.responseType = 'text';
            request.headers.forEach(function (value, name) {
                xhr.setRequestHeader(name, value);
            });
            xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
        });
    };
    belong.fetch.polyfill = true;
    //})(typeof self !== 'undefined' ? self : this);
})(typeof self !== 'undefined' ? self : this, fetch);
// var fetch = require('./fetch.js').fetch;
var symbol = Symbol();
var globalPrefilter = Symbol();
var globalSuccess = Symbol();
var globalError = Symbol();
var networkError = Symbol();
var MsgTimeOut = "Timeout request failed";
var MsgNetWork = "Network request failed";
/*var __interrupted= false;
var __running = [];*/
var Pxfetch = (function () {
    function Pxfetch() {
        this[symbol] = {};
    }
    // 设置全局过滤函数
    Pxfetch.fetchPrefilter = function (func) {
        // 静态方法中的this相当于类Pxfetch
        this[globalPrefilter] = func;
    };
    // 设置全局成功函数
    Pxfetch.fetchSuccess = function (func) {
        this[globalSuccess] = func;
    };
    // 设置全局失败函数
    Pxfetch.fetchError = function (func) {
        this[globalError] = func;
    };
    // 设置全局网络异常函数
    Pxfetch.fetchNetworkError = function (func) {
        this[networkError] = func;
    };
    Pxfetch.prototype.fetch = function (params, timeout) {
        var _this = this;
        // 存储参数方便进行过滤操作
        this[symbol] = params;
        // 请求之前进行全局过滤,this.constructor相当于类Pxfetch
        if (this.constructor[globalPrefilter]) {
            if (this.constructor[globalPrefilter](this[symbol])) {
                //返回true，表示中断请求
                return;
            }
        }
        // 进行自定义过滤操作
        if (this[symbol].beforeSend) {
            this[symbol].beforeSend(this[symbol]);
        }
        var type = this[symbol].type ? this[symbol].type : 'GET', url = this[symbol].url, data = this[symbol].data, complete = this[symbol].complete, error = this[symbol].error, success = this[symbol].success, init = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            }
        };
        if (type.toUpperCase() == 'GET') {
            // get并且有数据时
            if (data) {
                if (url.indexOf('?') > 0) {
                    //if (url.includes('?')) {
                    url += '&';
                }
                else {
                    url += '?';
                }
                for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
                    var item = _a[_i];
                    url += (item + '=' + data[item] + '&');
                }
                url = url.slice(0, url.length - 1);
            }
            init.method = 'GET';
        }
        else {
            init.method = type.toUpperCase();
            var dataString = '', key;
            for (key in data) {
                if (!!dataString) {
                    dataString += '&';
                }
                dataString += (key + '=' + data[key]);
            }
            init.body = dataString;
        }
        console.log('trump ajax start ')
        var tmpPro = fetch.fetch(url, init, timeout);
        //Pxfetch.__pushThis(this);
        // 先进行全局操作
        tmpPro
            .then(function (response) {
            //Pxfetch.__spliceThis(this);
            var clone = response.clone();
            if (response.ok) {
                response.json()
                    .then(function (data) {
            console.log('trump ajax stop 1',data)
                        
                    // 执行全局成功函数
                    if (_this.constructor[globalSuccess]) {
                        _this.constructor[globalSuccess](data, _this[symbol]);
                    }
                    return data;
                })
                    .then(function (data) {
            console.log('trump ajax stop 2',_this[symbol])
                        
                    if (_this[symbol].success) {
                        
                        success(data, response);
                    }
                });
            }
            else {
                if (_this.constructor[globalError]) {
                    _this.constructor[globalError](response);
                    // 执行自定义错误函数
                    if (error) {
                        error(response);
                    }
                }
            }
            if (complete) {
                complete(response);
            }
            return clone;
        }, function (error) {
            console.log('trump ajax stop 2',error)
            var message = typeof error == 'object' ? error.message : '';
            //超时
            if (message == MsgTimeOut) {
                //交给各自业务自己处理
                if (_this[symbol]['timeoutError']) {
                    _this[symbol]['timeoutError'](error);
                }
            }
            else if (message == MsgNetWork) {
                if (_this.constructor[networkError]) {
                    _this.constructor[networkError](error);
                }
            }
            else {
                console.error(error);
            }
        });
        return tmpPro;
    };
    // 静态函数生成一个只引用一次的pxfetch对象
    Pxfetch.pxfetch = function (params, timeout) {
        return new Pxfetch().fetch(params, timeout);
    };
    return Pxfetch;
}());
window.Pxfetch = Pxfetch;
__reflect(Pxfetch.prototype, "Pxfetch");
