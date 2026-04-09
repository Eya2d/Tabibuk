document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("a").forEach(link => {

    link.addEventListener("dragstart", e => e.preventDefault());

    link.addEventListener("contextmenu", e => e.preventDefault());

    link.addEventListener("mousedown", e => {
      if (e.button === 0) e.preventDefault(); // زر الماوس
    });

  });

});
