const publicKey = 'cc6564473569f94ef5db696237760823';
const privateKey = '7e7cd5bcbf99552fed287688b857daa7ad800045';

const maxCharacters = 1500;
const limit = 18;
function fetchAllHeroes() {
  const ts = Date.now().toString();
  const hash = md5(ts + privateKey + publicKey);

  const offset = Math.floor(Math.random() * (maxCharacters - limit));

  const url = `https://gateway.marvel.com/v1/public/characters?limit=${limit}&offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

  //FETCH #1
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const heroes = data.data.results;
      const container = document.getElementById('all-heroes');

      heroes.forEach(hero => {
        const heroCard = document.createElement('div');
        heroCard.classList.add('hero-card');

        heroCard.innerHTML = `
          <h3>${hero.name}</h3>
          <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${
          hero.name
        }" width="200">
          <p>${hero.description || 'No description available'}</p>
        `;

        container.appendChild(heroCard);
      });
    })
    .catch(err => {
      console.error('Error fetching heroes:', err);
      document.getElementById('all-heroes').innerText = 'Error loading heroes.';
    });
}
fetchAllHeroes();

document.getElementById('quizForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const answers = [...document.querySelectorAll('input[type="radio"]:checked')];
  if (answers.length < 3) {
    alert('Please select one answer for each question!');
    return;
  }

  const values = answers.map(a => a.value);
  const mostCommon = values
    .sort(
      (a, b) =>
        values.filter(v => v === a).length - values.filter(v => v === b).length
    )
    .pop();

  const ts = Date.now().toString();
  const hash = md5(ts + privateKey + publicKey);
  const url = `https://gateway.marvel.com/v1/public/characters?name=${encodeURIComponent(
    mostCommon
  )}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  //FETCH #2
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const character = data.data.results[0];
      const resultDiv = document.getElementById('result');

      if (character) {
        resultDiv.innerHTML = `
  <h2>${character.name}</h2>
  <img class="hero-image" src="${character.thumbnail.path}.${
          character.thumbnail.extension
        }" alt="${character.name}">
  <p>${character.description || 'Description not available'}</p>
`;
      } else {
        resultDiv.innerHTML = 'Character not found';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('result').innerText = 'Error fetching data.';
    });
});

//Footer
const today = new Date();
const thisYear = today.getFullYear();
const footer = document.querySelector('footer');
const copyright = document.createElement('p');
copyright.innerHTML = `&copy; ${thisYear} Coded by Aya Dzhaparbekova.`;
footer.appendChild(copyright);
