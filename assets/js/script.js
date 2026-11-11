
/* =========================================
   CHALOCHALE - MAIN JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("ChaloChale website loaded successfully!");


    /* =====================================
       1. TRAVEL DATE VALIDATION
       ===================================== */

    const travelDate = document.querySelector('input[name="date"]');

    if (travelDate) {

        // Get today's date in local time
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        const minimumDate = `${year}-${month}-${day}`;

        // Prevent users from selecting past dates
        travelDate.setAttribute("min", minimumDate);

    }


    /* =====================================
       2. DESTINATION SEARCH
       ===================================== */

    const searchForm = document.querySelector(".search-box");

    if (searchForm) {

        searchForm.addEventListener("submit", function (event) {

            event.preventDefault();

            // Get form values
            const destinationInput =
                searchForm.querySelector('input[name="destination"]');

            const dateInput =
                searchForm.querySelector('input[name="date"]');

            const travellerInput =
                searchForm.querySelector('select[name="travellers"]');


            // Read entered values
            const destination = destinationInput.value.trim();

            const date = dateInput.value;

            const travellers = travellerInput.value;


            // Validate destination
            if (destination === "") {

                destinationInput.setCustomValidity(
                    "Please enter your destination."
                );

                destinationInput.reportValidity();

                return;

            }

            destinationInput.setCustomValidity("");


            // Validate travel date
            if (!date) {

                dateInput.reportValidity();

                return;

            }

            const selectedDate = new Date(date + "T00:00:00");

            const currentDate = new Date();

            currentDate.setHours(0, 0, 0, 0);

            if (selectedDate < currentDate) {

                dateInput.setCustomValidity(
                    "Please select today or a future date."
                );

                dateInput.reportValidity();

                return;

            }

            dateInput.setCustomValidity("");


            // Prepare search parameters
            const searchData = new URLSearchParams();

            searchData.append("destination", destination);

            searchData.append("date", date);

            searchData.append("travellers", travellers);


            // Navigate to destinations page
            window.location.href =
                "destinations.html?" + searchData.toString();

        });

    }


    /* =====================================
       3. CLEAR VALIDATION ERRORS
       ===================================== */

    const destinationInput =
        document.querySelector('input[name="destination"]');

    const dateInput =
        document.querySelector('input[name="date"]');


    if (destinationInput) {

        destinationInput.addEventListener("input", function () {

            destinationInput.setCustomValidity("");

        });

    }


    if (dateInput) {

        dateInput.addEventListener("input", function () {

            dateInput.setCustomValidity("");

        });

        dateInput.addEventListener("change", function () {

            dateInput.setCustomValidity("");

        });

    }


    /* =====================================
       4. MOBILE NAVBAR AUTO CLOSE
       ===================================== */

    const navbarLinks =
        document.querySelectorAll(".navbar-collapse .nav-link");

    const navbarMenu =
        document.querySelector(".navbar-collapse");

    navbarLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (
                navbarMenu &&
                navbarMenu.classList.contains("show") &&
                window.bootstrap
            ) {

                const collapse =
                    bootstrap.Collapse.getOrCreateInstance(navbarMenu);

                collapse.hide();

            }

        });

    });


});










/* =========================================
   CHALOCHALE - DESTINATIONS FUNCTIONALITY
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("destination-search");

    const categorySelect = document.getElementById("category-select");

    const searchButton = document.getElementById("destination-search-btn");

    const filterButtons = document.querySelectorAll(".filter-btn");

    const destinationCards = document.querySelectorAll(".destination-item");

    const noResults = document.getElementById("no-results");

    const resetButton = document.getElementById("reset-search");


    // Stop if this is not the destinations page
    if (!searchInput || !categorySelect || destinationCards.length === 0) {
        return;
    }


    // Current selected category
    let selectedCategory = "all";


    /* =====================================
       1. FILTER DESTINATIONS
       ===================================== */

    function filterDestinations() {

        const searchValue = searchInput.value.trim().toLowerCase();

        let visibleCount = 0;

        destinationCards.forEach(function (card) {

            const destinationName = card.dataset.name.toLowerCase();

            const destinationCategory = card.dataset.category;

            const matchesSearch =
                destinationName.includes(searchValue);

            const matchesCategory =
                selectedCategory === "all" ||
                destinationCategory === selectedCategory;


            if (matchesSearch && matchesCategory) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        // Display message if no destinations match
        if (noResults) {

            noResults.style.display =
                visibleCount === 0 ? "block" : "none";

        }

    }


    /* =====================================
       2. SEARCH BUTTON
       ===================================== */

    searchButton.addEventListener("click", function () {

        filterDestinations();

    });


    /* =====================================
       3. LIVE SEARCH
       ===================================== */

    searchInput.addEventListener("input", function () {

        filterDestinations();

    });


    /* =====================================
       4. CATEGORY DROPDOWN
       ===================================== */

    categorySelect.addEventListener("change", function () {

        selectedCategory = categorySelect.value;

        updateActiveButton();

        filterDestinations();

    });


    /* =====================================
       5. CATEGORY BUTTONS
       ===================================== */

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            selectedCategory = button.dataset.filter;

            categorySelect.value = selectedCategory;

            updateActiveButton();

            filterDestinations();

        });

    });


    function updateActiveButton() {

        filterButtons.forEach(function (button) {

            button.classList.toggle(
                "active",
                button.dataset.filter === selectedCategory
            );

        });

    }


    /* =====================================
       6. RESET FILTERS
       ===================================== */

    if (resetButton) {

        resetButton.addEventListener("click", function () {

            searchInput.value = "";

            categorySelect.value = "all";

            selectedCategory = "all";

            updateActiveButton();

            filterDestinations();

        });

    }


    /* =====================================
       7. GET HOMEPAGE SEARCH PARAMETERS
       ===================================== */

    const urlParameters = new URLSearchParams(window.location.search);

    const destination = urlParameters.get("destination");

    const travelDate = urlParameters.get("date");

    const travellers = urlParameters.get("travellers");


    if (destination) {

        searchInput.value = destination;

        filterDestinations();

    }


    // Store selected travel information for later use
    if (destination || travelDate || travellers) {

        const travelSearch = {
            destination: destination || "",
            date: travelDate || "",
            travellers: travellers || "2"
        };

        console.log("Homepage Search Details:", travelSearch);

    }

});
















/* =========================================
   CHALOCHALE - PACKAGES FUNCTIONALITY
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const packageSearch = document.getElementById("package-search");

    const packageCategory = document.getElementById("package-category");

    const packageSearchBtn = document.getElementById("package-search-btn");

    const packageCards = document.querySelectorAll(".package-item");

    const filterButtons = document.querySelectorAll(".package-filter");

    const emptyMessage = document.getElementById("package-empty");

    const resetButton = document.getElementById("reset-packages");


    // Run only on the packages page
    if (!packageSearch || packageCards.length === 0) {
        return;
    }


    let selectedCategory = "all";


    /* 1. FILTER PACKAGES */

    function filterPackages() {

        const searchValue = packageSearch.value.trim().toLowerCase();

        let visibleCount = 0;

        packageCards.forEach(function (card) {

            const packageName = card.dataset.name.toLowerCase();

            const packageType = card.dataset.category;

            const matchesSearch = packageName.includes(searchValue);

            const matchesCategory =
                selectedCategory === "all" ||
                packageType === selectedCategory;


            if (matchesSearch && matchesCategory) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        if (emptyMessage) {

            emptyMessage.style.display =
                visibleCount === 0 ? "block" : "none";

        }

    }


    /* 2. SEARCH BUTTON */

    packageSearchBtn.addEventListener("click", filterPackages);


    /* 3. LIVE SEARCH */

    packageSearch.addEventListener("input", filterPackages);


    /* 4. CATEGORY DROPDOWN */

    packageCategory.addEventListener("change", function () {

        selectedCategory = packageCategory.value;

        updatePackageButtons();

        filterPackages();

    });


    /* 5. CATEGORY BUTTONS */

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            selectedCategory = button.dataset.filter;

            packageCategory.value = selectedCategory;

            updatePackageButtons();

            filterPackages();

        });

    });


    function updatePackageButtons() {

        filterButtons.forEach(function (button) {

            button.classList.toggle(
                "active",
                button.dataset.filter === selectedCategory
            );

        });

    }


    /* 6. RESET FILTERS */

    if (resetButton) {

        resetButton.addEventListener("click", function () {

            packageSearch.value = "";

            packageCategory.value = "all";

            selectedCategory = "all";

            updatePackageButtons();

            filterPackages();

        });

    }


    /* 7. PACKAGE DETAILS MODAL */

    const detailButtons = document.querySelectorAll(".details-btn");

    detailButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const packageName = button.dataset.package;

            const place = button.dataset.place;

            const price = button.dataset.price;

            const duration = button.dataset.duration;

            const description = button.dataset.description;


            document.getElementById("modal-package-name").textContent =
                packageName;

            document.getElementById("modal-package-place").textContent =
                place;

            document.getElementById("modal-package-price").textContent =
                price;

            document.getElementById("modal-package-duration").textContent =
                duration;

            document.getElementById("modal-package-description").textContent =
                description;


            // Pass selected package to booking page
            document.getElementById("modal-book-btn").href =
                "booking.html?package=" +
                encodeURIComponent(packageName);


            const modalElement = document.getElementById("packageModal");

            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

            modal.show();

        });

    });


    console.log("Packages functionality loaded successfully!");

});


















/* =====================================
   CHALOCHALE BOOKING PAGE
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const bookingForm = document.getElementById("booking-form");

    // Run only on the Booking page
    if (!bookingForm) return;

    const destinationInput = document.getElementById("booking-destination");
    const packageInput = document.getElementById("booking-package");
    const travelDateInput = document.getElementById("travel-date");
    const returnDateInput = document.getElementById("return-date");
    const travellersInput = document.getElementById("travellers");
    const bookingMessage = document.getElementById("booking-message");

    const prices = {
        "Goa Beach Escape": 8999,
        "Manali Mountain Tour": 12999,
        "Kashmir Paradise": 15999,
        "Dubai Luxury Holiday": 45999,
        "Bali Island Adventure": 38999,
        "Switzerland Explorer": 89999
    };

    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    travelDateInput.min = localToday;
    returnDateInput.min = localToday;

    // Read information from the URL
    const urlParams = new URLSearchParams(window.location.search);

    const urlDestination = urlParams.get("destination");
    const urlPackage = urlParams.get("package");

    // Preselect destination
    if (urlDestination) {
        const destinationExists = [...destinationInput.options]
            .some(option => option.value.toLowerCase() === urlDestination.toLowerCase());

        if (destinationExists) {
            destinationInput.value = destinationInput.options[
                [...destinationInput.options].findIndex(
                    option => option.value.toLowerCase() === urlDestination.toLowerCase()
                )
            ].value;
        }
    }

    // Preselect package
    if (urlPackage) {
        const packageExists = [...packageInput.options]
            .some(option => option.value.toLowerCase() === urlPackage.toLowerCase());

        if (packageExists) {
            packageInput.value = packageInput.options[
                [...packageInput.options].findIndex(
                    option => option.value.toLowerCase() === urlPackage.toLowerCase()
                )
            ].value;
        }
    }

    // Automatically select the destination from package
    function syncDestination() {
        const packageName = packageInput.value;

        const destinationMap = {
            "Goa Beach Escape": "Goa",
            "Manali Mountain Tour": "Manali",
            "Kashmir Paradise": "Kashmir",
            "Dubai Luxury Holiday": "Dubai",
            "Bali Island Adventure": "Bali",
            "Switzerland Explorer": "Switzerland"
        };

        if (destinationMap[packageName]) {
            destinationInput.value = destinationMap[packageName];
        }

        updateSummary();
    }

    // Format price in Indian currency
    function formatPrice(amount) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Update booking summary
    function updateSummary() {

        const destination = destinationInput.value || "Not selected";
        const packageName = packageInput.value || "Not selected";
        const travellers = Number(travellersInput.value) || 1;

        const price = prices[packageInput.value] || 0;
        const total = price * travellers;

        document.getElementById("summary-destination").textContent = destination;
        document.getElementById("summary-package").textContent = packageName;
        document.getElementById("summary-travellers").textContent = travellers;

        document.getElementById("summary-date").textContent =
            travelDateInput.value || "Not selected";

        document.getElementById("summary-price").textContent =
            formatPrice(price);

        document.getElementById("summary-total").textContent =
            formatPrice(total);
    }

    // Update summary when form fields change
    destinationInput.addEventListener("change", updateSummary);
    packageInput.addEventListener("change", syncDestination);
    travellersInput.addEventListener("change", updateSummary);
    travelDateInput.addEventListener("change", updateSummary);

    // Keep return date after travel date
    travelDateInput.addEventListener("change", function () {
        returnDateInput.min = travelDateInput.value || localToday;

        if (returnDateInput.value && returnDateInput.value < travelDateInput.value) {
            returnDateInput.value = "";
        }
    });

    // Initial summary
    updateSummary();

    // Handle booking form submission
    bookingForm.addEventListener("submit", function (event) {

        event.preventDefault();

        bookingMessage.textContent = "";
        bookingMessage.className = "mt-3";

        const travelDate = travelDateInput.value;
        const returnDate = returnDateInput.value;

        if (returnDate < travelDate) {
            bookingMessage.textContent =
                "Return date must be after or equal to the travel date.";
            bookingMessage.classList.add("text-danger");
            return;
        }

        if (!packageInput.value) {
            bookingMessage.textContent =
                "Please select a travel package before continuing.";
            bookingMessage.classList.add("text-danger");
            packageInput.focus();
            return;
        }

        const bookingDetails = {
            destination: destinationInput.value,
            package: packageInput.value,
            travelDate: travelDate,
            returnDate: returnDate,
            travellers: Number(travellersInput.value),
            travelType: document.getElementById("travel-type").value,
            fullName: document.getElementById("full-name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            specialRequest: document.getElementById("special-request").value,
            estimatedTotal:
                prices[packageInput.value] * Number(travellersInput.value)
        };

        console.log("Booking Details:", bookingDetails);

        bookingMessage.textContent =
            "Demo booking details validated successfully! No actual reservation or payment has been made.";
        bookingMessage.classList.add("text-success");

        // This is a frontend demonstration.
        // Backend/database integration is required to save real bookings.
    });

});








/* =====================================
   CHALOCHALE CONTACT FORM
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("contact-form");

    // Run only on Contact page
    if (!contactForm) return;

    const contactResponse = document.getElementById("contact-response");

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        contactResponse.textContent = "";
        contactResponse.className = "mt-3";

        // Get form values
        const contactDetails = {
            name: document.getElementById("contact-name").value.trim(),
            email: document.getElementById("contact-email").value.trim(),
            phone: document.getElementById("contact-phone").value.trim(),
            subject: document.getElementById("contact-subject").value,
            message: document.getElementById("contact-message").value.trim()
        };

        // Basic validation
        if (
            !contactDetails.name ||
            !contactDetails.email ||
            !contactDetails.phone ||
            !contactDetails.subject ||
            !contactDetails.message
        ) {
            contactResponse.textContent = "Please fill in all required fields.";
            contactResponse.classList.add("text-danger");
            return;
        }

        // Display submitted information in the console
        console.log("Contact Form Details:", contactDetails);

        contactResponse.textContent =
            "Your message has been validated successfully! Backend integration is required to send it.";
        contactResponse.classList.add("text-success");

        // Clear form
        contactForm.reset();

    });

});











/* =====================================
   CHALOCHALE LOGIN PAGE
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("login-form");

    // Run only on Login page
    if (!loginForm) return;

    const passwordInput = document.getElementById("login-password");
    const togglePassword = document.getElementById("toggle-password");
    const loginMessage = document.getElementById("login-message");

    // Show / Hide Password
    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.innerHTML =
                '<i class="fa-regular fa-eye-slash"></i>';

            togglePassword.setAttribute("aria-label", "Hide password");

        } else {

            passwordInput.type = "password";

            togglePassword.innerHTML =
                '<i class="fa-regular fa-eye"></i>';

            togglePassword.setAttribute("aria-label", "Show password");
        }

    });


    // Login Form Submission
    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        loginMessage.textContent = "";
        loginMessage.className = "mt-3 text-center";

        const email = document.getElementById("login-email").value.trim();
        const password = passwordInput.value;

        if (!email || !password) {

            loginMessage.textContent = "Please enter your email and password.";
            loginMessage.classList.add("text-danger");

            return;
        }

        if (password.length < 8) {

            loginMessage.textContent = "Password must contain at least 8 characters.";
            loginMessage.classList.add("text-danger");

            return;
        }

        const loginDetails = {
            email: email,
            rememberMe: document.getElementById("remember-me").checked
        };

        console.log("Login Details:", loginDetails);

        loginMessage.textContent =
            "Form validation successful! Connect a backend to authenticate your account.";

        loginMessage.classList.add("text-success");

    });


    // Forgot Password Demo
    document.getElementById("forgot-password").addEventListener("click", function (event) {

        event.preventDefault();

        const email = document.getElementById("login-email").value.trim();

        if (!email) {

            loginMessage.textContent =
                "Please enter your email address first.";

            loginMessage.className = "mt-3 text-center text-danger";

            return;
        }

        loginMessage.textContent =
            "Password recovery requires a backend or email service.";

        loginMessage.className = "mt-3 text-center text-info";

    });

});











/* =====================================
   CHALOCHALE SIGNUP PAGE
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const signupForm = document.getElementById("signup-form");

    // Run only on Signup page
    if (!signupForm) return;

    const passwordInput = document.getElementById("signup-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const signupMessage = document.getElementById("signup-message");

    // Show / Hide Password Function
    function setupPasswordToggle(input, button) {

        button.addEventListener("click", function () {

            if (input.type === "password") {

                input.type = "text";

                button.innerHTML =
                    '<i class="fa-regular fa-eye-slash"></i>';

                button.setAttribute("aria-label", "Hide password");

            } else {

                input.type = "password";

                button.innerHTML =
                    '<i class="fa-regular fa-eye"></i>';

                button.setAttribute("aria-label", "Show password");
            }

        });
    }

    setupPasswordToggle(
        passwordInput,
        document.getElementById("toggle-signup-password")
    );

    setupPasswordToggle(
        confirmPasswordInput,
        document.getElementById("toggle-confirm-password")
    );


    // Signup Form Submission
    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        signupMessage.textContent = "";
        signupMessage.className = "mt-3 text-center";

        // Get user details
        const signupDetails = {
            name: document.getElementById("signup-name").value.trim(),
            email: document.getElementById("signup-email").value.trim(),
            phone: document.getElementById("signup-phone").value.trim(),
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value
        };

        // Check password length
        if (signupDetails.password.length < 8) {

            signupMessage.textContent =
                "Password must contain at least 8 characters.";

            signupMessage.classList.add("text-danger");
            return;
        }

        // Check password match
        if (signupDetails.password !== signupDetails.confirmPassword) {

            signupMessage.textContent =
                "Password and Confirm Password do not match.";

            signupMessage.classList.add("text-danger");
            confirmPasswordInput.focus();
            return;
        }

        // Display safe details only
        console.log("Signup Details:", {
            name: signupDetails.name,
            email: signupDetails.email,
            phone: signupDetails.phone
        });

        signupMessage.textContent =
            "Your details passed validation! Backend integration is required to create your account.";

        signupMessage.classList.add("text-success");

        // Clear form
        signupForm.reset();

    });

});
