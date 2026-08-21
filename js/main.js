/**
 * healow Healthcare - Main JavaScript
 * Handles OWL Carousel, navigation, accordion, and interactive elements
 */

$(document).ready(function() {
    
    // Initialize OWL Carousel for Testimonials (only when cards exist)
    var $testimonialCarousel = $('.testimonial-carousel');
    if ($testimonialCarousel.length && $testimonialCarousel.children().length) {
        $testimonialCarousel.owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: false,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        },
        navText: [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ]
        });
    }

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        // Bootstrap tab links also use hash targets. Let Bootstrap handle them
        // without scrolling the active panel underneath the sticky header.
        if (this.matches('[data-bs-toggle="tab"], [data-toggle="tab"]')) return;

        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = $(href);
        if (target.length) {
            e.preventDefault();
            const stickyHeaderHeight = $('.main-nav-header').outerHeight() || 80;
            const anchorClearance = href === '#location-map' ? 40 : 16;
            $('html, body').stop().animate({
                scrollTop: Math.max(0, target.offset().top - stickyHeaderHeight - anchorClearance)
            }, 600);
        }
    });

    // Navbar active state on scroll
    $(window).on('scroll', function() {
        const scrollPos = $(window).scrollTop();
        $('.main-nav .nav-link').each(function() {
            const link = $(this);
            const href = link.attr('href');
            if (!href || href === '#') return;
            const targetSection = $(href);
            if (targetSection.length) {
                const sectionTop = targetSection.offset().top - 100;
                const sectionBottom = sectionTop + targetSection.outerHeight();
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    link.addClass('active');
                } else {
                    link.removeClass('active');
                }
            }
        });
    });

    // Tools tabs - highlight active tab on click
    $('.tools-tabs a').on('click', function(e) {
        e.preventDefault();
        $('.tools-tabs li').removeClass('active');
        $(this).closest('li').addClass('active');
    });

    // Mobile navbar collapse on link click
    $('.main-nav .nav-link').on('click', function() {
        if ($(window).width() < 992) {
            $('.navbar-collapse').collapse('hide');
        }
    });

    // Back to top button
    const $backToTop = $('#back-to-top');
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 400) {
            $backToTop.addClass('visible');
        } else {
            $backToTop.removeClass('visible');
        }
    });
    $backToTop.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // Use the native dialer on phones and copy the number on desktop devices.
    $('.call-action').on('click', async function(e) {
        const isPhone = window.matchMedia('(max-width: 767px), (any-pointer: coarse)').matches;
        if (isPhone) return;

        e.preventDefault();
        const phone = this.dataset.phone || '860-325-6908';
        try {
            await navigator.clipboard.writeText(phone);
        } catch (error) {
            const input = document.createElement('textarea');
            input.value = phone;
            input.setAttribute('readonly', '');
            input.style.position = 'fixed';
            input.style.opacity = '0';
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            input.remove();
        }

        const notice = document.getElementById('copyPhoneNotice');
        notice.classList.add('visible');
        window.clearTimeout(notice.hideTimer);
        notice.hideTimer = window.setTimeout(() => notice.classList.remove('visible'), 2600);
    });

    // Primary scheduling buttons call directly on phones and reveal details on desktop.
    $('.schedule-action').on('click', function(e) {
        const isPhone = window.matchMedia('(max-width: 767px), (any-pointer: coarse)').matches;
        if (isPhone) return;

        e.preventDefault();
        const target = $('#cta');
        if (target.length) {
            $('html, body').stop().animate({ scrollTop: target.offset().top - 80 }, 600);
        }
    });

    // Reserve exactly enough space for the fixed announcement at every screen size.
    const openingAnnouncement = document.getElementById('openingAnnouncement');
    const topContactBar = document.querySelector('.top-bar');
    const getVisibleHeight = function(element) {
        if (!element || element.getClientRects().length === 0 || window.getComputedStyle(element).display === 'none') {
            return 0;
        }
        return Math.ceil(element.getBoundingClientRect().height);
    };
    const syncFixedHeaderHeights = function() {
        const announcementHeight = getVisibleHeight(openingAnnouncement);
        const contactHeight = getVisibleHeight(topContactBar);
        document.documentElement.style.setProperty('--opening-announcement-height', announcementHeight + 'px');
        document.documentElement.style.setProperty('--top-contact-height', contactHeight + 'px');
    };

    syncFixedHeaderHeights();
    $(window).on('resize', syncFixedHeaderHeights);
    if (window.ResizeObserver) {
        const fixedHeaderObserver = new ResizeObserver(syncFixedHeaderHeights);
        if (openingAnnouncement) fixedHeaderObserver.observe(openingAnnouncement);
        if (topContactBar) fixedHeaderObserver.observe(topContactBar);
    }

    // Keep the opening notice available on future visits after a visitor dismisses it.
    $('#openingAnnouncementClose').on('click', function() {
        $('#openingAnnouncement').slideUp(180, syncFixedHeaderHeights);
    });

});
