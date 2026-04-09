document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById('search-input');
  const resultsDiv  = document.getElementById('results-div');
  const resultsGrid = document.getElementById('results-grid');
  const historyGrid = document.getElementById('history-grid');
  const filterAnchors = document.querySelectorAll('#filter-div a[data-cat]');
  const searchContainer = document.querySelector('.searsh');
  const deleteHistoryBtn = document.getElementById('delete-history');

  let activeFilter = 'الكل';
  let localData = {
    الكل:    [...DATA.الكل],
    شائعة:   [...DATA.شائعة],
    بشرة:    [...DATA.بشرة],
  };

  // ===== RENDER HISTORY =====
  function renderHistory() {
    const history = getWatchHistory();
    if (!history.length) {
      historyGrid.innerHTML = '<p class="empty-history">لم تشاهد أي فيديو بعد</p>';
      return;
    }
    historyGrid.innerHTML = history.map(v => {
      const safeV = JSON.stringify(v).replace(/"/g, '&quot;');
      const thumb = getYoutubeThumbnail(v.id);
      const cat   = encodeURIComponent(v.category);
      const ago   = timeAgo(v.watchedAt);
      return `
        <a class="cooo x-btn" href="watch.html?id=${v.id}&cat=${cat}"
           onclick="addToWatchHistory(${safeV})">
          <imga><img src="${thumb}" alt="${v.title}" loading="lazy" /></imga>
          <div class="history-card-info">
            <div class="history-card-title">${v.title}</div>
            <span class="history-time">${ago}</span>
          </div>
        </a>`;
    }).join('');
  }

  // ===== CLEAR HISTORY =====
  deleteHistoryBtn.addEventListener('click', () => {
    const history = getWatchHistory();
    if (!history.length) return;

    const confirmed = confirm('هل تريد حذف سجل المشاهدة؟');
    if (!confirmed) return;

    localStorage.removeItem('watchHistory');
    historyGrid.innerHTML = '<p class="empty-history">لم تشاهد أي فيديو بعد</p>';
  });

  // ===== HIDE SEARCH ON OUTSIDE CLICK =====
  document.addEventListener('click', (e) => {
    if (searchContainer && !searchContainer.contains(e.target)) {
      resultsDiv.classList.remove('active');
      resultsGrid.innerHTML = '';
    }
  });

  // ===== SEARCH =====
  function doSearch(q) {
    q = q.trim();
    if (!q) {
      resultsDiv.classList.remove('active');
      resultsGrid.innerHTML = '';
      return;
    }
    resultsDiv.classList.add('active');

    const catMatch = Object.keys(localData).find(k => k !== 'الكل' && k === q);
    if (catMatch && activeFilter === 'الكل') {
      window.location.href = `section.html?cat=${encodeURIComponent(catMatch)}`;
      return;
    }

    const pool = activeFilter === 'الكل' ? localData.الكل : (localData[activeFilter] || []);
    const results = pool.filter(v =>
      v.title.includes(q) || v.category.includes(q)
    ).slice(0, 10);

    if (!results.length) {
      resultsGrid.innerHTML = '<p class="no-results">لا توجد نتائج مطابقة</p>';
      return;
    }

    resultsGrid.innerHTML = results.map(v => {
      const safeV = JSON.stringify(v).replace(/"/g, '&quot;');
      const cat   = encodeURIComponent(v.category);
      return `
        <a class="coopp" href="watch.html?id=${v.id}&cat=${cat}"
           onclick="addToWatchHistory(${safeV})">
          <imga><img src="${getYoutubeThumbnail(v.id)}" alt="${v.title}" loading="lazy" /></imga>
          <div class="vid-card-info">
            <div class="vid-card-title">${v.title}</div>
            <div class="vid-card-cat">${v.category}</div>
          </div>
        </a>`;
    }).join('');
  }

  searchInput.addEventListener('input', () => doSearch(searchInput.value));

  // ===== FILTER ANCHORS =====
  filterAnchors.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      filterAnchors.forEach(b => b.classList.remove('active'));
      a.classList.add('active');
      const raw = a.dataset.cat;
      activeFilter = raw === 'الكل'    ? 'الكل'
                   : raw === 'الشائعة' ? 'شائعة'
                   : raw === 'البشرة'  ? 'بشرة'
                   : raw;
      doSearch(searchInput.value);
    });
  });

  // ===== INIT =====
  renderHistory();

  enrichVideos(DATA.الكل).then(enriched => {
    localData.الكل = enriched;
    enriched.forEach(v => {
      ['شائعة','بشرة'].forEach(cat => {
        const idx = localData[cat].findIndex(d => d.id === v.id);
        if (idx !== -1) localData[cat][idx].title = v.title;
      });
    });
    if (searchInput.value.trim()) doSearch(searchInput.value);
  });
});




const container = document.querySelector('.scroll-container'); // الديف الأب
let isDown = false;
let startX;
let scrollLeft;
let dragDirection = null; // لتحديد اتجاه السحب

// بداية السحب
container.addEventListener('touchstart', startDrag);
container.addEventListener('mousedown', startDrag);

// أثناء السحب
container.addEventListener('touchmove', moveDrag);
container.addEventListener('mousemove', moveDrag);

// نهاية السحب
container.addEventListener('touchend', endDrag);
container.addEventListener('mouseup', endDrag);
container.addEventListener('mouseleave', endDrag);

function startDrag(e) {
  isDown = true;
  startX = (e.touches ? e.touches[0].pageX : e.pageX) - container.offsetLeft;
  scrollLeft = container.scrollLeft;
  dragDirection = null;
}

function moveDrag(e) {
  if (!isDown) return;
  e.preventDefault();

  const x = (e.touches ? e.touches[0].pageX : e.pageX) - container.offsetLeft;
  const walk = (x - startX) * 1.2;
  
  // تحديد اتجاه السحب
  if (walk > 2) {
    dragDirection = 'right'; // سحب لليمين (التمرير لليسار)
  } else if (walk < -2) {
    dragDirection = 'left'; // سحب لليسار (التمرير لليمين)
  }
  
  container.scrollLeft = scrollLeft - walk;
}

function endDrag() {
  if (!isDown) return;
  isDown = false;
  
  // تأخير بسيط للتأكد من اكتمال الحركة
  setTimeout(() => {
    snapToClosest();
  }, 10);
}

// 🔥 الجزء الرئيسي: تحديد موقع العنصر حسب اتجاه السحب وموقعه
function snapToClosest() {
  const items = Array.from(container.querySelectorAll('.cooo.x-btn'));
  if (items.length === 0) return;
  
  // الحصول على الـ padding الخاص بالحاوية
  const containerStyle = getComputedStyle(container);
  const containerPaddingLeft = parseFloat(containerStyle.paddingLeft);
  const containerPaddingRight = parseFloat(containerStyle.paddingRight);
  
  const containerRect = container.getBoundingClientRect();
  const containerCenter = containerRect.left + (containerRect.width / 2);
  
  let targetItem = null;
  
  // حالة خاصة: إذا كان السحب من اليمين (left) نختار العنصر الأقرب لليسار
  if (dragDirection === 'left') {
    // نختار العنصر الأقرب لبداية الحاوية
    let minLeftDistance = Infinity;
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.left - (containerRect.left + containerPaddingLeft));
      if (distance < minLeftDistance) {
        minLeftDistance = distance;
        targetItem = item;
      }
    });
  } 
  // حالة خاصة: إذا كان السحب من اليسار (right) نختار العنصر الأقرب لليمين
  else if (dragDirection === 'right') {
    // نختار العنصر الأقرب لنهاية الحاوية
    let minRightDistance = Infinity;
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.right - (containerRect.right - containerPaddingRight));
      if (distance < minRightDistance) {
        minRightDistance = distance;
        targetItem = item;
      }
    });
  }
  // إذا كان سحب عادي أو بدون اتجاه محدد
  else {
    // نختار أقرب عنصر للمنتصف
    let minCenterDistance = Infinity;
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + (rect.width / 2);
      const distance = Math.abs(itemCenter - containerCenter);
      if (distance < minCenterDistance) {
        minCenterDistance = distance;
        targetItem = item;
      }
    });
  }
  
  if (targetItem) {
    // حساب الموقع المناسب حسب نوع العنصر (أول، آخر، وسط)
    const targetRect = targetItem.getBoundingClientRect();
    const itemIndex = items.indexOf(targetItem);
    const isFirst = itemIndex === 0;
    const isLast = itemIndex === items.length - 1;
    
    let scrollOffset;
    
    if (isFirst) {
      // العنصر الأول: يظهر في البداية (بعد الـ padding)
      scrollOffset = container.scrollLeft + (targetRect.left - containerRect.left) - containerPaddingLeft;
    } 
    else if (isLast) {
      // العنصر الأخير: يظهر في النهاية (قبل الـ padding)
      scrollOffset = container.scrollLeft + (targetRect.right - containerRect.right) + containerPaddingRight;
    }
    else {
      // العناصر الوسطى: تظهر في المنتصف
      const targetCenter = targetRect.left + (targetRect.width / 2);
      const containerCenterOffset = containerRect.left + (containerRect.width / 2);
      scrollOffset = container.scrollLeft + (targetCenter - containerCenterOffset);
    }
    
    container.scrollTo({
      left: scrollOffset,
      behavior: 'smooth'
    });
  }
}

// إضافة حدث للتحقق من التمرير بالماوس لتحديد الاتجاه بشكل أفضل
let lastScrollLeft = 0;
container.addEventListener('scroll', () => {
  if (isDown) {
    const currentScrollLeft = container.scrollLeft;
    if (currentScrollLeft > lastScrollLeft) {
      dragDirection = 'right';
    } else if (currentScrollLeft < lastScrollLeft) {
      dragDirection = 'left';
    }
    lastScrollLeft = currentScrollLeft;
  }
});
