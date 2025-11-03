// ========== ĐỊNH DẠNG TIỀN ==========
function vnd(price) {
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// ========== DỮ LIỆU GIỎ HÀNG ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ========== LƯU GIỎ HÀNG ==========
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ========== THÊM MÓN ==========
function addToCart(id, name, price, img) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, img, qty: 1 });
  }
  saveCart();
  showAddEffect(name);
}

// Hiệu ứng thêm món
function showAddEffect(name) {
  const note = document.createElement('div');
  note.className = 'add-note';
  note.textContent = `Đã thêm "${name}" vào giỏ hàng!`;
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 2000);
  const style = document.createElement('style');
  style.textContent = `
    .add-note {
      position: fixed;
      top: 30px; right: 30px;
      background: #3C9B90;
      color: white;
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: fadein 0.3s ease;
      z-index: 9999;
    }
    @keyframes fadein { from {opacity: 0; transform: translateY(-10px);} to {opacity: 1;} }
  `;
  document.head.appendChild(style);
}

// ========== HIỂN THỊ GIỎ HÀNG ==========
function showCartPopup() {
  const popup = document.createElement('div');
  popup.className = 'cart-popup';
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  let message = '';
  if (totalItems === 0) {
    message = "🛒 Giỏ hàng của bạn đang trống.";
  } else if (totalItems === 1) {
    message = "Bạn có 1 sản phẩm trong giỏ hàng.";
  } else {
    message = `Bạn có ${totalItems} sản phẩm trong giỏ hàng.`;
  }

  let listHTML = '';
  if (cart.length === 0) {
    listHTML = `<p>${message}</p>`;
  } else {
    listHTML = `
      <p style="font-weight:600; color:#3C9B90;">${message}</p>
      <ul class="cart-list">
        ${cart.map(i => `
          <li>
            <img src="${i.img}" alt="">
            <div>
              <p>${i.name}</p>
              <span>${i.qty} × ${vnd(i.price)}</span>
            </div>
          </li>
        `).join('')}
      </ul>
      <div class="cart-total">Tổng cộng: <strong>${vnd(subtotal)}</strong></div>
    `;
  }

  popup.innerHTML = `
    <div class="cart-popup-content">
      <h2>Giỏ hàng của bạn</h2>
      ${listHTML}
      <div class="cart-actions">
        <button id="close-cart">Đóng</button>
        ${cart.length > 0 ? `<button id="checkout-now">Thanh toán</button>` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(popup);
  addCartStyle();

  document.getElementById('close-cart').addEventListener('click', () => popup.remove());
  
  // Nếu có sản phẩm thì cho phép thanh toán
  if (cart.length > 0) {
    document.getElementById('checkout-now').addEventListener('click', () => {
      popup.remove();
      showSuccessPopup(); // Gọi popup thành công
      cart = [];
      saveCart();
    });
  }
}

// ========== POPUP THANH TOÁN THÀNH CÔNG ==========
function showSuccessPopup() {
  const success = document.createElement('div');
  success.className = 'success-popup';
  success.innerHTML = `
    <div class="success-content">
      <h2>Thanh toán thành công!</h2>
      <p>Cảm ơn bạn đã mua sắm tại <strong>Orne Decor</strong>.<br>Chúng tôi sẽ sớm liên hệ xác nhận đơn hàng của bạn.</p>
      <button id="home-btn">Về trang chủ</button>
    </div>
  `;
  document.body.appendChild(success);

  document.getElementById('home-btn').addEventListener('click', () => {
    window.location.href = 'indexx.html';
  });
}

// ========== STYLE ==========
function addCartStyle() {
  if (document.getElementById('cart-popup-style')) return;
  const style = document.createElement('style');
  style.id = 'cart-popup-style';
  style.textContent = `
    .cart-popup, .success-popup {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.4);
      display: flex; justify-content: center; align-items: center;
      z-index: 9999;
    }
    .cart-popup-content, .success-content {
      background: #ffffffed;
      border-radius: 14px;
      padding: 30px 40px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      text-align: center;
      animation: zoomIn 0.3s ease;
    }
    .success-content h2 {
      color: #3C9B90;
      margin-bottom: 10px;
    }
    .success-content p {
      color: #333;
      margin-bottom: 20px;
    }
    #home-btn {
      background: #3C9B90;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 15px;
      transition: all 0.3s;
    }
    #home-btn:hover {
      background: #2f7d74;
    }
    .cart-list {
      list-style: none;
      padding: 0;
      margin: 0 0 15px 0;
      max-height: 300px;
      overflow-y: auto;
    }
    .cart-list li {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      text-align: left;
    }
    .cart-list img {
      width: 60px; height: 60px;
      border-radius: 10px;
      margin-right: 10px;
      object-fit: cover;
    }
    .cart-actions button {
      background: #3C9B90;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      margin: 5px;
      cursor: pointer;
      font-size: 15px;
      transition: all 0.3s;
    }
    .cart-actions button:hover {
      background: #2f7d74;
    }
    @keyframes zoomIn { from {transform: scale(0.9); opacity: 0;} to {transform: scale(1); opacity: 1;} }
  `;
  document.head.appendChild(style);
}

// ========== NÚT THANH TOÁN TRONG TRANG ==========
document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById("checkout-btn");
  const errorBox = document.getElementById("error-message");

  if (payBtn) {
    payBtn.addEventListener("click", (e) => {
      e.preventDefault();
      errorBox.textContent = "";
      errorBox.style.color = "red";

      const name = document.querySelector("#name")?.value.trim();
      const phone = document.querySelector("#phone")?.value.trim();
      const address = document.querySelector("#address")?.value.trim();

      // ==== 1. Kiểm tra giỏ hàng ====
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        errorBox.textContent = "⚠️ Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.";
        return;
      }

      // ==== 2. Kiểm tra tên ====
      const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
      if (!name || !nameRegex.test(name)) {
        errorBox.textContent = "⚠️ Vui lòng nhập tên hợp lệ (chỉ chứa chữ cái, không ký tự đặc biệt).";
        return;
      }

      // ==== 3. Kiểm tra số điện thoại ====
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        errorBox.textContent = "⚠️ Số điện thoại phải gồm đúng 10 chữ số.";
        return;
      }

      // ==== 4. Kiểm tra địa chỉ ====
      if (!address) {
        errorBox.textContent = "⚠️ Vui lòng nhập địa chỉ giao hàng.";
        return;
      }

      // ==== 5. Nếu hợp lệ ====
      errorBox.style.color = "#3C9B90";
      errorBox.textContent = "✅ Thông tin hợp lệ. Đang xử lý thanh toán...";
      setTimeout(() => {
        localStorage.removeItem("cart"); // Xóa giỏ sau khi thanh toán
        window.location.href = "success.html";
      }, 1000);
    });
  }
});
  


document.addEventListener("DOMContentLoaded", () => {
  // Lấy vùng chứa sản phẩm
  const container = document.getElementById("selected-products");

  // Hàm render giỏ hàng
  window.renderCart = function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      container.innerHTML = `<p>Giỏ hàng của bạn đang trống.</p>`;
      updateSummary();
      return;
    }

    container.innerHTML = cart.map((item, index) => `
      <div class="product-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="product-info">
          <h4>${item.name}</h4>
          <div class="quantity-box">
            <p>Số lượng:</p>
            <input 
              type="number"
              min="1"
              value="${item.qty}"
              onchange="manualQty(${index}, this.value)"
            >
          </div>
          <p>Giá: ${(item.price * item.qty).toLocaleString("vi-VN")}₫</p>
        </div>
        <button class="remove-btn" onclick="removeItem(${index})">✕</button>
      </div>
    `).join("");

    updateSummary();
  };

  // Cập nhật tóm tắt (luôn đọc localStorage)
  window.updateSummary = function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("cart-total");
    const discountEl = document.getElementById("discount");
    const shippingEl = document.getElementById("shipping");
    const referralCode = document.getElementById("referral")?.value.trim().toLowerCase();

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = 25000;
    let discount = 0;

    if (referralCode === "camonquykhach") discount = subtotal * 0.1;
    const total = subtotal - discount + shipping;

    if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString("vi-VN") + "₫";
    if (discountEl) discountEl.textContent = discount.toLocaleString("vi-VN") + "₫";
    if (totalEl) totalEl.textContent = total.toLocaleString("vi-VN") + "₫";
  };

  // Thay đổi số lượng
  window.manualQty = function (index, value) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const qty = parseInt(value);

    if (isNaN(qty) || qty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = qty;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();      // cập nhật danh sách
    updateSummary();   // cập nhật tổng tiền
  };

  // Xóa sản phẩm
  window.removeItem = function (index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateSummary();
  };

  // Gọi khi tải trang
  renderCart();
  updateSummary();
});

  // ======= TÍNH TỔNG TIỀN GIỎ HÀNG =======
function updateSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("cart-total");
  const shippingEl = document.getElementById("shipping");

  if (!subtotalEl || !totalEl) return;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = shippingEl ? 25000 : 0;
  const total = subtotal + shipping;

  subtotalEl.textContent = subtotal.toLocaleString("vi-VN") + "₫";
  totalEl.textContent = total.toLocaleString("vi-VN") + "₫";
}

// ======= GỌI KHI RENDER HOẶC CẬP NHẬT =======
document.addEventListener("DOMContentLoaded", () => {
  updateSummary();
});

window.manualQty = (index, value) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const qty = parseInt(value);

  if (isNaN(qty) || qty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].qty = qty;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateSummary(); // ✅ cập nhật tổng tiền sau khi chỉnh số lượng
};

window.removeItem = (index) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateSummary(); // ✅ cập nhật lại tổng
};
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "error" : ""}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
function showToast(msg,type="success"){
  const toast=document.getElementById("toast");
  toast.textContent=msg;
  toast.className=`show ${type}`;
  setTimeout(()=>toast.className=toast.className.replace("show",""),3000);
}

function applyReferral() {
  const code = document.getElementById("referral").value.trim().toLowerCase();
  const discountEl = document.getElementById("discount");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("cart-total");
  const shippingEl = document.getElementById("shipping");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 25000;

  let discount = 0;
  if (code === "camonquykhach") discount = subtotal * 0.1;

  const total = subtotal - discount + shipping;

  discountEl.textContent = discount.toLocaleString("vi-VN") + "₫";
  subtotalEl.textContent = subtotal.toLocaleString("vi-VN") + "₫";
  totalEl.textContent = total.toLocaleString("vi-VN") + "₫";

  if(code==="camonquykhach") showToast("Áp dụng mã thành công! Giảm 10% tổng đơn.","success");
  else if(code!=="") showToast("Mã không hợp lệ!","error");
}


document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("apply-referral");
  if (btn) btn.addEventListener("click", applyReferral);
});
// ======= TOAST THÔNG BÁO GÓC PHẢI =======
function showToast(msg, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
  if (!document.getElementById("toast-style")) {
    const style = document.createElement("style");
    style.id = "toast-style";
    style.textContent = `
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 12px 18px;
        border-radius: 6px;
        font-size: 15px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        animation: fadeInOut 3s forwards;
        z-index: 1000;
      }
      .toast.error { background-color: #f44336; }
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-20px); }
        10%,90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
      }`;
    document.head.appendChild(style);
  }
}
