var moveStyle = {};
moveStyle.timeScroll = null;  //挂载整屏动画切换的实例
moveStyle.currentStep = "step1";

moveStyle.init = function() {
	moveStyle.resize();  //设置每一屏的高度和top值
	moveStyle.events();
	moveStyle.configIntAniamte();  //设置导航条的动画

	moveStyle.button3D(".start", ".state1", ".state2", 0.3);
	moveStyle.button3D(".button1", ".state1", ".state2", 0.3);
	moveStyle.button3D(".button2", ".state1", ".state2", 0.3);

	//设置每一屏中img的百分比
	moveStyle.imgWidth( $(".scene img") );

	$("body").height(8500);
	moveStyle.configTimeScroll(); //配置整屏切换的动画以及每一屏中的小动画
	twoAnimate.init();  //具体的第二屏的动画要实现的细节
	threeAnimate.init();  //具体的第三屏的动画要实现的细节
	fiveAnimate.init();  //具体的第五屏的动画要实现的细节
}

$(document).ready(moveStyle.init);

//配置事件
moveStyle.events = function() {
	$(window).resize( moveStyle.resize );
	moveStyle.nav();  //执行导航条的鼠标移入移除的动画

	$(window).bind("scroll", scrollFn);

	function scrollFn() {
		$(window).scrollTop(0); 
	}

	//在滚动条滚动的过程中，计算页面应该到哪一个时间点上去
	$(window).bind("scroll", moveStyle.scrollStatus);

	//当mousedowwn的时候，解除scroll事件对应的scrollFn
	$(window).bind("mousedown", function() {
		$(window).unbind("scroll", scrollFn);
	});

	//当mouseup的时候,让当前这一屏到达某个状态
	$(window).bind("mouseup", moveStyle.mouseupFn);

	//去掉浏览器默认的滚动行为
	$(".wrapper").bind("mousewheel", function(e) {
		if( $(window).width() > 780 ) {
			e.preventDefault();
		}
		
	});

	$(".wrapper").one("mousewheel", mousewheelFn);

	var timer = null;

	function mousewheelFn(e, direction) {
		$(window).unbind("scroll", scrollFn);
		if( direction < 1 ) {  //向下滚动

			moveStyle.changeStep("next");

		} else { //向上滚动

			moveStyle.changeStep("prev");

		};
		clearTimeout(timer);
		var timer = setTimeout(function() {
			if( $(window).width() > 780 ) {
				$(".wrapper").one("mousewheel", mousewheelFn);
			}
			
		}, 1200);

	}

	$(window).resize( moveStyle.resize );

}

moveStyle.mouseupFn = function() {

	//在滚动过程中计算出一个比例
	var scale = moveStyle.scale();
	//得到当前页面到达的一个时间点
	var times = scale * moveStyle.timeScroll.totalDuration();
	//获取到上一个状态和下一个状态
	var prevStep = moveStyle.timeScroll.getLabelBefore( times );
	var nextStep = moveStyle.timeScroll.getLabelAfter( times );

	//获取到上一个状态的时间和下一个状态的时间
	var prevTime = moveStyle.timeScroll.getLabelTime( prevStep );
	var nextTime = moveStyle.timeScroll.getLabelTime( nextStep );

	//计算差值
	var prevDvalue = Math.abs( prevTime - times );
	var nextDvalue = Math.abs( nextTime - times );

	/*
		如果scale为0
			step1
		如果scale为
			step5
		prevDvalue > nextDvalue 
			nextStep
		prevDvalue < nextDvalue
			prevStep
	*/

	var step = "";
	if( scale === 0 ) {
		step = "step1"
	} else if( scale === 1 ){
		step = "footer";
	} else if( prevDvalue < nextDvalue ) {
		step = prevStep;
	} else {
		step = nextStep;
	}
	console.log( prevDvalue + " - " + nextDvalue + " - " + step + " " + moveStyle.timeScroll.totalDuration());
	moveStyle.timeScroll.tweenTo( step );
	//-------------------松开鼠标时，控制滚动条到达某个状态计算出的距离---------------------
	//获取动画的总时长
	var totalTime = moveStyle.timeScroll.totalDuration();

	//获取到要到达的状态的时间
	var afterTime = moveStyle.timeScroll.getLabelTime( step );

	//获取到滚动条能够滚动的最大高度
	var maxH = $("body").height() - $(window).height();

	//计算出滚动条滚动的距离
	var positionY = afterTime / totalTime * maxH;

	//滚动条滚动距离的持续时间
	var d = Math.abs( moveStyle.timeScroll.time() - afterTime );

	var scrollAnimate = new TimelineMax();
	scrollAnimate.to( "html,body", d, {scrollTop: positionY} );
	moveStyle.currentStep = step;



}

//计算滚动条在滚动过程中的一个比例
moveStyle.scale = function() {
	var scrollT = $(window).scrollTop();
	var maxH = $("body").height() - $(window).height();
	var s = scrollT / maxH;
	return s;
}

//在滚动条滚动的过程中，计算页面应该到哪一个时间点上去
moveStyle.scrollStatus = function() {
	// console.log( moveStyle.scale() );
	var times = moveStyle.scale() * moveStyle.timeScroll.totalDuration();

	//当滚动条在滚动的过程中，让页面的动画到达某个时间点
	moveStyle.timeScroll.seek( times, false );

}

//切换整屏并且计算滚动条的距离
moveStyle.changeStep = function(value) {

 	if( value === "next" ) { //向下切换

 		//获取当前时间
 		var currentTime = moveStyle.timeScroll.getLabelTime( moveStyle.currentStep );
 		//获取到下一个状态的字符串
 		var afterStep = moveStyle.timeScroll.getLabelAfter( currentTime );

 		if( !afterStep ) return;

 		//获取动画的总时长
 		var totalTime = moveStyle.timeScroll.totalDuration();

 		//获取到下一个状态的时间
 		var afterTime = moveStyle.timeScroll.getLabelTime( afterStep );

 		//获取到滚动条能够滚动的最大高度
 		var maxH = $("body").height() - $(window).height();

 		//计算出滚动条滚动的距离
 		var positionY = afterTime / totalTime * maxH;

 		//滚动条滚动距离的持续时间
 		var d = Math.abs( moveStyle.timeScroll.time() - afterTime );

 		var scrollAnimate = new TimelineMax();
 		scrollAnimate.to( "html,body", d, {scrollTop: positionY} );

 		//运动到下一个状态
 		// moveStyle.timeScroll.tweenTo( afterStep );
 		//记录当前的状态为下一个状态，方便继续切换到下一个状态上
 		moveStyle.currentStep = afterStep;

 	} else {  //向上切换

 		//获取当前时间
 		var currentTime = moveStyle.timeScroll.getLabelTime( moveStyle.currentStep );

 		//获取到上一个状态的字符串
 		var beforeStep = moveStyle.timeScroll.getLabelBefore( currentTime );

 		if( !beforeStep ) return; 

 		//获取动画的总时长
 		var totalTime = moveStyle.timeScroll.totalDuration();

 		//获取到下一个状态的时间
 		var beforeTime = moveStyle.timeScroll.getLabelTime( beforeStep );

 		//获取到滚动条能够滚动的最大高度
 		var maxH = $("body").height() - $(window).height();

 		//计算出滚动条滚动的距离
 		var positionY = beforeTime / totalTime * maxH;

 		//滚动条滚动距离的持续时间
 		var d = Math.abs( moveStyle.timeScroll.time() - beforeTime );

 		var scrollAnimate = new TimelineMax();
 		scrollAnimate.to( "html,body", d, {scrollTop: positionY} );

 		//运动到上一个状态
 		// moveStyle.timeScroll.tweenTo( beforeStep );

 		//记录当前的状态为上一个状态，方便继续切换到上一个状态上
 		moveStyle.currentStep = beforeStep;

 	}

}

//配置整屏切换的动画以及每一屏中的小动画
moveStyle.configTimeScroll = function() {

	var time = moveStyle.timeScroll ? moveStyle.timeScroll.time() : 0;
	if( moveStyle.timeScroll ) moveStyle.timeScroll.clear();

	moveStyle.timeScroll = new TimelineMax();

		//当从第二屏切换到第一屏的时候，让第二屏里面的动画时间点重归0
		moveStyle.timeScroll.to( ".scene1", 0, {onReverseComplete: function() {
			twoAnimate.timeline.seek(0, false);
		}}, 0 );

	moveStyle.timeScroll.to(".footer", 0, {top: "100%"});

		moveStyle.timeScroll.add("step1");
	moveStyle.timeScroll.to(".scene2", 0.8, {top: 0, ease: Cubic.easeInout});
	moveStyle.timeScroll.to({}, 0.1, {onComplete: function() {
		menu.changeMenu( "menu_state2" );  //切换到第二屏调用的函数，同时传入导航条背景颜色变化的名字
	}, onReverseComplete: function() {
		menu.changeMenu( "menu_state1" );
	}}, "-=0.2");

	//当切换到第二屏的时候，翻转第二屏上的第一个动画
	moveStyle.timeScroll.to( {}, 0, {onComplete: function() {
		twoAnimate.timeline.tweenTo( "state1" );
	}}, "-=0.2" );

		moveStyle.timeScroll.add("step2");

	//主动画中配置第二屏的小动画start

	moveStyle.timeScroll.to( {}, 0, { onComplete: function() {
		twoAnimate.timeline.tweenTo("state2");
	}, onReverseComplete:function() {
		twoAnimate.timeline.tweenTo("state1");
	} } );
	moveStyle.timeScroll.to( {}, 0.4, {} );
	moveStyle.timeScroll.add("point1");


	moveStyle.timeScroll.to( {}, 0, { onComplete: function() {
		twoAnimate.timeline.tweenTo("state3");
	}, onReverseComplete:function() {
		twoAnimate.timeline.tweenTo("state2");
	} } );
	moveStyle.timeScroll.to( {}, 0.4, {} );
	moveStyle.timeScroll.add("point2");


	moveStyle.timeScroll.to( {}, 0, { onComplete: function() {
		twoAnimate.timeline.tweenTo("state4");
	}, onReverseComplete:function() {
		twoAnimate.timeline.tweenTo("state3");
	} } );
	moveStyle.timeScroll.to( {}, 0.4, {} );
	moveStyle.timeScroll.add("point3");

	//主动画中配置第二屏的小动画end

	moveStyle.timeScroll.to(".scene3", 0.8, {top: 0, ease: Cubic.easeInout, onReverseComplete: function() {
		threeAnimate.timeline.seek(0, false);
	}});
	moveStyle.timeScroll.to({}, 0.1, {onComplete: function() {
		menu.changeMenu( "menu_state3" );  //切换到第二屏调用的函数，同时传入导航条背景颜色变化的名字
	}, onReverseComplete: function() {
		menu.changeMenu( "menu_state2" );
	}}, "-=0.2");

	moveStyle.timeScroll.to({}, 0.1, {onComplete: function() {
		threeAnimate.timeline.tweenTo("threeState1");
	}}, "-=0.2");
		moveStyle.timeScroll.add("step3");

	//主动画中配置第三屏的小动画start
	moveStyle.timeScroll.to( {}, 0, { onComplete: function() {
		threeAnimate.timeline.tweenTo("threeState2");
	}, onReverseComplete:function() {
		threeAnimate.timeline.tweenTo("threeState1");
	} } );
	moveStyle.timeScroll.to( {}, 0.4, {} );
	moveStyle.timeScroll.add("threeState");
	//主动画中配置第三屏的小动画end

	moveStyle.timeScroll.to(".scene4", 0.8, {top: 0, ease: Cubic.easeInout});
		moveStyle.timeScroll.add("step4");

	//滚动到第五屏的时候，要让第四屏滚出屏幕外
	moveStyle.timeScroll.to(".scene4", 0.8, {top: -$(window).height(), ease: Cubic.easeInout});

	//当可视区域大于90，就让导航条隐藏起来
	if( $(window).width() > 950 ) {
		moveStyle.timeScroll.to(".menu_wrapper", 0.8, {top: -110, ease: Cubic.easeInout}, "-=0.8");
	} else {
		$(".menu_wrapper").css("top", 0);
	}

	moveStyle.timeScroll.to(".scene5", 0.8, {top: 0, ease: Cubic.easeInout, onReverseComplete: function() {
		fiveAnimate.timeline.seek(0, false);
	}}, "-=0.8");

	moveStyle.timeScroll.to({}, 0.1, {onComplete: function() {
		fiveAnimate.timeline.tweenTo("fiveState");
	}}, "-=0.2");

		moveStyle.timeScroll.add("step5");

	moveStyle.timeScroll.to(".scene5", 0.5, {top: -$(".footer").height(), ease: Cubic.easeInout});
	moveStyle.timeScroll.to(".footer", 0.5, {top: $(window).height() - $(".footer").height(), ease: Cubic.easeInout}, "-=0.5");
	moveStyle.timeScroll.add("footer");

	moveStyle.timeScroll.stop();
	//档改变浏览器的大小时，让动画走到之前到达的时间点
	moveStyle.timeScroll.seek( time );

}

//配置导航条动画
moveStyle.configIntAniamte = function() {

	var initAnimate = new TimelineMax();
	initAnimate.to(".menu", 0.5, {opacity: 1});
	initAnimate.to(".menu", 0.5, {left: 22}, "-=0.3");
	initAnimate.to(".nav", 0.5, {opacity: 1});

	//设置首屏的动画
	initAnimate.to(".scene1_logo", 0.5, {opacity: 1});
	initAnimate.staggerTo(".scene1_1 img", 2, {opacity: 1, rotationX: 0, ease: Elastic.easyOut}, 0.2);
	initAnimate.to(".light_left", 0.7, {rotationZ: 0, ease: Cubic.easyOut}, "-=2");
	initAnimate.to(".light_right", 0.7, {rotationZ: 0, ease: Cubic.easyOut}, "-=2");
	initAnimate.to(".controls", 0.5, {bottom: 20, opacity: 1}, "-=0.7");
	initAnimate.to("body", 0, {"overflow-y": "scroll"});

}

//导航条的动画
moveStyle.nav = function() {
	var navAnimate = new TimelineMax();
	$(".nav a").bind("mouseenter", function() {
		var w = $(this).width();
		var l = $(this).offset().left;
		navAnimate.clear();
		navAnimate.to(".line", 0.4, {opacity:1,left: l,width: w});
	});

	$(".nav a").bind("mouseleave", function() {
		navAnimate.clear();
		navAnimate.to(".line", 0.4, {opacity: 0});
	});

	//鼠标移入language要显示dropdown
	var languageAnimate = new TimelineMax();
	$(".language").bind("mouseenter", function() {
		languageAnimate.clear();
		languageAnimate.to(".dropdown", 0.5, {opacity: 1, "display": "block"});
	});
	$(".language").bind("mouseleave", function() {
		languageAnimate.clear();
		languageAnimate.to(".dropdown", 0.5, {opacity: 0, "display": "none"});
	});

	//调出左侧的导航条
	$(".btn_mobile").click(function() {
		var m_animate = new TimelineMax();
		m_animate.to(".left_nav", 0.5, {left: 0});
	});

	$(".l_close").click(function() {
		var l_animate = new TimelineMax();
		l_animate.to(".left_nav", 0.5, {left: -300});
	});

}

//3D翻转效果
moveStyle.button3D = function(obj, elem1, elem2, duration) {

	var button3DAnimate = new TimelineMax();
	button3DAnimate.to( $(obj).find(elem1), 0, {rotationX: 0, transformPerspective: 600, transformOrigin: "center bottom"} );
	button3DAnimate.to( $(obj).find(elem2), 0, {rotationX: -90, transformPerspective: 600, transformOrigin: "center top"} );

	$(obj).bind("mouseenter", function() {
		var enterAnimate = new TimelineMax();
		var ele1 = $(this).find(elem1);
		var ele2 = $(this).find(elem2);
		enterAnimate.to(ele1, duration, {rotationX: 90, top: -ele1.height(), ease: Cubic.easyOut}, 0);
		enterAnimate.to(ele2, duration, {rotationX: 0, top: 0, ease: Cubic.easyOut}, 0);
	});
	$(obj).bind("mouseleave", function() {
		var leaveAnimate = new TimelineMax();
		var ele1 = $(this).find(elem1);
		var ele2 = $(this).find(elem2);
		leaveAnimate.to(ele1, duration, {rotationX: 0, top: 0, ease: Cubic.easyOut}, 0);
		leaveAnimate.to(ele2, duration, {rotationX: -90, top: ele1.height(), ease: Cubic.easyOut}, 0);
	});
}

//设置每一屏的高度和top值
moveStyle.resize = function() {

	$(".scene").height( $(window).height() );  //设置每一屏的height
	$(".scene:not(':first')").css( "top", $(window).height() );

	moveStyle.configTimeScroll();

	if( $(window).width() <= 780 ) {

		$(".wrapper").unbind();
		$(window).unbind("mousewheel");
		$(window).unbind("scroll");
		$(window).unbind("mousedown");
		$(window).unbind("mouseup");

		$("body").css("height", "auto");
		$("body").addClass("r780 r950").css("overflow-y", "scroll");

		$(".menu").css("top", 0);
		$(".menu").css("transform", "none");
		$(".menu_wrapper").css("top", 0);

		$(".menu").removeClass("menu_state2");
		$(".menu").removeClass("menu_state3");

	} else if ( $(window).width() <= 950 ) {
		$("body").css("height", 8500);
		$("body").removeClass("r780").addClass("r950");
		$(".menu").css("top", 0);
		$(".menu").css("transform", "none");
	} else {
		$("body").removeClass("r780 r950");
		$("body").css("height", 8500);
		$("body").removeClass("r950");
		$(".menu").css("top", 22);
		$(".left_nav").css("left", -300);
	}
}

//设置img的百分比
moveStyle.imgWidth = function(elemImg) {

	elemImg.each(function() {

		$(this).load(function() {
			width = $(this).width();
			$(this).css({ "width": "100%", "max-width": width, "height": "auto" });
		});

	});

}

//配置第二屏的动画
var twoAnimate = {};
twoAnimate.timeline = new TimelineMax();

//具体的第二屏的动画要实现的细节
twoAnimate.init = function() {

	twoAnimate.timeline.staggerTo( ".scene2_1 img", 1.5, {opacity: 1, rotationX: 0, ease: Elastic.easyOut}, 0.1 );

	twoAnimate.timeline.staggerTo( ".points", 0.2, {bottom: 20}, "-=1" );

	//初始第一个按钮
	twoAnimate.timeline.to( ".scene2 .point0 .text", 0.1, {opacity:1} );
	twoAnimate.timeline.to( ".scene2 .point0 .point_icon", 0, {"background-position": "right top"} );

		twoAnimate.timeline.add( "state1" );
	twoAnimate.timeline.staggerTo( ".scene2_1 img", 0.2, {opacity: 0, rotationX: 90}, 0 );
	twoAnimate.timeline.to(".scene2_2 .left", 0.4, {opacity:1});
	twoAnimate.timeline.staggerTo(".scene2_2 .right  img", 0.3, {opacity:1, rotationX: 0,  ease: Cubic.easeInout}, 0, "-=0.4");

	//第二个按钮

	twoAnimate.timeline.to( ".scene2 .point .text", 0, {opacity:0}, "-=0.4" );
	twoAnimate.timeline.to( ".scene2 .point1 .text", 0.1, {opacity:1}, "-=0.4" );
	twoAnimate.timeline.to( ".scene2 .point .point_icon", 0, {"background-position": "left top"}, "-=0.4" );
	twoAnimate.timeline.to( ".scene2 .point1 .point_icon", 0, {"background-position": "right top"}, "-=0.4" );

		twoAnimate.timeline.add( "state2" );

	twoAnimate.timeline.to(".scene2_2 .left", 0.4, {opacity:0});
	twoAnimate.timeline.staggerTo(".scene2_2 .right  img", 0.3, {opacity:0, rotationX: 90,  ease: Cubic.easeInout}, 0, "-=0.4");
	twoAnimate.timeline.to(".scene2_3 .left", 0.4, {opacity:1});
	twoAnimate.timeline.staggerTo(".scene2_3 .right  img", 0.3, {opacity:1, rotationX: 0,  ease: Cubic.easeInout}, 0, "-=0.4");

	//第三个按钮
	twoAnimate.timeline.to( ".scene2 .point .text", 0, {opacity:0}, "-=0.4" );
	twoAnimate.timeline.to( ".scene2 .point2 .text", 0.1, {opacity:1}, "-=0.4" );
	twoAnimate.timeline.to( ".scene2 .point .point_icon", 0, {"background-position": "left top"}, "-=0.4" );
	twoAnimate.timeline.to( ".scene2 .point2 .point_icon", 0, {"background-position": "right top"}, "-=0.4" );

		twoAnimate.timeline.add( "state3" );

	twoAnimate.timeline.to(".scene2_3 .left", 0.4, {opacity:0});
	twoAnimate.timeline.staggerTo(".scene2_3 .right  img", 0.3, {opacity:0, rotationX: 90,  ease: Cubic.easeInout}, 0, "-=0.4");
	twoAnimate.timeline.to(".scene2_4 .left", 0.4, {opacity:1});
	twoAnimate.timeline.staggerTo(".scene2_4 .right  img", 0.3, {opacity:1, rotationX: 0,  ease: Cubic.easeInout}, 0, "-=0.4");

	//第四个按钮
	twoAnimate.timeline.to( ".scene2 .point .text", 0, {opacity:0}, "-=0.4" );
	twoAnimate.timeline.to( ".scene2 .point3 .text", 0.1, {opacity:1}, "-=0.4" );
	twoAnimate.timeline.to( ".scene2 .point .point_icon", 0, {"background-position": "left top"}, "-=0.4" );
	twoAnimate.timeline.to( ".scene2 .point3 .point_icon", 0, {"background-position": "right top"}, "-=0.4" );

		twoAnimate.timeline.add( "state4" );

	twoAnimate.timeline.stop();

}

//具体的第三屏的动画要实现的细节
var threeAnimate = {};
threeAnimate.timeline = new TimelineMax();
threeAnimate.init = function() {

	//把第三屏里面的图片都翻转-90度
	threeAnimate.timeline.to(".scene3 .step img", 0, {rotationX: -90, opacity: 0, transformPerspective: 600, transformOrigin: "center center"});
	threeAnimate.timeline.staggerTo(".step3_1 img", 0.2, {opacity: 1, rotationX: 0, ease: Cubic.easeInout}, 0.1);
	threeAnimate.timeline.add( "threeState1" );

	threeAnimate.timeline.to(".step3_1 img", 0.3, {opacity: 0, rotationX: -90, ease: Cubic.easeInout});
	threeAnimate.timeline.to(".step3_2 img", 0.3, {opacity: 1, rotationX: 0, ease: Cubic.easeInout});
	threeAnimate.timeline.add( "threeState2" );
	threeAnimate.timeline.stop();
}


//具体的第五屏的动画要实现的细节
var fiveAnimate = {};
fiveAnimate.timeline = new TimelineMax();
fiveAnimate.init = function() {

	//把所有图片和button翻转-90度,透明度变为0，scene5_img 的初始top变为-220px
	fiveAnimate.timeline.to(".scene5 .area_content img, .scene5 .button1, .scene5 .button2", 0, {rotationX: -90, transformPerspective: 600, transformOrigin: "center center"});
	fiveAnimate.timeline.to(".scene5 .scene5_img", 0, {top: -220});

	fiveAnimate.timeline.to(".scene5 .scene5_img", 0.5, {top: 0, ease: Cubic.easeInout});
	fiveAnimate.timeline.staggerTo(".scene5 .button1, .scene5 .button2, .scene5 .area_content img",1.2, {opacity: 1, rotationX: 0, ease: Cubic.easeInout}, 0.2 );
	fiveAnimate.timeline.to(".scene5 .lines", 0.5, {opacity: 1});
	fiveAnimate.timeline.add( "fiveState" );

	fiveAnimate.timeline.stop();
}


//实现导航条3D翻转动画
var menu = {};

//每滚动一屏，就调用这个函数，函数里面是3D翻转的具体实现细节
menu.changeMenu = function( stateClass ) {  //参数的作用：切换到某一屏的时候要传入的class名称

	//具体实现3D翻转效果
	var oldMenu = $(".menu");
	var newMenu = oldMenu.clone();
	$(".menu_wrapper").append( newMenu );
	newMenu.removeClass("menu_state1").removeClass("menu_state2").removeClass("menu_state3");
	newMenu.addClass(stateClass);

	oldMenu.addClass("removeClass");
	moveStyle.nav();
	moveStyle.button3D(".start", ".state1", ".state2", 0.3 );

	var menuAnimate = new TimelineMax();
	//如果可视区域大于950，才让导航条有一个3D翻转过程
	if( $(window).width() > 950 ) {

		menuAnimate.to(newMenu, 0, {top: 100, rotationX: -90, transformPerspective: 600, transformOrigin: "top center"});
		menuAnimate.to( oldMenu, 0, {rotationX: 0, top: 22, transformPerspective: 600, transformOrigin: "center bottom"} );

		menuAnimate.to( oldMenu, 0.3, { rotationX: 90, top:-55, ease: Cubic.easeInout, onComplete: function() {
			$(".removeClass").remove();
		} } );

		menuAnimate.to( newMenu, 0.3, {rotationX: 0, top: 22, ease:Cubic.easeInout }, "-=0.3" );

	}
}
