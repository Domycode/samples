var procedure_operations_arr;


(function ($) {



  function setCookie(name, value, props) {
	props = props || {}
	var exp = props.expires
	if (typeof exp == "number" && exp) {
  	var d = new Date()
  	d.setTime(d.getTime() + exp * 1000)
  	exp = props.expires = d
	}
	if (exp && exp.toUTCString) {
  	props.expires = exp.toUTCString()
	}

	value = encodeURIComponent(value)
	var updatedCookie = name + "=" + value
	for (var propName in props) {
  	updatedCookie += "; " + propName
  	var propValue = props[propName]
  	if (propValue !== true) {
    	updatedCookie += "=" + propValue
  	}
	}
	document.cookie = updatedCookie
  }




  function change_savings_blocks(block_id, page) {

	var pp = procedure_operations_arr[block_id]

	var price = pp.price,
  	gdPrice = pp.gd_price;

	if (page == 'profile') {

  	var retailPrice = $("#retail-price"),
    	discountPrice = $("#discount-price"),
    	retailPriceHright = $('#retail-price').height(),
    	discountPriceHeight = (((( gdPrice * 100 ) / price ) / 100 ) * retailPriceHright ).toFixed(0),
    	savePercent = (( 100 - (( gdPrice * 100) / price ))).toFixed(0);

  	if (discountPriceHeight < 40) {
    	discountPriceHeight = 40
  	}
  	;
  	if (discountPriceHeight > 120) {
    	discountPriceHeight = 120
  	}
  	;

  	discountPrice.animate({height: discountPriceHeight}, 1000);
  	retailPrice.find(".price").html('$' + price);
  	discountPrice.find(".price").html('$' + gdPrice);
  	$("#discounts-block .save-percent").html('save up to ' + savePercent + '%');

	} else {
  	$('.save-block .percent .price-amount').html('up to ' + ( 100 - ((gdPrice * 100) / price)).toFixed(0));
  	$('.save-block .godental-price .price-amount').html(gdPrice);
	}

  }

  $.expr[':'].icontains = function (obj, index, meta, stack) {
	return (obj.textContent || obj.innerText || jQuery(obj).text() || '').toLowerCase().indexOf(meta[3].toLowerCase()) >= 0;
  };


  function hregister_do_upload(field) {
	$('.image-widget-data .form-submit').trigger('mousedown');
  }

  function select_simulation(option) {
	//  select simulation for css style

	$(document).click(function () {
  	$('.drop').hide();
  	$('.slct').removeClass('active');
	});

	$('.slct').click(function () {
  	var dropBlock = $(this).parent().find('.drop');

  	if (dropBlock.is(':hidden')) {
    	dropBlock.slideDown();

    	$(this).addClass('active');

  	} else {
    	$(this).removeClass('active');
    	dropBlock.hide();
  	}

  	return false;
	});
	$('.drop').find('li').click(function () {

  	var selectResult = $(this).html();
  	var resultId = $(this).find('.procedure_id').html();

  	$(this).parent().parent().find('input').val(selectResult);

  	if ($(this).parent().hasClass('profile-savings')) {

    	change_savings_blocks(resultId, 'profile')
  	}
  	if ($(this).parent().hasClass('state-savings')) {

    	if (option) {
      	$(this).parent().parent().find('input').val(resultId);
      	var path = '' + window.location;
      	path = path.split('#');
      	path = path[0].split('?');
      	document.location.href = path[0] + '?fancybox=reload&state=' + resultId;

    	} else {
      	$(this).parent().parent().find('input').val(resultId);
      	window.location = '/content/savings/?state=' + resultId

    	}


  	} else {
    	var cookiVal = $(this).find('.procedure_id').html();
    	setCookie('cookiVal', cookiVal, { expires: 3600 });

    	change_savings_blocks(resultId, 'search')
  	}

  	$('.slct').removeClass('active').html(selectResult);

	});
  }



  $(document).ready(function () {

	select_simulation();

//  (/user/"id"/membership) Cancel membership
	if ($('.membership-page').length > 0) {
  	$('#membership-cancel').click(function () {
    	var answer = confirm('Do you really want to cancel your membership?');
    	if (answer) {
      	var currentLocation = window.location;
      	window.location = currentLocation + '/cancel';
    	} else {
      	return false;
    	}
  	});
	}
//  end (/user/"id"/membership) Cancel membership

//  see all savings fancybox reload
	var urlParams;
	(window.onpopstate = function () {
  	var match,
    	pl = /\+/g, // Regex for replacing addition symbol with a space
    	search = /([^&=]+)=?([^&]*)/g,
    	decode = function (s) {
      	return decodeURIComponent(s.replace(pl, " "));
    	},
    	query = window.location.search.substring(1);

  	urlParams = {};
  	while (match = search.exec(query))
    	urlParams[decode(match[1])] = decode(match[2]);
	})();
	if (urlParams["fancybox"] == 'reload') {
  	$('#all-savings').fancybox({
    	'href': '/ajax-actions/custom-functions/savings?state=' + urlParams["state"],
    	'autoDimensions': false,
    	'width': 1098,
    	'height': '90%',
    	'padding': 0,
   	 'overlayColor': '#000',
    	'centerOnScroll': true,
    	'onComplete': function () {
      	$('body').css('overflow', 'hidden');
      	select_simulation(1);
    	},
    	'onClosed': function () {
      	$('body').css('overflow', 'auto');
      	select_simulation();

    	}

  	}).click();
	}
//  end see all savings fancybox reload

//    	console.log($().jquery);


//  upload button hover effect

	$('#edit-profile-dentist-field-photos-und-3-upload').mouseenter(function () {
  	$(this).prev().attr("style", " background-position: bottom center;");
	});
	$('#edit-profile-dentist-field-photos-und-3-upload').mouseleave(function () {
  	$(this).prev().attr("style", " background-position: top center;");
	});

//  fancybox ajax

	$('#all-savings, .all-savings, #terms-use-link, #privacy-link, #provider-agreement-link, .privacy-link, .terms-use-link, #terms-use-link').fancybox({
  	'autoDimensions': false,
  	'width': 1098,
  	'height': '90%',
 	'padding': 0,
      'overlayColor': '#000',
  	'centerOnScroll': true,
  	'onComplete': function () {
    	$('body').css('overflow', 'hidden')
    	select_simulation(1);
  	},
  	'onClosed': function () {
    	$('body').css('overflow', 'auto');
    	select_simulation();
  	}

	});

//  fancybox gallery

//	$('.page-search .profile-photos a').hover(function () {
//  	var uid = $(this).attr('rel')
//
//  	$("a[rel=" + uid + "]").fancybox({
//    	'transitionIn':'none',
//    	'transitionOut':'none',
//    	'titlePosition':'over'
//  	});
//
//	});


	$("a[rel=example_group]").fancybox({
  	'transitionIn': 'none',
  	'transitionOut': 'none',
  	'titlePosition': 'over'
	});


//  main-area -> (/users/"id") #discounts-block  manipulation of the price

	if ($('#discounts-block').length != 0) {

  	var price = $('#discounts-block #retail-price .price').html().substr(1),
    	gdPrice = $('#discounts-block #discount-price .price').html().substr(1),
    	retailPriceHright = $('#retail-price').height(),
    	discountPrice = $("#discount-price"),
    	discountPriceHeight = (((( gdPrice * 100 ) / price ) / 100 ) * retailPriceHright ).toFixed(0);

  	if (discountPriceHeight < 40) {
    	discountPriceHeight = 40
  	}
  	;
  	if (discountPriceHeight > 120) {
    	discountPriceHeight = 120
  	}
  	;

  	discountPrice.height(discountPriceHeight);
	}
	;

//  end main-area -> (/users/"id") #discounts-block  manipulation of the price

//  select simulation for hover effect

	if ($(".page-search")) {

  	$("#savings-box li").addClass('select-li-bg');

  	$("#savings-box li").mouseenter(function () {
    	$(this).prev().removeClass('select-li-bg');
  	})
  	$("#savings-box li").mouseleave(function () {
    	$(this).prev().addClass('select-li-bg');
  	})
	}

//  form validation

	jQuery("#user-profile-form").validationEngine();

//  quick links tabs

	if ($(".page-node-7").length > 0) {

  	var hash = window.location.hash.substring(1),
    	tab_cont = $('.tab-container'),
    	first_tab = $(".you-dentist"),
    	first_link = $("#block-menu-menu-quick-links-menu .content a").eq(1);

  	$('#block-menu-menu-quick-links-menu a').removeClass('active');

  	if (hash == '') {
    	tab_cont.hide();
    	first_tab.show();
    	first_link.addClass("active");

  	} else {
    	tab_cont.each(function () {

      	if ($(this).hasClass(hash)) {
        	$(this).show();
      	} else {
        	$(this).hide();
      	}
    	});

    	$('#block-menu-menu-quick-links-menu a[href*="#' + hash + '"]').addClass('active');
  	}

  	$('#block-menu-menu-quick-links-menu a, #node-7 #contact-us-link, #node-7 .contact-us-link').click(function () {
    	var hash = $(this).attr('href').substring($(this).attr('href').indexOf("#") + 1);
    	$('.tab-container').hide();
    	$('.' + hash).show();


    	$('#block-menu-menu-quick-links-menu a').removeClass('active');
    	$('#block-menu-menu-quick-links-menu a[href*="#' + hash + '"]').addClass('active');

  	})

	}
	;


//  page-user-register description popup

	if ($('.description').length != 0) {
  	$('body').append('<div id="description-block" style="display:none"><div class="desc-border"><div class="desc-center"></div></div></div>');

  	$(document).click(function (e) {
    	if (!$(e.target).hasClass("help-icon")) {
      	$('#description-block').hide();
    	} else {

      	var desc = $(e.target).next().html();
      	var desc_popup = $('#description-block');
      	var pos = $(e.target).offset();

      	desc_popup.find('.desc-center').html(desc);
      	desc_popup.css({"position": "absolute", "top": (pos.top + $(e.target).outerHeight(true) / 2 - desc_popup.outerHeight(true) / 2 ) + 'px', "left": (pos.left + $(e.target).outerWidth(true) ) + 'px', "z-index": "100"});
      	desc_popup.show();

    	}
  	})

	}

	var countDesc = $(".form-wrapper .description");

	countDesc.each(function () {
  	$(this).prev().after("<span class='help-icon' style='display: inline-block;'></span>");
	})


//  front page search form effect

	$("#main-area #hfinder-form-find-dentist .form-text").focusin(function () {
  	$("#main-area #hfinder-form-find-dentist label").hide();
	});
	$("#main-area #hfinder-form-find-dentist .form-text").focusout(function () {

  	if (!$("#main-area #hfinder-form-find-dentist .form-text").val()) {
    	$("#main-area #hfinder-form-find-dentist label").show();
  	}

	});
	if ($("#main-area #hfinder-form-find-dentist .form-text").val()) {
  	$("#main-area #hfinder-form-find-dentist label").hide();
	}

//  select-plan page details popup

//    	var individualListPopup = $("#individual-list-popup"),
//        	familyListPopup = $("#family-list-popup");
//
//    	$("#individual-details").click(
//        	function () {
//            	individualListPopup.slideToggle();
//        	}
//    	);
//    	$("#family-details").click(
//        	function () {
//            	familyListPopup.slideToggle();
//        	}
//    	);

//  password change popup

	var request_change = $("#pass-request-link"),
  	pass_confirm_block = $(".form-type-password-confirm");

	pass_confirm_block.hide();
	request_change.click(
  	function () {
    	pass_confirm_block.slideToggle();
  	}
	);

//  practice-info popup
	var desc = $('.practice-info .desc');

	if (desc.length > 0) {

  	var number_lines = 4, // number of lines in <div class="desc">
    	speed_animate = 500;
  	container_height = desc.css('line-height').slice(0, -2) * number_lines;

  	desc.each(function (i, elem) {
    	if ($(this).height() >= container_height) {
      	$(this).height(container_height).css({'overflow': 'hidden', 'margin-bottom': '0'}).parent().append('<div class="read-more-container"><span class="blue read-more">read more</span></div>');
    	}
  	});

  	var read_more_link = $('.practice-info .read-more');

  	read_more_link.click(function () {
    	var desc = $(this).parent().parent().find(".desc");
    	desc.animate({height: desc[0].scrollHeight}, speed_animate);
    	$(this).parent().css('overflow', 'hidden').animate({height: 0}, speed_animate);
    	return false;
  	});

	}
//  end practice-info popup

//  autocomplete disabled search button
	$('#edit-postcode').ajaxStart(function () {
  	$(this).closest('.form-item-postcode').next().after('<div id="hide-search"></div><div id="throbber-img"></div>');
  	$('#hfinder-form-find-dentist').submit(function () {
    	return false;
  	});
	});
	$('#edit-postcode').ajaxStop(function () {
  	$('#hide-search, #throbber-img').remove();
  	$('#hfinder-form-find-dentist').unbind();
	});
//  end autocomplete disabled search button


	if ($('body').hasClass('dentist-profile')) {
  	initialize_profile_map();
	}


  });




  function initialize_profile_map() {

	//var address = $('#user-profile-page').find('.practice-address').html().replace("\n", " ").replace("  ", " ").replace("<br>", " ");
	var address = $('#user-profile-page').find('.practice-address').text();
	//var title = $('#user-profile-page').find('.practice-name').html();
	var title = $('#user-profile-page .practice-name').text();

   // console.log(address);
   // console.log(title);

	geocoder = new google.maps.Geocoder();

	var mapOptions = {
  	mapTypeId: google.maps.MapTypeId.ROADMAP,
  	panControl: true,
  	zoomControl: true,
  	mapTypeControl: false,
  	scaleControl: false,
  	streetViewControl: false,
  	tileSize: new google.maps.Size(500, 500),
  	overviewMapControl: false,
  	zoom: 16
	};


	bounds = new google.maps.LatLngBounds();
	if(($("#map-container").length > 0)){
    	map = new google.maps.Map(document.getElementById('map-container'),
      	mapOptions);

    	geocoder.geocode({ 'address': address}, function (results, status) {

      	if (status == google.maps.GeocoderStatus.OK) {

        	var image = '/sites/all/themes/bootstrap/img/marker/marker_1.png';


        	var shadow = new google.maps.MarkerImage('/sites/all/themes/dentist/images/marker_shadow.png',
          	new google.maps.Size(42.0, 40.0),
          	new google.maps.Point(0, 0),
          	new google.maps.Point(13.0, 40.0)
        	);

        	bounds.extend(results[0].geometry.location);
        	var marker = new google.maps.Marker({
          	map: map,
          	icon: image,
          	shadow: shadow,
          	animation: google.maps.Animation.DROP,
          	title: title,

          	position: results[0].geometry.location
        	});
        	map.setCenter(results[0].geometry.location);

      	}

    	})

	}
  }
})
  (jQuery);
