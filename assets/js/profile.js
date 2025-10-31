// profile.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('contactPopupContainer');
  const hamburger = document.getElementById('hamburger');

  // Load nội dung popup từ file profile.html
  fetch('assets/html/profile.html')
    .then(response => response.text())
    .then(data => {
      container.innerHTML = `<div class="contact-popup" id="contactPopup">${data}</div>`;

      const popup = document.getElementById('contactPopup');
      const closeBtn = document.getElementById('closePopup');

      // Gán event nút đóng
      closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
      });

      // Gán event hamburger
      hamburger.addEventListener('click', () => {
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
      });
    })
    .catch(err => console.error('Lỗi load profile:', err));
});
