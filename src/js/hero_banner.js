export default class HeroBanner {
    constructor(element, options = {}) {
        const thisBanner = this;
        this.element = element; // #hero-banner

        /* 다음은 각 옵션값들
        * url: 가져오고자 하는 이미지의 API 요청 url
        * count: 가져오고자 하는 배너이미지의 수
        * navStyle: arrow일 땐 좌우 화살표만 표시, dot일 때는 하단 인디케이터만 표시, 아무값도 넣지 않았을 때는 둘다 표시
        * autoSlide: 자동 슬라이드 여부
        * autoSlideTime: 자동 슬라이드 시간
        * infinity: 가장 마지막 배너에서 멈추지않고 처음 배너위치로 이동시킬지 여부
        */
        this.url = !options.url ? '' : options.url;
        this.count = !options.count ? '1' : options.count;
        this.navStyle = !options.navStyle ? '' : options.navStyle;
        this.autoSlide = !options.autoSlide ? false : options.autoSlide;
        this.autoSlideTime = !options.autoSlideTime ? 3000 : options.autoSlideTime;
        this.infinity = !options.infinity && options.infinity !== false ? true : options.infinity;

        // 자동슬라이드가 되는 도중 mouse관련 이벤트들이 실행될 때 autoSlideStatus를 통해 멈추게하는 변수:
        this.autoSlideStatus = '';

        // 현재 배너의 인덱스 값
        this.BannerIndex = 0;
        // getFirst는 각 함수들이 중복 실행되지 않기 위한 변수.
        this.getFirst = true;

        // 배너에서 마우스 드래그 시 이미지 복사, href의 url 복사를 방지하기 위함.
        this.element.ondragstart = new Function("return false");

        // 편의성을 위해 다음과 같은 div들을 자동으로 미리 생성.
        let appendBannerWrapper = document.createElement('div');
        appendBannerWrapper.className = "banner-wrapper";
        this.element.appendChild(appendBannerWrapper);
        let appendNavWrapper = document.createElement('div');
        appendNavWrapper.className = "nav-wrapper";
        this.element.appendChild(appendNavWrapper);

        for (let i = 0; i < this.count; i++) {
            let appendBannerItem = document.createElement('div');
            appendBannerItem.className = "hero-banner-item";
            thisBanner.element.children[0].appendChild(appendBannerItem);
        }

        // 이미지를 가져오는 함수, 모두 가져오고 나서 nav를 생성하는 함수와 같은 기타 다른 함수들을 실행함.
        this.getImage('desktop');
        this.getImage('mobile');
    }

    // 이미지 가져오기
    getImage(device) {
        const thisBanner = this;
        let bannerAry = [];

        fetch(thisBanner.url + '?device='+device+'&count=' + thisBanner.count, {
            method: 'get'
        })
            .then((res) => res.json())
            .then(function (data) {
                bannerAry = data;

                for (let i = 0; i < bannerAry.length; i++) {
                    let bannerImage = "";
                    if (HeroBanner.canUseWebP()) {
                        bannerImage = bannerAry[i]['image'];
                    } else {
                        bannerImage = bannerAry[i]['image'].replace('.webp', '.jpg');
                    }
                    let appendBanner = document.createElement('div');
                    appendBanner.className = device + "_wrapper";
                    let appendImage = document.createElement('img');
                    appendImage.src = bannerImage;
                    appendImage.alt = "bannerImage";
                    appendBanner.appendChild(appendImage)
                    appendBanner.addEventListener('click', function () {
                        window.open(bannerAry[i]['link'], '_self');
                    });
                    thisBanner.element.children[0].children[i].appendChild(appendBanner);
                }
            })
            .then(function () {
                if (thisBanner.getFirst) {
                    thisBanner.getFirst = false;
                } else {
                    // 함수 실행
                    thisBanner.navMaker();
                    if (thisBanner.autoSlide) thisBanner.autoSlideEvent();
                    thisBanner.swipeEvent();

                    getWindowSize();
                    window.addEventListener("resize", getWindowSize);
                }
            }).catch(function (err) {
                // Error :(
            });

        function getWindowSize() {
            let desktopWrapper = document.querySelectorAll('.desktop_wrapper');
            let mobileWrapper = document.querySelectorAll('.mobile_wrapper');
            let bannerWidth = null;

            // 브라우저 사이즈가 640보다 크면  데스크탑 이미지가 보이게, 640보다 작으면 모바일 이미지가 보이게 함.
            // 브라우저 사이즈가 640보다 크면 좌우 화살표 보이게, 640보다 작으면 보이지 않게 함.
            // 1180보다 크게되면 여백을 위해 1180에 고정.
            if (window.outerWidth > 640) {
                if (window.outerWidth > 1180) {
                    bannerWidth = 1180;
                } else {
                    bannerWidth = thisBanner.element.clientWidth;
                }

                for (let i = 0; i < desktopWrapper.length; i++) {
                    desktopWrapper[i].style.display = "block";
                    mobileWrapper[i].style.display = "none";
                }

                thisBanner.element.children[1].children[0].style.display = 'block';
                thisBanner.element.onmouseover = () => {
                    thisBanner.element.children[1].children[0].style.opacity = '1';
                    thisBanner.element.children[1].children[0].style.visibility = 'visible';
                };
                thisBanner.element.onmouseout = () => {
                    thisBanner.element.children[1].children[0].style.opacity = '0';
                    thisBanner.element.children[1].children[0].style.visibility = 'hidden';
                }
            } else {
                for (let i = 0; i < mobileWrapper.length; i++) {
                    desktopWrapper[i].style.display = "none";
                    mobileWrapper[i].style.display = "block";
                }

                bannerWidth = thisBanner.element.clientWidth;

                thisBanner.element.children[1].children[0].style.display = 'none';
            }

            /*
             기초 세팅
             thisBanner.element.children[0] -> .banner-wrapper
             배너의 전체 너비를 현재 브라우저 너비에 총 배너 개수만큼 곱하여 구한다.
             */
            thisBanner.element.children[0].style.width = `${bannerWidth * thisBanner.element.children[0].children.length}px`;
            /*
             기초 세팅
             각 배너의 너비를 현재 브라우저 너비에 맞춘다.
             */
            for (let i = 0; i < thisBanner.element.children[0].children.length; i++) {
                thisBanner.element.children[0].children[i].style.width = `${bannerWidth}px`;
            }

            // 브라우저 크기를 resize할 때 그에 맞춰 x축 위치를 변경하기 위함.
            thisBanner.element.children[0].style['transform'] = `translateX(-${bannerWidth * thisBanner.BannerIndex}px)`;
            thisBanner.element.children[0].style['msTransform'] = `translateX(-${bannerWidth * thisBanner.BannerIndex}px)`;
            thisBanner.element.children[0].style['MozTransform'] = `translateX(-${bannerWidth * thisBanner.BannerIndex}px)`;
            thisBanner.element.children[0].style['WebkitTransform'] = `translateX(-${bannerWidth * thisBanner.BannerIndex}px)`;
            // 배너가 translate될 때는 300ms이지만 resize할 때만 배너 이미지의 크기 이상 문제 때문에 0ms로 변경함.
            thisBanner.element.children[0].style.transitionDuration = '0ms';
        }
    }

    // 네비게이션 생성
    navMaker() {
        /*
         기초 세팅
         thisBanner.element.children[1] -> .nav-wrapper
         */

        if (this.navStyle === 'arrow') {
            let appendArrow = document.createElement('div');
            appendArrow.className = "nav-arrow";
            appendArrow.innerHTML = `<div class="nav-arrow-left">Left</div><div class="nav-arrow-right">Right</div>`;
            this.element.children[1].appendChild(appendArrow);

            // 왼쪽 화살표를 눌렀을 때
            this.element.children[1].children[0].children[0].onclick = () => {
                // 화살표 클릭 시 자동슬라이드 멈춤
                if (this.autoSlide) clearInterval(this.autoSlideStatus);

                // 현재 배너의 인덱스가 0보다 작으면 가장 마지막 배너로 이동하고 그게 아니면 이전 배너로 이동
                if (this.infinity) this.BannerIndex = this.BannerIndex <= 0 ? this.element.children[0].children.length - 1 : this.BannerIndex - 1;
                else this.BannerIndex = this.BannerIndex <= 0 ? 0 : this.BannerIndex - 1;

                this.moveAction(this.BannerIndex);
            };

            // 오른쪽 화살표를 눌렀을 때
            this.element.children[1].children[0].children[1].onclick = () => {
                // 화살표 클릭 시 자동슬라이드 멈춤
                if (this.autoSlide) clearInterval(this.autoSlideStatus);

                // 현재 배너의 인덱스가 총 배너 수와 같거나 크면 가장 처음 배너로 이동하고 그게 아니면 다음 배너로 이동
                if (this.infinity) this.BannerIndex = this.BannerIndex >= this.element.children[0].children.length - 1 ? 0 : this.BannerIndex + 1;
                else this.BannerIndex = this.BannerIndex = this.BannerIndex >= this.element.children[0].children.length - 1 ? this.BannerIndex : this.BannerIndex + 1;

                this.moveAction(this.BannerIndex);
            }
        } else if (this.navStyle === 'dot') {
            let appendDot = document.createElement('div');
            appendDot.className = "nav-dot";
            let appendNav = '';
            for (let i = 0; i < this.element.children[0].children.length; i++) {
                if (i === 0) {
                    appendNav += `<span class="nav-on"></span>`;
                } else {
                    appendNav += "<span></span>";
                }
            }
            appendDot.innerHTML = appendNav;
            this.element.children[1].appendChild(appendDot);

            for (let i = 0; i < this.element.children[1].children[0].children.length; i++) {
                // dot를 눌렀을 때 해당 배너로 이동
                this.element.children[1].children[0].children[i].addEventListener('click', () => { // click event register
                    // dot 클릭 시 자동슬라이드 멈춤
                    if (this.autoSlide) clearInterval(this.autoSlideStatus);
                    this.BannerIndex = i;
                    this.moveAction(i);
                });
            }
        } else {
            let appendArrow = document.createElement('div');
            appendArrow.className = "nav-arrow";
            appendArrow.innerHTML = `<div class="nav-arrow-left">Left</div><div class="nav-arrow-right">Right</div>`;
            this.element.children[1].appendChild(appendArrow);

            let appendDot = document.createElement('div');
            appendDot.className = "nav-dot";
            let appendNav = '';
            for (let i = 0; i < this.element.children[0].children.length; i++) {
                if (i === 0) {
                    appendNav += `<span class="nav-on"></span>`;
                } else {
                    appendNav += "<span></span>";
                }
            }
            appendDot.innerHTML = appendNav;
            this.element.children[1].appendChild(appendDot);

            // navStyle을 지정하지 않으면 화살표와 dot모두 이용함.

            // 왼쪽 화살표를 눌렀을 때
            this.element.children[1].children[0].children[0].onclick = () => {
                // 화살표 클릭 시 자동슬라이드 멈춤
                if (this.autoSlide) clearInterval(this.autoSlideStatus);

                // 현재 배너의 인덱스가 0보다 작으면 가장 마지막 배너로 이동하고 그게 아니면 이전 배너로 이동
                if (this.infinity) this.BannerIndex = this.BannerIndex <= 0 ? this.element.children[0].children.length - 1 : this.BannerIndex - 1;
                else this.BannerIndex = this.BannerIndex <= 0 ? 0 : this.BannerIndex - 1;

                this.moveAction(this.BannerIndex);
            };

            // 오른쪽 화살표를 눌렀을 때
            this.element.children[1].children[0].children[1].onclick = () => {
                // 화살표 클릭 시 자동슬라이드 멈춤
                if (this.autoSlide) clearInterval(this.autoSlideStatus);

                // 현재 배너의 인덱스가 총 배너 수와 같거나 크면 가장 처음 배너로 이동하고 그게 아니면 다음 배너로 이동
                if (this.infinity) this.BannerIndex = this.BannerIndex >= this.element.children[0].children.length - 1 ? 0 : this.BannerIndex + 1;
                else this.BannerIndex = this.BannerIndex = this.BannerIndex >= this.element.children[0].children.length - 1 ? this.BannerIndex : this.BannerIndex + 1;

                this.moveAction(this.BannerIndex);
            };

            for (let i = 0; i < this.element.children[1].children[1].children.length; i++) {
                // dot를 눌렀을 때 해당 배너로 이동
                this.element.children[1].children[1].children[i].addEventListener('click', () => { // click event register
                    // dot 클릭 시 자동슬라이드 멈춤
                    if (this.autoSlide) clearInterval(this.autoSlideStatus);
                    this.BannerIndex = i;
                    this.moveAction(i);
                });
            }
        }
    }

    // 자동슬라이드
    autoSlideEvent() {
        /*
           - autoSlideTime만큼의 시간마다 자동슬라이드를 함
           - 만약 배너의 인덱스가 총 배너 수와 같거나 크면 가장 처음 배너로 이동
           - 배너 위에 마우스 진입 시 자동 슬라이드 멈춤
           - 배너에서 마우스 벗어날 시 다시 자동 슬라이드 실행
         */
        this.autoSlideStatus = setInterval(() => {
            if (this.infinity) {
                if (this.BannerIndex >= this.element.children[0].children.length - 1) this.BannerIndex = 0;
                else this.BannerIndex = this.BannerIndex + 1;
            } else {
                if (this.BannerIndex >= this.element.children[0].children.length - 1) this.BannerIndex = this.element.children[0].children.length - 1;
                else this.BannerIndex = this.BannerIndex + 1;
            }

            this.moveAction(this.BannerIndex);
        }, this.autoSlideTime);
        this.element.addEventListener('mouseenter', () => { // mouse over
            clearInterval(this.autoSlideStatus);
        });
        this.element.addEventListener('mouseleave', () => { // mouse out
            this.autoSlideStatus = setInterval(() => {
                if (this.infinity) {
                    if (this.BannerIndex >= this.element.children[0].children.length - 1) this.BannerIndex = 0;
                    else this.BannerIndex = this.BannerIndex + 1;
                } else {
                    if (this.BannerIndex >= this.element.children[0].children.length - 1) this.BannerIndex = this.element.children[0].children.length - 1;
                    else this.BannerIndex = this.BannerIndex + 1;
                }

                this.moveAction(this.BannerIndex);
            }, this.autoSlideTime);
        })
    }

    // 스와이프 이벤트
    swipeEvent() {
        const thisBanner = this;
        let initialX = null;

        function initTouch(e) {
            // 배너 클릭 시 자동슬라이드 멈춤
            if (thisBanner.autoSlide) clearInterval(thisBanner.autoSlideStatus);

            // 터치이벤트가 있으면 터치값에서 가져옴
            initialX = `${e.touches ? e.touches[0].clientX : e.clientX}`;
        }

        function swipeDirection(e) {
            if (initialX !== null) {
                const currentX = `${e.touches ? e.touches[0].clientX : e.clientX}`;

                let diffX = initialX - currentX;
                if (diffX > 0) {
                    // 현재 배너의 인덱스가 총 배너 수와 같거나 크면 가장 처음 배너로 이동하고 그게 아니면 다음 배너로 이동
                    if (thisBanner.infinity) thisBanner.BannerIndex = thisBanner.BannerIndex >= thisBanner.element.children[0].children.length - 1 ? 0 : thisBanner.BannerIndex + 1;
                    else thisBanner.BannerIndex = thisBanner.BannerIndex = thisBanner.BannerIndex >= thisBanner.element.children[0].children.length - 1 ? thisBanner.BannerIndex : thisBanner.BannerIndex + 1;

                    thisBanner.moveAction(thisBanner.BannerIndex);
                } else if (diffX < 0) {
                    // 현재 배너의 인덱스가 0보다 작으면 가장 마지막 배너로 이동하고 그게 아니면 이전 배너로 이동
                    if (thisBanner.infinity) thisBanner.BannerIndex = thisBanner.BannerIndex <= 0 ? thisBanner.element.children[0].children.length - 1 : thisBanner.BannerIndex - 1;
                    else thisBanner.BannerIndex = thisBanner.BannerIndex <= 0 ? 0 : thisBanner.BannerIndex - 1;

                    thisBanner.moveAction(thisBanner.BannerIndex);
                }

                initialX = null;
            }
        }

        // 터치 눌렀을 때 시작 x좌표를 가져오는 이벤트
        this.element.addEventListener("touchstart", initTouch);
        // 터치후 이동할 때 x좌표를 가져와서 서로 비교 후 배너를 이동시키는 이벤트
        this.element.addEventListener("touchmove", swipeDirection);
        // 마우스 클릭을 했을 때 시작 x좌표를 가져오고 클릭을 한 상태에서 마우스 이동을 했을 때 x좌표를 가져와서 서로 비교 후 배너를 이동시키는 이벤트
        this.element.addEventListener("mousedown", (e) => {
            initTouch(e), this.element.addEventListener("mousemove", swipeDirection);
        });
        // 마우스 클릭을 뗐을  때 mousemove 이벤트를 삭제하여 더이상 이벤트가 발생하지 않게 함.
        this.element.addEventListener("mouseup", () => {
            this.element.removeEventListener("mousemove", swipeDirection);
        });
    }

    // 배너이동 이벤트
    moveAction(index) {
        const thisBanner = this;

        // 현재 브라우저의 너비에 이동하려는 인덱스만큼 곱하여 x위치를 좌측으로 이동하게함
        this.element.children[0].style.transitionDuration = '300ms';
        this.element.children[0].style['transform'] = `translateX(-${this.element.clientWidth * index}px)`;
        this.element.children[0].style['msTransform'] = `translateX(-${this.element.clientWidth * index}px)`;
        this.element.children[0].style['MozTransform'] = `translateX(-${this.element.clientWidth * index}px)`;
        this.element.children[0].style['WebkitTransform'] = `translateX(-${this.element.clientWidth * index}px)`;

        if (!this.navStyle) {
            // navStyle을 지정하지 않아서 현재 배너 인덱스 dot의 하이라이트 처리를 this.element.children[1].children[1]에서 하게됨. (this.element.children[1].children[1]는 nav-arrow)
            for (let i = 0; i < this.element.children[1].children[1].children.length; i++) { // nav-wrapper > spans nav-on remove
                this.element.children[1].children[1].children[i].setAttribute('class', '');
            }
            this.element.children[1].children[1].children[index].setAttribute('class', 'nav-on'); // nav-wrapper > span nav-on add
        } else if (this.navStyle === 'dot') {
            for (let i = 0; i < this.element.children[1].children[0].children.length; i++) { // nav-wrapper > spans nav-on remove
                this.element.children[1].children[0].children[i].setAttribute('class', '');
            }
            this.element.children[1].children[0].children[index].setAttribute('class', 'nav-on'); // nav-wrapper > span nav-on add
        }
        setTimeout(function () {
            thisBanner.element.children[0].style.transitionDuration = '0ms';
        }, 300);
    }

    // webp 확장자 지원여부 확인
    static canUseWebP() {
        let elem = document.createElement('canvas');

        if (!!(elem.getContext && elem.getContext('2d'))) {
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }

        return false;
    }
}
