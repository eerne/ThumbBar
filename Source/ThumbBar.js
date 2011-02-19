/*
---
name: ThumbBar

description: Show, hide and scroll thumbnails with rpflorence/SlideShow

authors:
  - Enrique Erne (http://mild.ch/)

license:
  - MIT license

requires:
  - Core/Class
  - Core/Element.Event
  - Core/Element.Dimensions
  - Core/Fx.Tween

provides: [ThumbBar]
...
*/

var ThumbBar = new Class({
	
	Implements: [Options],
	
	options: {
		container: '> .inner',
		content: 'img',
		offset: 0,
		tween: {
			link: 'cancel',
			duration: 3500,
			transition: Fx.Transitions.Quart.easeOut
		}
	},
	
	initialize: function(element, options){
		this.element = document.id(element);
		this.setOptions(options);
		this.bound = {
			move: this.move.bind(this),
			over: this.over.bind(this),
			out: this.out.bind(this)
		};
		this.prepare();
	},
	
	hover: false,
	
	prepare: function(){
		this.width = this.element.getSize().x  - this.options.offset;
		
		this.content = this.element.getElements(this.options.content);
		this.container = this.element.getElement(this.options.container);
		if (this.container.getStyle('position') == 'static') this.container.setStyle('position', 'relative');
		this.container.set('tween', this.options.tween);
		
		var full = 0;
		this.content.getSize().map(function(item){
			full += item.x;
		});
		this.full = full;
		
		if (this.full > this.width) this.attach();
		else this.detach();
		return this;
	},
	
	attach: function(){
		this.element.addEvents({
			'mousemove': this.bound.move,
			'mouseenter': this.bound.over,
			'mouseleave': this.bound.out
		});
	},
	
	detach: function(){
		this.element.removeEvent('mousemove', this.bound.move);
		this.element.removeEvent('mouseenter', this.bound.over);
		this.element.removeEvent('mouseleave', this.bound.out);
	},
	
	getScrollX: function(){
		if (typeof(window.pageYOffset) == 'number'){
			return window.pageXOffset;
		} else if (document.body && (document.body.scrollLeft || document.body.scrollTop)){
			return document.body.scrollLeft;
		} else if( document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)){
			return document.documentElement.scrollLeft;
		} else return 0;
	},
	
	move: function(e){
		var m = e.client.x + this.offsetX,
			diff = this.full - this.width,
			left = -((m - this.pos) / this.width) * diff;
		
		if (Number.from(left)) this.container.setStyle('left', left);
		
	},
	
	over: function(){
		this.pos = this.element.getPosition().x;
		this.container.get('tween').cancel();
		this.offsetX = this.getScrollX() - this.options.offset;
		this.hover = true;
	},
	
	out: function(){
		this.container.tween('left', 0);
		this.hover = false;
	}
	
});
