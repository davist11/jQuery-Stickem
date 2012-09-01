/**
 * @name jQuery Stick 'em
 * @author Trevor Davis

$('div[role="main"]').imagesLoaded(function() {
	var $this = $(this);
	
	$this.find('.stickem').stickem({
		offset: 75
	});
});

 */
;(function($, window, document, undefined) {
	
	var Stickem = function(elem, options) {
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options;
		this.metadata = this.$elem.data( "stickem-options" );
		this.elemHeight = this.$elem.height();
		this.$win = $(window);
		this.isStuck = false;
		this.windowHeight = this.$win.height();
	};

	Stickem.prototype = {
		defaults: {
			container: '.stickem-container',
			offset: 0
		},

		init: function() {
			var _self = this;
			
			_self.config = $.extend( {}, _self.defaults, _self.options, _self.metadata );
			
			_self.windowHeight = _self.windowHeight - this.config.offset;


			//REMOVE ME
			_self.$container = _self.$elem.parents(_self.config.container);
			_self.$elem.css('background', 'green');
			_self.$container.css('background', 'red');


			//Only do it if the window is tall enough
			if(_self.windowHeight > _self.elemHeight) {
				_self.$container = _self.$elem.parents(_self.config.container);
				
				_self.containerInner = {
					border: parseInt(_self.$container.css('border-top'), 10),
					padding: parseInt(_self.$container.css('padding-top'), 10)
				};
				_self.containerHeight = _self.$container.height();
				_self.containerStart = _self.$container.offset().top - _self.config.offset + _self.containerInner.padding + _self.containerInner.border;
				_self.scrollFinish = _self.containerStart + (_self.containerHeight - _self.elemHeight);
				_self.difference = _self.scrollFinish - _self.containerStart + _self.containerInner.padding;

				console.log('start: ' + _self.containerStart)
				console.log('end: ' + _self.scrollFinish)
				console.log('container height: ' + _self.containerHeight)
				console.log('elemheight: ' + _self.elemHeight)
				console.log('amount: ' + (_self.scrollFinish - _self.containerStart))


				_self.$win.on('scroll', function(e) {
					var pos = _self.$win.scrollTop();

					//TODO: add check to see if the element is bigger than the parent
					//TODO: do something once you have reached the end (position absolute, top postition)


					console.log(pos)
					if(_self.isStuck) {
						//if we have reached the end, do something
						if(pos < _self.containerStart || pos > _self.scrollFinish) {
							_self.$elem.removeClass('stickit')
							
							//only at the bottom
							if(pos > _self.scrollFinish) {
								_self.$elem.addClass('stickit-end');
							}
							
							_self.isStuck = false;
						}
					} else {
						if(pos > _self.containerStart && pos < _self.scrollFinish) {
							_self.$elem.removeClass('stickit-end').addClass('stickit');
							_self.isStuck = true;
						}
					}
				});
				
			}
			
			return _self;
		}
	};

	Stickem.defaults = Stickem.prototype.defaults;

	$.fn.stickem = function(options) {
		return this.each(function() {
			new Stickem(this, options).init();
		});
	};

})(jQuery, window , document);