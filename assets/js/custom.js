window.addEventListener("load", () => {
    const loader = document.querySelector(".loader-container");
    const mainContent = document.querySelector(".main-content");
  
    // Sau 3 giây ẩn loader và hiện nút
    setTimeout(() => {
      loader.classList.add("fade-out");
      setTimeout(() => {
        loader.style.display = "none";
        mainContent.style.display = "flex"; // hiện 2 nút ra giữa
      }, 800);
    }, 3000);
  });
  