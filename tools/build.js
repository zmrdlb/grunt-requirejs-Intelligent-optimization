// JavaScript Document
//只打包压缩1个js
/*({
    baseUrl: "../web/js",
	name: 'page/main1',
	out: '../build/js/page/main1-built.js', //相对于build.js所在的当前目录
	//mainConfigFile项老是不管用，所以只有复制相关配置
	paths: {
	    'api1': 'third/api1'
    }
})*/

//打包压缩整个工程
({
	//必填项
    appDir: "../web/js", //将appDir下的代码全部压缩复制到dir参数指定的目录中
    baseUrl: ".", //相对于appDir的baseUrl设置，路径指向requirejs.config的baseUrl路径
    dir: "../build/js", //目标文件夹
	keepBuildDir: false, //设置为flase,则会先清空dir里面的文件
	//requirejs.config中相关路径的配置项
	paths: { //requirejs.config里面的paths
		'api1': 'third/api1',
		'api2': 'third/api2',
		'jquery.cookie': 'third/jquery.cookie',
		'jquery': 'http://www.zmr.com/lib/js/core/jquery/jquery-1.11.3.min'
	},
	map: {
		'*': {
		    'css': 'require-css/css' // 添加require-css打包配置
		}
	},
	shim: {
		'jquery.cookie': ['jquery']
	},
	//需要优化的文件
    modules: [{
		name: 'config'
	},{
		name: 'page/home/main1', //需要优化的js文件
		//优化此文件时不打包jquery.cookie依赖，jquery.cookie将会异步加载
		exclude: ['jquery.cookie'] 
	},{
		name: 'page/main2'
	}]
});