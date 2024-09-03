const footerInfo = document.getElementById("info-footer")
const cardContainer = document.getElementById("row-cards")
const searchInput = document.getElementById("search-input-value")

let currentIndex = 1

const fetchCharacters = async (query = "") => {
  try {
    let response

    if (query) {
      response = await api.get(`/character/?name=${query}`)
    } else {
      
      response = await api.get(
        `/character/[${Array.from({ length: 6 }, () => currentIndex++).join(
          ","
        )}]`
      )
    }

    const characters = response.data.results || response.data
    cardContainer.innerHTML = ""
    characters.forEach(renderCard);

  } catch (error) {
    console.error("Personagem não encontrado ou erro na busca:", error)
    cardContainer.innerHTML =
      "<p class='text-white'>Nenhum personagem encontrado.</p>"
  }
}

const renderCard = async (character) => {
  const lastEpisodeUrl = character.episode.at(-1)
  const episodeName = await getEpisodeName(lastEpisodeUrl)

  const characterCard = `
    <div class="col-6">
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-5">
            <img src="${
              character.image
            }" class="img-fluid rounded-start" alt="${character.name}" />
          </div>
          <div class="col-md-7">
            <div class="card-body">
              <a href="#" data-bs-toggle="modal" data-bs-target="#modal${
                character.id
              }" class="card-title text-white">${character.name}</a>
              <p class="card-text text-white status-indicator">
                <span class="${character.status.toLowerCase()}"></span> ${
    character.status
  } - ${character.species}
              </p>
              <p class="card-text text-body">Última localização conhecida<br>
                <span class="text-white">${character.location.name}</span>
              </p>
              <p class="card-text text-body">Último episódio visto:<br>
                <span class="text-white">${episodeName}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${generateModal(character)}
  `

  cardContainer.innerHTML += characterCard
}

const generateModal = (character) => `
  <div class="modal fade" id="modal${character.id}" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content modal-custom">
        <div class="modal-header">
          <h1 class="modal-title">${character.name}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <img src="${character.image}" class="img-fluid rounded-start" alt="${character.name}" />
          <ul class="list-group mt-2">
            <li class="list-group-item">Espécie: ${character.species}</li>
            <li class="list-group-item">Gênero: ${character.gender}</li>
            <li class="list-group-item">Origem: ${character.origin.name}</li>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        </div>
      </div>
    </div>
  </div>
`


const getEpisodeName = async (episodeUrl) => {
  try {
    const response = await axios.get(episodeUrl)
    return response.data.name

  } catch (error) {
    console.error(error)

    return "Episódio Desconhecido"
  }
}

const nextPage = () => {
  currentIndex += 6

  fetchCharacters()
}

const prevPage = () => {
  if (currentIndex > 6) {
    currentIndex -= 6
    
    fetchCharacters()
  }
}

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim()

  fetchCharacters(query)
})

fetchCharacters()
