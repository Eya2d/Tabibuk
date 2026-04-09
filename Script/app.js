document.addEventListener("DOMContentLoaded", () => {

  // منع الكليك يمين وسحب للروابط
  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("dragstart", e => e.preventDefault());
    link.addEventListener("contextmenu", e => e.preventDefault());
    link.addEventListener("mousedown", e => {
      if (e.button === 0) e.preventDefault(); // زر الماوس الأيسر
    });
  });

  // منع الكليك يمين وسحب للصور
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("contextmenu", e => e.preventDefault());
    img.addEventListener("dragstart", e => e.preventDefault());
  });

});
