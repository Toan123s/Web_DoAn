// Dữ liệu trong localStorage
let products = JSON.parse(localStorage.getItem('products')) || [
  {
    id: 1,
    name: "Bình Hoa Thủy Tinh 30cm",
    description: "Bình trong suốt, decor sang trọng.",
    images: [],
    status: 1
  }
];

let editingProdId = null;
let tempImages = [];

// Load ban đầu
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});

// === TAB ===
function openTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`[onclick="openTab('${tabId}')"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// === SẢN PHẨM ===
function renderProducts() {
  const tbody = document.querySelector("#product-table tbody");
  tbody.innerHTML = "";
  if (products.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>Không có sản phẩm.</td></tr>";
    return;
  }
  products.forEach(p => {
    const tr = document.createElement("tr");
    if (!p.status) tr.classList.add("hidden");
    const firstImage = p.images.length > 0 ? p.images[0] : '';
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.status ? "Không" : "Có"}</td>
      <td class="actions">
        <button class="btn-small" onclick="editProduct(${p.id})">Sửa</button>
        <button class="btn-small ${p.status ? 'btn-red' : ''}" onclick="toggleProduct(${p.id})">
          ${p.status ? "Ẩn" : "Hiện"}
        </button>
        <button class="btn-small btn-red" onclick="deleteProduct(${p.id})">Xóa</button>
      </td>
      <td>
        ${firstImage ? `<img src="${firstImage}" onclick="viewProductImages(${p.id})">` : 'Không có ảnh'}
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
  if (!p) return;
  editingProdId = id;
  tempImages = [...p.images];
  document.getElementById("prod-modal-title").textContent = "Sửa sản phẩm";
  document.getElementById("prod-name").value = p.name;
  document.getElementById("prod-desc").value = p.description;

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

  if (!files.length) return;
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

  if (!name) return alert("Nhập đầy đủ tên!");
  if (tempImages.length === 0) return alert("Vui lòng chọn ít nhất 1 ảnh!");

  if (editingProdId) {
    const p = products.find(x => x.id === editingProdId);
    if (p) {
      p.name = name;
      p.description = desc;
      p.images = tempImages;
    }
  } else {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    products.push({
      id: newId, name, description: desc,
      images: tempImages, status: 1
    });
  }

  closeModal("product-modal");
  renderProducts();
}

function toggleProduct(id) {
  const p = products.find(x => x.id === id);
  if (p) p.status = p.status ? 0 : 1;
  renderProducts();
}

function deleteProduct(id) {
  if (confirm("Xóa sản phẩm này?")) {
    products = products.filter(x => x.id !== id);
    renderProducts();
  }
}

// Xem ảnh sản phẩm
function viewProductImages(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const preview = document.getElementById("image-preview");
  preview.innerHTML = "";
  p.images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    preview.appendChild(img);
  });
  document.getElementById("product-modal").style.display = "flex";
  document.getElementById("prod-modal-title").textContent = `Xem ảnh sản phẩm: ${p.name}`;
  document.getElementById("prod-name").value = p.name;
  document.getElementById("prod-desc").value = p.description;
  editingProdId = id;
  tempImages = [...p.images];
}

// === HỖ TRỢ ===
function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
