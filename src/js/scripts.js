// FOOTER TO BOTTOM PAGE
function footerToBottomPage() {
	if (document.querySelector('.no-flexbox')) {
		const main = document.querySelector('main'),
			footer = document.querySelector('footer');

		main.style.minHeight = document.body.offsetHeight + 'px';
		main.style.paddingBottom = footer.offsetHeight + 'px';
		footer.style.marginTop = -footer.offsetHeight + 'px';
		footer.style.opacity = 1;
	}
}

// MAIN NAV STYLES
function mainNavStyles() {
	document.querySelectorAll('.main-nav a span').forEach(el => {
		el.closest('a').setAttribute('data-title', el.textContent);
	});
}

// BLOCK POSITIONS
function blockPosition() {
	const containerWr = document.querySelector('.toggle-wrapper'),
		container = document.querySelector('.toggle-wrapper > div'),
		lang = document.querySelector('.lang'),
		logo = document.querySelector('.logo-company'),
		userNav = document.querySelector('.user-nav'),
		mainNav = document.querySelector('.main-nav');

	if (window.innerWidth > 1200) {
		logo.after(mainNav);
		containerWr.before(lang);
		lang.after(userNav);
	}

	if (window.innerWidth <= 1200) {
		container.prepend(mainNav);
		mainNav.after(userNav);
		container.append(lang);
	}
}

// BLOCK SAME HEIGHT
function blockSameH(cb) {
	let bl1 = $('.list-2 p'),
		tallest1 = 0;

	if (window.innerWidth > 992) {
		bl1.each(function() {
			let thisHeight1 = $(this).innerHeight();

			if (thisHeight1 > tallest1) {
				tallest1 = thisHeight1;
			}
		});

		bl1.innerHeight(tallest1);
	}

	if (window.innerWidth <= 992) {
		bl1.css('height', '');
	}

	bl1.closest('div').css('opacity', 1);

	cb();
}

// LIST STYLES
function listStyles() {
	if (document.querySelector('.list-2')) {
		document.querySelectorAll('.list-2 li').forEach(el => {
			if (document.querySelector('.section-4')) {
				if (window.innerWidth > 992) {
					el.style.marginTop = -el.offsetHeight * 0.42 + 'px';

					document.querySelector('.section-4').style.paddingBottom =
						el.offsetHeight * 0.42 + 'px';
				}

				if (window.innerWidth <= 992) {
					el.style.marginTop = '';

					document.querySelector('.section-4').style.paddingBottom = '';
				}
			}
		});
	}
}

// TOGGLE CONTENT
function toggleContent() {
	if ('ontouchstart' in document.documentElement) {
		document.addEventListener('touchstart', toggleFunc());
	} else {
		document.addEventListener('click', toggleFunc());
	}
}

function toggleFunc() {
	return function(e) {
		const target = e.target,
			toggleWr = document.querySelector('.toggle-wrapper'),
			toggleBtn = document.querySelector('.toggle-btn'),
			toggleBtnEl = document.querySelectorAll('.toggle-btn i'),
			toggleContent = document.querySelector('.toggle-wrapper > div'),
			overlay = document.querySelector('.overlay');

		for (let i = 0; i < toggleBtnEl.length; i++) {
			if (target == toggleBtnEl[i]) {
				toggleWr.classList.toggle('toggle-wrapper-style');
				toggleBtn.classList.toggle('toggle-btn-style');
				toggleContent.classList.toggle('visible');
				overlay.classList.toggle('overlay-visible');
				document.body.classList.toggle('ovyh');
			}
		}

		if (target == toggleWr || target == toggleBtn) {
			toggleWr.classList.toggle('toggle-wrapper-style');
			toggleBtn.classList.toggle('toggle-btn-style');
			toggleContent.classList.toggle('visible');
			overlay.classList.toggle('overlay-visible');
			document.body.classList.toggle('ovyh');
		}

		if (!target.closest('.toggle-wrapper')) {
			toggleWr.classList.remove('toggle-wrapper-style');
			toggleBtn.classList.remove('toggle-btn-style');
			toggleContent.classList.remove('visible');
			overlay.classList.remove('overlay-visible');
			document.body.classList.remove('ovyh');
		}
	};
}

// BUTTON BACK TO TOP
function backToTop() {
	if ($('.back-top').length) {
		$('.back-top').click(function() {
			$('body,html').animate(
				{
					scrollTop: 0
				},
				800
			);
			return false;
		});
	}
}

function animateBlocks() {
	if ($('h2').length) {
		$('h2').viewportChecker({
			classToAdd: 'op1 animated zoomIn',
			offset: 10
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	mainNavStyles();
	blockPosition();
	toggleContent();
	backToTop();

	animateBlocks();
}); // END READY

window.addEventListener('resize', () => {
	footerToBottomPage();
	blockPosition();
	blockSameH(listStyles);
});

window.addEventListener('load', () => {
	footerToBottomPage();
	blockSameH(listStyles);
});

window.addEventListener('scroll', e => {
	if (pageYOffset > 100) {
		document.querySelector('.back-top').classList.add('back-top-show');
	} else {
		document.querySelector('.back-top').classList.remove('back-top-show');
	}
});

window.addEventListener('orientationchange', () => {
	document.location.reload();
	blockSameH(listStyles);
});
