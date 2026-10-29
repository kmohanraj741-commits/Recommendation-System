const productsContainer =
    document.getElementById("products");

const count =
    document.getElementById("count");

const error =
    document.getElementById("error");

const category =
    document.getElementById("category");

const minPrice =
    document.getElementById("minPrice");

const maxPrice =
    document.getElementById("maxPrice");

const sort =
    document.getElementById("sort");

const filterButton =
    document.getElementById("filterButton");

const clearButton =
    document.getElementById("clearButton");


function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}


function escapeHtml(value) {
    return String(value).replace(
        /[&<>"']/g,
        char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char])
    );
}


function renderProducts(products) {

    count.textContent =
        `${products.length} items`;

    if (products.length === 0) {

        productsContainer.innerHTML = `
            <p class="note">
                No recommendations match
                the selected filters.
            </p>
        `;

        return;
    }

    productsContainer.innerHTML =
        products
            .map(product => `
                <article class="product">

                    <div class="product-top">

                        <h3>
                            ${escapeHtml(product.name)}
                        </h3>

                        <span class="category">
                            ${escapeHtml(product.category)}
                        </span>

                    </div>

                    <p class="price">
                        ${formatPrice(product.price)}
                    </p>

                    <span class="score">
                        Recommendation score:
                        ${product.score}/100
                    </span>

                </article>
            `)
            .join("");
}


async function loadRecommendations() {

    try {

        error.textContent = "";

        const params =
            new URLSearchParams();

        if (category.value) {
            params.set(
                "category",
                category.value
            );
        }

        if (minPrice.value) {
            params.set(
                "minPrice",
                minPrice.value
            );
        }

        if (maxPrice.value) {
            params.set(
                "maxPrice",
                maxPrice.value
            );
        }

        if (sort.value) {
            params.set(
                "sort",
                sort.value
            );
        }

        const query =
            params.toString();

        const url = query
            ? `/api/recommendations?${query}`
            : "/api/recommendations";

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                "Could not load recommendations."
            );
        }

        const data =
            await response.json();

        renderProducts(
            data.recommendations
        );

    } catch (err) {

        error.textContent =
            err.message;

        count.textContent =
            "Unavailable";

        productsContainer.innerHTML = "";
    }
}


filterButton.addEventListener(
    "click",
    loadRecommendations
);


clearButton.addEventListener(
    "click",
    () => {

        category.value = "";
        minPrice.value = "";
        maxPrice.value = "";
        sort.value = "";

        loadRecommendations();
    }
);


loadRecommendations();