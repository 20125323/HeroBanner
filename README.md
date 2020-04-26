# HeroBanner

## 목차

#### [1. 프로젝트 설명](#about_project)
#### [2. 사용 방법](#how)
#### [3. 옵션 설명](#options)


</br>

<a name="about_project">  

### 1. 프로젝트 설명

</a>
  
##### 1-1. 프로젝트 기획

 > 데스크탑과 모바일 모두를 지원하는 유동적인 UI 모듈 개발

##### 1-2. 프로젝트 목적
 * VanilliaJS 기반으로 개발.
 * Webpack으로 모듈링.
 * 옵션에 따른 기능 변경 가능.
 * 쉽고 간단한 사용방법 추구.
  
<a name="how">  

### 2. 사용 방법

</a>
* hero_banner.css와 hero_banner.js를 import하여 사용
</br>
</br>
* html 파일 내 구현하고자 하는 위치에 class="hero-banner"의 div 생성
</br>
* js파일 내 다음과 같이 사용
</br>
  
  let hero_banner = document.querySelector('.hero-banner')
> 생성한 배너 element를 가져와서 실제 배너를 아래와 같은 옵션 값을 요청해서 만듬.

  new HeroBanner(hero_banner, {
</br>
      url: '요청하고자 하는 url',
</br>
      count: 4,
</br>
      autoSlide: true,
</br>
      autoSlideTime: 3000,
</br>
      infinity: true
</br>
  });
  
<a name="options">  

### 3. 옵션 설명

</a>
 * url: [{"image": "", "link": ""}] 형태의 배너 이미지 json값을 반환하는 API를 요청하는 url
</br>
 * count : 가져오고자 하는 배너이미지의 수 (url의 get 변수로 같이 보내게 됨), default값은 1
</br>
 * navStyle : arrow값은 화살표만 보이게, dot값은 하단 인디케이터만 보이게, 옵션값을 쓰지 않으면 모두 보이게 됨.
</br>
 * autoSlide : true값은 자동슬라이드 허용, false값은 자동슬라이드 비허용, default값은 false
</br>
 * autoSlideTime : 다음 배너로 자동슬라이드되는 시간, default값은 3초 (ms단위)
</br>
 * infinity : 마지막 배너에서 다음 배너로 이동 시 처음 배너로 이동할지 여부, true값은 허용, false값은 비허용, default값은 true
</br>
 
</br>
</br>
[맨 위로 가기](#top)
</br>
  
