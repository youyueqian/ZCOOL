//导航条初始化
(function($,arrowWidth){
	var $ul = $(".z-nav>ul");
	var boxWidth = $(".z-nav-box").width();
	if($ul.width() <= boxWidth){
		$(".z-nav").css({
			"width": "100%",
			"overflow-x": "hidden",
			"display": "flex",
			"justify-content": "center"
		});
		$(".z-arrow").css({
			"display":"none"
		});
	}else{
		var liWidth = $ul.width() / $ul.children().length;
		var num = Math.floor((boxWidth - arrowWidth) / liWidth);
		$(".z-nav").width(liWidth * num);
	}
})($,70);
// 导航条切换
(function(window,document,$){
	$(".z-arrow").on("click",function(){
		$(".z-nav-block").css({
			"display": "block"
		});
		$(".z-nav-box").css({
			"display": "none"
		});
	});
})(window,document,$);
// 轮播图模块
(function($,window,interval){
	// 初始化小圆点
	var imgBox = $(".z-imgs");
	var num = imgBox.children().length;
	var container = $("<ul></ul>");
	for(var i=0;i < num;i++){
		if(i == 0){
			container.append("<li class='current'></li>");
		}else{
			container.append("<li></li>");
		}	
	}
	$(".z-circle").append(container);
	// 克隆轮播图首图和尾图
	imgBox.append(imgBox.children().eq(0).clone().addClass("hidden"));
	imgBox.prepend(imgBox.children().eq(num-1).clone().addClass("hidden"));
	// 轮播图切换
	var index = 1,timer;
	timer = window.setInterval(function(){
		toggleImg();
	},interval);
	// 切换图片
	function toggleImg(dir="next"){
		imgBox.children().addClass("hidden");
		imgBox.children().eq(index).removeClass("hidden");
		if(dir == "next"){
			index++;
		}else{
			index--;
		}
		imgBox.children().eq(index).removeClass("hidden");
		if(index >= imgBox.children().length){
			index = 1;
			imgBox.children().addClass("hidden");
			imgBox.children().eq(1).removeClass("hidden");
			imgBox.children().eq(2).removeClass("hidden");
		}else if(index <= 0){
			index = imgBox.children().length-2;
			imgBox.children().addClass("hidden");
			imgBox.children().eq(index).removeClass("hidden");
			imgBox.children().eq(index+1).removeClass("hidden");
		}
		if(dir == "next"){
			imgBox.addClass("carousel-next");
		}else{
			imgBox.addClass("carousel-prev");
		}
		imgBox.on("animationend",function(){
			if(dir == "next"){
				imgBox.removeClass("carousel-next");
				imgBox.children().eq(index-1).addClass("hidden");
			}else{
				imgBox.removeClass("carousel-prev");
				imgBox.children().eq(index+1).addClass("hidden");
			}
			if(index == imgBox.children().length - 1){
				index = 1;
			}		
			toggleCircle(index);
		});
	}
	// 圆点切换
	function toggleCircle(index){
		$(".z-circle>ul").children().removeClass("current");
		if(index>=$(".z-circle>ul").children().length + 1){
			$(".z-circle>ul").children().eq(0).addClass("current");
		}else{
			$(".z-circle>ul").children().eq(index-1).addClass("current");
		}
	}
	// 切换事件
	var start,end;
	var distance = 20;
	$(".z-carousel")
		.on("touchstart",function(e){
			start = e.targetTouches[0].clientX;
			clearInterval(timer);
		})
		.on("touchmove",function(e){
			end = e.targetTouches[0].clientX;
		})
		.on("touchend",function(e){
			if(Math.abs(start - end) < 20){
				return;
			}
			if(start - end < 0){
				toggleImg("prev");
			}else if(start - end > 0){
				toggleImg("next");
			}
			timer = window.setInterval(function(){
				toggleImg();
			},3000);
		});
})($,window,5000);
// nav/tab栏初始化
(function($){
	$(".z-nav>ul").children().each(function(index,ele){
		var className = $(ele).children().eq(0).data("target");
		var $ul = $("<ul></ul>");
		$ul.addClass(className);
		if(index != 1){
			$ul.addClass("hidden");
		}
		$(".z-list").append($ul);
	});
	$(".z-nav-block").append($(".z-nav>ul").clone());
	var $arrow = $('<li class="arrow-up"><a class="up-arrow" href="javascript:;"><i class="icon-arrow-up"></a></li>');
	$arrow.on("click",function(){
		$(".z-nav-block").css({
			"display": "none"
		});
		$(".z-nav-box").css({
			"display": "flex"
		});
	});
	$(".z-nav-block>ul>li:eq(3)").before($arrow);
})($);
// 数据载入器
(function(window){
	// 数据载入器
	function DataLoader(options){
		this._init(options);
	}
	// 对象方法
	DataLoader.prototype = {
		_init: function(options){
			this.data = options.data;
			this.url = options.url || "https://index.api.youku.com/getData";
			this.callback = options.callback || "jsoncallback";
		},
		load: function(dataIntegrator,callback){
			var that = this;
			$.ajax({  
		        type : "get",  
		        async: false,  
		        url : that.url,  
		        dataType : "jsonp",//数据类型为jsonp
		        data: that.data,
		        jsonp: that.callback,//服务端用于接收callback调用的function名的参数  
		        success : function(data){  
		            dataIntegrator.init(data);
		            callback && callback();
		        },  
		        error:function(){  
		            alert('数据加载失败!请联系小编QQ：3232371958');
		        }  
    		});
		}
	}
   	//将对象原型全局化
   	window.DataLoader = DataLoader; 
})(window);
// 数据模板整合器
(function($,template){
	function DataIntegrator(options){
		this._init(options);
	}
	DataIntegrator.prototype = {
		_init: function(options){
			this.tpl = options.tpl;
			this.container = $(options.container);
			this.mode = options.mode || "a";
			this.dataNeed = options.dataNeed || null;
			this.prevFilter = options.prevFilter || null;
		},
		init: function(data){
			var data = this.dataNeed?data[this.dataNeed]:data;
			if(this.prevFilter){
				data = this.prevFilter.init(data);
			}
			var html = template(this.tpl,data);
			if(this.mode == "a"){
				this.container.append(html);
			}else if(this.mode == "n"){
				this.container.html(html);
			}
		}
	}
	// 对象原型全局化
	window.DataIntegrator = DataIntegrator;
})($,template);
// 优酷数据加载器
(function($,DataIntegrator,DataLoader){
	function DataUpdater(options){
		this._init(options);
	}
	DataUpdater.prototype = {
		_init: function(options){
			this.container = options.container;
			this.tpl = options.tpl;
			this.num = options.num || 700009;
			this.orderPro = options.orderPro || "vv";
			this.startindex = options.startindex || 1;
			this.endindex = options.endindex || 10;
			this.channelId = options.channelId;
			this.loading = false;
			this.dataNeed = "result";
		},
		init: function(callback){
			this.getData(this.startindex,this.endindex,"n",callback);
			$(this.container).attr("endindex",this.endindex);
		},
		add: function(callback,num=10){
			var container = $(this.container);
			var endindex = parseInt(container.attr("endindex"));
			this.getData(endindex + 1, endindex + num,"a",callback);
			container.attr("endindex",endindex+num);
		}, 
		getData: function(startindex,endindex,mode="n",callback){
			if(this.loading){
				return;
			}else{
				this.loading = true;
			}
			var dataIntegrator = new DataIntegrator({
				container: this.container,
				tpl: this.tpl,
				mode: mode,
				dataNeed: this.dataNeed
			});
			var dataLoader = new DataLoader({
					data: {
						num: this.num,
				        orderPro: this.orderPro,
				        startindex: startindex,
				        endindex: endindex,
				        channelId : this.channelId
					}
			});
			var that = this;
			dataLoader.load(dataIntegrator,function(){
				that.loading = false;
				callback&&callback();
			});
		}
	}
	window.DataUpdater = DataUpdater;
})($,DataIntegrator,DataLoader);
// 优酷数据初始化
(function(DataUpdater){
	var dataUpdater = new DataUpdater({
		container: ".z-list>ul:eq(1)",
		tpl: "movie_list",
		channelId: ""
	});
	dataUpdater.init();
})(DataUpdater);
// 加载更多数据模块
(function(window,document,$,DataUpdater){
	$(window).on("scroll",function(){
		if($(window).scrollTop() >=  $(document).height() - $(window).height()){
			if($(".z-play").hasClass("hidden")){
				// 数据更新
				var $currentNav = $(".z-nav li.current a");
				var className = $currentNav.data("target");
				var channelId = $currentNav.data("id");
				var $currentList = $(".z-list>ul."+className);
				if($currentList.attr("loading")){
					return;
				}else{
					$currentList.attr("loading",true);
				}
				var dataUpdater = new DataUpdater({
					container: ".z-list>ul."+className,
					tpl: "movie_list",
					channelId: channelId
				});
				$currentList.append("<div class='list-loading'><img src='images/loading.gif'/>乐酷舞蹈QQ：3232371958</div>");
				dataUpdater.add(function(){
					$currentList.children(".list-loading").remove();
					$currentList.removeAttr("loading");
				}); 
			}else{
				// 加载评论
				var commentLoader = new CommentLoader({
					container: ".z-comment",
					tpl: "comment_list"
				});
				commentLoader.load();
			}
		}
	});
})(window,document,$,DataUpdater);
// tab栏切换事件响应
(function($,DataUpdater){
	$(".z-nav>ul").on("click","a:not(.play)",function(){
		toggleLoad.call(this);
	});
	$(".z-nav-block>ul").on("click","a:not(.up-arrow,.play)",function(){
		toggleLoad.call(this);
	});
	function toggleLoad(){
		$(".z-list>ul").addClass("hidden");
		var className = $(this).data("target");
		$currentUl = $(".z-list>ul."+className);
		$currentUl.removeClass("hidden");
		if(!$currentUl.children().length){
			var dataUpdater = new DataUpdater({
				container: ".z-list>ul."+className,
				tpl: "movie_list"
			});
			var num = $(this).data("num");
			if(num){
				dataUpdater.num = $(this).data("num");
			}
			dataUpdater.channelId = $(this).data("id");
			$(".z-list>ul."+className).append("<div class='list-loading'><img src='images/loading.gif'/>乐酷舞蹈QQ：3232371958</div>");
			dataUpdater.init(function(){
				$currentUl.children(".list-loading").remove();
				$currentUl.removeAttr("loading");
			});
		}
		$(".z-tab .play").parent().removeClass("current");
		$(".z-play").addClass("hidden");
		$(".z-show").removeClass("hidden");
		$("[data-target="+className+"]").parent().parent().children().removeClass("current");
		$("[data-target="+className+"]").parent().addClass("current");
	}
})($,DataUpdater);
// 搜索热词数据加载器
// (function($,DataIntegrator,DataLoader){
// 	function HotWordLoader(options){
// 		this._init(options);
// 	}

// 	HotWordLoader.prototype = {
// 		_init: function(options){
// 			this.url = options.url || "https://tip.soku.com/searches/soku/kubox/v4/by_keyword.json";
// 			this.site = options.site || 62;
// 			this.callback = "jsoncallback";
// 			this.container = options.container || ".z-hot>ul";
// 			this.tpl = options.tpl || "hot_word";
// 		},
// 		load: function(){
// 			var dataLoader = new DataLoader({
// 				url: this.url,
// 				data:{	
// 					site: this.site
// 				},
// 				callback: this.callback
// 			});
// 			var dataIntegrator = new DataIntegrator({
// 				container: this.container,
// 				tpl: this.tpl,
// 			});
// 			dataLoader.load(dataIntegrator);
// 		}
// 	}

// 	window.HotWordLoader = HotWordLoader;
// })($,DataIntegrator,DataLoader);
// 搜索框得到焦点响应事件
// (function($,HotWordLoader){
// 	$("#search").on("focus",function(){
// 		$(".z-hot").show();
// 			if(!$(".z-hot>ul").children().length){
// 			var hotWordLoader = new HotWordLoader({
// 				container: ".z-hot>ul"
// 			});
// 			hotWordLoader.load();
// 		}
// 	});
// 	$(".close").on("click",function(){
// 		$(".z-hot").hide();
// 	})
// })($,HotWordLoader);
// 搜索数据前过滤器
(function(){
	function SearchPrevFilter(){
		this.tip = "没有相关结果！";
	}

	SearchPrevFilter.prototype = {
		init : function(data){
			if(!data){
				return {res:this.tip};
			}else {
				if(data.s[0].hi){
					return {res:data.s[0]};
				}else{
					return {res:this.tip};
				}
			}
		}
	}

	window.SearchPrevFilter = SearchPrevFilter;
})();
// 搜索数据加载器
(function($,DataIntegrator,DataLoader,SearchPrevFilter){
	function Searcher(options){
		this._init(options);
	} 

	Searcher.prototype = {
		_init: function(options){
			this.url = options.url || "https://tip.soku.com/searches/soku/kubox/v4/by_keyword.json";
			this.container = options.container;
			this.tpl = options.tpl;
			this.mode = options.mode || "n";
		},
		find: function(word,callback){
			var dataLoader = new DataLoader({
				url: this.url,
				data:{
					query: word,
					site: 51
				}
			});
			var dataIntegrator = new DataIntegrator({
				container: this.container,
				tpl: this.tpl,
				mode: this.mode,
				prevFilter: new SearchPrevFilter()
			});
			dataLoader.load(dataIntegrator,callback);
		}
	}

	window.Searcher = Searcher;
})($,DataIntegrator,DataLoader,SearchPrevFilter);
// 搜索框数据变化相应事件
(function($,Searcher){
	$("#search").on("input",function(){
		var word = $(this).val();
		var searcher = new Searcher({
			container: ".z-search-data ul",
			tpl: "search_data"
		});
		searcher.find(word,function(){
			$(".z-search-data").show();
			$(".z-search-data .close").on("click",function(){
				$(this).parent().html("");
			});
		});
	});
})($,Searcher);
// 搜索框失去焦点相应事件
(function($){
	$("#search").on("blur",function(){
		if($(".z-search-data .tip").length){
			$(".z-search-data").hide();
		}
	});
})($);
// 模态框初始化阻止滚动页面
(function($,eWidth){	
	$(".z-modal").on("touchmove",function(e){
		var flag = false;
		for(var i=0;i<e.originalEvent.path.length;i++){
			if(e.originalEvent.path[i] == $(".modal-list").get(0)){
				flag = true;
				break;
			}
		}
		if(!flag){
			e.preventDefault();
		}
	});
	var $modalWidth = $(window).width();
	var eNum = Math.floor($modalWidth / eWidth);
	var eMargin  = ($modalWidth - eNum * eWidth) / (2 * eNum);
	$(".modal-episodes li").css({
		margin: eMargin
	});
})($,50);
// 显示初始化模态框内部,阻止事件冒泡
(function($,window){
	var startOffsetTop;
	$(".z-episodes-choice").on("click",function(){
		var $modal = $(".z-modal");
		var $playBox = $(".z-play-box");
		var playBoxHeight = $playBox.height();
		var playBoxOffsetTop = $playBox.offset().top;
		$(".modal-content").height($(window).height() - playBoxHeight - playBoxOffsetTop);
		$(".modal-list").height($(".modal-content").height() - $(".modal-content-header").height());
		$modal.toggleClass("hidden");
		startOffsetTop = $(".modal-episodes").offset().top;
	});
	var currentY;
	$(".modal-episodes,.modal-abstract").on("touchmove",function(e){
		var offsetTop = $(this).offset().top;
		var nowY = e.touches[0].clientY;
		if(startOffsetTop - offsetTop >= $(this).height() - $(this).parent().height() && nowY < currentY){
			e.preventDefault();
		}
		currentY = e.touches[0].clientY;
	}).on("touchstart",function(e){
		currentY = e.touches[0].clientY;
	});
})($,window);
// 模态框关闭按钮事件响应
(function($){
	$(".model-close").on("click",function(){
		$(".z-modal").addClass("hidden");
	});
})($);
// 模态框内容切换
(function($){
	$(".z-modal .choice,.z-modal .abstract").on("click",function(){
		$(this).toggleClass("selected");
		$(this).siblings().toggleClass("selected");
		$("."+$(this).data("target")).removeClass("hidden");
		$("."+$(this).data("target")).siblings().addClass("hidden");
	});
})($);
// 视频数据加载器
(function($,setTimeout){
	function Player(options){
		this._init(options);
	}

	Player.prototype = {
		_init: function(options){
			this.dom = $(options.dom || ".z-video");
			this.playerBox = $(options.playerBox ||".z-play-box");
			this.prevAd = options.prevAd || $("#video_prevAd").html();
			this.prevAdInterval = options.prevAdInterval || 5000;
			this.api = options.api || "https://tv-123.cn/webcloud/mgtv.php?url=";
			this.vLinkHost = options.vLinkHost || "v.youku.com";
		},
		init: function initPlayer(src){
			// 初始化播放器尺寸
			this.playerBox.height(this.playerBox.width()* 9/16);
			// 清除原有的广告
			$(".z-video-ad").remove();
			// 设置播放前广告
			if(this.prevAd.indexOf("<") == 0){
				this.prevAd = $(this.prevAd);
				this.playerBox.append(this.prevAd);
			}else{
				this.prevAd = $(this.prevAd);
			}
			// 加载视频
			this.dom.attr("src",this.api + this.formatSrc(src));
			// 加载广告
			this.dom.on("load",function(){
				setTimeout(function(){
					this.prevAd.remove();
				}.bind(this),this.prevAdInterval);
			}.bind(this));
		},
		formatSrc: function (src) {
			if(src.indexOf("http://") == -1 && src.indexOf("https://") == -1){
				return "http://" + src.substr(src.indexOf(this.vLinkHost));
			}else{
				return src;
			}
		},
		setUserAgent: function(){

		}
	}

	window.Player = Player;
})($,setTimeout);
// 视频数据列表加载器
(function ($,DataLoader) {
	function VideoListLoader(options){
		this._init(options);
	}

	VideoListLoader.prototype = {
		sid: null,
		setSid: function(sid){
			VideoListLoader.prototype.sid = sid;
		},
		_init: function(options){
			this.url = options && options.url || "https://list.youku.com/show/module";
			this.tab = options && options.tab || "showInfo";
			this.callback = "callback";
			this.container = options && options.container || ".z-episodes-list";
		},
		load: function(sid,stage){
			var dataIntegrator = {
				init: function(data){
					$(this.container).html("");
					$(this.container).html(data.html);
					$(".z-abstract").html("");
					$(".p-drama-list").appendTo($(".z-abstract"));
				}.bind(this)
			};
			var dataLoader = new DataLoader({
				url: this.url,
				callback: this.callback,
				data: {
					tab: this.tab,
					id: sid,
					stage: stage?stage:""
				}
			});
			dataLoader.load(dataIntegrator);
			if(!stage){
				this.setSid(sid);
			}
		},

	}
	window.VideoListLoader = VideoListLoader;
})($,DataLoader);
// 评论数据加载器
(function(DataLoader,DataIntegrator){
	function CommentLoader(options){
		this._init(options);
	}

	CommentLoader.prototype = {
		_init: function(options){
			this.url = options && options.url || "https://p.comments.youku.com/ycp/comment/pc/commentList";
			this.app = "700-cJpvjG4g";
			this.objectId = "XMTM3OTE1NzMzNg==";
			this.objectType = 1;
			this.listType = 0;
			this.pageSize = options && options.pageSize || 30;
			this.sign = "1e1bbfb5e0bbe8fbb38866a7fbfa359d";
			this.time = "1536461093";
			this.tpl = options && options.tpl || "";
			this.container = options && options.container || "";
		},
		load: function(objectId,mode = "a"){
			if(objectId){
				CommentLoader.prototype.objectId = this.getObjectId(objectId);
				CommentLoader.prototype.currentPage = 1;
				var mode = "n";
			}
			var dataIntegrator = new DataIntegrator({
				tpl: this.tpl,
				container: this.container,
				mode: mode
			});
			var dataLoader = new DataLoader({
				url: this.url,
				data: {
					app: this.app,
					objectId: CommentLoader.prototype.objectId,
					objectType: 1,
					listType: 0,
					currentPage: CommentLoader.prototype.currentPage++,
					pageSize: this.pageSize,
					sign: this.sign,
					time: this.time
				}
			});
			dataLoader.load(dataIntegrator);
		},
		getObjectId: function(objectId){
			var regExp = /id_(.+)\.html/gi;
			var res;
			if(res = regExp.exec(objectId)){
				return res[1];
			}else{
				return objectId;
			}
		}
	}

	window.CommentLoader = CommentLoader;
})(DataLoader,DataIntegrator);
// 委托事件显示载入数据到播放区块
(function($){
	$(".z-list,.z-search-data,.z-imgs").on("click","a",function(e){
		var vlink = $(this).data("vlink");
		var sid = $(this).data("sid");
		var player = new Player({});
		$(".z-show").addClass("hidden");
		$(".z-play").removeClass("hidden");
		$(".z-tab li").removeClass("current");
		$(".z-tab .play").parent().addClass("current");
		player.init(vlink);//初始化播放器
		var className = $(this).data("target");
		// 导航栏切换到乐酷
		$("[data-target="+className+"]").parent().parent().children().removeClass("current");
		$("[data-target="+className+"]").parent().addClass("current");
		// 页面滚动顶部
		$(window).scrollTop(0);
		// 加载集数列表
		var videoListLoader = new VideoListLoader();
		videoListLoader.load(sid);
		// 加载评论
		var commentLoader = new CommentLoader({
			container: ".z-comment",
			tpl: "comment_list"
		});
		commentLoader.load(vlink);
	});

	$(".z-search-data").on("click","a",function(){
		$(".z-search-data ul").html("");
	});
})($);
// 选集区块事件响应
(function($){
	// 载入选集列表区块
	$(".z-episodes-list").on("click","li",function(){
		var stage = $(this).data("id");
		if(!stage){
			return;
		}
		// var id = $(this).data("id");
		var videoListLoader = new VideoListLoader({
			url: "https://list.youku.com/show/episode",
			container: ".p-panels"
		});
		var sid = videoListLoader.sid;
		videoListLoader.load(sid,stage);
	});
	// 选集播放
	$(".z-episodes-list,.z-abstract").on("click","a",function(e){
		e.preventDefault();
		var vlink = this.href;
		var player = new Player({});
		player.init(vlink);//初始化播放器
		// 加载评论
		var commentLoader = new CommentLoader({
			container: ".z-comment",
			tpl: "comment_list"
		});
		commentLoader.load(vlink);
	});
})($);
// 乐酷播放tab响应事件
(function($){
	$(".z-nav-box .play").on("click",function(){
		if(!$(".z-play iframe").attr("src")){
			return;
		}
		$(".z-play").removeClass("hidden");
		$(".z-show").addClass("hidden");
		$(".z-nav li").removeClass("current");
		$(".z-nav-block li").removeClass("current");
		$(".z-nav li").eq(0).addClass("current");
		$(".z-nav-block li").children("li").eq(0).addClass("current");
	});
})($);
