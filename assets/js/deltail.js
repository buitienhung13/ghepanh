fetch('assets/data/gallery.json')
  .then(res => res.json())
  .then(data => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const item = data.find(i => i.id.toLowerCase() === id.toLowerCase());
    const container = document.getElementById('detailContainer');

    if(item) {
      container.innerHTML = `
        <div class="detail-card">
          <img id="detailImage" src="${item.image}" alt="${item.title}">
          <h2>${item.title}</h2>
          <p>${item.description}</p>
          ${item.link ? `<a href="${item.link}" target="_blank">Xem trên Facebook</a>` : ''}
        </div>
      `;
    } else {
      container.innerHTML = `<p>Không tìm thấy thông tin ảnh.</p>`;
    }
  })
  .catch(err => console.error('Lỗi load chi tiết:', err));
