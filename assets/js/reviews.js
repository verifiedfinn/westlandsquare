// Script for reviews

fetch('assets/js/reviews.json')
    .then(response => response.json())
    .then(data => {
        let reviews = data;
        let filteredReviews = reviews;
        let currentPage = 0;

        // Function to display reviews dynamically
        function displayReviews(reviews) {
            const reviewsList = document.getElementById('reviews-list');
            reviewsList.innerHTML = ''; // Clear previous content

            reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.classList.add('col');
                reviewDiv.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${review.name}</h5>
                            <p class="card-text">${review.comment}</p>
                        </div>
                    </div>
                `;
                reviewsList.appendChild(reviewDiv);
            });
        }

        // Function to show a specific page of reviews
        function showPage(page) {
            const reviewsPerPage = 3; 
            const start = page * reviewsPerPage;
            const end = start + reviewsPerPage;
            const pageReviews = filteredReviews.slice(start, end);
            displayReviews(pageReviews);
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
                filterReviews(filter);
            });
        });

        // Event listeners for Prev and Next navigation links
        document.getElementById('prev').addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
            } else {
                // Go to the last page
                currentPage = Math.ceil(filteredReviews.length / 3) - 1;
            }
            showPage(currentPage);
        });

        document.getElementById('next').addEventListener('click', () => {
            if (currentPage < Math.ceil(filteredReviews.length / 3) - 1) {
                currentPage++;
            } else {
                currentPage = 0; // Reset to the first page
            }
            showPage(currentPage);
        });

        // Initial display of reviews
        showPage(currentPage);

        // Handle screen resize
        window.addEventListener('resize', () => {
            showPage(currentPage);
        });
    })
    .catch(error => console.error('Error fetching data: ', error));
