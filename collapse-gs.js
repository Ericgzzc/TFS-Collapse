// ==UserScript==
// @name     Collapse items in TFS
// @version  1
// @include	http://*/changeset/*
// @require	https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant 	GM_addStyle
// @run-at	document-idle
// ==/UserScript==

	(function(win) {
	    'use strict';
	    
	    var listeners = [], 
	    doc = win.document, 
	    MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
	    observer;
	    
	    function ready(selector, fn) {
	        // Store the selector and callback to be monitored
	        listeners.push({
	            selector: selector,
	            fn: fn
	        });
	        if (!observer) {
	            // Watch for changes in the document
	            observer = new MutationObserver(check);
	            observer.observe(doc.documentElement, {
	                childList: true,
	                subtree: true
	            });
	        }
	        // Check if the element is currently in the DOM
	        check();
	    }
	        
	    function check() {
	        // Check the DOM for elements matching a stored selector
	        for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
	            listener = listeners[i];
	            // Query for elements matching the specified selector
	            elements = doc.querySelectorAll(listener.selector);
	            for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
	                element = elements[j];
	                // Make sure the callback isn't invoked with the 
	                // same element more than once
	                if (!element.ready) {
	                    element.ready = true;
	                    // Invoke the callback with the element
	                    listener.fn.call(element, element);
	                }
	            }
	        }
	    }

	    // Expose `ready`
	    win.ready = ready;
            
	})(this);

	function onclickHeader() {
			$header = $(this);
	    $content = $header.next();
	    $content.toggle("slow");
	}


$(document).ready(function() {
  
  waitForKeyElements ("#vss_87", addButtons);

  function addButtons (element) {
    var ul = element;
    var lidown = ul.find('li:last').clone();
    var liup = ul.find('li:last').clone();
    var spandown = lidown.find('span:first');
    spandown.attr('class', 'menu-item-icon bowtie-icon bowtie-chevron-down-light');
    var spanup = liup.find('span:first');
    spanup.attr('class', 'menu-item-icon bowtie-icon bowtie-chevron-up-light');
    lidown.attr('id', 'collap_down');
    liup.attr('id', 'collap_up');
    liup.prependTo(ul);
    lidown.prependTo(ul);
    
    $('#collap_down').click(function(){
      $('.item-details').hide();
    });

    $('#collap_up').click(function(){
      $('.item-details').show();
    });
    
  }
  
	ready('.item-details', function(element) {
		var elprev = element.previousSibling;
		$header = $(elprev);
		if($header.hasClass("file-row"))
		{
			elprev.onclick = onclickHeader;
		}
	});
  
});