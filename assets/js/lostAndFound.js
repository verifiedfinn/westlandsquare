// Lost and found script

document.addEventListener("DOMContentLoaded", function () {
    const addObjectBtn = document.querySelector(".add-object-btn");
    const formContainer = document.querySelector(".form-container");
    const postButton = document.getElementById("postObject");
    const objectNameInput = document.getElementById("objectName");
    const objectDescriptionInput = document.getElementById("objectDescription");
    const objectImageInput = document.getElementById("objectImage");
    const lostFoundSection = document.getElementById("lostFoundSection");

    // Load lost & found objects from localStorage on page load
    loadLostAndFound();

    addObjectBtn.addEventListener("click", function () {
        if (formContainer.style.display === "none" || formContainer.style.display === "") {
            formContainer.style.display = "block";

            const buttonPosition = addObjectBtn.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: buttonPosition - 20, behavior: "smooth" });

            addObjectBtn.textContent = "Close the Tab";
        } else {
            formContainer.style.display = "none";
            addObjectBtn.textContent = "Add an Object";
        }
    });
    
    postButton.addEventListener("click", function () {
        const objectName = objectNameInput.value.trim();
        const objectDescription = objectDescriptionInput.value.trim();
        const objectImage = objectImageInput.files[0];
    
        if (objectName === "" || objectDescription === "") {
            alert("Please fill in all fields before posting.");
            return;
        }
    
        // Function to add object 
        function saveAndDisplayObject(imageBase64 = null) {
            const newObject = {
                name: objectName,
                description: objectDescription,
                image: imageBase64 // Image is null if not provided
            };
    
            // Save to localStorage
            const lostObjects = JSON.parse(localStorage.getItem("lostObjects")) || [];
            lostObjects.push(newObject);
            localStorage.setItem("lostObjects", JSON.stringify(lostObjects));
    
            // Add to UI
            addLostObjectToSection(newObject);
    
            // Clear form
            objectNameInput.value = "";
            objectDescriptionInput.value = "";
            objectImageInput.value = "";
    
            // Hide form and reset button
            formContainer.style.display = "none";
            addObjectBtn.textContent = "Add an Object";
    
            // Scroll to section
            lostFoundSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    
        // If an image is provided, read it. Otherwise, proceed without an image.
        if (objectImage) {
            const reader = new FileReader();
            reader.onloadend = function () {
                saveAndDisplayObject(reader.result);
            };
            reader.readAsDataURL(objectImage);
        } else {
            saveAndDisplayObject(null); 
        }
    });
    
    // Remove an object from Lost & Found
    lostFoundSection.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-object")) {
            const objectCard = event.target.closest(".p-3");
            if (objectCard) {
                const objectName = objectCard.querySelector("h5").textContent;
                const objectDescription = objectCard.querySelector("p").textContent;
    
                objectCard.remove(); // Remove from DOM
    
                // Update localStorage
                const lostObjects = JSON.parse(localStorage.getItem("lostObjects")) || [];
                const updatedObjects = lostObjects.filter(obj => obj.name !== objectName || obj.description !== objectDescription);
                localStorage.setItem("lostObjects", JSON.stringify(updatedObjects));
            }
        }
    });

    // Load all lost objects from localStorage on page load
    function loadLostAndFound() {
        const lostObjects = JSON.parse(localStorage.getItem("lostObjects")) || [];
        lostObjects.forEach(addLostObjectToSection);
    }

    // Function to create a new lost object card
    function addLostObjectToSection(lostObject) {
        const objectCard = document.createElement("div");
        objectCard.classList.add("object-card", "p-3", "mb-3", "rounded", "shadow-sm");

        // Create object card content (including image if provided)
        let objectCardContent = `
            <h5 class="text-secondary">${lostObject.name}</h5>
            <p>${lostObject.description}</p>
        `;

        // If image is provided, create an image element
        if (lostObject.image) {
            objectCardContent += `<img src="${lostObject.image}" alt="Object Image" class="img-fluid my-2" style="max-height: 200px; object-fit: cover;">`;
        }

        objectCard.innerHTML = objectCardContent;
        objectCard.innerHTML += '<p><button class="btn btn-sm remove-object mt-3">Remove</button></p>';

        // Append to the Lost & Found section
        lostFoundSection.appendChild(objectCard);
    }
});
