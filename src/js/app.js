import * as burger from './modules/burger';
import * as dynamicAdapt from './modules/dynamicAdapt';
import * as searchForm from './modules/searchForm'
import Swiper from "swiper/bundle";

const swiper = new Swiper('.swiper', {
	loop: true,
	autoplay: {
		delay: 2000
	},
	scrollbar: {
		el: '.swiper-scrollbar',
	},
	breakpoints: {
		545: {
			spaceBetween: 10,
			slidesPerView: 2,
		},
		768: {
			slidesPerView: 3,
		},
		992: {
			slidesPerView: 2,
			spaceBetween: 20
		},
		1680: {
			slidesPerView: 3,
			spaceBetween: 50
		}
	}
});