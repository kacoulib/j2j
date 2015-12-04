(function(ctx)
{
	var css = function (s,a,b)
	{
		console.log(s,a,b);
		var txt = '', name, s, val,
			// selector = ctx.getSelector('this.selector'),
			browser  = ctx.getBrowserInfo();

		// define the black lists
		this.blackList = function (selector,a)
		{
			var b = {
				'display'			: selector.selector+'.style.currentStyle ? '+selector.selector+'.style.currentStyle.display : getComputedStyle('+selector.selector+', null).display;',
				'width'   			: selector.selector+'.offsetWidth',
				'height'   			: selector.selector+'.offsetHeight ',
				'color'   			: selector.selector+'.style.currentStyle ? '+selector.selector+'.style.currentStyle.color : getComputedStyle('+selector.selector+', null).color;',
				'backgroundColor'   : selector.selector+'.style.currentStyle ? '+selector.selector+'.style.currentStyle.display : getComputedStyle('+selector.selector+', null).backgroundColor;',
			};

			// prefix with browser prefix
			// ex animation => webkitAnimation
			var prefix   = ['animation','animationDelay','animationDirection','animationDuration','animationFillMode','animationIterationCount','animationName','animationPlayState','animationTimingFunction','border-image','columns','columnCount','columnGap','columnRule','columnRuleColor','columnRuleStyle','columnRuleWidth','columnSpan','columnWidth','flex-flow','flex-grow','flex-shrink','flex-wrap','justify-content','fontFeatureSettings','lineBreak',
						'textOrientation','boxDecorationBreak','flex','order'],
			cup = a.charAt(0).toUpperCase();
				
			if (prefix.indexOf(a) >= 0)
			{
				return (browser.name != 'noPrefix') ? '"'+a+' => "+'+selector.selector+'.'+browser.name+cup+a.substr(1)+'+" "+' : '+" '+a+' => "+'+selector.selector+'.'+a+'+" "+';
			};

			return false;
		};

		// if it's a function 
		// ex : selector.css('width','100px');

		if (typeof a == 'string')
		{
			a  = ctx.setDashUcfirst(a);
			val = b;
			txt = s+'.style.'+a+' = "'+val+'";';

			// if the second param is a function 
			// ex : selector.css('width',function(){});
			if (typeof b == 'function')
			{
				txt = selector.selector+'.style.'+a+' = "'+val()+'";';
			};

			// if it return the css value
			// ex: selector.css('width');
			if (typeof b == 'undefined')
			{
				selector = 'window.getComputedStyle('+selector+',null)';
				txt      = selector+'.'+a;

				if (this.blackList(selector,a))
				{
					txt = this.blackList(selector,a);
				}
			} 
		};

		// if it's an object 
		// ex : selector.css({'width':'100px'});
		var key,
			type;
		if (typeof a == 'object')
		{
			for (key in a)
			{
				val = a[key];

				if (key)
				{
					key = ctx.setDashUcfirst(key);
				};
		
				// if it's an array 
				// ex : selector.css(['width','height','opacity']);
				type = parseInt(key);
				console.log('txt = '+type);
				if (type >= 0)
				{
					txt += 'window.getComputedStyle('+selector.selector+',null)'+'.'+val+';';

				}
				else
				{
					// select the good quote
					// ex 'url('img.png')' => 'url("img.png")'
					txt += (val.indexOf('"') >= 0)? txt = selector.selector+".style."+key+" = '"+val+"';" : txt = selector.selector+".style."+key+' = "'+val+'";';
				}
			}
		};
		
		
		ctx.toString += txt + "\r";
		return this;
	};

	ctx.css = css;

})(app);