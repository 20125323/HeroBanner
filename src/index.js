import './css/main.css';
import './css/hero_banner.css';

import HeroBanner from './js/hero_banner';

let hero_banner = document.querySelector('.hero-banner');

new HeroBanner(hero_banner, {
    url: 'https://e37cfac5-6a30-473f-9c3d-7394356cfa67.mock.pstmn.io/api/banners',
    count: 4,
    navPosition: 'bottom',
    autoSlide: false,
    autoSlideTime: 3000,
    infinity: true
});
