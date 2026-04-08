document.addEventListener("DOMContentLoaded", () => {

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // استخدام حدث واحد فقط حسب نوع الجهاز
  const toggleEvent = isTouchDevice ? 'touchstart' : 'click';
  
  document.querySelectorAll(".toggle").forEach(button => {
    const toggleMenu = (e) => {
      e.stopPropagation();
      e.preventDefault(); // منع السلوك الافتراضي

      let menu = button.nextElementSibling;

      document.querySelectorAll(".menu").forEach(m => {
        if (m !== menu) m.classList.remove("active");
      });

      menu.classList.toggle("active");
    };

    button.addEventListener(toggleEvent, toggleMenu);
  });

  // إغلاق القائمة عند النقر خارجها (حدث واحد فقط)
  const closeEvent = isTouchDevice ? 'touchstart' : 'mousedown';
  document.addEventListener(closeEvent, (e) => {
    if (!e.target.closest('.toggle') && !e.target.closest('.menu')) {
      document.querySelectorAll(".menu").forEach(menu => {
        menu.classList.remove("active");
      });
    }
  });
  
  // عند النقر على رابط، أغلق القائمة
  document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener('click', () => {
      link.closest('.menu').classList.remove('active');
    });
  });
});