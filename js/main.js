const html = {
    input: document.querySelector('#movie-input'),
    button: document.querySelector('#search-btn'),
    movieInfo: document.querySelector('#movie-info')
};

const options = {
    method: 'GET',
    headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMzQyYWFmNWYwYTc2OTIwNDkxZTk2MDMyZjU5YTFlMSIsIm5iZiI6MTc0OTQzNzcxNC40NjIwMDAxLCJzdWIiOiI2ODQ2NGQxMmFlYTFlMWZkZjlmZDVkZTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.CL4PJnxastJUJZGtfkNQfs7aqAzQm3Kol0MPinsGeNs' }
};

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function searchMovie() {
    html.movieInfo.innerHTML = '';
    const query = html.input.value.trim().toLowerCase().replaceAll(' ', '+');
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}`
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Película no encontrada.')
            }
            if (html.input.value.trim().length === 0) {
                throw new Error("Ingresa el nombre de una película.");
            }
            return response.json()
        })
        .then(data => {
            if (data.total_results === 0) {
                throw new Error('No se encontraron películas con ese nombre.')
            }
            const urlResult = `https://api.themoviedb.org/3/movie/${data.results[0].id}?language=es-MX`;
            fetch(urlResult, options)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    let genres = [];
                    for (let index = 0; index < data.genres.length; index++) {
                        genres.push(data.genres[index].name);
                    }
                    let releaseDate = data.release_date.split('-');
                    releaseDate[1] = months[releaseDate[1] - 1];
                    html.movieInfo.innerHTML = `
                        <h2>${data.title}</h2>
                        <h3>${data.tagline}</h3>
                        <div id="movie-details">
                            <img src="https://image.tmdb.org/t/p/original${data.poster_path}" alt="Poster de la película ${data.title}">
                            <div>
                                <p id="release-date">Estrenada el ${releaseDate[2]} de ${releaseDate[1]} de ${releaseDate[0]}</p>
                                <p id="movie-description">${data.overview}</p>
                                <div id="movie-genres"></div>
                            </div>
                        </div>`;
                    for (let index = 0; index < genres.length; index++) {
                        document.querySelector('#movie-genres').innerHTML += `<p>${genres[index]}</p>`
                    };
                })
        })
        .catch(error => {
            html.movieInfo.innerHTML = `<p>${error.message}</p>`
        });
};

html.button.addEventListener('click', searchMovie);
html.input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        searchMovie();
    };
});