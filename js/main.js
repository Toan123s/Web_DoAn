document.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra và sửa dữ liệu khi trang load
  const rawProducts = JSON.parse(localStorage.getItem('product')) || [];
  console.log('Tổng số sản phẩm:', rawProducts.length);

  // Log các sản phẩm lỗi
  const invalidProducts = rawProducts.filter(product =>
    !product.productId || !product.name || !product.price || !product.src
  );

  if (invalidProducts.length > 0) {
    console.warn('Có sản phẩm lỗi:', invalidProducts);

    // Xóa các sản phẩm lỗi
    const validProducts = rawProducts.filter(product =>
      product.productId && product.name && product.price && product.src
    );
    localStorage.setItem('product', JSON.stringify(validProducts));
    console.log('Đã xóa sản phẩm lỗi, còn lại:', validProducts.length);
    productsFromLocal = validateProductData(validProducts);
  } else {
    productsFromLocal = validateProductData(rawProducts);
  }

  // Hiển thị tất cả sản phẩm khi trang được tải
  displayFilteredProducts(productsFromLocal, 1);

  const swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // Kiểm tra trạng thái đăng nhập từ localStorage
  const userAccount = localStorage.getItem("userLogin");
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");
  const accountinfo = document.getElementById("account-info-link");
  const userdisplay = document.getElementById("username-display");

  if (userAccount) {
    loginLink.style.display = "inline-block";
    logoutLink.style.display = "inline-block";
    accountinfo.style.display = "inline-block";
    document.querySelector("#login-link").addEventListener("click", () => {
      document.querySelector(".modal").style.display = "none";
      showLogin();
    });
  } else {
    loginLink.style.display = "inline-block";
    logoutLink.style.display = "none";
    accountinfo.style.display = "none";
  }

  logoutLink.addEventListener("click", function () {
    localStorage.removeItem("userLogin");
    document.querySelector("#login-link").addEventListener("click", () => {
      document.querySelector(".modal").style.display = "flex";
      showLogin();
    });
    loginLink.style.display = "inline-block";
    logoutLink.style.display = "none";
    accountinfo.style.display = "none";
    userdisplay.style.display = "none";
  });

  // Lọc sản phẩm
  const filterBtn = document.querySelector(".filter-btn");
  const advancedSearch = document.querySelector(".advanced-search");

  filterBtn.addEventListener("click", function () {
    if (advancedSearch.classList.contains("open")) {
      advancedSearch.classList.remove("open");
    } else {
      advancedSearch.classList.add("open");
    }
  });

  document.addEventListener("click", function (event) {
    if (!advancedSearch.contains(event.target) && !filterBtn.contains(event.target)) {
      advancedSearch.classList.remove("open");
    }
  });

  // Hiển thị thông tin user nếu đã đăng nhập
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  if (userLogin) {
    displayUserInfo(userLogin);
    document.getElementById("username-display").innerText = ` ${userLogin.UserName}`;
  }
});

// Hàm kiểm tra và làm sạch dữ liệu sản phẩm
function validateProductData(products) {
  return products.filter(product => {
    return product &&
      product.productId &&
      product.name &&
      product.price &&
      product.src &&
      product.category;
  }).map(product => {
    // Đảm bảo price là number
    if (typeof product.price === 'string') {
      product.price = parseFloat(product.price.replace(/[^\d]/g, '')) || 0;
    }
    return product;
  });
}

let productsFromLocal = [];

const newbooks = JSON.parse(localStorage.getItem('newbook'));
const arrnewproduct = document.getElementsByClassName('item-newproducts');

for (let i = 0; i < arrnewproduct.length; i++) {
  if (newbooks[i]) {
    arrnewproduct[i].innerHTML = `
      <div class="images-newbook"><img src="${newbooks[i].src}" alt=""></div>
      <div class="info-book name">${newbooks[i].name}</div>
      <div class="info-book categorynew"><i class="fa-solid fa-tag"></i>${newbooks[i].category}</div>
      <div class="info-book price"> <i class="fas fa-coins newcoin"></i>giá: ${newbooks[i].price}Đ</div>
    `;
  }
}

const pageSize = 8;

// Gợi ý hiển thị sản phẩm
function showSearchSuggestions(searchTerm) {
  const searchResultsContainer = document.getElementById("search-results");
  const showProductContainer = document.getElementById("show-product");
  if (!showProductContainer) return;

  showProductContainer.innerHTML = '';

  if (searchTerm.trim() === '') {
    searchResultsContainer.classList.remove('show');
    return;
  }

  const filteredProducts = productsFromLocal.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    const noResultsMessage = document.createElement('div');
    noResultsMessage.classList.add('no-results');
    noResultsMessage.innerText = 'Không có gợi ý phù hợp.';
    showProductContainer.appendChild(noResultsMessage);
    searchResultsContainer.classList.add('show');
    return;
  }

  filteredProducts.slice(0, 5).forEach(product => {
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('search-suggestion');
    suggestionItem.innerHTML = `
      <img src="${product.src}" alt="${product.name}" class="suggestion-img">
      <div class="suggestion-info">
        <p class="suggestion-name">${product.name}</p>
        <p class="suggestion-price">${typeof product.price === 'number' ? product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Liên hệ'}</p>
      </div>
    `;
    suggestionItem.addEventListener('click', () => {
      // Reset tìm kiếm và hiển thị sản phẩm được chọn
      resetSearch();
      document.querySelector('.search-bar input').value = product.name;
      searchProducts();
      searchResultsContainer.classList.remove('show');
    });
    showProductContainer.appendChild(suggestionItem);
  });

  searchResultsContainer.classList.add('show');
}

// Gắn sự kiện cho ô tìm kiếm
document.querySelector('.search-bar input').addEventListener('input', (event) => {
  const searchTerm = event.target.value.trim();
  showSearchSuggestions(searchTerm);

  // Tìm kiếm realtime
  if (searchTerm.length > 0) {
    searchProducts();
  }
});

// Sự kiện cho nút tìm kiếm
document.querySelector('.search-bar button').addEventListener('click', searchProducts);

// Sự kiện enter để tìm kiếm
document.querySelector('.search-bar input').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    searchProducts();
  }
});

// Hiển thị sản phẩm và phân trang
function displayFilteredProducts(filteredProducts, currentPage) {
  const productsContainer = document.querySelector('.products');
  productsContainer.innerHTML = '';

  // Kiểm tra và validate sản phẩm trước khi hiển thị
  const validProducts = validateProductData(filteredProducts);

  if (validProducts.length === 0) {
    const noProductsMessage = document.createElement('div');
    noProductsMessage.classList.add('no-products-message');
    noProductsMessage.innerText = 'Không tìm thấy sản phẩm phù hợp.';
    productsContainer.appendChild(noProductsMessage);
    return;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const productsToDisplay = validProducts.slice(startIndex, endIndex);

  productsToDisplay.forEach(product => {
    if (!product.productId || !product.name || !product.price || !product.src) {
      console.warn('Sản phẩm bị lỗi:', product);
      return;
    }

    const productItem = document.createElement('div');
    productItem.classList.add('productitems');
    productItem.innerHTML = `
      <img class="product-img" src="${product.src}" alt="${product.name}" onerror="this.src='./assets/images/placeholder.jpg'">
      <div class="product-name">${product.name}</div>
      <div class="product-price">${typeof product.price === 'number' ? product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Liên hệ'}</div>
      <div class="iconfreeship">
        <i class="fa-solid fa-truck"></i>
        <div class="freeship">Freeship</div>
      </div>
      <div class="add-cart" onclick="addToCart(${product.productId})">Thêm vào giỏ</div>
    `;
    productsContainer.appendChild(productItem);
  });

  renderPage(validProducts, currentPage);
}

function renderPage(filteredProducts, currentPage) {
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('div');
    pageButton.classList.add('page', `page${i}`);
    if (i === currentPage) {
      pageButton.classList.add('activepage');
    }
    pageButton.innerText = i;
    pageButton.addEventListener('click', () => changePage(filteredProducts, i));
    paginationContainer.appendChild(pageButton);
  }
}

function changePage(filteredProducts, pageNumber) {
  displayFilteredProducts(filteredProducts, pageNumber);
}

function searchProducts() {
  const searchTerm = document.querySelector('.search-bar input').value.toLowerCase();
  const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
  const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
  const category = document.getElementById('advanced-search-category-select').value;

  console.log('Tìm kiếm với:', { searchTerm, minPrice, maxPrice, category });

  const filteredProducts = productsFromLocal.filter(product => {
    const matchesName = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = category === 'Tất cả' || product.category === category;
    const productPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price);
    const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;

    console.log(`Sản phẩm: ${product.name}`, {
      matchesName, matchesCategory, matchesPrice,
      price: productPrice, minPrice, maxPrice
    });

    return matchesName && matchesCategory && matchesPrice;
  });

  console.log('Kết quả tìm kiếm:', filteredProducts);
  displayFilteredProducts(filteredProducts, 1);

  // Cuộn đến kết quả
  const productsContainer = document.querySelector('.products');
  if (productsContainer) {
    productsContainer.scrollIntoView({ behavior: 'smooth' });
  }
}

document.querySelector('.search-bar input').addEventListener('input', searchProducts);
document.getElementById('min-price').addEventListener('change', searchProducts);
document.getElementById('max-price').addEventListener('change', searchProducts);
document.getElementById('advanced-search-category-select').addEventListener('change', searchProducts);

function resetSearch() {
  document.querySelector('.search-bar input').value = '';
  document.getElementById('min-price').value = '';
  document.getElementById('max-price').value = '';
  document.getElementById('advanced-search-category-select').value = 'Tất cả';
}

function addToCart(productId) {
  const user = JSON.parse(localStorage.getItem('userLogin'));
  if (!user) {
    alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
    document.querySelector('.modal').style.display = 'flex';
    return;
  }

  const product = productsFromLocal.find(p => p.productId === productId);
  if (!product) {
    alert('Sản phẩm không tồn tại!');
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.productId === productId && item.userId === user.UserID);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId: product.productId,
      name: product.name,
      price: product.price,
      src: product.src,
      quantity: 1,
      userId: user.UserID
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

document.getElementById('reset-search').addEventListener('click', function (event) {
  event.preventDefault();
  resetSearch();
});

function closeSearchAdvanced() {
  document.querySelector(".advanced-search").classList.toggle("open");
}

"use strict";

document.querySelector("#login-link").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "flex";
  showLogin();
});

document.querySelector(".close-btn").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "none";
  showLogin();
});

document.querySelector("#account-info-link").addEventListener("click", () => {
  document.querySelector(".modal1").style.display = "flex";
});

document.querySelector(".modal1").addEventListener("click", (event) => {
  if (event.target.classList.contains("modal1")) {
    document.querySelector(".modal1").style.display = "none";
  }
});

function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
  document.querySelector(".tab-container .tab.active-tab").classList.remove("active-tab");
  document.querySelector(".tab-container .tab").classList.add("active-tab");
}

function showRegister() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
  document.querySelector(".tab-container .tab.active-tab").classList.remove("active-tab");
  document.querySelectorAll(".tab-container .tab")[1].classList.add("active-tab");
}

function register() {
  const UserName = document.getElementById("register-username").value;
  const FullName = document.getElementById("register-fullname").value;
  const UserPassword = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const Sdt = document.getElementById("phone-number").value;
  let presentId = parseInt(localStorage.getItem("presentId"));

  if (FullName.length == 0) {
    document.querySelector('.form-message-fullname').innerHTML = 'Vui lòng nhập họ và tên';
    document.getElementById('register-fullname').focus();
    return;
  } else if (FullName.length < 3) {
    document.getElementById('register-fullname').value = '';
    document.querySelector('.form-message-fullname').innerHTML = 'Vui lòng nhập họ và tên lớn hơn 3 kí tự';
    return;
  } else {
    document.querySelector('.form-message-fullname').innerHTML = '';
  }
  if (UserName == 0) {
    document.querySelector('.form-message-username').innerHTML = 'Vui lòng nhập tên đăng nhập';
    document.getElementById('register-username').focus();
    return;
  } else {
    document.querySelector('.form-message-username').innerHTML = '';
  }
  if (UserPassword.length == 0) {
    document.querySelector('.form-message-password').innerHTML = 'Vui lòng nhập mật khẩu';
    return;
  } else if (UserPassword.length < 6) {
    document.querySelector('.form-message-password').innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự';
    document.getElementById('register-password').value = '';
    return;
  } else {
    document.querySelector('.form-message-password').innerHTML = '';
  }
  if (confirmPassword == 0) {
    document.querySelector('.form-message-password-confi').innerHTML = 'Vui lòng nhập lại mật khẩu';
    return;
  } else if (confirmPassword !== UserPassword) {
    document.querySelector('.form-message-password-confi').innerHTML = 'Mật khẩu không khớp';
    document.getElementById('confirm-password').value = '';
    return;
  } else {
    document.querySelector('.form-message-password-confi').innerHTML = '';
  }
  if (Sdt.length == 0) {
    document.querySelector('.form-message-phone').innerHTML = 'Vui lòng nhập vào số điện thoại';
    return;
  } else if (!/^\d{10}$/.test(Sdt)) {
    document.querySelector('.form-message-phone').innerHTML = 'Vui lòng nhập vào số điện thoại 10 số';
    document.getElementById('phone-number').value = '';
    return;
  } else {
    document.querySelector('.form-message-phone').innerHTML = '';
  }

  const userAccountList = JSON.parse(localStorage.getItem("USER")) || [];
  if (!presentId) {
    presentId = userAccountList.length + 10001;
  }

  if (!UserName || !UserPassword || !confirmPassword || !Sdt || !FullName) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  if (UserPassword !== confirmPassword) {
    alert("Mật khẩu nhập lại không khớp!");
    return;
  }

  const isUserNameTaken = userAccountList.some((user) => user.UserName === UserName);
  const isSdt = userAccountList.some((user) => user.Sdt == Sdt);
  if (isUserNameTaken) {
    document.querySelector('.form-message-username').innerHTML = 'Tên đăng nhập đã tồn tại';
    return;
  }
  if (isSdt) {
    document.querySelector('.form-message-phone').innerHTML = 'Số điện thoại đã tồn tại';
    return;
  }

  const newUser = {
    UserID: presentId,
    UserName,
    FullName,
    UserPassword,
    Sdt,
    Address1: '',
    Address2: 0,
    Address4: 0,
    Address3: 0,
    Status: 1
  };

  userAccountList.push(newUser);

  localStorage.setItem("USER", JSON.stringify(userAccountList));
  localStorage.setItem("presentId", presentId + 1);
  alert("Đăng kí thành công!");
  showLogin();
}

function login() {
  const UserName = document.getElementById("username").value;
  const UserPassword = document.getElementById("password").value;
  const userAccountList = JSON.parse(localStorage.getItem("USER")) || [];

  const matchedUser = userAccountList.find(
    (user) => user.UserName === UserName && user.UserPassword === UserPassword
  );

  if (matchedUser) {
    if (matchedUser.Status === 0) {
      alert("Tài khoản của bạn đã bị khóa!");
      return;
    }
    alert("Đăng nhập thành công!");
    localStorage.setItem("userLogin", JSON.stringify(matchedUser));
    document.getElementById("username-display").innerText = ` ${matchedUser.UserName}`;
    window.location.href = "index.html";
  } else {
    alert("Tên đăng nhập hoặc mật khẩu không đúng!");
  }
}

function lockAccount(UserName) {
  const userAccountList = JSON.parse(localStorage.getItem("USER")) || [];
  const userIndex = userAccountList.findIndex(user => user.UserName === UserName);
  if (userIndex !== -1) {
    userAccountList[userIndex].Status = 0;
    localStorage.setItem("user", JSON.stringify(userAccountList));
    alert("Tài khoản đã bị khóa thành công!");
  } else {
    alert("Không tìm thấy tài khoản.");
  }
}

function displayUserInfo(user) {
  if (user.Status == 0) {
    alert("Tài khoản của bạn đã bị khóa!");
    return;
  }

  document.getElementById("infoname").value = user.FullName;
  document.getElementById("infophone").value = user.Sdt;
  document.getElementById("infoemail").value = user.email;
  document.getElementById("infoaddress").value = user.Address1;
  document.getElementById("provinces").value = user.Address2;
  populateDistricts();
  document.getElementById("districts").value = user.Address3;
  populateWards();
  document.getElementById("wards").value = user.Address4;

  document.getElementById("save-info-user").addEventListener("click", function () {
    changeInformation(user);
  });

  document.getElementById("save-password").addEventListener("click", function () {
    changePassword(user);
  });
}

function changeInformation(user) {
  const updatedFullName = document.getElementById("infoname").value;
  const updatedPhone = document.getElementById("infophone").value;
  const updatedEmail = document.getElementById("infoemail").value;
  const updatedAddress = document.getElementById("infoaddress").value;
  const updatedAddress2 = document.getElementById("provinces").value;
  const updatedAddress3 = document.getElementById("districts").value;
  const updatedAddress4 = document.getElementById("wards").value;

  user.FullName = updatedFullName;
  user.Sdt = updatedPhone;
  user.email = updatedEmail;
  user.Address1 = updatedAddress.trim();
  user.Address2 = updatedAddress2.trim();
  user.Address3 = updatedAddress3.trim();
  user.Address4 = updatedAddress4.trim();

  const userAccountList = JSON.parse(localStorage.getItem("USER"));
  const index = userAccountList.findIndex((u) => u.UserName === user.UserName);
  userAccountList[index] = user;
  localStorage.setItem("USER", JSON.stringify(userAccountList));
  localStorage.setItem("userLogin", JSON.stringify(user));

  alert("Cập nhật thông tin thành công!");
}

function changePassword(user) {
  const currentPassword = document.getElementById("password-cur-info").value;
  const newPassword = document.getElementById("password-after-info").value;
  const confirmPassword = document.getElementById("password-comfirm-info").value;

  if (currentPassword !== user.UserPassword) {
    alert("Mật khẩu hiện tại không đúng!");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Mật khẩu mới không khớp!");
    return;
  }

  if (newPassword.length < 6) {
    alert("Mật khẩu mới phải dài hơn 6 ký tự!");
    return;
  }

  user.UserPassword = newPassword;

  const userAccountList = JSON.parse(localStorage.getItem("USER"));
  const index = userAccountList.findIndex((u) => u.UserName === user.UserName);
  userAccountList[index] = user;
  localStorage.setItem("USER", JSON.stringify(userAccountList));
  localStorage.setItem("userLogin", JSON.stringify(user));

  alert("Đổi mật khẩu thành công!");
}

function populateProvinces() {
  const provinces = JSON.parse(localStorage.getItem('Tinh_TP')) || [];
  const provincesSelect = document.getElementById('provinces');

  provincesSelect.innerHTML = '<option value="">Chọn Tỉnh / Thành phố</option>';

  provinces.forEach(province => {
    const option = document.createElement('option');
    option.value = province.TinhID;
    option.textContent = province.TinhName;
    provincesSelect.appendChild(option);
  });
}

function populateDistricts() {
  const provinceId = document.getElementById('provinces').value;
  const districts = JSON.parse(localStorage.getItem('Quan_Huyen')) || [];
  const districtsSelect = document.getElementById('districts');

  if (!provinceId) {
    districtsSelect.innerHTML = '<option value="">Chọn Quận / Huyện</option>';
    return;
  }

  const filteredDistricts = districts.filter(district => district.TinhID === provinceId);

  districtsSelect.innerHTML = '<option value="">Chọn Quận / Huyện</option>';
  filteredDistricts.forEach(district => {
    const option = document.createElement('option');
    option.value = district.Quan_HuyenID;
    option.textContent = district.Quan_HuyenName;
    districtsSelect.appendChild(option);
  });
}

function populateWards() {
  const districtId = document.getElementById('districts').value;
  const wards = JSON.parse(localStorage.getItem('Phuong_Xa')) || [];
  const wardsSelect = document.getElementById('wards');

  if (!districtId) {
    wardsSelect.innerHTML = '<option value="">Chọn Phường / Xã</option>';
    return;
  }

  const filteredWards = wards.filter(ward => ward.Quan_HuyenID === districtId);

  wardsSelect.innerHTML = '<option value="">Chọn Phường / Xã</option>';
  filteredWards.forEach(ward => {
    const option = document.createElement('option');
    option.value = ward.PhuongID;
    option.textContent = ward.PhuongName;
    wardsSelect.appendChild(option);
  });
}

window.onload = function () {
  populateProvinces();
  const user = JSON.parse(localStorage.getItem('userLogin'));
  if (user) {
    displayUserInfo(user);
  }
};

const searchBar = document.querySelector('#searchh');
const searchDropdown = document.querySelector('#search-results');

searchBar.addEventListener('click', function (event) {
  searchDropdown.classList.toggle('show');
  event.stopPropagation();
});

document.addEventListener('click', function (event) {
  if (!searchBar.contains(event.target) && !searchDropdown.contains(event.target)) {
    searchDropdown.classList.remove('show');
  }
});