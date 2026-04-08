document.addEventListener("DOMContentLoaded", () => {

  // فتح القائمة باستخدام click فقط (حتى على الهاتف)
  document.querySelectorAll(".toggle").forEach(button => {
    const toggleMenu = (e) => {
      e.stopPropagation();

      let menu = button.nextElementSibling;

      // إغلاق القوائم الأخرى
      document.querySelectorAll(".menu").forEach(m => {
        if (m !== menu) m.classList.remove("active");
      });

      menu.classList.toggle("active");
    };

    button.addEventListener("click", toggleMenu);
  });

  // إغلاق القائمة باللمس خارجها (فقط على الهواتف والأجهزة اللمسية)
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.addEventListener("touchstart", (e) => {
      // إذا كان اللمس خارج الزر وخارج القائمة
      if (!e.target.closest('.toggle') && !e.target.closest('.menu')) {
        document.querySelectorAll(".menu").forEach(menu => {
          menu.classList.remove("active");
        });
      }
    });
  }

  // إغلاق القائمة بالضغط على الكمبيوتر (اختياري للتوافق)
  document.addEventListener("mousedown", (e) => {
    if (!e.target.closest('.toggle') && !e.target.closest('.menu')) {
      document.querySelectorAll(".menu").forEach(menu => {
        menu.classList.remove("active");
      });
    }
  });

  // عند النقر على رابط داخل القائمة، أغلق القائمة
  document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener("click", (e) => {
      const menu = link.closest('.menu');
      if (menu) menu.classList.remove("active");
    });
    
    // منع touchstart من إغلاق القائمة قبل النقر
    link.addEventListener("touchstart", (e) => {
      e.stopPropagation();
    });
  });
});
