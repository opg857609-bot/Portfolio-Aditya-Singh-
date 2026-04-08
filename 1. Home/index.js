// apod

const API_KEY = "sKUX2KPZCcQTdfgQikLa8AODxSQHol3gNXoVpz1f";
const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

fetch(url)
  .then(response => {
    if (!response.ok && response.status !== 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.code && data.code !== 200) {
      document.getElementById("title").textContent = "🌌 NASA API Maintenance";
      document.getElementById("date").textContent = "Try again later";
      document.getElementById("description").textContent = `NASA's APOD server is currently down (${data.msg || "Internal Server Error"}). We can't fetch the image right now!`;
      return;
    }

    document.getElementById("title").textContent = data.title;
    document.getElementById("date").textContent = data.date;
    document.getElementById("description").textContent = data.explanation;

    const image = document.getElementById("apod-image");

    if (data.media_type === "image") {
      image.src = data.url;
    } else {
      image.style.display = "none";
      document.querySelector(".card").innerHTML += `
        <iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>
      `;
    }
  })
  .catch(error => {
    console.error("Error fetching APOD:", error);
    document.getElementById("title").textContent = "API Error";
    document.getElementById("description").textContent = "Could not reach the Astronomy Picture of the Day service.";
  });



document.addEventListener('DOMContentLoaded', () => {
  let notes = [
    { id: 1, text: 'undercover out now', type: 'update', date: '2026-04-01', likes: 2 },
    { id: 2, text: 'stream limn plslsls **.*', type: 'misc', date: '2026-04-05', likes: 5 },
    { id: 3, text: 'misc pages :p', type: 'misc', date: '2026-04-03', likes: 1 },
    { id: 4, text: 'new research dropped', type: 'update', date: '2026-03-20', likes: 10 }
  ];

  let currentFilter = 'all';
  let currentSort = 'newest';
  let searchQuery = '';

  const bulletinContainer = document.getElementById('dynamic-bulletin');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sortBtn = document.getElementById('sort-btn');

  function renderNotes() {
    if (!bulletinContainer) return;


    let filteredNotes = notes.filter(note => {
      const matchesFilter = currentFilter === 'all' || note.type === currentFilter;
      const matchesSearch = note.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    filteredNotes.sort((a, b) => {
      if (currentSort === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (currentSort === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      } else if (currentSort === 'likes') {
        return b.likes - a.likes;
      }
      return 0;
    });


    bulletinContainer.innerHTML = filteredNotes.map(note => `
            <div class="sticky-note ${note.type === 'misc' ? 'lines' : ''}">
                <p>${note.text}</p>
                <div style="font-size: 10px; margin-top: 8px; color: #555;">${note.date}</div>
                <button class="like-btn" data-id="${note.id}">❤️ ${note.likes}</button>
            </div>
        `).join('');


    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));

        const note = notes.find(n => n.id === id);
        if (note) {
          note.likes++;
          renderNotes();
        }
      });
    });
  }

  if (searchInput) {

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderNotes();
    });


    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderNotes();
      });
    });


    if (sortBtn) {
      sortBtn.addEventListener('click', () => {
        if (currentSort === 'newest') {
          currentSort = 'oldest';
          sortBtn.textContent = 'Sort: Oldest';
        } else if (currentSort === 'oldest') {
          currentSort = 'likes';
          sortBtn.textContent = 'Sort: Most Likes';
        } else {
          currentSort = 'newest';
          sortBtn.textContent = 'Sort: Newest';
        }
        renderNotes();
      });
    }


    renderNotes();
  }


  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      if (document.body.classList.contains('light-mode')) {
        themeToggleBtn.textContent = '🌑';
      } else {
        themeToggleBtn.textContent = '🌓';
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight
        }
      });
    }
  });
});