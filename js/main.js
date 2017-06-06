function preloadimages(obj, complete_cb, progress_cb) {
	var loaded = 0;
	var toload = 0;
	var images = obj instanceof Array ? [] : {};
	toload = obj.length;
	for (var i = 0; i < obj.length; i++) {
		images[i] = new Image();
		images[i].src = obj[i];
		images[i].onload = load;
		images[i].onerror = load;
		images[i].onabort = load;
	}
	if (obj.length == 0) {
		complete_cb(images);
	}
	function load() {
		++loaded;
		if (progress_cb) {
			progress_cb(loaded / toload);
		}
		if (loaded >= toload) {
			complete_cb(images);
		}
	}
}

var chose_img_arr_num;
var time = 0;
var faile_flag = false;
var submit_flag = false;


var pos = [
	'0,0',
	'0,1',
	'0,2',
	'1,0',
	'1,1',
	'1,2',
	'2,0',
	'2,1',
	'2,2'
]
function disrupted(cLi,name){
	var new_arr = []
	var len = cLi.length;
	while(len){
		var num = parseInt(Math.random() * len)
		new_arr.push(cLi[num]);
		cLi.splice(num,1);
		len--
	}
	showCli(new_arr,name)
}

function showCli(arr,name){
	$("#puzzle ul").html("")
	for(var i = 0 ; i < arr.length ; i ++ ){
		var sort = arr[i].sort
		var img = "./image/"+name + '_'+sort+".jpg"
		var ele_li = "<li style='background: url("+img+") 0 0 no-repeat' data-sort="+sort+" data-pos="+pos[i]+"></li>";
		$("#puzzle ul").append($(ele_li));
	}
	addEliClick();
}


function addEliClick(){
	var aLi = $("#puzzle ul li");
	var oDrag = $("#drag");
	var startX,startY,moveX,moveY,old,thatNum,num,pX= 0,pY=0;
	var block = true
	var posArr = []
	var smallX = 191
	var smallY = 248
	var maxwidth = $("#page3 .box").width;
	var maxheight = $("#page3 .box").height;
	var minwidth = 0;
	var minheight = 0;
	var bingo = false;
	for(var i = 0;i < aLi.length ; i ++){
		aLi[i].index = i
		aLi[i].addEventListener('touchstart',function(ev){
			ev.preventDefault();
			event.preventDefault();
			var $that = $(this)
			old = this.index;
			posArr[0] = $that.data('pos').split(",");
			var color = $that.css('background')
			var top = Number(posArr[0][0]) * smallY;
			var left = Number(posArr[0][1]) * smallX;
			oDrag.css('top',top+'px');
			oDrag.css('left',left+'px');
			oDrag.css('background',color);
			oDrag.show();
			startX = 0;
			startY = 0;
			pX = 0;
			pY = 0;
			if(block && !bingo){
				startX = ev.touches[0].pageX;
				startY = ev.touches[0].pageY;
				block = false
			}
		});

		aLi[i].addEventListener('touchmove',function(ev){
			ev.preventDefault();
			event.preventDefault();
			if(!block && startX != 0 && startY != 0 && !bingo){
				pX = ev.touches[0].pageX;
				pY = ev.touches[0].pageY;

				moveX = pX - startX + Number(posArr[0][1]) * smallX;
				moveY = pY - startY + Number(posArr[0][0]) * smallY;
				if(moveX > maxwidth){
					moveX = maxwidth
				}
				if(moveX < minwidth ){
					moveX = minwidth
				}
				if(moveY > maxheight){
					moveY = maxheight
				}
				if(moveY < minheight ){
					moveY = minheight
				}

				oDrag.css('top',moveY+'px');
				oDrag.css('left',moveX+'px');
			}

		})

		aLi[i].addEventListener('touchend',function(ev){
			ev.preventDefault();
			oDrag.hide();
			if(!block && !bingo && time<20){
				block = true;
				if(pX == 0 || pY == 0 || moveX > maxwidth || moveX < minwidth || moveY > maxheight || moveY < minwidth){
					return false;
				}
				var little_moveX = moveX/smallX;
				var little_moveY = moveY/smallY;

				var diff_x = []

				diff_x[0] =  Math.abs( 0 - little_moveX );
				diff_x[1] = Math.abs( 1 - little_moveX );
				diff_x[2] = Math.abs( 2 - little_moveX );
				var minInNumbersX = Math.min.apply(Math,diff_x)

				var final_x = diff_x.indexOf(minInNumbersX)
				var diff_y = []

				diff_y[0] = Math.abs( 0 - little_moveY );
				diff_y[1] = Math.abs( 1 - little_moveY );
				diff_y[2] = Math.abs( 2 - little_moveY );

				var minInNumbersY = Math.min.apply(Math,diff_y)
				var final_y = diff_y.indexOf(minInNumbersY)

				var final_num = pos.indexOf(final_y+','+final_x);


				var old_style = $(aLi[old]).attr('style');
				var new_style = $(aLi[final_num]).attr('style');
				var old_data_index = $(aLi[old]).data('sort');
				var new_data_index = $(aLi[final_num]).data('sort');
				// var old_text = $(aLi[old]).html();
				// var new_text = $(aLi[final_num]).html();
				$(aLi[old]).attr('style',new_style);
				$(aLi[final_num]).attr('style',old_style);
				$(aLi[old]).data('sort',new_data_index);
				$(aLi[final_num]).data('sort',old_data_index);
				// $(aLi[old]).html(new_text);
				// $(aLi[final_num]).html(old_text);
				var count = 0;
				for(var k = 0 ; k < aLi.length ; k ++){
					var sort_num = $(aLi[k]).data('sort');
					if(Number(sort_num) != (k+1)){
						count = 0
						break;
					}else{
						count ++ ;
						if(count == aLi.length - 1){
							bingo = true
						}
					}
				}
				if(bingo && !faile_flag){
					bingo = false;
					submit_flag = true;
					clearInterval(timer)
					$("#page2 .box").hide();
					$("#ori_img").show();
					// $("#page3 .show").removeClass('show_img')
					$("#dialog5").show();
					// getShareTimeInfo();
					if(time != 0){
						$.post(time_submit,{'time':time},function(res){
							console.log('success');
						})
					}
				}
			}
		})
	}
}
var timer;
function countdown() {
	faile_flag = false
	var timeText = "00"
	time = 0
	var time_ele = $("#time")
	time_ele.text(timeText)
	timer = setInterval(function(){
		++time;
		if(time < 10){
			timeText = '0'+time
		}else{
			timeText = ""+time
		}
		if(time >= 20){
			faile_flag = true;
			timeText = "20";
			time_ele.text(timeText)
			$("#dialog4").show();
			return false
		}
		time_ele.text(timeText)
	},1000)
}

function play(){
	$(".page").hide();
	$("#page3").show();
	$("#page3 .box").hide();
	$("#puzzle").show();
	countdown();
}

function ready_puzzle() {
	var chose_img_arr = [
		{'sort':1},
		{'sort':2},
		{'sort':3},
		{'sort':4},
		{'sort':5},
		{'sort':6},
		{'sort':7},
		{'sort':8},
		{'sort':9}
	];
	var chose_img_name = '';
	switch (chose_img_arr_num){
		case 1:
			chose_img_name = 'puzzle1';
			break;
		case 2:
			chose_img_name = 'puzzle2';
			break;
		case 3:
			chose_img_name = 'puzzle3';
			break;
		case 4:
			chose_img_name = 'puzzle4';
			break;
	}
	$("#page1 .ori_img").html("");
	$("#ori_img").html("<img src='./image/"+chose_img_name+".jpg' />").show()
	disrupted(chose_img_arr,chose_img_name);
}


function getShareFriendInfo() {
	var f_text = [
		{'title':'拼图大作战','desc':'验证智商的时候到了。'},
		{'title':'拼图送好礼','desc':'奖品竟然是定制哒！'},
		{'title':'来来来，拼个图！','desc':'然后把奖品全部拿走好吗？'},
	]

	var num = parseInt(Math.random()*3);
	shareTitle = f_text[num].title;
	shareDesc = f_text[num].desc;

}

function getShareTimeInfo() {
	var t_text = [
		'哇！[TIME]秒挑战成功，打败了全国[PERSENT]%的用户。',
		'就喜欢这种简单直接，奖品来的全不费工夫！',
		'本次拼图就用时[TIME]秒，打败了全国[PERSENT]%的用户。',
	]

	var num1 = 1;
	var persent = 0;
	if(0 < time <= 20){
		num1 = parseInt(Math.random()*3);
		var min = parseInt(time);
		var max = parseInt(time) + 1;
		persent = min + parseFloat(Math.random() * (max - min + 1));
		persent = persent.toFixed(2)
		persent = 100 - persent;
	}
	var text = t_text[num1].replace('[TIME]',time);
	text = text.replace('[PERSENT]',persent);
	shareData = text;
}

$(function() {

	//判断ios还是安卓
	var u = navigator.userAgent, app = navigator.appVersion;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

	//阻止ios双击事件
	var iLastTouch = null;                                //缓存上一次tap的时间
	if (isiOS)
	{
		$("#ads").css('top','93%');
		document.body.addEventListener('touchend', function(event)
		{
			var iNow = new Date()
				.getTime();
			iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */ ;
			var delta = iNow - iLastTouch;
			if (delta < 500 && delta > 0)
			{
				event.preventDefault();
				return false;
			}
			iLastTouch = iNow;
		}, false);
	}

	for(var k = 1 ; k < 4 ; k++){
		document.getElementById('page'+k).addEventListener("touchstart", function (e) {
			// e.preventDefault();
		}, false);
		document.getElementById('page'+k).addEventListener("touchmove", function (e) {
			e.preventDefault();
		}, false);
		document.getElementById('page'+k).addEventListener("touchend", function (e) {
			// e.preventDefault();
		}, false);
	}
	// for(var d = 1 ; d < 8 ; d++){
	// 	document.getElementById('dialog'+d).addEventListener("touchstart", function (e) {
	// 		// e.preventDefault();
	// 	}, false);
	// 	document.getElementById('dialog'+d).addEventListener("touchmove", function (e) {
	// 		e.preventDefault();
	// 	}, false);
	// 	document.getElementById('dialog'+d).addEventListener("touchend", function (e) {
	// 		// e.preventDefault();
	// 	}, false);
	// }

	var preloadImageList = [];
	if( $('div').length > 0 ){
		var reg = /[^;"]+url\(([^\)]+)\).*/;
		$.each($('div'), function(index, val) {
			// var img = $(val).css('background').replace( /^url\((['"]?)(.*)\1\)$/ , '$2' );
			var text = reg.exec($(val).css('background'))
			if(text){
				text = text[1].replace(/['"]/g,"")
			}
			$.trim(text)
			var img = $.trim(text);
			if( img && img.match(/[^/]+(jpg|png|gif)$/) ){
				preloadImageList.push( img );
			}
		});
	}
	if( $('img').length > 0 ){
		$.each($('img'), function(index, val) {
			var img = $(val).attr('src');
			if( img && img.match(/[^/]+(jpg|png|gif)$/) ){
				preloadImageList.push( img );
			}
		});
	}

	var timeEnd = false;
	var imgLoaded = false;
	preloadImageList = [];
	// console.log(image_arr);
	preloadimages( preloadImageList , function () {
		imgLoaded = true;
		$("#ads").css('opacity',1);
		// getShareFriendInfo();
		$("#page1").show();
	}, function(progress){
		var text = Math.floor( progress*100 );
		//to do show text
	} );


	// var bg_music = document.getElementById("background");

	// $("#music").on('click',function(event){
	// 	event.stopPropagation();
	// 	event.preventDefault();
	// 	var $that = $(this)
	// 	if($that.hasClass("action")){
	// 		$that.removeClass("action");
	// 		bg_music.pause();
	// 	}else{
	// 		$that.addClass("action");
	// 		bg_music.play()
	// 	}

	// });

	$(".dialog .close").on('click',function (event) {
		event.stopPropagation();
		event.preventDefault();
		$(".dialog").hide()
	})

	$("#btn_prize_list").on('click',function () {
		// if(user_info_length != '0'){
		// 	$("#dialog2").show();
		// }else{
		// 	my_notify('暂无中奖信息')
		// }
		my_notify('暂无中奖信息')

	})
	$("#btn_rule").on('click',function () {
		$("#dialog1").show();
	})

	$("#start_play").on('click',function(){
		$(".page").hide();
		$("#page2").show();
	})
	$("#page2 .puzzle_img").on('click',function(){
		var $that = $(this);
		chose_img_arr_num = $that.data('img');
		if(chose_img_arr_num == 0){
			return;
		}
		console.log($that)
		ready_puzzle();
		// var bg_img = 'url(../image/puzzle'+chose_img_arr_num+'_bg.png) 0 0 no-repeat'
		// $that.css('background',bg_img);
		$that.addClass('active');
		setTimeout(function () {
			$(".page").hide();
			$("#page3").show();
			$that.removeClass('active');
			setTimeout(function () {
				$("#dialog3").show();
				setTimeout(function(){
					$("#dialog3 .drowcount img").attr('src','./image/2_text.png');
					setTimeout(function () {
						$("#dialog3 .drowcount img").attr('src','./image/1_text.png');
						setTimeout(function(){
							$("#dialog3 .drowcount img").attr('src','./image/start_text.png');
							setTimeout(function () {
								$(".dialog").hide();
								play()
							},1000)
						},1000)
					},1000)
				},1000)
			},1000)
		},1000)
	});
	
	$("#play_again_btn").on('click',function () {
		ready_puzzle();
		clearInterval(timer)
		$(".dialog").hide();
		play()
	});

	$("#input_btn").on('click',function () {
		$(".dialog").hide();
		$(".page").hide();
		$("#dialog6").show();
	});

	$("#share_btn").on('click',function () {
		$(".dialog").hide();
		$("#dialog7").show();
	});
	$("#dialog7").on('click',function () {
		$(".dialog").hide();
		$("#dialog5").show();
	})

});