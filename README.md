Make items sticky as you scroll, to a point. ([See Demo](http://davist11.github.com/jQuery-Stickem/))

## Usage

<pre>&lt;div class="container">
	&lt;div class="row stickem-container">
		&lt;div class="content">
			Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		&lt;/div>
		
		&lt;div class="aside stickem">
		  I'm gonna be sticky!
		&lt;/div>
	&lt;/div>
&lt;/div></pre>

<pre>.stickem-container {
  position: relative;
}

.stickit {
	margin-left: 660px;
	position: fixed;
	top: 0;
}

.stickit-end {
	bottom: 40px;
	position: absolute;
	right: 0;
}</pre>

<pre>$('.container').stickem();</pre>

### Defaults

**item: '.stickem'**<br>
Items that you want to stick on scroll.

**container: '.stickem-container'**<br>
Container that you want the sticky item to be contained in.

**stickClass: 'stickit'**<br>
Class added to the sticky item once it should start being sticky.

**endStickClass: 'stickit-end'**<br>
Class added to the sticky item once it has reached the end of the container

**offset: 0**<br>
Do you already have a fixed horizontal header on the page? Offset stick 'em by that many pixels.

**start: 0**<br>
If your sticky item isn't at the top of the container, tell it where it should start being sticky.

**onStick: null**<br>
You can create a callback function that fires when an item gets "stuck". The item gets passed back.

**onUnstick: null**<br>
You can create a callback function that fires when an item gets "un-stuck". The item gets passed back.

### Destroying

If you have a bunch of stuff that happens after your page has loaded (e.g. AJAX requests) that changes the height of your containers and page, and you need to "destroy" stick 'em, do it like this:

<pre>var sticky = $('.container').stickem();
sticky.destroy();</pre>

Then you can re-instantiate again if you need to.