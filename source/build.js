/**
 * Created by love on 17/10/26.
 * @author trumpli<李志伟>
 */
var fs = require('fs');
var stat = fs.stat;

//删除目录
function deleteFolder(path) {
	var files = [];
	if (fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function (file, index) {
			var curPath = path + "/" + file;
			if (fs.statSync(curPath).isDirectory()) { // recurse
				deleteFolder(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
}
/**
 * 删除文件
 * @param path 需要删除的文件目录
 * @param fn 删除成功的回调函数
 */
function deleteFile(path,fn){
	fs.stat(path,function(err,stat){
		if(err){ 
			console.log(path+"文件不存在！"); 
		}else{ 
			fs.unlink(path,(err) => {
				if (err) {
					return console.log(err,'删除'+path+'文件错误')
				}
				else {
					console.log(path+'文件删除成功');
					fn();
				}
			});
		}
	});
}
/**
 * 复制目录中的所有文件包括子目录
 * @param src 需要复制的目录
 * @param dst 复制到指定的目录
 */
function copyDir(src, dst) {
	// 读取目录中的所有文件/目录
	var paths = fs.readdirSync(src);
	paths.forEach(function (path) {
		var _src = src + '/' + path,
		   _dst = dst + '/' + path,
		   readable, writable;
		
		stat(_src, function (err, st) {
			if (err) {
				throw err;
			}
			// 判断是否为文件
			if (st.isFile()) {
				// 创建读取流
				readable = fs.createReadStream(_src);
				// 创建写入流
				writable = fs.createWriteStream(_dst);
				// 通过管道来传输流
				readable.pipe(writable);
			}
			// 如果是目录则递归调用自身
			else if (st.isDirectory()) {
				fs.exists(_dst, function (exists) {
					// 已存在
					if (exists) {
						copyDir(_src, _dst);
					}
					// 不存在
					else {
						fs.mkdir(_dst, function () {
							copyDir(_src, _dst);
						});
					}
				});
			}
		});
	});
}

//删除release 目录 ,创建一个新的目录
var fromDir = './bin-release/web/release/';
var targetDir = '../release/';
deleteFolder(targetDir);
fs.mkdirSync(targetDir);


// 复制replace里的文件
copyDir('../replace/', fromDir + 'libs/modules/egret/');

// 删除favicon文件
deleteFile(fromDir + 'favicon.ico',function(){
	copyDir(fromDir,targetDir);
	
});







// fs.stat(fromDir+'manifest.json',function(err,stat){
// 	if(err){ 
// 		console.log("manifest.json文件不存在！"); 
// 	}else{ 
// 		//index.html
// 		var html = fs.readFileSync(fromDir+'index.html').toString();
// 		var manifest = JSON.parse(fs.readFileSync(fromDir+'manifest.json'));
// 		var list = manifest.initial.concat(manifest.game);
// 		html = html.toString().replace(
// 			` var xhr = new XMLHttpRequest();
// 			xhr.open('GET', './manifest.json?v=' + Math.random(), true);
// 			xhr.addEventListener("load", function () {
// 				var manifest = JSON.parse(xhr.response);
// 				var list = manifest.initial.concat(manifest.game);
// 				loadScript(list, function () {
// 					/**
// 					 * {
// 					 * "renderMode":, //Engine rendering mode, "canvas" or "webgl"
// 					 * "audioType": 0 //Use the audio type, 0: default, 2: web audio, 3: audio
// 					 * "antialias": //Whether the anti-aliasing is enabled in WebGL mode, true: on, false: off, defaults to false
// 					 * "calculateCanvasScaleFactor": //a function return canvas scale factor
// 					 * }
// 					 **/
// 					egret.runEgret({ renderMode: "webgl", audioType: 0, calculateCanvasScaleFactor:function(context) {
// 						var backingStore = context.backingStorePixelRatio ||
// 							context.webkitBackingStorePixelRatio ||
// 							context.mozBackingStorePixelRatio ||
// 							context.msBackingStorePixelRatio ||
// 							context.oBackingStorePixelRatio ||
// 							context.backingStorePixelRatio || 1;
// 						return (window.devicePixelRatio || 1) / backingStore;
// 					}});
// 				});
// 			});
// 			xhr.send(null);`
// 			,
// 			` loadScript(${list}, function () {
// 					/**
// 					 * {
// 					 * "renderMode":, //Engine rendering mode, "canvas" or "webgl"
// 					 * "audioType": 0 //Use the audio type, 0: default, 2: web audio, 3: audio
// 					 * "antialias": //Whether the anti-aliasing is enabled in WebGL mode, true: on, false: off, defaults to false
// 					 * "calculateCanvasScaleFactor": //a function return canvas scale factor
// 					 * }
// 					 **/
// 					egret.runEgret({ renderMode: "webgl", audioType: 0, calculateCanvasScaleFactor:function(context) {
// 						var backingStore = context.backingStorePixelRatio ||
// 							context.webkitBackingStorePixelRatio ||
// 							context.mozBackingStorePixelRatio ||
// 							context.msBackingStorePixelRatio ||
// 							context.oBackingStorePixelRatio ||
// 							context.backingStorePixelRatio || 1;
// 						return (window.devicePixelRatio || 1) / backingStore;
// 					}});
// 				});`);

// 		fs.writeFileSync(fromDir+'index.html',html);

// 		// 删除manifest文件
// 		deleteFile(fromDir + 'manifest.json');
// 	}
// });


	//index.html
	// var html = fs.readFileSync(targetDir+'/index.html');
    // console.log(html,666);
	
	
    // fs.writeFileSync(targetDir+'/index.html?v='+Math.round()*10000,html);

// (function(){
	
// 	//start.js
// 	var cocos = fs.readFileSync(fromDir+'/cocos2d-js-min.js');
// 	var project = fs.readFileSync(fromDir+'/src/project.js');
// 	var settings = fs.readFileSync(fromDir+'/src/settings.js');
// 	var main = fs.readFileSync('./main.js');
	
// 	fs.writeFileSync(targetDir+'/start.js',cocos);
// 	fs.appendFileSync(targetDir+'/start.js',project);
// 	fs.appendFileSync(targetDir+'/start.js',settings);
// 	fs.appendFileSync(targetDir+'/start.js',main);
	
// 	//index.html
// 	var html = fs.readFileSync('./index.html').toString();
// 	var style = fs.readFileSync('./style.css').toString();
	
// 	html = html.toString().replace('_style_',style)
	
// 	fs.writeFileSync(targetDir+'/index.html',html);
	
	
// })();


// deleteFolder('../server/web-mobile');
// fs.mkdirSync('../server/web-mobile');
// copyDir(targetDir, '../server/web-mobile');


