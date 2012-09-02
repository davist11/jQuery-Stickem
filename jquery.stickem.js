/**
 * @name jQuery Stick 'em
 * @author Trevor Davis

$('div[role="main"]').imagesLoaded(function() {
	var $this = $(this);

	$this.stickem({
		offset: 75
	});
});

 */
;(function($, window, document, undefined) {
	
	var Stickem = function(elem, options) {
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options;
		this.metadata = this.$elem.data("stickem-options");
		this.$win = $(window);
	};

	Stickem.prototype = {
		defaults: {
			stickClass: 'stickit',
			endStickClass: 'stickit-end',
			item: '.stickem',
			container: '.stickem-container',
			offset: 0
		},

		init: function() {
			var _self = this;
			
			//Merge options
			_self.config = $.extend({}, _self.defaults, _self.options, _self.metadata);
			
			_self.setWindowHeight();
			_self.getItems();
			_self.bindEvents();
			
			return _self;
		},
		
		bindEvents: function() {
			var _self = this;
			
			if(_self.items.length > 0) {
				_self.$win.on('scroll', $.proxy(_self.handleScroll, _self));
				
				_self.$win.on('resize', $.proxy(_self.handleResize, _self));
			}
		},
		
		getItem: function(index, element) {
			var _self = this;
			var $this = $(element);
			var item = {
				$elem: $this,
				elemHeight: $this.height(),
				$container: $this.parents(_self.config.container),
				isStuck: false
			};
			
			//If the element is smaller than the window
			if(_self.windowHeight > item.elemHeight) {
				item.containerHeight = item.$container.height();
				item.containerInner = {
					border: {
						bottom: parseInt(item.$container.css('border-bottom'), 10) || 0,
						top: parseInt(item.$container.css('border-top'), 10) || 0
					},
					padding: {
						bottom: parseInt(item.$container.css('padding-bottom'), 10) || 0,
						top: parseInt(item.$container.css('padding-top'), 10) || 0
					} 
				};
				
				item.containerInnerHeight = item.containerHeight - item.containerInner.border.bottom - item.containerInner.border.top - item.containerInner.padding.bottom - item.containerInner.border.top;
				item.containerStart = item.$container.offset().top - _self.config.offset + item.containerInner.padding.top + item.containerInner.border.top;
				item.scrollFinish = item.containerStart + (item.containerInnerHeight - item.elemHeight);
				
				//If the element is smaller than the container
				if(item.containerInnerHeight > item.elemHeight) {
					_self.items.push(item);
				}
			}
		},
		
		getItems: function() {
			var _self = this;
			
			_self.items = [];
			
			_self.$elem.find(_self.config.item).each($.proxy(_self.getItem, _self));
		},
		
		handleResize: function() {
			var _self = this;
			
			_self.getItems();
			_self.setWindowHeight();
		},
		
		handleScroll: function() {
			var _self = this;
			var pos = _self.$win.scrollTop();

			for(var i = 0, len = _self.items.length; i < len; i++) {
				var item = _self.items[i];
				
				//If it's stuck, and we need to unstick it
				if(item.isStuck && (pos < item.containerStart || pos > item.scrollFinish)) {
					item.$elem.removeClass(_self.config.stickClass);

					//only at the bottom
					if(pos > item.scrollFinish) {
						item.$elem.addClass(_self.config.endStickClass);
					}

					item.isStuck = false;
				
				//If we need to stick it
				} else if(item.isStuck === false && pos > item.containerStart && pos < item.scrollFinish) {
						item.$elem.removeClass(_self.config.endStickClass).addClass(_self.config.stickClass);
						item.isStuck = true;
				}
			}
		},
		
		setWindowHeight: function() {
			var _self = this;
			
			_self.windowHeight = _self.$win.height() - _self.config.offset;
		}
	};

	Stickem.defaults = Stickem.prototype.defaults;

	$.fn.stickem = function(options) {
		return this.each(function() {
			new Stickem(this, options).init();
		});
	};

})(jQuery, window , document);