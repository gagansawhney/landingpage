////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// jQuery
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var resizeId;

$(document).ready(function($) {
    "use strict";

    var lastScrollTop = 0;
    var $nav = $(".navbar.fixed-top");
    // Initialize hero layout on load
    $(function(){
        heroHeight();
    });
    
    $(window).on("scroll", function(){
        var st = $(this).scrollTop();
        if (st > lastScrollTop && st > 50) {
            $nav.addClass("navbar-hidden");
        } else {
            $nav.removeClass("navbar-hidden");
        }
        lastScrollTop = st;
    });

//  "img" into "background-image" transfer

    $("[data-background-image]").each(function() {
        $(this).css("background-image", "url("+ $(this).attr("data-background-image") +")" );
    });

    $(".background--image, .img-into-bg").each(function() {
        $(this).css("background-image", "url("+ $(this).find("img").attr("src") +")" );
    });

//  Custom background color

    $("[data-background-color]").each(function() {
        $(this).css("background-color", $(this).attr("data-background-color")  );
    });

//  Parallax Background Image

    $("[data-parallax='scroll']").each(function() {
        var speed = $(this).attr("data-parallax-speed");
        var $this = $(this);
        var isVisible;
        var backgroundPosition;

        $this.isInViewport(function(status) {
            if (status === "entered") {
                isVisible = 1;
                var position;

                $(window).scroll(function () {
                    if( isVisible === 1 ){
                        position = $(window).scrollTop() - $this.offset().top;
                        backgroundPosition = (100 - (Math.abs((-$(window).height()) - position) / ($(window).height()+$this.height()))*100);
                        //$this.find(".parallax-element").css("background-position-y", (backgroundPosition/2) + "%");
                        if( $this.find(".parallax-element").hasClass("background--image") ){
                            $this.find(".background--image.parallax-element").css("background-position-y", (position/speed) + "px");
                        }
                        else {
                            $this.find(".parallax-element").css("transform", "translateY(" +(position/speed)+ "px)");
                        }
                    }
                });
            }
            if (status === "leaved"){
                isVisible = 0;
            }
        });
    });

    $(".background--particles").particleground({
        density: 15000,
        lineWidth: 0.1,
        dotColor: "#eeeeee",
        parallax: false,
        proximity: 200
    });

    var $owlCarousel = $(".owl-carousel").not('.modal__carousel');

    if( $owlCarousel.length ){
        $owlCarousel.each(function() {

            var items = parseInt( $(this).attr("data-owl-items"), 10);
            if( !items ) items = 1;

            var nav = parseInt( $(this).attr("data-owl-nav"), 2);
            if( !nav ) nav = 0;

            var dots = parseInt( $(this).attr("data-owl-dots"), 2);
            if( !dots ) dots = 0;

            var center = parseInt( $(this).attr("data-owl-center"), 2);
            if( !center ) center = 0;

            var loop = parseInt( $(this).attr("data-owl-loop"), 2);
            if( !loop ) loop = 0;

            var margin = parseInt( $(this).attr("data-owl-margin"), 2);
            if( !margin ) margin = 0;

            var autoWidth = parseInt( $(this).attr("data-owl-auto-width"), 2);
            if( !autoWidth ) autoWidth = 0;

            var navContainer = $(this).attr("data-owl-nav-container");
            if( !navContainer ) navContainer = 0;

            var autoplay = $(this).attr("data-owl-autoplay");
            if( !autoplay ) autoplay = 0;

            var fadeOut = $(this).attr("data-owl-fadeout");
            if( !fadeOut ) fadeOut = 0;
            else fadeOut = "fadeOut";

            if( $("body").hasClass("rtl") ) var rtl = true;
            else rtl = false;

            if( items === 1 ){
                $(this).owlCarousel({
                    navContainer: navContainer,
                    animateOut: fadeOut,
                    autoplaySpeed: 2000,
                    autoplay: autoplay,
                    center: center,
                    loop: loop,
                    margin: margin,
                    autoWidth: autoWidth,
                    items: 1,
                    nav: nav,
                    dots: dots,
                    autoHeight: true,
                    rtl: rtl,
                    navText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>']
                });
            }
            else {
                $(this).owlCarousel({
                    navContainer: navContainer,
                    animateOut: fadeOut,
                    autoplaySpeed: 2000,
                    autoplay: autoplay,
                    autoheight: items,
                    center: center,
                    loop: loop,
                    margin: margin,
                    autoWidth: autoWidth,
                    items: 1,
                    nav: nav,
                    dots: dots,
                    autoHeight: true,
                    rtl: rtl,
                    navText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>'],
                    responsive: {
                        1199: {
                            items: items
                        },
                        992: {
                            items: 3
                        },
                        768: {
                            items: 2
                        },
                        0: {
                            items: 1
                        }
                    }
                });
            }

            if( $(this).find(".owl-item").length === 1 ){
                $(this).find(".owl-nav").css( { "opacity": 0,"pointer-events": "none"} );
            }

        });
    }

    $(".popup-image").magnificPopup({
        type:'image',
        fixedContentPos: false,
        gallery: { enabled:true },
        removalDelay: 300,
        mainClass: 'mfp-fade',
        callbacks: {
            open: function() {
                $(".page-wrapper, .navbar-nav").css("margin-right", getScrollBarWidth());
            },
            close: function() {
                $(".page-wrapper, .navbar-nav").css("margin-right", 0);
            }
        }
    });

    //  Scroll Reveal

    if ( $(window).width() > 768 && $("[data-scroll-reveal]").length ) {
        window.scrollReveal = new scrollReveal();
    }

    heroHeight();

});

$(window).on("resize", function(){
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 250);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Do after resize

function doneResizing(){
    heroHeight();
}

// Set Hero height

function heroHeight(){
    var $nav = $(".navbar.fixed-top");
    var navHeight = $nav.outerHeight() || 0; // use full height to ensure image fully visible on load
    $("#hero").css({
        marginTop: navHeight + "px",
        height: "100vh"
    });
}

// Google Map

function simpleMap(latitude, longitude, markerImage, mapTheme, mapElement, markerDrag){
    if (!markerDrag){
        markerDrag = false;
    }
    if ( mapTheme === "light" ){
        var mapStyles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]}];
    }
    else if ( mapTheme === "dark" ){
        mapStyles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
    }
    var mapCenter = new google.maps.LatLng(latitude,longitude);
    var mapOptions = {
        zoom: 13,
        center: mapCenter,
        disableDefaultUI: false,
        scrollwheel: false,
        styles: mapStyles
    };
    var element = document.getElementById(mapElement);
    var map = new google.maps.Map(element, mapOptions);
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude,longitude),
        map: map,
        icon: markerImage,
        draggable: markerDrag
    });

    // autoComplete(map, marker); // Commented out to debug ReferenceError

}

// Smooth Scroll

$('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
        if (
            location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '')
            &&
            location.hostname === this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function() {
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) {
                        return false;
                    } else {
                        $target.attr('tabindex','-1');
                        $target.focus();
                    }
                });
            }
        }
    });

function getScrollBarWidth () {
    var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
        widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
    $outer.remove();
    return 100 - widthWithScroll;
}

// Defer-load modal gallery slides on first open (responsive, folder-based with explicit filenames)
$('#modal-feature').off('show.bs.modal').on('show.bs.modal', function (ev) {
	var $modal = $(this);
	var trigger = $(ev.relatedTarget);
	var initialKey = trigger && trigger.attr('data-gallery') || 'villa1';

	// Villa meta content
	var meta = {
		villa1: {
			title: 'Villa Verde Luna',
			subtitle: 'Your Private Oasis of Luxury',
			builtUp: '2,781 Sq Ft',
			descriptionHtml: [
				'<p>Villa Verde Luna offers 4 bedrooms, 5 bathrooms, and spacious living and dining areas crafted with luxury fittings and a modular kitchen. With a private splash pool, wooden deck, and exclusive entrance, this villa is a haven for those who value elegance and solitude. Enjoy the finest in luxurious living with every modern comfort.</p>',
				'<ul class="mt-2">',
				'  <li><strong>Built Up Area:</strong> 2,781 Sq Ft</li>',
				'  <li>4 Bedrooms, 5 Bathrooms</li>',
				'  <li>Spacious Living & Dining, Modular Kitchen</li>',
				'  <li>Private splash pool with wooden deck</li>',
				'  <li>Exclusive entrance; designed for privacy</li>',
				'</ul>'
			].join(''),
			otherVillas: [
				{ label: 'Villa Verde Sol', key: 'villa2' },
				{ label: 'Villa Verde Brisa', key: 'villa3' },
				{ label: 'Villa Verde Mar', key: 'villa4' }
			]
		},
		villa2: {
			title: 'Villa Verde Sol',
			subtitle: 'Luxury Living with a Natural Twist',
			builtUp: '3,031 Sq Ft',
			descriptionHtml: [
				'<p>Experience Villa Verde Sol, a 4-bedroom, 5-bathroom sanctuary that combines luxurious interiors with nature. Featuring a lap pool, outdoor bar, and shower with forest views, this villa is perfect for relaxation and entertainment alike. With spacious living, dining, and modern kitchen spaces, Villa Verde Sol offers a blend of style and serenity.</p>',
				'<ul class="mt-2">',
				'  <li><strong>Built Up Area:</strong> 3,031 Sq Ft</li>',
				'  <li>4 Bedrooms, 5 Bathrooms</li>',
				'  <li>Lap pool, outdoor bar, shower with forest views</li>',
				'</ul>'
			].join(''),
			otherVillas: [
				{ label: 'Villa Verde Luna', key: 'villa1' },
				{ label: 'Villa Verde Brisa', key: 'villa3' },
				{ label: 'Villa Verde Mar', key: 'villa4' }
			]
		},
		villa3: {
			title: 'Villa Verde Brisa',
			subtitle: 'An Escape of Pure Indulgence',
			builtUp: '3,035 Sq Ft',
			descriptionHtml: [
				'<p>Villa Verde Brisa is an elegant 4-bedroom, 5-bathroom villa, complete with a large living area, modular kitchen, and high-end fittings. With a lap pool, poolside Jacuzzi, lush garden, and serene forest views, this villa invites you to unwind in luxury and peace.</p>',
				'<ul class="mt-2">',
				'  <li><strong>Built Up Area:</strong> 3,035 Sq Ft</li>',
				'  <li>Lap pool, poolside Jacuzzi, lush garden</li>',
				'</ul>'
			].join(''),
			otherVillas: [
				{ label: 'Villa Verde Luna', key: 'villa1' },
				{ label: 'Villa Verde Sol', key: 'villa2' },
				{ label: 'Villa Verde Mar', key: 'villa4' }
			]
		},
		villa4: {
			title: 'Villa Verde Mar',
			subtitle: 'Elegance with Coastal Charm',
			builtUp: '2,829 Sq Ft',
			descriptionHtml: [
				'<p>Villa Verde Mar captures coastal elegance with its 4 bedrooms, 5 bathrooms, and expansive living spaces. Enjoy the lap pool, wooden deck, and a beautifully landscaped garden, perfect for outdoor relaxation. Crafted with luxury finishes and a modern kitchen, Villa Verde Mar is where sophistication meets comfort.</p>',
				'<ul class="mt-2">',
				'  <li><strong>Built Up Area:</strong> 2,829 Sq Ft</li>',
				'  <li>Lap pool with wooden deck, landscaped garden</li>',
				'</ul>'
			].join(''),
			otherVillas: [
				{ label: 'Villa Verde Luna', key: 'villa1' },
				{ label: 'Villa Verde Sol', key: 'villa2' },
				{ label: 'Villa Verde Brisa', key: 'villa3' }
			]
		}
	};

	var galleries = {
		villa1: [
			{ normal: 'assets/img/Villa-1/Villa-1-Living-1-3K.webp', small: 'assets/img/Villa-1/Villa-1-Living-1-3K-small.webp' },
			{ normal: 'assets/img/Villa-1/Villa-1-Living-4-3K.webp', small: 'assets/img/Villa-1/Villa-1-Living-4-3K-small.webp' },
			{ normal: 'assets/img/Villa-1/Villa-1-Living-6-3K.webp', small: 'assets/img/Villa-1/Villa-1-Living-6-3K-small.webp' },
			{ normal: 'assets/img/Villa-1/Villa-1-Bedroom-3-4K.webp', small: 'assets/img/Villa-1/Villa-1-Bedroom-3-4K-small.webp' }
		],
		villa2: [
			{ normal: 'assets/img/Villa-2/Villa-2-Cam-1-Final-3K.webp', small: 'assets/img/Villa-2/Villa-2-Cam-1-Final-3K-small.webp' },
			{ normal: 'assets/img/Villa-2/Villa-2-Cam-7-Final-3K.webp', small: 'assets/img/Villa-2/Villa-2-Cam-7-Final-3K-small.webp' },
			{ normal: 'assets/img/Villa-2/Villa-2-Cam-8-Final-3K.webp', small: 'assets/img/Villa-2/Villa-2-Cam-8-Final-3K-small.webp' },
			{ normal: 'assets/img/Villa-2/Villa-2-Bedroom-3-Final-4K.webp', small: 'assets/img/Villa-2/Villa-2-Bedroom-3-Final-4K-small.webp' }
		],
		villa3: [
			{ normal: 'assets/img/Villa-3/Villa-3-Cam-1-Final-4K.webp', small: 'assets/img/Villa-3/Villa-3-Cam-1-Final-4K-small.webp' },
			{ normal: 'assets/img/Villa-3/Villa-3-Cam-2-Final-4K.webp', small: 'assets/img/Villa-3/Villa-3-Cam-2-Final-4K-small.webp' },
			{ normal: 'assets/img/Villa-3/Villa-3-Cam-3-Final-3K.webp', small: 'assets/img/Villa-3/Villa-3-Cam-3-Final-3K-small.webp' },
			{ normal: 'assets/img/Villa-3/Villa-3-Bedroom-3-Final-4K.webp', small: 'assets/img/Villa-3/Villa-3-Bedroom-3-Final-4K-small.webp' }
		],
		villa4: [
			{ normal: 'assets/img/Villa-4/Villa-4-Living-Cam-1-3K.webp', small: 'assets/img/Villa-4/Villa-4-Living-Cam-1-3K-small.webp' },
			{ normal: 'assets/img/Villa-4/Villa-4-Living-Cam-2-3K.webp', small: 'assets/img/Villa-4/Villa-4-Living-Cam-2-3K-small.webp' },
			{ normal: 'assets/img/Villa-4/Villa-4-Living-Cam-3-3K.webp', small: 'assets/img/Villa-4/Villa-4-Living-Cam-3-3K-small.webp' },
			{ normal: 'assets/img/Villa-4/Villa-4-Bedroom-Final-4K.webp', small: 'assets/img/Villa-4/Villa-4-Bedroom-Final-4K-small.webp' }
		]
	};

	var currentKey;
	function buildModal(key) {
		if (currentKey === key) return; // no-op if already on this villa
		currentKey = key;
		var slides = galleries[key] || galleries.villa1;
		var info = meta[key] || meta.villa1;

		// Update title and body text
		$modal.find('.modal__title h2').text(info.title);
		var $left = $modal.find('.modal-body .float-left');
		$left.find('h4').text(info.subtitle);
		$left.find('p').html(info.descriptionHtml);

		// Update right column with fixed villa list
		var allVillas = [
			{ label: 'Villa Verde Luna', key: 'villa1' },
			{ label: 'Villa Verde Sol', key: 'villa2' },
			{ label: 'Villa Verde Brisa', key: 'villa3' },
			{ label: 'Villa Verde Mar', key: 'villa4' }
		];
		var $right = $modal.find('.modal-body .float-right');
		$right.find('h4').text('');
		$right.children('figure').remove();
		var linksHtml = allVillas.map(function(l){
			var active = l.key === key ? ' is-active' : '';
			var attrs = l.key === key ? ' aria-current="true"' : '';
			return '<figure><a href="#" class="js-switch-villa'+active+'" data-target-villa="'+l.key+'"'+attrs+'><i class="fa fa-home"></i><span>'+l.label+'</span></a></figure>';
		}).join('');
		$right.prepend(linksHtml);

		// Ensure CTA exists
		var $body = $modal.find('.modal-body');
		var $cta = $body.find('.modal-cta');
		if (!$cta.length) {
			$cta = $('<div class="modal-cta"><button class="btn btn-contact js-modal-contact">Contact Us</button></div>');
			$body.append($cta);
		}

		// Rebuild carousel
		var $c = $modal.find('.modal__carousel');
		try {
			// Properly destroy if already initialized
			$c.trigger('destroy.owl.carousel');
		} catch(e) {}
		// Clean up DOM and data
		$c.off('.owl.carousel');
		$c.removeClass('owl-loaded owl-hidden');
		$c.find('.owl-stage-outer').children().unwrap();
		$c.removeData('owl.carousel');
		$c.removeData('owlCarousel');
		$c.removeData('owl-initialized');
		$c.empty();
		slides.forEach(function(it){
			var slide = [
				'<div class="slide">',
				'  <img src="'+it.normal+'"',
				'       srcset="'+it.small+' 600w, '+it.normal+' 1200w"',
				'       sizes="(max-width: 767px) 100vw, 1200px" alt="">',
				'</div>'
			].join('');
			$c.append(slide);
		});
		$c.owlCarousel({ items:1, nav:0, dots:1, loop:1, autoplay:1, autoplaySpeed:2000, autoHeight:true });
		// Ensure height recalculates after images load
		$c.find('img').one('load', function(){
			try { $c.trigger('refresh.owl.carousel'); } catch(e) {}
		}).each(function(){
			if (this.complete) $(this).trigger('load');
		});
	}

	// Bind internal switching and contact button actions (once per modal instance)
	$modal.off('click.modalSwitch', '.js-switch-villa')
		.on('click.modalSwitch', '.js-switch-villa', function(e){
			console.log('Switch villa link clicked');
			e.preventDefault();
			e.stopPropagation();
			var k = $(this).data('target-villa');
			buildModal(k);
		});
	$modal.off('click.modalContact', '.js-modal-contact')
		.on('click.modalContact', '.js-modal-contact', function(e){
			e.preventDefault();
			e.stopPropagation();
			$modal.modal('hide');
			var $target = $('#contact');
			if ($target.length) {
				$('html, body').animate({ scrollTop: $target.offset().top }, 800);
			}
		});

	// initial build
	buildModal(initialKey);
});

// Accordion icon toggle
$('#amenities-accordion').on('show.bs.collapse', function (e) {
    $(e.target).prev('.card-header').find('.fa').removeClass('fa-plus').addClass('fa-minus');
});

$('#amenities-accordion').on('hide.bs.collapse', function (e) {
    $(e.target).prev('.card-header').find('.fa').removeClass('fa-minus').addClass('fa-plus');
});

// Skip background transfer for modal to avoid eager loads
$('.background--image, .img-into-bg').not('#modal-feature .img-into-bg').each(function() {
    $(this).css('background-image', 'url('+ $(this).find('img').attr('src') +')' );
});