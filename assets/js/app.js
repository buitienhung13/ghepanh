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

// Data storage
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
  return hero.skins.find(s => s.file === skinSelect.value);
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
// Event listeners
// ==================
tuongSelect.addEventListener("change", () => {
  const hero = getSelectedHero();
  populateSelect(skinSelect, hero.skins);
  drawCanvas();
});

skinSelect.addEventListener("change", drawCanvas);
khungSelect.addEventListener("change", drawCanvas);
phepSelect.addEventListener("change", drawCanvas);
thongthaoSelect.addEventListener("change", drawCanvas);
trikiSelect.addEventListener("change", drawCanvas);
vienvangCheck.addEventListener("change", drawCanvas);
tenGameInput.addEventListener("input", drawCanvas);

saveBtn.addEventListener("click", ()=>{
  const link = document.createElement("a");
  link.download = "skin_preview.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

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
    
    // Kích thước mới (ví dụ nhỏ 80% và dịch xuống 50px)
    const newWidth = canvas.width * 0.91;   // nhỏ 80% so với canvas
    const newHeight = canvas.height * 0.91; // nhỏ 80% so với canvas
    const newX = (canvas.width - newWidth) / 2; // căn giữa ngang
    const newY = 60; // dịch xuống 50px
    
    drawImageCover(ctx, imgHero, newX, newY, newWidth, newHeight);
}

  // Layer 2: Khung
  const imgKhung = await loadImage("khung/" + khung);
  drawImageCover(ctx, imgKhung, 0,0, canvas.width, canvas.height);

  // Layer 3: Tag
if (skin && skin.tag) {
  const imgTag = await loadImage("tag/" + skin.tag + ".png");
  const tagW = 380;   // độ rộng tag
  const tagH = 380;   // độ cao tag
  const tagX = (canvas.width - tagW) / 2;   // giữa theo chiều ngang
  const tagY = (canvas.height - tagH) / 2 + 60; // giữa theo chiều dọc (trừ bớt 100px để hơi cao hơn giữa)
  drawImageCover(ctx, imgTag, tagX, tagY, tagW, tagH);
}
  // Layer 4: Thông thạo
  const imgThongthao = await loadImage("thongthao/" + thongthao);
  drawImageCover(ctx, imgThongthao, 50,40,240,240);

  // Layer 5: Phép bổ trợ
  const imgPhep = await loadImage("phepbotro/" + phep);
  const phepW = 134;
  const phepH = 134;
  const phepX = (canvas.width - phepW) / 2;  // căn giữa ngang
  const phepY = canvas.height - phepH - 26; // xích xuống một chút
  drawImageCover(ctx, imgPhep, phepX, phepY, phepW, phepH);
  
  // Layer 6: Tri kỉ
  const imgTriki = await loadImage("triki/" + triki);
  const trikiW = 150;
  const trikiH = 150;
  const trikiX = 165;                         // hơi sát trái một chút
  const trikiY = canvas.height - trikiH - 35; // xuống dưới một chút
  drawImageCover(ctx, imgTriki, trikiX, trikiY, trikiW, trikiH);

  // Layer 7: Viền vàng
  if(vien){
    const imgVien = await loadImage(vien);
    
    // Kích thước mới: nhỏ 90% và dịch xuống 30px
    const newWidth = canvas.width * 0.9;
    const newHeight = canvas.height * 0.9;
    const newX = (canvas.width - newWidth) / 2; // căn giữa ngang
    const newY = 422; // dịch xuống 30px
    
    drawImageCover(ctx, imgVien, newX, newY, newWidth, newHeight);
}

  // Layer 8: Tên tướng
  if(hero){
    let text = hero.name;
    let fontSize = 75;
    ctx.textAlign = "center";       // căn giữa ngang
    ctx.textBaseline = "middle";    // căn giữa theo chiều dọc

    // Tự động giảm font nếu chữ vượt 500px
    do {
        ctx.font = `${fontSize}px Arial`;
        var textWidth = ctx.measureText(text).width;
        if (textWidth > 600) fontSize -= 1;
        else break;
    } while(fontSize > 10);

    const x = canvas.width / 2;
    const y = canvas.height - 330;  // xích xuống chút so với cũ

    // Vẽ stroke đen bên ngoài
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.strokeText(text, x, y);

    // Vẽ fill màu xanh
    ctx.fillStyle = "#3094ff";
    ctx.fillText(text, x, y);
}
  
  // Layer 9: Tên skin
  if(skin && skin.displayName){
    let text = skin.displayName;
    let fontSize = 75;
    ctx.textAlign = "center";       // căn giữa ngang
    ctx.textBaseline = "middle";    // căn giữa theo chiều dọc

    // Tự động giảm font nếu chữ vượt 500px
    do {
        ctx.font = `${fontSize}px Arial`;
        var textWidth = ctx.measureText(text).width;
        if (textWidth > 630) fontSize -= 1;
        else break;
    } while(fontSize > 10);

    const x = canvas.width / 2;
    const y = canvas.height - 430;  // xích xuống chút

    // Vẽ stroke đen bên ngoài
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.strokeText(text, x, y);

    // Vẽ fill vàng
    ctx.fillStyle = "#ffefae";
    ctx.fillText(text, x, y);
}
  // Layer 10: Tên game
ctx.font = "75px Arial";
ctx.textAlign = "center";       // căn giữa ngang
ctx.textBaseline = "middle";    // căn giữa dọc chữ
ctx.fillStyle = vienvangCheck.checked ? "#ffefae" : "#ffffff"; // màu theo checkbox

const x = canvas.width / 2;     // giữa canvas
const y = canvas.height - 240;   // xích xuống một chút

ctx.fillText(nameGame, x, y);
}

// ==================
// Init
// ==================
loadAllData();