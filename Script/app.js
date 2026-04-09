document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("a").forEach(link => {

    link.addEventListener("dragstart", e => e.preventDefault());

    link.addEventListener("contextmenu", e => e.preventDefault());

    link.addEventListener("mousedown", e => {
      if (e.button === 0) e.preventDefault(); // زر الماوس
    });

  });

});


document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  });

});


document.addEventListener("DOMContentLoaded", () => {

  document.addEventListener("contextmenu", (e) => {
    
    // إذا العنصر رابط <a>
    if (e.target.closest("a")) {
      e.preventDefault();
    }

  });

});
