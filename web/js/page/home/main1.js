// JavaScript Document
requirejs(['css!css1/style','jquery.cookie','jquery','comp/a1','api2'],function(css,cookie,$,a1,api2){
	//代码注释
	$('#container').html(a1.name+'<br/>'+api2.name);
});