document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://restcountries.com/v3.1/all';
    let countriesData = [];

    // Obtener la lista de países al cargar la página
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            countriesData = data;
            displayCountries(countriesData);
            renderPieChart(countriesData);
        })
        .catch(error => console.error('Error al obtener la lista de países:', error));

    function displayCountries(countries) {
        const countriesListElement = document.getElementById('countries-list');
        const searchInput = document.getElementById('search-input');
        const countryDetailsElement = document.getElementById('country-details');

        // Función para filtrar y mostrar detalles del país seleccionado
        function showCountryDetails(countryCode) {
            const selectedCountry = countries.find(country => country.cca3 === countryCode);
            if (selectedCountry) {
                const countryDetails = `
                    <h2>${selectedCountry.name.common}</h2>
                    <img src="${selectedCountry.flags.svg}" alt="Flag" width="100" height="auto">
                    <p>Capital: ${selectedCountry.capital}</p>
                    <p>Población: ${selectedCountry.population}</p>
                    <p>Área: ${selectedCountry.area} km²</p>
                    <p>Región: ${selectedCountry.region}</p>
                    
                `;
                countryDetailsElement.innerHTML = countryDetails;
            } else {
                countryDetailsElement.innerHTML = '<p>No se encontraron detalles para este país.</p>';
            }
        }

        // Función para filtrar los países según el término de búsqueda
        function filterCountries() {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredCountries = countries.filter(country =>
                country.name.common.toLowerCase().includes(searchTerm)
            );
            renderCountryList(filteredCountries);
        }

        // Escuchar eventos de cambio en el campo de búsqueda
        searchInput.addEventListener('input', filterCountries);

        // Renderizar la lista de países
        function renderCountryList(countryList) {
            // Limpiar la lista existente
            countriesListElement.innerHTML = '';
            countryDetailsElement.innerHTML = '';

            // Agrupar países por continente
            const continents = {};
            countryList.forEach(country => {
                const continent = country.region;
                if (!continents[continent]) {
                    continents[continent] = [];
                }
                continents[continent].push(country);
            });

            // Crear cards por continente en una fila
            for (const continent in continents) {
                const continentSection = document.createElement('div');
                continentSection.classList.add('continent-section');

                const continentTitle = document.createElement('h2');
                continentTitle.textContent = continent;
                continentSection.appendChild(continentTitle);

                const countryRow = document.createElement('div');
                countryRow.classList.add('country-row');

                continents[continent].forEach(country => {
                    const countryCard = document.createElement('div');
                    countryCard.classList.add('country-card');
                    countryCard.textContent = country.name.common;

                    // Agregar evento click para mostrar detalles del país
                    countryCard.addEventListener('click', () => showCountryDetails(country.cca3));

                    countryRow.appendChild(countryCard);
                });

                continentSection.appendChild(countryRow);
                countriesListElement.appendChild(continentSection);
            }
        }

        // Renderizar la lista inicial de países
        renderCountryList(countries);
    }

    function renderPieChart(data) {
        // Supongamos que 'data' es un array con datos de varios países y cada país tiene una propiedad 'region'
        const regions = Array.from(new Set(data.map(country => country.region)));
        const countriesByRegion = regions.map(region => data.filter(country => country.region === region).length);
    
        new Chart(document.getElementById("pie-chart"), {
            type: 'pie',
            data: {
                labels: regions,
                datasets: [{
                    data: countriesByRegion,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(131, 255, 97, 0.7)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(131, 255, 97, 1)',
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                maintainAspectRatio: false
            }
        });
    }
    
});
