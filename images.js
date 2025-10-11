// ✅ Trạng thái giảm giá
let enableSale = localStorage.getItem("saleOff") === "true" ? false : true;
const discountPercent = 20;

const sections = [
  {
    title: "Xứ sở hoàng hôn",
    class: "vertical",
    items: [
      ["xhh01.JPEG", 20000], ["xhh02.JPEG", 20000], ["xhh03.JPEG", 18000],
      ["xhh04.PNG", 19000], ["xhh06.JPEG", 25000],
      ["xhh07.JPEG", 22000], ["xhh08.JPG", 20000], ["xhh09.JPG", 20000],
      ["xhh010.JPG", 20000], ["xhh11.jpg", 20000], ["xhh12.jpg", 20000],
      ["xhh13.jpg", 20000], ["xhh14.jpg", 20000], ["xhh15.jpg", 20000],
       ["xhh17.jpg", 20000],
      ["xhh19.jpg", 25000], ["xhh21.jpg", 20000],
      ["xhh22.jpg", 20000], ["xhh23.jpg", 20000], ["xhh24.jpg", 20000],
      ["xhh25.jpg", 20000], ["xhh26.jpg", 20000], ["xhh27.jpg", 20000],
      ["xhh28.jpg", 20000], ["xhh29.jpg", 20000], ["xhh30.jpg", 20000],
      ["xhh32.jpg", 20000], ["xhh33.jpg", 20000], ["xhh34.jpg", 20000],
	["VIP0001.jpg", 20000], ["VIP0002.jpg", 20000], 
	["VIP0003.jpg", 20000], ["VIP0004.jpg", 20000], 
      ["xhh35.jpg", 20000]
    ]
  },
	 {
    title: "Xứ sở tiền đâu",
    class: "vertical",
    items: [
      ["VIP1013.jpg", 20000], ["VIP1014.jpg", 20000],
	["xhh05.JPEG", 20000], ["xhh16.jpg", 20000],
	["xhh18.jpg", 20000],["xhh20.jpg", 20000]
    ]
  },
  {
    title: "Xứ sở bình minh",
    class: "horizontal",
    items: [
      ["xbm01.JPEG", 20000], ["xbm02.JPEG", 19000], ["xbm03.JPEG", 20000],
      ["xbm04.JPEG", 18000], ["xbm12.JPEG", 20000], ["xbm14.JPEG", 20000],
      ["xbm07.JPEG", 14000], ["xbm08.JPEG", 16000], 
      ["xbm17.JPEG", 20000], ["xbm18.JPEG", 20000],
      ["xbm19.JPEG", 22000], ["xbm20.JPEG", 18000], ["xbm21.JPEG", 22000],
      ["xbm24.jpg", 16000], ["xbm25.jpg", 12000], 
	["HOT0001.jpg", 20000], ["HOT0004.jpg", 20000], 
	["xbm26.jpg", 20000]
    ]
  },
  {
    title: "Xứ sở pha lê",
    class: "horizontal",
    items: [
      ["xbm05.JPEG", 25000], ["xbm06.PNG", 20000], ["xbm09.JPG", 25000],
      ["xbm11.JPEG", 20000], ["xbm13.JPEG", 20000],
	["HOT0002.jpg", 20000], ["HOT0003.jpg", 20000],
		["xbm16.JPEG", 25000],
      ["xbm22.JPEG", 35000], ["xbm23.jpg", 20000]
    ]
  },
{
    title: "Xứ sở bim bim",
    class: "horizontal",
    items: [
      ["HOT1001.jpg", 20000], ["HOT1002.jpg", 20000],
	["xbm10.JPEG", 18000], ["xbm15.JPEG", 14000]
    ]
  },
{
    title: "Xứ sở thần tiên",
    class: "vertical",
    items: [
    ["VIP1001.jpg", 30000], ["VIP1002.jpg", 30000],
	["VIP1003.jpg", 30000], ["VIP1004.jpg", 30000],
	["VIP1005.jpg", 30000], ["VIP1006.jpg", 30000],
	["VIP1007.jpg", 30000], ["VIP1008.jpg", 30000],
	["VIP1009.jpg", 30000], ["VIP1010.jpg", 30000],
	["VIP1011.jpg", 30000], ["VIP1012.jpg", 30000],
    ]
  },
  { title: "Cứ nhắn zalo: 0347510287 mình nha" }
];

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  sections.forEach(sec => {
    const title = document.createElement("h2");
    title.textContent = sec.title;
    body.appendChild(title);

    if (!sec.items) return;

    const div = document.createElement("div");
    div.className = `gallery ${sec.class}`;
    body.appendChild(div);

    sec.items.forEach(([img, price], i) => {
      const card = document.createElement("div");
      card.className = "card";

      let finalPrice = price;
      if (enableSale) {
        finalPrice = Math.ceil(price * (1 - discountPercent / 100) / 1000) * 1000;
      }

      const priceDisplay = enableSale
        ? `<div class="overlay bottom">
            <s style="color:#a00;">${price.toLocaleString()}đ</s>
            <span style="color:#000; font-weight:700;"> ${finalPrice.toLocaleString()}đ</span>
          </div>`
        : `<div class="overlay bottom">Giá: ${price.toLocaleString()}đ</div>`;

      card.innerHTML = `
        <img src="images/${img}" alt="${sec.title} ${i+1}">
        <div class="overlay top">${img.split('.')[0].toUpperCase()}</div>
        ${priceDisplay}
      `;
      div.appendChild(card);
    });
  });

  startCountdown();
});

// ✅ Cập nhật giá khi hết giảm giá
function updatePrices() {
  document.querySelectorAll(".card").forEach(card => {
    const bottomOverlay = card.querySelector(".overlay.bottom");
    if (!bottomOverlay) return;

    const text = bottomOverlay.innerHTML;
    const match = text.match(/(\d{1,3}(?:,\d{3})*)đ/);
    if (!match) return;

    const originalPrice = parseInt(match[1].replace(/,/g, ""));
    bottomOverlay.innerHTML = `Giá: ${originalPrice.toLocaleString()}đ`;
  });
}

// ⏰ Flash Sale Countdown
function startCountdown() {
  const saleEndTime = new Date("2025-10-13T00:00:00+07:00").getTime();
  const countdownEl = document.getElementById("countdown");

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = saleEndTime - now;

    if (distance < 0) {
      clearInterval(timer);
      countdownEl.innerHTML = "Hết thời gian giảm giá!";

      setTimeout(() => {
        document.getElementById("sale-banner").style.display = "none";
      }, 3000);

      enableSale = false;
      updatePrices();
      return;
    }

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownEl.innerHTML =
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const timer = setInterval(updateCountdown, 1000);
  updateCountdown();
}
// JavaScript Document
// =====================
// 🔎 TÌM ẢNH THEO MÃ FILE
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");
  const result = document.getElementById("result");

function showImage() {
  const code = input.value.trim().toLowerCase(); // Đưa mã nhập về chữ thường
  if (!code) {
    result.innerHTML = `<p class="notice">Vui lòng nhập mã ảnh.</p>`;
    return;
  }

  // Lấy toàn bộ danh sách file ảnh từ sections
  const allImages = sections.flatMap(s => s.items || []).map(([name]) => name);

  // Tìm file có tên (bỏ đuôi) trùng với mã người dùng nhập
  const matchedFile = allImages.find(name => name.split('.')[0].toLowerCase() === code);

  if (matchedFile) {
    const imgPath = `images/${matchedFile}`;
    result.innerHTML = `
      <div class="preview">
        <img src="${imgPath}" alt="${code}">
        <p class="caption">Mã ảnh: <b>${matchedFile.split('.')[0].toUpperCase()}</b></p>
      </div>`;
  } else {
    result.innerHTML = `<p class="notice notfound">❌ Không tìm thấy ảnh "${code.toUpperCase()}"</p>`;
  }
}


  btn?.addEventListener("click", showImage);
  input?.addEventListener("keypress", e => {
    if (e.key === "Enter") showImage();
  });
});
