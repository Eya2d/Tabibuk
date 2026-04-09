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




