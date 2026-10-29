const productsContainer = document.getElementById("products");
const count = document.getElementById("count");
const error = document.getElementById("error");

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
function renderProducts(products) {
  count.textContent = `${products.length} items`;
  productsContainer.innerHTML = products.map(product => `
    <article class="product">
      <div class="product-top"><h3>${escapeHtml(product.name)}</h3><span class="category">${escapeHtml(product.category)}</span></div>
      <p class="price">${formatPrice(product.price)}</p>
      <span class="score">Recommendation score: ${product.score}/100</span>
    </article>`).join("");
}
async function loadRecommendations() {
  try {
    const response = await fetch("/api/recommendations");
    if (!response.ok) throw new Error("Could not load recommendations.");
    const data = await response.json();
    renderProducts(data.recommendations);
  } catch (err) {
    error.textContent = err.message;
    count.textContent = "Unavailable";
  }
}
loadRecommendations();
