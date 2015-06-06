module.exports = function(grunt) {
	/**
	 * requirejs优化经验说明：
	 * 1. requirejs优化，最好不要用jquery的压缩后的插件，因为会重复压缩。实在不行配合参数skipDirOptimize: true，让不在modules里面的文件不进行优化
	 */
	//requirejs用户自定义扩展配置项，非官方标准配置。为了实现智能简便配置
	var requirejsconfig = {
		mfolder: ['page','page2'], //待打包的文件夹，默认此文件夹下的所有Js都打包。文件夹基于appDir和baseUrl下
		modules: [{name:'config'}], //modules项初始化
		/**
		* 给每个待打包的文件，指定不需要打包的文件.
		* @param {name: ['file']} 打包name文件或文件夹下的所有文件，排除对指定file列表的文件的打包
		* 配置情况举例说明如下：
		* {
			'all': ['api1'] 所有的modules不打包模块依赖api1
			'page': ['api1'] page文件夹下的所有文件都不打包模块依赖api1		
		*	'page/main1': ['api1'] page/main1.js不打包模块依赖api1
		* }
		* 不需要此项，则为{}
	    */
		exclude: {'all':['jquery'],'page/main2':['api1']}
	};
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs: {}
	});
	
	//配置requirejs的任务
	grunt.task.registerTask('addfiles','config',function(){
		/**
		* 根据当前文件夹名称foldername，文件完整相对路径filesrc，从变量requirejsconfig.exclude中获取当前文件的完整exclude配置项
		*/
		function getexclude(foldername,filesrc){
			var excludeobj = requirejsconfig.exclude;
			var result = [];
			var keyarr = ['all',foldername,filesrc];
			for(var i = 0, len = keyarr.length; i < len; i++){
			   if(excludeobj[keyarr[i]]){
				  result = result.concat(excludeobj[keyarr[i]]);
			   }
			}
			return result;
		}
		//requirejs打包处理程序
		for(var i = 0, len = requirejsconfig.mfolder.length; i < len; i++){
			var folder = requirejsconfig.mfolder[i];
			var files = grunt.file.expand('../web/js/'+folder+'/*.js');
			files.forEach(function(file) {
				var filenamelist = file.split('/');
				var num = filenamelist.length;
				var foldername = filenamelist[num-2];
				var filename = filenamelist[num - 1].replace('.js','');
				var filesrc = foldername + '/' + filename; //获取文件完整相对路径
				var opt = {
					name: filesrc
				};
				var exclude = getexclude(foldername,filesrc);
				if(exclude.length > 0){
					opt.exclude = exclude;
				}
				requirejsconfig.modules.push(opt);
			});
		}
		grunt.config.set('requirejs',{
			compile: { //requirejs官方标准配置
				options: {
				    appDir: "../web/js", //将js下的代码全部压缩复制到dir参数指定的目录中
					baseUrl: ".", //相对于appDir的baseUrl设置
					dir: "../build/js", //目标文件夹
					keepBuildDir: false, //设置为false,则会先清空dir里面的文件
					//skipDirOptimize: true, 默认为false。为true则除了modules里声明的文件，其他文件未进行优化和压缩，也就是说和执行requirejs优化前是一样的
					/*打包的时候不包括指定表达式里的文件或文件夹，这样也不会输出到dir。如果modules里面的文件依赖于此声明的文件，则不要使用此配置，否则会报错。原因如下：
					  requirejs打包原理：
					  1. 所有代码复制到dir；
					  2. 压缩所有代码；
					  3. 按照引用对modules里声明的文件进行打包；
					*/
					//fileExclusionRegExp: /common|comp/, 
					//stubModules: ['api1'], //这个配置项有问题，api1压缩后正常，但是在打包后的main1.js里内容被清空define("api1",{})
					//配置文件中相关路径的配置项
					paths: {
						'api1': 'third/api1',
						'api2': 'third/api2',
						'jquery': 'http://www.zmr.com/lib/js/core/jquery/jquery-1.11.3.min'
					},
					//需要打包（优化）的文件 exclude不打包此文件，但是得每个module项都得有配置
					modules: requirejsconfig.modules
				}
		  	}
		});
	});
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.registerTask('default', 'default', function(){
		grunt.task.run(['addfiles','requirejs']);
	});
};