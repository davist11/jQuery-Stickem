/**
 * @name jQuery Stick 'em
 * @author Trevor Davis
 * @version 1.4
 *
 *	$('.container').stickem({
 *	 	item: '.stickem',
 *		container: '.stickem-container',
 *		stickClass: 'stickit',
 *		endStickClass: 'stickit-end',
 *		offset: 0,
 *		onStick: null,
 *		onUnstick: null
 *	});
 */

;(function($, window, document, undefined) {

	var Stickem = function(elem, options) {
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options;
		this.metadata = this.$elem.data("stickem-options");
		this.$win = $(window);
		this.lastPos = 0;
	};

	Stickem.prototype = {
		defaults: {
			item: '.stickem',
			container: '.stickem-container',
			stickClass: 'stickit',
			endStickClass: 'stickit-end',
			overflowStickClass: 'stickit-overflow',
			activeStickClass: 'stickit-active',
			offset: 0,
			start: 0,
			onStick: null,
			onUnstick: null,
			overflow: true,
			topProperty: 'top',
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
			
			_self.$win.on('scroll.stickem', $.proxy(_self.handleScroll, _self));
			_self.$win.on('resize.stickem', $.proxy(_self.handleResize, _self));
		},

		destroy: function() {
			var _self = this;

			_self.$win.off('scroll.stickem');
			_self.$win.off('resize.stickem');
		},

		getItem: function(index, element) {
			var _self = this;
			var $this = $(element);
			var item = {
				$elem: $this,
				elemHeight: $this.height(),
				$container: $this.parents(_self.config.container),
				isStuck: $this.hasClass(_self.config.stickClass)
			};

			//If the element is smaller than the window
			if(_self.config.overflow || _self.windowHeight > item.elemHeight) {
				item.overflowAmount = Math.max(0, item.elemHeight - _self.windowHeight);
				if (item.overflowAmount && item.isStuck) item.isOverflowing = 1;
				item.containerHeight = item.$container.outerHeight();
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

				item.containerInnerHeight = item.$container.height();
				item.containerStart = item.$container.offset().top - _self.config.offset + _self.config.start + item.containerInner.padding.top + item.containerInner.border.top;
				item.scrollFinish = item.containerStart - _self.config.start + (item.containerInnerHeight - item.elemHeight);

				//If the element is smaller than the container
				if(item.containerInnerHeight > item.elemHeight) {
					_self.items.push(item);
					item.$elem.addClass(_self.config.activeStickClass);
					return;
				}
			}
			item.$elem.removeClass(_self.config.stickClass + ' ' + _self.config.endStickClass 
				+ ' ' + _self.config.activeStickClass + ' ' + _self.config.overflowStickClass);
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

			if(_self.items.length > 0) {
				var pos = _self.$win.scrollTop();

				for(var i = 0, len = _self.items.length; i < len; i++) {
					var item = _self.items[i];

					//If it's stuck, and we need to unstick it
					if(item.isStuck && (pos < item.containerStart || pos > item.scrollFinish + item.overflowAmount
							|| (item.isOverflowing > 0 && pos >= _self.lastPos)
							|| (item.isOverflowing < 0 && pos <= _self.lastPos)
					)) {
						item.isOverflowing = 0;
						item.$elem.removeClass(_self.config.stickClass);
						// set current position as absolute
						if (_self.config.topProperty) {
							item.$elem.css(_self.config.topProperty, 
								Math.max(item.containerStart, Math.min(pos + parseInt(item.$elem.css('top'),10), item.scrollFinish)) 
									- item.$elem.offsetParent().offset().top + 'px'
							);
						}
						//only at the bottom
						if(pos > item.scrollFinish) {
							item.$elem.addClass(_self.config.endStickClass);
						} else if (pos > item.containerStart) {
							item.$elem.addClass(_self.config.overflowStickClass);
						}

						item.isStuck = false;

						//if supplied fire the onUnstick callback
						if(_self.config.onUnstick) {
							_self.config.onUnstick(item);
						}

					//If we need to stick it
					} else if(item.isStuck === false && pos > item.containerStart && pos < item.scrollFinish) {
						if (_self.config.topProperty) {
							if (item.overflowAmount) {
								var itemOffsetTop = item.$elem.offset().top;
								if (_self.lastPos < pos && itemOffsetTop + item.elemHeight < pos + _self.windowHeight) {
									item.$elem.css(_self.config.topProperty, (-item.overflowAmount) + 'px');
									item.isOverflowing = -1;
								} else if (_self.lastPos > pos && itemOffsetTop > pos) {
									item.$elem.css(_self.config.topProperty, '0px');
									item.isOverflowing = 1;
								} else if (itemOffsetTop > pos + _self.windowHeight || itemOffsetTop + item.elemHeight < pos) {
									item.$elem.css(_self.config.topProperty, '0px');
								// } else if (item.$elem.hasClass(_self.config.stickClass)) {
								// 	// we actually are not sticked...
								// 	item.isOverflowing = -1;
								} else {
									return;
								}
							} else {
								item.$elem.css(_self.config.topProperty, '0px');
							}
						}
						item.$elem.removeClass(_self.config.endStickClass + ' ' + _self.config.overflowStickClass)
							.addClass(_self.config.stickClass);
						item.isStuck = true;

						//if supplied fire the onStick callback
						if(_self.config.onStick) {
							_self.config.onStick(item);
						}
					}
				}
			}
			_self.lastPos = pos;
		},

		setWindowHeight: function() {
			var _self = this;

			_self.windowHeight = _self.$win.height() - _self.config.offset;
		}
	};

	Stickem.defaults = Stickem.prototype.defaults;

	$.fn.stickem = function(options) {
		//Create a destroy method so that you can kill it and call it again.
		this.destroy = function() {
			this.each(function() {
				new Stickem(this, options).destroy();
			});
		};

		return this.each(function() {
			new Stickem(this, options).init();
		});
	};

})(jQuery, window , document);