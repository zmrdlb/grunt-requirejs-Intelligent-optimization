// JavaScript Document
define(['common/c1','api1'], function(c1,api1){
	return {
		name: 'b1模块，引用c1和api1<br/>'+c1.NAME+'<br/>'+api1.name
	};
});