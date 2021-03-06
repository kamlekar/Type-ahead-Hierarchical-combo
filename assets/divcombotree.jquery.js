/**
  * This is a Type-ahead Hierarchical combo tree component
  * @author Venkateshwar
  */
var DivComboTree = function(elem, suggestions, values) {
	var code = {up: 38, down: 40,enter: 13},
		$elem = $(elem);

		values = values || {},
		values.container = values.container || "comboTree",
		values.suggestionsContainer = values.suggestionsContainer || "suggestionsContainer",
		values.hoveredElement = values.hoveredElement || "active",
		values.collapseArrow = values.collapseArrow || "collapseArrow",
		values.expandArrow = values.expandArrow || "expandArrow",
		values.listClass = values.listClass || "selectable",
		values.noChild = "noChild",
		dot = ".",
		suggestionsContainerClass = dot + values.suggestionsContainer;

	$elem.addClass(values.container);

	var textBox = document.createElement('input');
	textBox.setAttribute('type', 'text');
	renderSuggestions(elem, suggestions, textBox);

	// <--  Hide section -->
	//events
	// This section is to make sure that when the user clicks on outside of the suggestions box
	// The suggestion box will hide.
	document.onclick = function(){
		hideSuggestions(true);
	}
	$elem.click(function(e){
		e.stopPropagation();
	});
	// <-- End of Hide section -->

	/**
	 * It is used to show or hide the child items. 'excludeChildren' flag is used to show or hide the child items
	 * @constructor
	 * @param {object} e - represents the event or jquery element object.
	 */
	function toggleChildItems(e){
		var el = $(e.currentTarget);

		if(el.hasClass(values.collapseArrow)){
			collapseItems(el);
		}
		else if(el.hasClass(values.expandArrow)){
			expandItems(el);
		}
		$elem.find('input').focus();
	}

	/**
	 * It is used to hide the child items Makes the flag, 'excludeChildren' true. To hide the child items and then renders the new list again
	 * @constructor
	 * @param: {object} el - Holds the clicked parent list item
	 */
	function collapseItems(el){
		var refId = el.parent().data('id');
		for(var i = 0; i< suggestions.length; i++){
			var p = suggestions[i];
			if(refId === p.id){
				p.excludeChildren = true;
			}
		}
		renderSuggestions(elem, suggestions);
	}

	/**
	 * It is used to show the child items Makes the flag, 'excludeChildren' false. To show the child items and then renders the new list again
	 * @param {object} el - Holds the clicked parent list item
	 */
	function expandItems(el){
		var refId = el.parent().data('id');
		var blnAccess = false;
		for(var i = 0; i< suggestions.length; i++){
			var p = suggestions[i];
			if(refId === p.id){
				blnAccess = true;
				p.excludeChildren = false;
			}
		}
		if(blnAccess){
			renderSuggestions(elem, suggestions);
		}
	}

	/**
	 * Inserts the clicked list item's data in to the textbox. Here the code checks whether the clicked list item is parent item or parent item with no children or child item.
	 * @constructor
	 * @param {object} e - could be the event or the jquery dom element object itself.
	 */
	function insertData(e){
		var el = $(e.currentTarget || e);
		var text = $elem.find('input');
		if(el[0].tagName.toLowerCase() === "span"){
			text.val(el.html());
		}
		else if(el[0].tagName.toLowerCase() === "div"){
			text.val(el.children().eq(1).html());
		}
		else{
			text.val(el.parents('li').children('div').children('span').eq(1).html() + ":" + el.html());
		}
		hideSuggestions();
	}

	/**
	 * Shows the suggestions
	 * @constructor
	 * @param {object} e - event
	 */
	function showSuggestions(e){
		if($elem.find(suggestionsContainerClass).css('display') !== 'none'){
			return;
		}
		if(e){
			filterSuggestions($(e.currentTarget));
		}
		$elem.find(suggestionsContainerClass).show();
	}
	/**
	 * Hides the suggestions
	 * @constructor
	 * @param {boolean} dontFocus - This will be true if the textbox shouldn't be focussed.
	 */
	function hideSuggestions(dontFocus){
		$elem.find(suggestionsContainerClass).hide();
		if(!dontFocus){
			focusInputTextBox();
		}
	}

	/*
	 * Focuses the textBox
	 * @constructor
	 */
	function focusInputTextBox(){
		$elem.find('input').focus();
	}

	/**
	 * Triggers whenever user presses a keyboard key.
	 * <br><b>Code explanation:</b> Handles keys to navigate the items up or down and 
	 * when pressed 'Enter', the selected item will be added to the textbox.
	 * @constructor
	 * @param {object} e - represents key pressed event.
	 */
	function keyOperations(e){
		var keyCode = e.keyCode || e.which;
		var el = $(e.currentTarget);
		// 'UP' Key pressed
		if(code.up == keyCode){
			var active = $elem.find(dot + values.hoveredElement);

			if(active.length){

				var selectables = $elem.find(dot + values.listClass);

				for(var i = 0; i < selectables.length; i++){
					var s = selectables.eq(i);
					if(s[0] === active[0]){
						var k = i - 1;
						if(k >= 0 && k < selectables.length){
							selectables.eq(k).addClass(values.hoveredElement);
						}
						else{
							selectables.eq(selectables.length-1).addClass(values.hoveredElement);
						}
						active.removeClass(values.hoveredElement);
					}
				}
			}
			else{
				$elem.find(dot + values.listClass).last().addClass(values.hoveredElement);
			}
		}
		// 'DOWN' key pressed
		else if(code.down === keyCode){
			var active = $elem.find(dot + values.hoveredElement);

			if(active.length){

				var selectables = $elem.find(dot + values.listClass);

				for(var i = 0; i < selectables.length; i++){
					var s = selectables.eq(i);
					if(s[0] === active[0]){
						var k = i + 1;
						if(k >= selectables.length){
							selectables.eq(0).addClass(values.hoveredElement);
						}
						else{
							selectables.eq(k).addClass(values.hoveredElement);
						}
						active.removeClass(values.hoveredElement);
					}
				}
			}
			else{
				$elem.find(dot + values.listClass).first().addClass(values.hoveredElement);
			}
		}
		// 'ENTER' Key pressed
		else if(code.enter === keyCode){
			var $active = $elem.find(dot + values.listClass + dot + values.hoveredElement);
			if($active.length && $active.is(':visible')){
				insertData($active);
			}
			else{
				showSuggestions();
			}
		}
		// For other key pressed, just filter the suggestions.
		else{
			filterSuggestions(el);
		}
	}

	/*
	 * Styles the hovered item (parent or child).
	 * @constructor
	 * @param: 'e' represents the Mouse hovered event
	 */
	function makeActive(e){
		var el = $(e.currentTarget);
		$elem.find(dot + values.hoveredElement).removeClass(values.hoveredElement);
		el.addClass(values.hoveredElement);
	}

	/**
	 * Filters the suggestions based on the entered text in textbox.
	 * <br><b>Code explanation:</b> 'query' represents textbox value (with no colon)
	 * 'queryString' represents parent item textbox value (before colon)
	 * 'subQuery' represents child item's textbox value (after colon)
	 * @constructor
	 * @param {object} el - represent jquery dom element object.
	 */
	function filterSuggestions(el){
		showSuggestions();
		var query = el.val();
		var queryString = "";

		if(query.indexOf(":") > -1){
			subQuery = query.substring(query.indexOf(":",0)+1, query.length);
			queryString = query.substring(0, query.indexOf(":",0));
		}
		else{
			subQuery = "";
		}

		for(var i = 0; i< suggestions.length; i++){
			var p = suggestions[i];
			if(p.name === queryString){
				p.excludeParent = false;
				p.excludeChildren = false;
				var f = p.children;
				for(var j=0;j<f.length;j++){
					var feature = f[j];
					if(feature.name.indexOf(subQuery) > -1){
						feature.excludeChild = false;
					}
					else{
						feature.excludeChild = true;
					}
				}	
			}
			else if(p.name.indexOf(query) < 0){
				p.excludeParent = true;
			}
			else{
				p.excludeParent = false;
				p.excludeChildren = true;
				var f = p.children;
				if(f){
					for(var j=0;j<f.length;j++){
						var feature = f[j];
						feature.excludeChild = false;
					}	
				}			
			}
		}
		renderSuggestions(elem, suggestions);
	}

	/**
	 * Renders the suggestions dynamically when user shows/hides the child items
	 * or when user press any key (by focussing on input textbox).
	 * 'list' represents the object data holding all parent items and child items with initialized flags:
	 * 'excludeParent', 'excludeChildren' and 'excludeChild' flags.
	 * @constructor
	 * @param {object} el - represents the element in which the suggestions are to be rendered.
	 */
	function renderSuggestions(el, list, textBox){
		if(list.length){
			var ul = document.createElement('ul');

			for(var i=0; i< list.length; i++){
				var projectHeadingWrapper = document.createElement('div');
				var spanArrow = document.createElement('span');
				var spanProjectName = document.createElement('span');

				projectHeadingWrapper.appendChild(spanArrow);
				projectHeadingWrapper.appendChild(spanProjectName);

				projectHeadingWrapper.className = values.listClass;

				var li = document.createElement('li');
				li.appendChild(projectHeadingWrapper);

				//active
				projectHeadingWrapper.onmouseover = makeActive;

				var project = list[i];
				var features = project.children;
				if(project.children){
					if(project.excludeChildren === false){
						spanArrow.className = values.collapseArrow;
					}
					else{
						spanArrow.className = values.expandArrow;
					}
					//event
					spanArrow.onclick = toggleChildItems;					
				}
				else{
					spanArrow.className = values.noChild;
				}
				if(!project.excludeParent){
					spanProjectName.innerHTML = project.name;
					projectHeadingWrapper.setAttribute('data-id', project.id);

					spanProjectName.onclick = insertData;

					li.name = project.id;
					if(features && features.length && project.excludeChildren === false){
						var subUl = document.createElement('ul');
						var features = features;
						for(var j=0;j<features.length; j++){
							var feature = features[j];
							if(!feature.excludeChild){
								var subLi = document.createElement('li');
								subLi.innerHTML = feature.name;
								subUl.appendChild(subLi);

								//event
								subLi.onclick = insertData;
								subLi.onmouseover = makeActive;

								subLi.className = values.listClass;
							}
						}
						li.appendChild(subUl);
					}
					ul.appendChild(li);
				}
			}
			// if textBox variable is present, then it means that the rendering is happening for the first time.
			if(textBox){
				// Making sure nothing is present in the using container.
				el.innerHTML = "";
				el.appendChild(textBox);

				//event
				textBox.onclick = showSuggestions;
				textBox.onkeyup = keyOperations;

				var suggestionsContainer = document.createElement('div');
				suggestionsContainer.className = values.suggestionsContainer;
			}
			else{
				// keep the textbox
				var suggestionsContainer = $(el).children(suggestionsContainerClass)[0];
				suggestionsContainer.innerHTML = "";
			}
			suggestionsContainer.appendChild(ul);
			el.appendChild(suggestionsContainer);
		}	
	}
}
