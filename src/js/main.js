let hero_banner = document.querySelector('.hero-banner')

new HeroBanner(hero_banner, {
    url: 'https://37fbf4e4-a4c3-4813-a4c7-51569f0ac024.mock.pstmn.io/api/banners',
    count: 4,
    navPosition: 'bottom',
    autoSlide: false,
    autoSlideTime: 3000,
    infinity: true
});
