import Swiper, { Navigation, Pagination, Autoplay } from 'swiper';

export default function swiper() {
    const swiper = new Swiper('.promo__slider', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        loop: true,
        breakpoints: {
            768: {
                slidesPerView: 2.62,
                spaceBetween: 24,
            },
            1440: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
        },
    });
}
