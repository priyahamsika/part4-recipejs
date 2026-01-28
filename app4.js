const RecipeApp = (() => {
    'use strict';

    // DATA
    const recipes = [
        {
            id: 1,
            title: "Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "Creamy Italian pasta.",
            ingredients: ["Spaghetti", "Eggs", "Cheese", "Pepper"]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Spiced tomato curry.",
            ingredients: ["Chicken", "Tomato", "Cream", "Spices"]
        },
        {
            id: 3,
            title: "Greek Salad",
            time: 15,
            difficulty: "easy",
            description: "Fresh vegetable salad.",
            ingredients: ["Cucumber", "Tomato", "Feta", "Olives"]
        }
    ];

    // STATE
    let currentFilter = "all";
    let currentSort = "none";
    let searchQuery = "";
    let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];
    let debounceTimer;

    // DOM
    const recipeContainer = document.querySelector("#recipe-container");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const sortButtons = document.querySelectorAll(".sort-btn");
    const searchInput = document.querySelector("#search-input");
    const clearBtn = document.querySelector("#clear-search");
    const recipeCount = document.querySelector("#recipe-count");

    // HELPERS
    const saveFavorites = () =>
        localStorage.setItem("recipeFavorites", JSON.stringify(favorites));

    const filterBySearch = (list) => {
        if (!searchQuery) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(r =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.ingredients.some(i => i.toLowerCase().includes(q))
        );
    };

    const applyFilter = (list) => {
        if (currentFilter === "favorites") {
            return list.filter(r => favorites.includes(r.id));
        }
        if (currentFilter === "all") return list;
        return list.filter(r => r.difficulty === currentFilter);
    };

    const applySort = (list) => {
        if (currentSort === "name") {
            return [...list].sort((a, b) => a.title.localeCompare(b.title));
        }
        if (currentSort === "time") {
            return [...list].sort((a, b) => a.time - b.time);
        }
        return list;
    };

    const toggleFavorite = (id) => {
        id = Number(id);
        favorites = favorites.includes(id)
            ? favorites.filter(f => f !== id)
            : [...favorites, id];
        saveFavorites();
        updateDisplay();
    };

    // RENDER
    const createRecipeCard = (r) => `
        <div class="recipe-card">
            <button class="favorite-btn" data-id="${r.id}">
                ${favorites.includes(r.id) ? "❤️" : "🤍"}
            </button>
            <h3>${r.title}</h3>
            <p>${r.description}</p>
            <p>⏱️ ${r.time} min</p>
        </div>
    `;

    const updateDisplay = () => {
        let result = filterBySearch(recipes);
        result = applyFilter(result);
        result = applySort(result);

        recipeContainer.innerHTML = result.map(createRecipeCard).join("");
        recipeCount.textContent = `Showing ${result.length} of ${recipes.length} recipes`;
    };

    // EVENTS
    const handleSearch = (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchQuery = e.target.value.trim();
            clearBtn.style.display = searchQuery ? "block" : "none";
            updateDisplay();
        }, 300);
    };

    const clearSearch = () => {
        searchQuery = "";
        searchInput.value = "";
        clearBtn.style.display = "none";
        updateDisplay();
    };

    const handleClicks = (e) => {
        if (e.target.classList.contains("favorite-btn")) {
            toggleFavorite(e.target.dataset.id);
        }
    };

    const setup = () => {
        filterButtons.forEach(btn =>
            btn.addEventListener("click", () => {
                currentFilter = btn.dataset.filter;
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                updateDisplay();
            })
        );

        sortButtons.forEach(btn =>
            btn.addEventListener("click", () => {
                currentSort = btn.dataset.sort;
                sortButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                updateDisplay();
            })
        );

        recipeContainer.addEventListener("click", handleClicks);
        searchInput.addEventListener("input", handleSearch);
        clearBtn.addEventListener("click", clearSearch);
    };

    const init = () => {
        setup();
        updateDisplay();
        console.log("🍳 RecipeJS fully loaded!");
    };

    return { init };
})();

RecipeApp.init();