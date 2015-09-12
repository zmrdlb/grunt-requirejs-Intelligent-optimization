// JavaScript Document
requirejs(['jquery','comp/a1','api2','jquery.cookie'],function($,a1,api2){
	$('#container').html(a1.name+'<br/>'+api2.name);
});