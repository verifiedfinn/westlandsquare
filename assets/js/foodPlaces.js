// Script for fetching data from foodPlaces.json and displaying it

fetch('../assets/js/foodPlaces.json')
    .then(response => response.json())
    .then(data => {
        let foodPlaces = data;
        let filteredFoodPlaces = foodPlaces;

        // Function to display food places dynamically
        function displayFoodPlaces(places) {
            const foodPlacesList = document.getElementById('food-places-list');
            foodPlacesList.innerHTML = ''; 

            places.forEach(place => {
                const foodPlaceDiv = document.createElement('div');
                foodPlaceDiv.classList.add('col');
                foodPlaceDiv.innerHTML = `
                    <div class="card whatsAround">
                        <img src="${place.image}" class="card-img-top" alt="${place.name} +'s + picture">
                        <div class="card-body">
                            <h5 class="fw-bold">${place.name}</h5>
                            <p class="place-descr">${place.description}</p>
                            <p>${place.pricing}</p>
                            <i class="fas fa-link" aria-label="Link icon"></i><a href="${place.website}" target="_blank">Visit website</a>
                        </div>
                    </div>
                `;
                foodPlacesList.appendChild(foodPlaceDiv);
            });
        }

        // Function to filter food places based on category
        function filterFoodPlaces(category) {
            if (category === 'all') {
                filteredFoodPlaces = foodPlaces;
            } else {
                filteredFoodPlaces = foodPlaces.filter(place => place.category === category);
            }
            displayFoodPlaces(filteredFoodPlaces);
        }

        // Event listener for filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.disabled = true;
                filterButtons.forEach(btn => {
                    if (btn !== button) {
                        btn.disabled = false;
                    }
                });
                const filter = button.getAttribute('data-filter');
                filterFoodPlaces(filter);
            });
        });

        // Initially display all food places
        displayFoodPlaces(filteredFoodPlaces);
    })
    .catch(error => console.error('Error fetching data: ', error));
