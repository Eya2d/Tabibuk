document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("a, img").forEach(el => {

    // منع السحب
    el.addEventListener("dragstart", e => e.preventDefault());

    // منع كليك يمين
    el.addEventListener("contextmenu", e => e.preventDefault());

    // منع الضغط (اختياري لو تبيه)
    el.addEventListener("mousedown", e => {
      if (e.button === 0) e.preventDefault(); // زر اليسار
    });

  });

});
