// Script for getting data from studentsFoodPlacesReviews.json and displaying it

document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("../assets/js/studentsFoodPlacesReviews.json");
    const reviews = await response.json();
    const carouselContent = document.getElementById("carousel-content");

    reviews.forEach((review, index) => {
        const activeClass = index === 0 ? "active" : ""; // First item should be active
        const item = document.createElement("div");
        item.className = `carousel-item ${activeClass}`;
        item.innerHTML = `
            <div class="place-name">${review.place}</div>
            <div class="rating">${review.rating}</div>
            <div class="review">"${review.review}"</div>
            <div class="student-name">- ${review.student}</div>
            <small class="student-status">${review.studentStatus}</small>
        `;
        carouselContent.appendChild(item);
    });
});
        