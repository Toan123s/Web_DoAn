// Dữ liệu trong localStorage
let categories = JSON.parse(localStorage.getItem('categories')) || [
  { id: 1, name: "Bình hoa", status: 1 },
  { id: 2, name: "Lọ nhỏ", status: 1 },
  { id: 3, name: "Bình cưới", status: 1 }
];

let products = JSON.parse(localStorage.getItem('products')) || [
  {
    id: 1,
    name: "Bình Hoa Thủy Tinh 30cm",
    category_id: 1,
    description: "Bình trong suốt, decor sang trọng.",
    images: [],
    status: 1
  }
];

let editingCatId = null;
let editingProdId = null;
let tempImages = [];

// Load ban đầu
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts();
  updateCategorySelect();
});

// === TAB ===
function openTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`[onclick="openTab('${tabId}')"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// === LOẠI SẢN PHẨM ===
function renderCategories() {
  const tbody = document.querySelector("#category-table tbody");
  tbody.innerHTML = "";
  categories.forEach(cat => {
    const tr = document.createElement("tr");
    if (!cat.status) tr.classList.add("hidden");
    tr.innerHTML = `
      <td>${cat.id}</td>
      <td>${cat.name}</td>
      <td>${cat.status ? "Hiện" : "Ẩn"}</td>
      <td class="actions">
        <button class="btn-small" onclick="editCategory(${cat.id})">Sửa</button>
        <button class="btn-small ${cat.status ? 'btn-red' : ''}" onclick="toggleCategory(${cat.id})">
          ${cat.status ? "Ẩn" : "Hiện"}
        </button>
        <button class="btn-small btn-red" onclick="deleteCategory(${cat.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  saveCategories();
}

function openCategoryModal() {
  editingCatId = null;
  document.getElementById("cat-modal-title").textContent = "Thêm loại mới";
  document.getElementById("cat-name").value = "";
  document.getElementById("category-modal").style.display = "flex";
}

function editCategory(id) {
  const cat = categories.find(c => c.id === id);
  editingCatId = id;
  document.getElementById("cat-modal-title").textContent = "Sửa loại";
  document.getElementById("cat-name").value = cat.name;
  document.getElementById("category-modal").style.display = "flex";
}

function saveCategory() {
  const name = document.getElementById("cat-name").value.trim();
  if (!name) return alert("Vui lòng nhập tên loại!");

  if (editingCatId) {
    const cat = categories.find(c => c.id === editingCatId);
    cat.name = name;
  } else {
    const newId = Math.max(...categories.map(c => c.id), 0) + 1;
    categories.push({ id: newId, name, status: 1 });
  }
  closeModal("category-modal");
  renderCategories();
  updateCategorySelect();
}

function toggleCategory(id) {
  const cat = categories.find(c => c.id === id);
  cat.status = cat.status ? 0 : 1;
  renderCategories();
}

function deleteCategory(id) {
  if (confirm("Xóa loại này? Sản phẩm sẽ mất loại!")) {
    categories = categories.filter(c => c.id !== id);
    products.forEach(p => { if (p.category_id === id) p.category_id = null; });
    renderCategories();
    renderProducts();
    updateCategorySelect();
  }
}

// === SẢN PHẨM ===
function renderProducts() {
  const tbody = document.querySelector("#product-table tbody");
  tbody.innerHTML = "";
  products.forEach(p => {
    const cat = categories.find(c => c.id === p.category_id);
    const tr = document.createElement("tr");
    if (!p.status) tr.classList.add("hidden");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${cat ? cat.name : "-"}</td>
      <td>${p.status ? "Không" : "Có"}</td>
      <td class="actions">
        <button class="btn-small" onclick="editProduct(${p.id})">Sửa</button>
        <button class="btn-small ${p.status ? 'btn-red' : ''}" onclick="toggleProduct(${p.id})">
          ${p.status ? "Ẩn" : "Hiện"}
        </button>
        <button class="btn-small btn-red" onclick="deleteProduct(${p.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  saveProducts();
}

function openProductModal() {
  editingProdId = null;
  tempImages = [];
  document.getElementById("prod-modal-title").textContent = "Thêm sản phẩm mới";
  document.getElementById("prod-name").value = "";
  document.getElementById("prod-desc").value = "";
  document.getElementById("image-preview").innerHTML = "";
  document.getElementById("prod-images").value = ""; // Reset input file
  document.getElementById("product-modal").style.display = "flex";
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  editingProdId = id;
  tempImages = [...p.images];
  document.getElementById("prod-modal-title").textContent = "Sửa sản phẩm";
  document.getElementById("prod-name").value = p.name;
  document.getElementById("prod-desc").value = p.description;
  document.getElementById("prod-category").value = p.category_id || "";

  const preview = document.getElementById("image-preview");
  preview.innerHTML = "";
  p.images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    preview.appendChild(img);
  });

  document.getElementById("product-modal").style.display = "flex";
}

// Xem trước ảnh
function previewImages(event) {
  const files = event.target.files;
  const preview = document.getElementById("image-preview");
  preview.innerHTML = ""; // Xóa ảnh cũ
  tempImages = []; // Reset mảng ảnh tạm

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(ev) {
      tempImages.push(ev.target.result); // Lưu base64
      const img = document.createElement("img");
      img.src = ev.target.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

function saveProduct() {
  const name = document.getElementById("prod-name").value.trim();
  const desc = document.getElementById("prod-desc").value;
  const catId = +document.getElementById("prod-category").value || null;

  if (!name) return alert("Nhập đầy đủ tên!");
  if (tempImages.length === 0) return alert("Vui lòng chọn ít nhất 1 ảnh!");

  if (editingProdId) {
    const p = products.find(x => x.id === editingProdId);
    p.name = name;
    p.description = desc;
    p.category_id = catId;
    p.images = tempImages;
  } else {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    products.push({
      id: newId, name, category_id: catId, description: desc,
      images: tempImages, status: 1
    });
  }

  closeModal("product-modal");
  renderProducts();
}

function toggleProduct(id) {
  const p = products.find(x => x.id === id);
  p.status = p.status ? 0 : 1;
  renderProducts();
}

function deleteProduct(id) {
  if (confirm("Xóa sản phẩm này?")) {
    products = products.filter(x => x.id !== id);
    renderProducts();
  }
}

// === HỖ TRỢ ===
function updateCategorySelect() {
  const sel = document.getElementById("prod-category");
  sel.innerHTML = "<option value=''>-- Chọn loại --</option>";
  categories.filter(c => c.status).forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}