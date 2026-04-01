const API_KEY = "sKUX2KPZCcQTdfgQikLa8AODxSQHol3gNXoVpz1f";
const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
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
  });