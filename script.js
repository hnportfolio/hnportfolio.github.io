(function () {
  var targets = document.querySelectorAll(".reveal, .reveal-img");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();

(function () {
  var slider = document.getElementById("heroSlider");
  var dotsWrap = document.getElementById("heroSliderDots");
  if (!slider || !dotsWrap) return;

  var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero__slide"));
  var total = slides.length;
  if (total < 2) return;

  var current = 0;
  var intervalMs = 4500; // 배너 이미지가 자동으로 넘어가는 간격(밀리초). 숫자를 줄이면 더 빨리 넘어감
  var duration = 1000;   // 슬라이드 전환 애니메이션 길이(밀리초)
  var timer = null;

  var dots = slides.map(function (_, i) {
    var b = document.createElement("button");
    b.className = "hero-dot";
    b.type = "button";
    b.setAttribute("aria-label", "이미지 " + (i + 1) + "로 이동");
    b.addEventListener("click", function () {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(b);
    if (i === 0) b.classList.add("is-active");
    return b;
  });

  slides.forEach(function (slide, i) {
    slide.style.transform = "translateY(" + (i === 0 ? 0 : -100) + "%)";
  });

  function updateDots() {
    dots.forEach(function (d, i) { d.classList.toggle("is-active", i === current); });
  }

  function goTo(index) {
    if (index === current) return;
    var outgoing = slides[current];
    var incoming = slides[index];

    incoming.style.transition = "none";
    incoming.style.transform = "translateY(-100%)";
    void incoming.offsetHeight;
    incoming.style.transition = "";

    outgoing.style.transform = "translateY(100%)";
    incoming.style.transform = "translateY(0%)";

    current = index;
    updateDots();

    setTimeout(function () {
      outgoing.style.transition = "none";
      outgoing.style.transform = "translateY(-100%)";
      void outgoing.offsetHeight;
      outgoing.style.transition = "";
    }, duration + 50);
  }

  function next() { goTo((current + 1) % total); }

  function start() {
    timer = setInterval(next, intervalMs);
  }

  function stop() {
    if (timer) clearInterval(timer);
  }

  function restart() {
    stop();
    start();
  }

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  start();
})();

(function () {
  var filters = Array.prototype.slice.call(document.querySelectorAll(".work-filter"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".work-card"));
  if (!filters.length || !cards.length) return;

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function applyFilter(value) {
    filters.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-filter") === value);
    });

    var shownIndex = 0;
    cards.forEach(function (card) {
      var show = value === "all" || card.getAttribute("data-category") === value;
      card.style.display = show ? "" : "none";

      if (show && !reduceMotion) {
        card.classList.remove("work-card--pop");
        card.style.animationDelay = "";
        void card.offsetWidth;
        card.style.animationDelay = (Math.min(shownIndex, 10) * 25) + "ms";
        card.classList.add("work-card--pop");
        shownIndex++;
      }
    });
  }

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  var hash = window.location.hash.replace("#", "");
  var matches = filters.some(function (btn) { return btn.getAttribute("data-filter") === hash; });
  if (matches) applyFilter(hash);
})();

(function () {
  var titleEl = document.getElementById("projectTitle");
  if (!titleEl) return;

  var CATEGORIES = {
    brand: "Brand Identity",
    graphic: "Graphic Design",
    web: "Web Design",
    event: "Product Detail Page",
    promo: "Promotional Page"
  };

  var DEFAULT_STORY = "디자인 스토리를 이곳에 추가해주세요.";

  var PROJECTS = {
    "garden-sketch": {
      title: "Garden Sketch", category: "brand", type: "LOGO DESIGN",
      brand: "가든 스케치", software: ["Ps", "Ai"],
      keywords: "Nature · Organic · Harmony · Natural · Lifestyle",
      story: "자연을 모티브로 한 나뭇잎의 유기적인 형태를 브랜드 이니셜 'G'와 결합하여 심볼화했습니다. 자연의 순환과 조화를 상징하는 원형 구조와 그린·브라운 컬러를 통해 편안하고 내추럴한 브랜드 아이덴티티를 표현했습니다.",
      images: ["images/project/Garden-Sketch.jpg"]
    },
    "hwarihanwoo-brand": {
      title: "Product packaging design", category: "graphic", type: "PACKAGE DESIGN",
      brand: "화려한우", software: ["Ai", "Ps"],
      keywords: "Traditional · Premium · Trust · Clean",
      story: "한우 곰탕의 정갈함과 전통적인 이미지를 중심으로, 제품에 대한 신뢰와 품질이 자연스럽게 느껴지도록 구성했습니다.\n아이보리와 브라운 계열을 사용해 따뜻하고 담백한 분위기를 만들고, 전통 문양과 한식 이미지를 더해 고급스럽고 정성스러운 브랜드 인상을 강조했습니다.\n전면에는 제품명과 음식 이미지를 명확하게 배치해 직관성을 높이고, 전체적으로 깔끔하면서도 믿음직한 패키지 디자인으로 완성했습니다.",
      images: ["images/project/hwarihanwoo-brand/01.사골곰탕package.jpg"]
    },
    "vvd-painting": {
      title: "VVD Painting", category: "brand", type: "BRAND IDENTITY",
      brand: "VVD Painting", software: ["Ai", "Ps"],
      keywords: "Professional · Trust · Colorful · Dynamic · Modern · Versatile",
      story: "페인팅 작업의 전문성과 다양한 컬러 표현을 브랜드 아이덴티티에 담아, 신뢰감과 역동성을 동시에 전달하는 비주얼 시스템으로 디자인했습니다.\n심플한 로고 구조에 다채로운 그라데이션 컬러를 적용해 페인트가 가진 변화와 확장성을 표현했으며, 웹사이트·차량·유니폼·인쇄물 등 다양한 매체에서도 일관된 브랜드 이미지를 유지하도록 구성했습니다.",
      images: ["images/project/vvd-painting/01.jpg"]
    },
    "yorigo": {
      title: "Yorigo", category: "brand", type: "LOGO DESIGN",
      brand: "Yorigo", software: ["Ai", "Ps"],
      keywords: "Fast · Friendly · Energetic · Convenient · Intuitive · Flexible",
      story: "배달 서비스의 핵심인 빠른 이동과 편리함을 직관적인 심볼과 컬러로 표현했습니다.\n위치와 이동을 연상시키는 그래픽 요소를 로고에 담고, 밝은 옐로우와 코랄 컬러를 활용해 친근하고 활기찬 브랜드 이미지를 구성했습니다.\n앱, 패키지, 배달 차량 등 다양한 접점에서도 자연스럽게 이어질 수 있도록 일관된 비주얼로 확장했습니다.",
      images: ["images/project/yorigo/요리고.jpg"]
    },
    "oz-plasma": {
      title: "OZ Plasma", category: "brand", type: "LOGO DESIGN",
      brand: "OZ Plasma", software: ["Ai", "Ps"],
      keywords: "Technology · Futuristic · Energy · Trust",
      story: "플라즈마의 빛과 에너지, 그리고 물방울을 연상시키는 유기적인 형태를 모티브로 첨단 기술의 이미지를 표현했습니다.\n물방울 형태의 심볼은 깨끗함과 순환, 생명력을 의미하며, 딥블루와 시안 컬러를 통해 신뢰감과 청정한 분위기를 강조했습니다.\n빛나는 입자와 유동적인 그래픽을 더해 플라즈마 에너지의 움직임과 미래지향적인 이미지를 함께 담았습니다.",
      images: ["images/project/oz-plasma/OZ.jpg"]
    },
    "soda-talk": {
      title: "SODA Talk", category: "brand", type: "LOGO DESIGN",
      brand: "SODA Talk", software: ["Ai", "Ps"],
      keywords: "Communication · Friendly · Connection · Lively",
      story: "'대화'와 '소통'을 상징하는 말풍선 형태를 중심으로, 누구나 편하게 다가갈 수 있는 친근한 브랜드 이미지를 표현했습니다.\n밝은 블루 컬러와 둥근 그래픽 요소를 활용해 가볍고 활기찬 분위기를 만들고, 다양한 온·오프라인 매체에서도 자연스럽게 이어질 수 있도록 일관된 비주얼로 구성했습니다.",
      images: ["images/project/soda-talk/소다톡.jpg"]
    },
    "today-dental": {
      title: "오늘치과", category: "brand", type: "LOGO DESIGN",
      brand: "오늘치과", software: ["Ai", "Ps"],
      keywords: "Trust · Clean · Comfort · Friendly",
      story: "'오늘'이라는 이름에서 착안해 해와 달의 이미지를 하나의 심볼로 표현했습니다.\n낮과 밤을 아우르는 형태를 통해 언제나 가까이에서 함께하는 치과의 이미지를 담았고, 밝은 블루 컬러와 간결한 그래픽으로 청결함과 신뢰감, 편안함을 강조했습니다.\n전체적으로 부담 없이 다가갈 수 있는 친근한 의료 브랜드의 분위기를 구성했습니다.",
      images: ["images/project/today-dental/오늘치과.jpg"]
    },
    "network": {
      title: "Network", category: "brand", type: "LOGO DESIGN",
      brand: "Network", software: ["Ai", "Ps"],
      keywords: "Connection · Trust · Technology · Expansion",
      story: "네트워크의 핵심인 연결과 확장을 모티브로, 이니셜 'N'을 간결한 기하학 형태로 표현했습니다.\n직선적인 구조와 반복되는 라인을 통해 기술적이고 체계적인 이미지를 만들고, 블루 계열 컬러를 사용해 신뢰감과 안정감, 전문성을 담았습니다.\n다양한 온·오프라인 매체에서도 일관된 인상을 줄 수 있도록 심플하고 확장성 있는 아이덴티티로 구성했습니다.",
      images: ["images/project/network/08.network.jpg"]
    },
    "brand-color": {
      title: "Brand Color System", category: "brand", type: "COLOR SYSTEM DESIGN",
      brand: "화려한우", software: ["Ai", "Ps"],
      keywords: "Fresh · Confident · Premium · Refined",
      story: "고기의 신선함과 생동감은 살리면서, 브랜드가 가진 자신감과 프리미엄 이미지가 함께 느껴지도록 컬러 시스템을 재정비했습니다.\nRed를 중심으로 Ivory, Navy, Pink를 조합해 시선을 끄는 힘은 유지하고, 전체적으로는 보다 세련되고 고급스러운 분위기로 균형을 맞췄습니다.",
      images: ["images/project/brand-color/01.화려한우_BrandColor.jpg"]
    },
    "hanam-city": {
      title: "Hanam City", category: "graphic", type: "BUSINESS CARD DESIGN",
      brand: "하남시청", software: ["Ai", "Ps"],
      keywords: "Trust · Friendly · Urban Life · Connectivity · Vitality",
      story: "도시의 신뢰와 시민의 일상을 하나의 비주얼 언어로 연결하다.\n안정적인 블루와 활기찬 오렌지 컬러, 도시의 다양한 모습을 담은 라인 그래픽을 통해 친근하면서도 현대적인 하남시의 브랜드 이미지를 표현했습니다.",
      images: [
        "images/project/hanam-city/Hanam-City_01.jpg",
        "images/project/hanam-city/Hanam-City_02.jpg",
        "images/project/hanam-city/Hanam-City_03.jpg",
        "images/project/hanam-city/Hanam-City_04.jpg",
        "images/project/hanam-city/Hanam-City_05.jpg"
      ]
    },
    "banner-design": {
      title: "Banner design", category: "graphic", type: "SIGNAGE DESIGN",
      brand: "Banner design", software: ["Ai", "Ps"],
      story: DEFAULT_STORY,
      images: [
        "images/project/banner-design/01.banner.jpg",
        "images/project/banner-design/02.banner.jpg",
        "images/project/banner-design/03.banner.jpg"
      ]
    },
    "brochure": {
      title: "Brochure design", category: "graphic", type: "BROCHURE DESIGN",
      brand: "양화봉", software: ["Ai", "Ps"],
      keywords: "Natural · Trust · Professional · Warm",
      story: "벌과 꿀이 가진 자연적이고 건강한 이미지를 중심으로, 제품의 신뢰성과 전문성이 잘 드러나도록 구성했습니다.\n옐로우 컬러를 포인트로 사용해 꿀의 따뜻함과 생동감을 표현하고, 넉넉한 화이트 공간과 정돈된 그리드를 통해 제품 정보가 명확하게 전달되도록 디자인했습니다.\n자연 사진과 제품 이미지를 균형 있게 배치해 친환경적이면서도 전문적인 브랜드 인상을 담았습니다.",
      images: [
        "images/project/brochure/01.brochure.jpg",
        "images/project/brochure/02.brochure.jpg",
        "images/project/brochure/03.brochure.jpg",
        "images/project/brochure/04.brochure.jpg",
        "images/project/brochure/05.brochure.jpg"
      ]
    },
    "box-package": {
      title: "Box Package", category: "graphic", type: "PACKAGE DESIGN",
      brand: "Box Package", software: ["Ai", "Ps"],
      keywords: "Minimal · Functional · Tech · Intuitive",
      story: "제품의 기능성과 기술적인 이미지를 강조하기 위해 화이트 베이스의 미니멀한 패키지 구성으로 디자인했습니다.\n제품 이미지를 크게 배치해 형태와 특징을 직관적으로 보여주고, 모델별로 블루·민트·퍼플 등의 포인트 컬러를 적용해 라인업을 쉽게 구분할 수 있도록 했습니다.\n전체적으로 불필요한 요소를 줄이고 정보의 위계를 명확하게 정리해 깔끔하고 신뢰감 있는 테크 브랜드 이미지를 표현했습니다.",
      images: [
        "images/project/box-package/01.box-package.jpg",
        "images/project/box-package/02.box-package.jpg",
        "images/project/box-package/03.box-package.jpg"
      ]
    },
    "brochure-2": {
      title: "Brochure", category: "graphic", type: "BROCHURE DESIGN",
      brand: "OZ Plasma", software: ["Ai", "Ps"],
      keywords: "Clean · Technology · Trust · Professional",
      story: "플라즈마 기술의 청정함과 전문성을 중심으로, 물과 에너지를 연상시키는 비주얼을 활용해 기술의 특성을 직관적으로 표현했습니다.\n화이트와 블루 계열을 중심으로 깨끗하고 신뢰감 있는 인상을 만들고, 인포그래픽과 도식화된 정보를 통해 복잡한 기술 내용을 쉽게 이해할 수 있도록 구성했습니다.\n전체적으로 첨단 기술 기업의 전문성과 친환경적인 이미지가 함께 느껴지도록 정리한 브로슈어 디자인입니다.",
      images: [
        "images/project/brochure-2/01.brochure.jpg",
        "images/project/brochure-2/02.brochure.jpg",
        "images/project/brochure-2/03.brochure.jpg"
      ]
    },
    "leaflet-design": {
      title: "Leaflet Design", category: "graphic", type: "LEAFLET DESIGN",
      brand: "Leaflet Design", software: ["Ai", "Ps"],
      keywords: "Natural · Authentic · Healthy · Trust",
      story: "청년 농부의 진심과 자연에서 온 건강한 이미지를 중심으로, 신뢰감 있고 따뜻한 농산물 브랜드의 분위기를 담았습니다.\n그린과 아이보리 컬러를 사용해 자연친화적인 인상을 주고, 농장과 생산자의 이미지를 함께 배치해 제품이 만들어지는 과정과 진정성을 자연스럽게 전달했습니다.\n제품 정보는 깔끔하게 정리해 친환경·건강·정직함이 한눈에 느껴지도록 구성했습니다.",
      images: [
        "images/project/leaflet-design/01.leaflet-design.jpg",
        "images/project/leaflet-design/02.leaflet-design.jpg",
        "images/project/leaflet-design/03.leaflet-design.jpg",
        "images/project/leaflet-design/04.leaflet-design.jpg",
        "images/project/leaflet-design/05.leaflet-design.jpg"
      ]
    },
    "hanwoo-package": {
      title: "한우 Package", category: "graphic", type: "PACKAGE DESIGN",
      brand: "한우 Package", software: ["Ai", "Ps"],
      keywords: "Premium · Elegant · Traditional · Sincere",
      story: "한우 선물세트가 가진 고급스러움과 정성스러운 선물의 가치가 느껴지도록 구성했습니다.\n차분한 베이지와 그레이 톤을 중심으로 전통 보자기 포장과 절제된 장식 요소를 더해, 한우의 품격과 한국적인 미감을 함께 담았습니다.\n제품 자체의 마블링과 선물 패키지가 돋보이도록 전체 분위기를 정갈하게 연출해 프리미엄 기프트 브랜드의 이미지를 강조했습니다.",
      images: [
        "images/project/hanwoo-package/01.package.jpg",
        "images/project/hanwoo-package/02.package.jpg",
        "images/project/hanwoo-package/03.package.jpg"
      ]
    },
    "dajimyuk-package": {
      title: "다짐육 Package", category: "graphic", type: "PACKAGE DESIGN",
      brand: "다짐육 Package", software: ["Ai", "Ps"],
      keywords: "Safe · Healthy · Friendly · Practical",
      story: "아기의 첫 한우라는 제품 특성이 잘 드러나도록 안전함과 신뢰감, 친근함을 중심으로 패키지를 구성했습니다.\n밝은 아이보리와 그린 컬러로 건강하고 자연스러운 이미지를 만들고, 아기와 캐릭터 일러스트를 활용해 부모가 부담 없이 선택할 수 있는 부드러운 분위기를 더했습니다.\n6구 소분 트레이와 제품 이미지를 함께 보여줘 편리함과 실용성도 직관적으로 전달했습니다.",
      images: [
        "images/project/dajimyuk-package/01.package.jpg",
        "images/project/dajimyuk-package/02.package.jpg",
        "images/project/dajimyuk-package/03.package.jpg"
      ]
    },
    "ilyang-brochure": {
      title: "일양 Brochure", category: "graphic", type: "BROCHURE DESIGN",
      brand: "일양", software: ["Ai", "Ps"],
      keywords: "Global · Trust · Professionalism · Dynamic Flow",
      story: "수출·물류의 흐름을 연상시키는 역동적인 곡선과 블루 컬러를 활용하여, 기업의 전문성과 신뢰성을 시각적으로 표현한 브로셔 디자인. 넓은 화이트 공간과 정돈된 레이아웃을 통해 정보 전달력을 높이고, 글로벌 비즈니스 기업의 깔끔하고 안정적인 이미지를 강조했습니다.",
      images: [
        "images/project/ilyang-brochure/01.brochure.jpg",
        "images/project/ilyang-brochure/02.brochure.jpg",
        "images/project/ilyang-brochure/03.brochure.jpg",
        "images/project/ilyang-brochure/04.brochure.jpg",
        "images/project/ilyang-brochure/05.brochure.jpg"
      ]
    },
    "exhibition-booth-design": {
      title: "Exhibition Booth Design", category: "graphic", type: "EXHIBITION BOOTH DESIGN",
      brand: "Exhibition Booth Design", software: ["Ai", "Ps"],
      keywords: "Premium · Mystical · High-Performance / Bright · Energetic · Daily Care",
      story: "1안. 다크 컨셉 부스\n\"Solar Eclipse Prestige\"\n우주와 일식 이미지를 활용해 강렬한 차단력과 프리미엄한 브랜드 이미지를 강조한 전시부스입니다.\n딥네이비와 블랙 중심의 컬러, 별빛과 광원 효과를 통해 신비롭고 고급스러운 분위기를 연출하며, 선스틱의 강력한 자외선 차단 기능을 인상적으로 시각화했습니다. 전체적으로 브랜드를 기능적이면서도 하이엔드한 코스메틱 브랜드로 인식시키는 데 초점을 둔 디자인입니다.\n\n2안. 브라이트 컨셉 부스\n\"Sunny Energy & Daily Protection\"\n옐로우와 화이트를 중심으로 태양의 밝고 긍정적인 이미지를 표현한 전시부스입니다.\n따뜻하고 경쾌한 컬러감으로 제품의 친숙함과 활력을 강조하며, 선케어 제품이 주는 일상적이고 산뜻한 보호 이미지를 직관적으로 전달합니다. 브랜드를 보다 밝고 다가가기 쉬운 라이프스타일 코스메틱 브랜드로 보이게 하는 방향의 디자인입니다.",
      images: [
        "images/project/exhibition-booth-design/01.exhibition-booth.jpg",
        "images/project/exhibition-booth-design/02.exhibition-booth.jpg"
      ]
    },
    "iherb": {
      title: "iHerb", category: "web", type: "UI/UX DESIGN",
      brand: "iHerb", software: ["Figma", "Ps"],
      keywords: "Healthy · Trustworthy · Intuitive · Clean",
      story: "아이허브의 기존 브랜드 아이덴티티는 유지하면서, 복잡했던 정보 구조를 정리해 건강·신뢰·편리함이 직관적으로 느껴지는 쇼핑 경험으로 리뉴얼한 디자인입니다. 브랜드의 그린 컬러를 중심으로 화이트 여백과 정돈된 그리드 시스템을 적용해 전문성과 신뢰감을 강화했으며, 건강 목적별 카테고리와 개인화 추천, 명확한 상품 정보 위계를 통해 사용자가 원하는 제품을 빠르게 탐색하고 구매까지 자연스럽게 이어질 수 있도록 구성했습니다.",
      video: "images/project/iherb/iHerb.mp4",
      images: [
        "images/project/iherb/01.iherb.jpg",
        "images/project/iherb/02.iherb.jpg",
        "images/project/iherb/03.iherb.jpg",
        "images/project/iherb/04.iherb.jpg"
      ]
    },
    "hanwoo-blog": {
      title: "Blog Design", category: "web", type: "BLOG DESIGN",
      brand: "화려한우", software: ["Figma", "Ps"],
      keywords: "Premium · Gourmet · Trust · Elegant · Appetizing",
      story: "프리미엄 한우의 고급스러운 이미지를 강조하면서, 상품과 레시피 콘텐츠를 직관적으로 연결한 프리미엄 푸드 라이프스타일 블로그 디자인입니다. 여백을 활용한 깔끔한 레이아웃과 강렬한 레드 포인트 컬러를 통해 브랜드 아이덴티티와 상품 주목도를 높였습니다.",
      images: ["images/project/hanwoo-blog/01.blog-design.jpg"]
    },
    "cosmetics": {
      title: "Cosmetics", category: "web", type: "LANDING PAGE DESIGN",
      brand: "Cosmetics", software: ["Figma", "Ps"],
      keywords: "Trendy · Bold · Colorful · Dynamic · Beauty",
      story: "Bold & Trendy Beauty Experience\n컬러풀한 비주얼과 트렌디한 메이크업 이미지를 중심으로 브랜드의 개성과 에너지를 강조한 Dynamic Beauty Editorial UI입니다. 제품, 룩북, 트렌드 콘텐츠를 직관적으로 구성해 사용자가 브랜드 감성을 경험하면서 자연스럽게 제품을 탐색할 수 있도록 디자인했습니다.",
      images: ["images/project/cosmetics/01.cosmetics.jpg"]
    },
    "verus": {
      title: "VERUS 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "VERUS", software: ["Ps"],
      keywords: "Lifestyle · Functional · Practical · Modern · Minimal · Versatile",
      story: "Smart Utility in Everyday Style\n제품의 기능성과 실용성을 일상적인 라이프스타일 이미지와 결합하여, 사용자가 제품의 가치를 직관적으로 이해할 수 있도록 구성한 상세페이지 디자인입니다. 카드 수납, 거치, 충격 보호 등 핵심 기능을 명확하게 전달하는 동시에, 실제 사용 장면을 활용해 패션 액세서리처럼 자연스럽게 어우러지는 제품의 활용성을 강조했습니다.\n뉴트럴한 베이지와 그레이 톤을 기반으로 제품 컬러를 포인트로 적용해 세련되고 안정적인 분위기를 연출했으며, 제품 중심의 비주얼과 라이프스타일 이미지를 균형 있게 배치해 기능적 정보 전달과 감성적인 브랜드 경험을 동시에 구현했습니다.",
      images: ["images/project/verus/01.verus.jpg"]
    },
    "food-brand": {
      title: "이유식 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "식품 브랜드", software: ["Ps"],
      keywords: "Trust · Safe · Healthy · Natural · Warm",
      story: "Safe Nutrition for Growing Kids\n아이의 첫 식재료를 선택하는 부모의 고민에 초점을 맞춰, 제품의 안전성·영양 정보·원재료의 신뢰도를 직관적으로 전달한 이유식 상세페이지입니다. 따뜻한 옐로우와 크림 톤을 중심으로 부드럽고 친근한 분위기를 구성하고, 실제 식재료와 이유식 이미지를 활용해 신선함과 건강한 이미지를 강조했습니다.\n제품의 원산지, 영양성분, HACCP 인증, 제조 과정 등 구매 결정에 필요한 정보를 단계적으로 배치하여 신뢰도를 높였으며, 아이의 식사 장면과 후기 콘텐츠를 함께 구성해 기능적 정보와 육아 공감 요소가 자연스럽게 연결되도록 설계했습니다.",
      images: ["images/project/food-brand/01.이유식.jpg"]
    },
    "true-religion": {
      title: "True Religion 상세페이지", category: "event", type: "LANDING PAGE DESIGN",
      brand: "True Religion", software: ["Ps"],
      keywords: "Editorial · Denim · Modern · Heritage · Minimal · Sophisticated · Fashion · Premium",
      story: "Modern Denim Editorial\n트루릴리전의 브랜드 아이덴티티와 데님의 감성을 중심으로, 제품의 핏·소재·컬러를 패션 매거진처럼 보여주는 상세페이지 디자인입니다. 뉴트럴한 그레이 톤과 인디고 컬러를 중심으로 절제된 분위기를 구성하고, 모델 화보와 제품 디테일 컷을 교차 배치해 브랜드의 세련되고 감각적인 이미지를 강조했습니다.\n브랜드 소개, 원단 정보, 실루엣, 컬러 옵션 등 구매에 필요한 정보를 시각적으로 정돈해 전달했으며, 여백과 타이포그래피를 적극적으로 활용해 제품 정보와 패션 화보가 자연스럽게 연결되는 에디토리얼형 콘텐츠 구조를 완성했습니다.",
      images: ["images/project/true-religion/01.true-religion.png"]
    },
    "phone-case": {
      title: "핸드폰케이스 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "핸드폰케이스", software: ["Ps"],
      keywords: "Technical · Protective · Rugged · Premium · Structural",
      story: "Engineered Protection, Refined Form\n제품의 강력한 보호 성능과 구조적 완성도를 중심으로, 기능성과 프리미엄 이미지를 동시에 전달한 상세페이지 디자인입니다. 블랙과 차콜 중심의 다크 톤을 기반으로 메탈 소재와 입체적인 제품 이미지를 강조해 견고하고 정교한 인상을 구현했습니다.\n맥세이프 호환, 충격 보호, 힌지 구조, 이중 설계 등 핵심 기능을 단계적으로 보여주고, 제품 분해도와 디테일 컷을 활용해 기술적 신뢰도를 높였습니다. 또한 절제된 타이포그래피와 명확한 정보 위계를 통해 고성능 모바일 액세서리 브랜드의 전문성과 세련된 테크 이미지를 일관되게 표현했습니다.",
      images: ["images/project/phone-case/01.phone-case.png"]
    },
    "baby-bicycle": {
      title: "유아자전거 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "유아자전거", software: ["Ps"],
      keywords: "Safe · Functional · Versatile · Clean · Reliable",
      story: "Smart Mobility for Growing Kids\n아이의 성장 단계에 따라 다양한 방식으로 활용할 수 있는 유아용 트라이크의 기능성과 안전성을 중심으로 구성한 상세페이지 디자인입니다. 화이트와 블루 계열의 컬러를 기반으로 깨끗하고 안정적인 인상을 형성하고, 제품의 형태와 구조가 명확하게 드러나는 이미지 구성을 통해 사용성과 신뢰도를 직관적으로 전달했습니다.\n자전거 모드, 유모차 모드, 360도 회전 시트, 안전가드, 브레이크 등 주요 기능을 단계적으로 보여주어 제품의 확장성과 편의성을 강조했으며, 실제 사용 장면과 디테일 이미지를 함께 배치해 부모가 구매 과정에서 중요하게 고려하는 안전성·실용성·성장 대응력을 효과적으로 전달했습니다.",
      images: ["images/project/baby-bicycle/01.baby-bicycle.jpg"]
    },
    "dried-persimmon": {
      title: "곶감 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "곶감", software: ["Ps"],
      keywords: "Premium · Traditional · Authentic · Natural · Trust",
      story: "Premium Tradition, Crafted by Nature\n곶감의 전통성과 프리미엄 이미지를 중심으로, 원산지와 자연 건조 과정, 당도와 품질을 체계적으로 보여주는 상세페이지 디자인입니다. 딥네이비와 블랙을 중심으로 한 절제된 컬러와 전통 문양을 활용해 고급스러운 분위기를 형성하고, 제품의 주황빛 컬러를 포인트로 사용해 시각적 집중도를 높였습니다.\n산지 정보, 건조 방식, 크기와 당도, 생산 환경 등 구매 신뢰를 높이는 핵심 정보를 단계적으로 구성했으며, 패키지와 제품 이미지를 함께 강조해 선물용 프리미엄 식품으로서의 가치와 브랜드 신뢰도를 동시에 전달했습니다.",
      images: ["images/project/dried-persimmon/01.dried-persimmon.png"]
    },
    "carrot-storage": {
      title: "당근수납함 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "당근수납함", software: ["Ps"],
      keywords: "Playful · Safe · Organized · Functional · Friendly · Practical · Kids · Bright",
      story: "Playful Organization for Kids\n아이 스스로 정리하는 습관을 형성할 수 있도록 제품의 사용성과 수납 기능을 중심으로 구성한 상세페이지 디자인입니다. 오렌지와 크림 톤을 메인 컬러로 활용해 밝고 활기찬 분위기를 만들고, 실제 놀이 공간과 아이의 사용 장면을 함께 보여주어 제품이 일상 속에서 어떻게 활용되는지 직관적으로 전달했습니다.\n수납 공간의 구성, 안전한 라운딩 마감, 미끄럼 방지, 다양한 활용 방식 등 핵심 기능을 단계적으로 보여주고, 제품 디테일과 라이프스타일 이미지를 균형 있게 배치해 아이에게는 친근함을, 부모에게는 안전성과 실용성에 대한 신뢰를 전달하도록 설계했습니다.",
      images: ["images/project/carrot-storage/01.carrot-storage.jpg"]
    },
    "earphone-case": {
      title: "이어폰케이스 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "이어폰케이스", software: ["Ps"],
      keywords: "Soft · Modern · Functional · Protective",
      story: "Soft Tech, Smart Protection\n갤럭시 버즈 케이스의 보호 기능과 휴대성을 중심으로, 일상 속에서 자연스럽게 사용할 수 있는 라이프스타일 이미지를 결합한 상세페이지 디자인입니다. 라이트 그레이와 파스텔 톤을 기반으로 부드럽고 세련된 분위기를 연출하고, 다양한 컬러 옵션을 강조해 제품 선택의 즐거움과 감성적인 소장 가치를 함께 전달했습니다.\n힌지 보호, 충격 완화, 탈착 편의성, 락 기능 등 핵심 기능을 명확한 정보 구조와 디테일 컷으로 보여주어 제품 이해도를 높였으며, 감각적인 오브제와 제품 연출 이미지를 활용해 기능성과 디자인 감성을 균형 있게 전달하는 모바일 액세서리 브랜드 이미지를 구축했습니다.",
      images: ["images/project/earphone-case/01.earphone-case.png"]
    },
    "stroller": {
      title: "유모차 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "유모차", software: ["Ps"],
      keywords: "Premium · Mobility · Compact · Functional · Comfortable",
      story: "Premium Mobility for Everyday Life\n도심과 여행 환경에서 편리하게 사용할 수 있는 유모차의 휴대성과 실용성을 중심으로 구성한 상세페이지 디자인입니다. 크림·베이지·블랙 계열의 차분한 컬러와 라이프스타일 이미지를 활용해 세련되고 프리미엄한 분위기를 연출했으며, 제품의 구조와 주요 기능이 자연스럽게 드러나도록 정보 흐름을 구성했습니다.\n한 손 폴딩, 컴팩트한 수납, 가벼운 무게, 캐노피와 시트 기능 등 실제 사용 과정에서 중요한 요소를 단계적으로 보여주어 제품의 편의성을 강조했습니다. 또한 부모와 아이가 함께하는 일상 장면을 적극 활용해 기능적 장점뿐 아니라 이동 경험과 라이프스타일까지 함께 전달하는 브랜드 이미지를 구현했습니다.",
      images: ["images/project/stroller/01.stroller.png"]
    },
    "bus-organizer": {
      title: "버스정리대 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "버스정리대", software: ["Ps"],
      keywords: "Organized · Functional · Modular · Safe · Playful",
      story: "Smart Storage for Growing Kids\n아이 스스로 정리하는 습관을 자연스럽게 익힐 수 있도록 수납 기능과 공간 활용성을 중심으로 구성한 상세페이지 디자인입니다. 화이트 베이스에 퍼플과 민트 계열을 포인트 컬러로 활용해 밝고 친근한 이미지를 형성하고, 실제 아이가 사용하는 생활 장면을 통해 제품의 활용성을 직관적으로 전달했습니다.\n다양한 수납 방식과 2층 구조, 확장 가능한 구성, 안전한 마감 등 핵심 기능을 단계적으로 보여주어 제품의 실용성을 강조했으며, 제품 디테일과 라이프스타일 이미지를 균형 있게 배치해 정리 습관·공간 효율·안전성을 동시에 전달하는 키즈 수납 브랜드 이미지를 완성했습니다.",
      images: ["images/project/bus-organizer/01.bus-organizer.jpg"]
    },
    "step-stool": {
      title: "디딤대 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "디딤대", software: ["Ps"],
      keywords: "Safe · Independent · Functional · Adjustable",
      story: "Growing Independence, Safely\n아이의 자립적인 생활 습관을 돕는 디딤대의 안전성과 활용성을 중심으로 구성한 상세페이지입니다. 부드러운 컬러와 실제 사용 장면을 통해 친근한 키즈 라이프스타일 이미지를 형성하고, 높이 조절과 안전 구조 등 핵심 기능을 직관적으로 전달했습니다.",
      images: ["images/project/step-stool/01.step-stool.png"]
    },
    "supplement": {
      title: "영양제 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "영양제", software: ["Ps"],
      keywords: "Healthy · Kids · Nutrition · Friendly · Bright",
      story: "Healthy Growth, Easy Everyday Care\n성장기 아이를 위한 영양 성분과 간편한 섭취 방식을 중심으로 구성한 키즈 영양제 상세페이지입니다. 밝고 친근한 컬러와 캐릭터 비주얼을 활용해 접근성을 높이고, 핵심 성분과 기능 정보를 체계적으로 구성해 제품의 신뢰도와 이해도를 높였습니다.",
      images: ["images/project/supplement/01.supplement.png"]
    },
    "pet-supplies": {
      title: "펫용품 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "펫용품", software: ["Ps"],
      keywords: "Pet-Friendly · Safe · Comfortable · Modular",
      story: "Safe Space for Happy Pets\n반려동물의 안전과 편안함을 중심으로, 확장 가능한 구조와 다양한 공간 활용성을 직관적으로 보여준 펫가구 상세페이지입니다. 따뜻한 컬러와 실제 사용 장면을 활용해 친근한 브랜드 이미지를 형성하고, 소재와 구조적 장점을 체계적으로 전달했습니다.",
      images: ["images/project/pet-supplies/01.pet-supplies.png"]
    },
    "rocking-horse": {
      title: "흔들말 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "흔들말", software: ["Ps"],
      keywords: "Playful · Safe · Growing · Functional · Active",
      story: "Safe Play, Happy Growth\n아이의 놀이 경험과 안전성을 중심으로 구성한 유아 흔들말 상세페이지입니다. 밝고 부드러운 컬러와 실제 사용 장면을 활용해 친근한 브랜드 이미지를 형성하고, 흔들말·붕붕카·밸런스 기능과 안전 요소를 체계적으로 전달해 제품의 활용성과 신뢰도를 강조했습니다.",
      images: ["images/project/rocking-horse/01.rocking-horse.png"]
    },
    "slide": {
      title: "미끄럼틀 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "미끄럼틀", software: ["Ps"],
      keywords: "Safe · Playful · Calm · Modular · Functional",
      story: "Calm Play, Safe Growth\n아이의 안전한 놀이와 공간 활용성을 중심으로 구성한 미끄럼틀 상세페이지입니다. 차분한 세이지 그린과 뉴트럴 컬러를 활용해 감성적인 키즈 라이프스타일 이미지를 구축하고, 다양한 세트 구성과 안전 구조를 체계적으로 전달해 제품의 실용성과 프리미엄 이미지를 강조했습니다.",
      images: ["images/project/slide/01.slide.png"]
    },
    "multi-high-chair": {
      title: "멀티하이체어 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "멀티하이체어", software: ["Ps"],
      keywords: "Versatile · Safe · Comfortable · Functional · Growing",
      story: "Growing Together, Everyday Comfort\n아이의 성장 단계에 따라 다양하게 활용할 수 있는 4 in 1 하이체어의 기능성과 안전성을 중심으로 구성한 상세페이지입니다. 따뜻하고 부드러운 컬러와 실제 사용 장면을 활용해 친근한 브랜드 이미지를 형성하고, 식사·놀이·휴식 등 다양한 활용 방식을 직관적으로 전달했습니다.",
      images: ["images/project/multi-high-chair/01.multi-high-chair.jpg"]
    },
    "baby-lotion": {
      title: "유아로션 상세페이지", category: "event", type: "PRODUCT PAGE DESIGN",
      brand: "유아로션", software: ["Ps"],
      keywords: "Gentle · Clean · Moisturizing · Sensitive · Natural",
      story: "Gentle Care for Delicate Skin\n민감한 유아 피부를 위한 저자극 보습 케어를 중심으로 구성한 상세페이지입니다. 화이트와 민트 계열의 부드러운 컬러와 자연 원료 비주얼을 활용해 순하고 깨끗한 이미지를 형성하고, 성분과 보습 기능을 체계적으로 전달해 제품의 전문성과 신뢰도를 강조했습니다.",
      images: ["images/project/baby-lotion/01.baby-lotion.jpg"]
    },
    "hanwoo-holiday-event": {
      title: "설 선물전 이벤트", category: "promo", type: "EVENT PAGE DESIGN",
      brand: "화려한우", software: ["Ps"],
      keywords: "Warm · Festive · Premium · Traditional · Gifting",
      story: "Warm Holiday, Premium Gifting\n설 명절을 맞아 시그니처 선물세트를 소개하는 프로모션 페이지 디자인입니다. 보름달과 캐릭터 일러스트를 활용해 따뜻한 명절 분위기를 연출하고, 라이브 특가와 쿠폰 혜택을 단계적으로 배치해 구매 전환을 유도하도록 구성했습니다.",
      images: ["images/project/hanwoo-holiday-event/01.hanwoo-holiday-event.jpg"]
    },
    "dawn-delivery-event": {
      title: "새벽배송 DAY 이벤트", category: "promo", type: "EVENT PAGE DESIGN",
      brand: "새벽배송", software: ["Ps"],
      keywords: "Fresh · Fast · Trendy · Vivid · Convenient",
      story: "Fresh & Fast, Delivered at Dawn\n신선식품을 빠르고 저렴하게 받아보는 새벽배송 프로모션 페이지입니다. 보랏빛 그라디언트와 캐릭터 트럭 일러스트로 브랜드의 속도감을 표현하고, 연예인 후기와 전용 쿠폰, 베스트 상품을 순차적으로 배치해 신뢰도와 구매 욕구를 동시에 끌어올리도록 구성했습니다.",
      images: ["images/project/dawn-delivery-event/01.dawn-delivery-event.jpg"]
    },
    "spring-festa-event": {
      title: "봄페스타 이벤트", category: "promo", type: "EVENT PAGE DESIGN",
      brand: "화려한우", software: ["Ps"],
      keywords: "Romantic · Fresh · Pink · Seasonal · Playful",
      story: "Romantic Spring, Special Deal\n봄 시즌 한정 프로모션을 알리는 시즌 이벤트 페이지 디자인입니다. 벚꽃과 핑크 톤 그라데이션으로 봄의 설렘을 표현하고, 라이브 특가 상품과 쿠폰 혜택을 강조해 시즌 프로모션의 특별함을 직관적으로 전달했습니다.",
      images: ["images/project/spring-festa-event/01.spring-festa-event.jpg"]
    },
    "hanwoo-newyear-event": {
      title: "설날 브랜드데이 이벤트", category: "promo", type: "EVENT PAGE DESIGN",
      brand: "화려한우", software: ["Ps"],
      keywords: "Traditional · Warm · Trustworthy · Premium · Festive",
      story: "New Year Brand Day, Wishes Delivered\n새해를 맞아 진행되는 브랜드데이 프로모션 페이지 디자인입니다. 크림과 그린 톤의 전통적인 색감과 캐릭터 일러스트로 정겨운 명절 분위기를 살리고, 세일 혜택과 라이브 이벤트를 단계별로 구성해 명확한 정보 전달과 구매 유도를 함께 이끌어냈습니다.",
      images: ["images/project/hanwoo-newyear-event/01.hanwoo-newyear-event.jpg"]
    },
    "benebene-sns-cards": {
      title: "베네베네 SNS 카드뉴스", category: "promo", type: "SNS CARD DESIGN",
      brand: "베네베네", software: ["Ps"],
      keywords: "Playful · Bright · Kids · Friendly · Colorful",
      story: "Playful Moments, Shared Everyday\n키즈 브랜드의 신제품과 이벤트 소식을 전하는 SNS 카드뉴스 세트입니다. 제품별 컬러감을 살린 카드 구성과 아이들의 생활 장면을 활용해 브랜드의 친근하고 발랄한 이미지를 SNS 채널에서 일관되게 전달하도록 디자인했습니다.",
      images: ["images/project/benebene-sns-cards/01.benebene-sns-cards.jpg"]
    },
    "hanwoo-sns-cards": {
      title: "화려한우 SNS 카드뉴스", category: "promo", type: "SNS CARD DESIGN",
      brand: "화려한우", software: ["Ps"],
      keywords: "Premium · Bold · Trustworthy · Appetizing · Modern",
      story: "Premium Taste, Told in Cards\n한우 브랜드의 이벤트와 콘텐츠 소식을 전하는 SNS 카드뉴스 세트입니다. 레드와 블랙 중심의 색감으로 브랜드의 프리미엄 이미지를 강조하고, 제품 비주얼과 카피를 균형 있게 구성해 SNS 채널에서의 주목도와 신뢰도를 동시에 높였습니다.",
      images: ["images/project/hanwoo-sns-cards/01.hanwoo-sns-cards.jpg"]
    }
  };

  var id = new URLSearchParams(window.location.search).get("id");
  var project = PROJECTS[id];

  if (!project) {
    titleEl.textContent = "프로젝트를 찾을 수 없습니다";
    var sidebarHeadingEl = document.getElementById("projectSidebarHeading");
    if (sidebarHeadingEl) sidebarHeadingEl.textContent = "work.html에서 다시 선택해주세요.";
    return;
  }

  var categoryLabel = CATEGORIES[project.category] || project.category;
  var categoryHref = "work.html#" + project.category;

  document.getElementById("pageTitle").textContent = project.title + " | Hanna Lee";
  titleEl.textContent = project.title;
  document.getElementById("breadcrumbTitle").textContent = project.title;

  var breadcrumbCategoryEl = document.getElementById("breadcrumbCategory");
  breadcrumbCategoryEl.textContent = categoryLabel;
  breadcrumbCategoryEl.href = categoryHref;

  document.getElementById("projectSidebarHeading").textContent = project.type;
  document.getElementById("projectBrand").textContent = project.brand;
  document.getElementById("projectStory").textContent = project.story;

  if (project.keywords) {
    document.getElementById("projectKeywords").textContent = project.keywords;
    document.getElementById("projectKeywordsBlock").hidden = false;
  }

  var softwareEl = document.getElementById("projectSoftware");
  project.software.forEach(function (name) {
    var badge = document.createElement("span");
    badge.className = "software-badge";
    badge.textContent = name;
    softwareEl.appendChild(badge);
  });

  if (project.video || (project.images && project.images.length)) {
    var imageEl = document.getElementById("projectImage");
    imageEl.classList.add("has-image");

    if (project.video) {
      var videoWrap = document.createElement("div");
      videoWrap.className = "project-media__video-wrap";
      var videoTag = document.createElement("video");
      videoTag.className = "project-media__video";
      videoTag.src = project.video;
      videoTag.controls = true;
      videoTag.playsInline = true;
      videoWrap.appendChild(videoTag);
      imageEl.appendChild(videoWrap);
    }

    if (project.images) {
      project.images.forEach(function (src, i) {
        var imgTag = document.createElement("img");
        imgTag.className = "project-media__img";
        imgTag.src = src;
        imgTag.alt = project.title + " " + (i + 1);
        imageEl.appendChild(imgTag);
      });
    }
  }
})();
