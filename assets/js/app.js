const canvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");

// Controls
const tuongSelect = document.getElementById("tuongSelect");
const skinSelect = document.getElementById("skinSelect");
const khungSelect = document.getElementById("khungSelect");
const phepSelect = document.getElementById("phepSelect");
const thongthaoSelect = document.getElementById("thongthaoSelect");
const trikiSelect = document.getElementById("trikiSelect");
const vienvangCheck = document.getElementById("vienvangCheck");
const tenGameInput = document.getElementById("tenGameInput");
const saveBtn = document.getElementById("saveBtn");
const createBtn = document.getElementById("createBtn");

// Data
let heroes = [];
let khungs = [];
let pheps = [];
let thongthaos = [];
let trikis = [];
const vienvangFile = "vienvang.png";

// ==================
// Load JSON động
// ==================
async function loadJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load ' + url + ' (status ' + res.status + ')');
  return await res.json();
}

async function loadAllData() {
  heroes = await loadJSON("assets/data/heroandskin.json");
  khungs = await loadJSON("assets/data/khung.json");
  pheps = await loadJSON("assets/data/phepbotro.json");
  thongthaos = await loadJSON("assets/data/thongthao.json");
  trikis = await loadJSON("assets/data/triki.json");
  
  populateSelect(tuongSelect, heroes, true);
  populateSelect(khungSelect, khungs);
  populateSelect(phepSelect, pheps);
  populateSelect(thongthaoSelect, thongthaos);
  populateSelect(trikiSelect, trikis);

  // Gọi event change để load danh sách skin đầu tiên
  tuongSelect.dispatchEvent(new Event("change"));
}

// ==================
// Populate select
// ==================
function populateSelect(select, data, isHero=false) {
  select.innerHTML = "";
  data.forEach(item => {
    const option = document.createElement("option");
    if(isHero){
      option.value = item.name;
      option.textContent = item.name;
    } else {
      option.value = item.file;
      option.textContent = item.displayName || item.file;
    }
    select.appendChild(option);
  });
}

// ==================
// Helper
// ==================
function getSelectedHero() {
  return heroes.find(h => h.name === tuongSelect.value);
}

function getSelectedSkin() {
  const hero = getSelectedHero();
  return hero?.skins.find(s => s.file === skinSelect.value);
}

function loadImage(src){
  return new Promise(resolve=>{
    const img = new Image();
    img.src = "assets/images/" + src;
    img.onload = ()=>resolve(img);
    img.onerror = ()=>resolve(null);
  });
}

function drawImageCover(ctx, img, x, y, w, h){
  if(!img) return;
  const scale = Math.min(w / img.width, h / img.height);
  const iw = img.width * scale;
  const ih = img.height * scale;
  const ix = x + (w - iw)/2;
  const iy = y + (h - ih)/2;
  ctx.drawImage(img, ix, iy, iw, ih);
}

// ==================
// Draw canvas
// ==================
async function drawCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const hero = getSelectedHero();
  const skin = getSelectedSkin();
  const khung = khungSelect.value;
  const phep = phepSelect.value;
  const thongthao = thongthaoSelect.value;
  const triki = trikiSelect.value;
  const vien = vienvangCheck.checked ? vienvangFile : null;
  const nameGame = tenGameInput.value;

  // Layer 1: Hero + skin
  if(skin){
    const imgHero = await loadImage("heroandskin/" + skin.file);
    const newWidth = canvas.width * 0.91;
    const newHeight = canvas.height * 0.91;
    const newX = (canvas.width - newWidth) / 2;
    const newY = 60;
    drawImageCover(ctx, imgHero, newX, newY, newWidth, newHeight);
  }

  // Layer 2: Khung
  const imgKhung = await loadImage("khung/" + khung);
  drawImageCover(ctx, imgKhung, 0,0, canvas.width, canvas.height);

  // Layer 3: Tag
  if (skin && skin.tag) {
    const imgTag = await loadImage("tag/" + skin.tag + ".png");
    if (imgTag) {
      const tagW = 380;
      const scale = tagW / imgTag.width;
      const tagH = imgTag.height * scale;
      const tagX = (canvas.width - tagW) / 2; 
      const tagY = canvas.height - tagH - 455;
      drawImageCover(ctx, imgTag, tagX, tagY, tagW, tagH);
    }
  }

  // Layer 4: Thông thạo
  const imgThongthao = await loadImage("thongthao/" + thongthao);
  drawImageCover(ctx, imgThongthao, 50,40,240,240);

  // Layer 5: Phép bổ trợ
  const imgPhep = await loadImage("phepbotro/" + phep);
  drawImageCover(ctx, imgPhep, (canvas.width - 137) / 2, canvas.height - 167, 137, 137);
  
  // Layer 6: Tri kỉ
  const imgTriki = await loadImage("triki/" + triki);
  drawImageCover(ctx, imgTriki, 165, canvas.height - 185, 150, 150);

  // Layer 7: Viền vàng
  if(vien){
    const imgVien = await loadImage(vien);
    const newWidth = canvas.width * 0.8;
    const newHeight = canvas.height * 0.8;
    const newX = (canvas.width - newWidth) / 2;
    const newY = 486;
    drawImageCover(ctx, imgVien, newX, newY, newWidth, newHeight);
  }

  // Layer 8: Tên tướng
  if(hero){
    let text = hero.name;
    let fontSize = 75;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    do {
        ctx.font = `${fontSize}px Arial`;
        var textWidth = ctx.measureText(text).width;
        if (textWidth > 600) fontSize -= 1;
        else break;
    } while(fontSize > 10);

    const x = canvas.width / 2;
    const y = canvas.height - 328;

    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.strokeText(text, x, y);

    ctx.fillStyle = "#3094ff";
    ctx.fillText(text, x, y);
  }
  
  // Layer 9: Tên skin
  if(skin && skin.displayName){
    let text = skin.displayName;
    let fontSize = 75;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    do {
        ctx.font = `${fontSize}px Arial`;
        var textWidth = ctx.measureText(text).width;
        if (textWidth > 630) fontSize -= 1;
        else break;
    } while(fontSize > 10);

    const x = canvas.width / 2;
    const y = canvas.height - 430;

    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.strokeText(text, x, y);

    ctx.fillStyle = "#f9dc92ff";
    ctx.fillText(text, x, y);
  }

  // Layer 10: Tên game
  ctx.font = "68px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = vienvangCheck.checked ? "#f9dc92ff" : "#ffffff";
  ctx.fillText(nameGame, canvas.width / 2, canvas.height - 235);
}

// ==================
// Event listeners
// ==================
tuongSelect.addEventListener("change", () => {
  const hero = getSelectedHero();
  if (!hero || !hero.skins) return;
  populateSelect(skinSelect, hero.skins);
  // chọn skin đầu tiên luôn
  skinSelect.selectedIndex = 0;
});

// ==================
// Nút "Tạo ảnh"
// ==================
createBtn.addEventListener("click", async () => {
  // Vô hiệu hóa nút và đổi chữ
  createBtn.disabled = true;
  createBtn.textContent = "⏳ Đang tạo ảnh...";

  // Vẽ canvas
  await drawCanvas();

  // Hiển thị canvas và nút lưu
  canvas.style.display = "block";
  saveBtn.style.display = "inline-block";

  // Cuộn xuống canvas
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  // Bật lại nút và trả chữ về
  createBtn.disabled = false;
  createBtn.textContent = "✨ Tạo ảnh";
});

// ==================
// Nút "Lưu ảnh"
// ==================
saveBtn.addEventListener("click", ()=>{
  const link = document.createElement("a");
  link.download = "skin_preview.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
// ==================
// Init
// ==================
loadAllData();
