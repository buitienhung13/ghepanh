const container = document.getElementById("galleryContainer");
const searchInput = document.getElementById("searchInput");
let galleryData = [];

// Load dữ liệu từ JSON
fetch('assets/data/gallery.json')
  .then(response => response.json())
  .then(data => {
    galleryData = data;
    renderGallery(galleryData);
  })
  .catch(error => console.error('Lỗi khi load JSON:', error));

function renderGallery(data) {
  container.innerHTML = data.map(item => `
    <div class="card">
      <a href="detail.html?id=${encodeURIComponent(item.id)}">
        <img src="${item.image}" alt="${item.title}">
        <div class="card-id">${item.id}</div>
      </a>
    </div>
  `).join("");
}

searchInput.addEventListener("input", e => {
  const keyword = e.target.value.trim().toLowerCase();
  const filtered = galleryData.filter(i => i.id.toLowerCase().includes(keyword));
  renderGallery(filtered);
});
