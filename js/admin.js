// ========================================
// VY FOOD ADMIN.JS (KẾT HỢP ADMIN 1 VÀ ADMIN 2)
// Quản lý navigation động (Admin 2) và logic quản lý (Admin 1)
// ========================================

console.log('🚀 Admin.js đã được load');

/* ======== KHỐI 1: HÀM KHỞI TẠO VÀ CHUNG (Admin 1) ======== */

// KHỞI TẠO ADMIN MẶC ĐỊNH
(function initAdminAccount() {
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const hasAdmin = accounts.some(acc => acc.userType === 1);

    if (!hasAdmin) {
        const defaultAdmin = {
            fullname: "Admin Test",
            phone: "0000000000",
            password: "123456",
            userType: 1,
            status: 1,
            join: new Date().toISOString().slice(0, 10)
        };
        accounts.push(defaultAdmin);
        localStorage.setItem("accounts", JSON.stringify(accounts));
        console.log("✅ Tạo tài khoản admin mặc định: 0000000000 / 123456");
    }
})();

function checkLogin() {
    const adminStatus = localStorage.getItem("adminLogin");

    // Nếu đã đăng nhập thì thôi
    if (adminStatus === "true") return true;

    // // ========== GIAO DIỆN LOGIN ==============
    // const overlay = document.createElement("div");
    // overlay.id = "admin-login-overlay";
    // overlay.innerHTML = `
    //     <div id="admin-login-container">
    //         <!-- Cảnh báo ban đầu -->
    //         <div class="login-warning">
    //             <div class="icon">⚙️</div>
    //             <h2>Đây là trang dành cho admin</h2>
    //             <p>Chọn <span>Đăng nhập</span> để tiếp tục</p>
    //             <button id="btn-open-login">Đăng nhập</button>
    //         </div>

    //         <!-- Form đăng nhập -->
    //         <div id="login-modal">
    //             <div class="modal-content">
    //                 <h3>Đăng nhập Admin</h3>
    //                 <input type="text" id="username" placeholder="Tên đăng nhập">
    //                 <input type="email" id="email" placeholder="Email">
    //                 <input type="password" id="password" placeholder="Mật khẩu">
    //                 <div class="actions">
    //                     <button id="btn-submit-login">Đăng nhập</button>
    //                     <button id="btn-cancel-login">Hủy</button>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // `;
    // document.body.appendChild(overlay);

    // DOM elements
    const btnOpenLogin = document.getElementById("btn-open-login");
    const modal = document.getElementById("login-modal");
    const warning = document.querySelector(".login-warning");
    const btnSubmit = document.getElementById("btn-submit-login");
    const btnCancel = document.getElementById("btn-cancel-login");

    // Khi nhấn "Đăng nhập" lần đầu → ẩn cảnh báo, hiện form
    btnOpenLogin.addEventListener("click", () => {
        warning.classList.add("hide");
        modal.classList.add("show");
    });

    // Khi hủy → quay lại màn cảnh báo
    btnCancel.addEventListener("click", () => {
        modal.classList.remove("show");
        warning.classList.remove("hide");
    });

    // Danh sách admin (switch-case)
    btnSubmit.addEventListener("click", () => {
        const user = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const pass = document.getElementById("password").value.trim();

        let isValid = false;

        switch (user) {
            case "TranLeToan":
                if (email === "toantranle3@gmail.com" && pass === "Toan123s") isValid = true;
                break;
            // thêm admin khác nếu cần
        }

        if (isValid) {
            localStorage.setItem("adminLogin", "true");
            alert("Đăng nhập thành công!");
            overlay.remove();
            location.reload();
        } else {
            alert("Sai thông tin đăng nhập!");
        }
    });

    return false;
}


// FORMAT DATE (Admin 1)
function formatDate(date) {
    if (!date) return "";
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return dd + "/" + mm + "/" + yyyy;
}

// LOGOUT (Admin 2 + Admin 1)
function initLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    const oldLogoutBtn = document.getElementById("logout-acc");

    const handleLogout = (e) => {
        e.preventDefault();
        if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.removeItem("currentuser");
            window.location.href = "index.html";
        }
    };

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    if (oldLogoutBtn) {
        oldLogoutBtn.addEventListener('click', handleLogout);
    }
}

// Hàm mở modal (Định nghĩa global vì modal nằm ngoài các section)
window.openCreateAccount = function () {
    const modal = document.getElementById("account-modal");
    if (!modal) return;
    modal.classList.add("open");
    document.querySelectorAll(".edit-account-e").forEach(item => item.style.display = "none");
    document.querySelectorAll(".add-account-e").forEach(item => item.style.display = "block");
    signUpFormReset();
}

// Hàm đóng modal
window.closeModal = function (modalId = "account-modal") {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('open');
    }
}

/* ======== KHỐI 2: QUẢN LÝ NAVIGATION (Admin 2) ======== */

function initAdminNavigation() {
    const navItems = document.querySelectorAll(".sidebar .nav-item");

    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            const page = item.getAttribute("data-content");
            loadPageContent(page);
            document
                .querySelector(".sidebar .nav-item.active")
                ?.classList.remove("active");
            item.classList.add("active");
        });
    });
}


function loadPageContent(pageName, container) {
    const header = container.querySelector('.header h1') || container.querySelector('.page-title');
    const content = container.querySelector('.content');

    if (!header || !content) {
        console.error('Lỗi: Không tìm thấy header hoặc content container trong main-content.');
        return;
    }

    console.log('📄 Đang load trang:', pageName);

    // Đảm bảo tiêu đề được cập nhật
    header.textContent = getPageTitle(pageName);

    switch (pageName) {
        case 'tongquan':
            loadTongQuanPage(content);
            break;
        case 'sanpham':
            loadSanPhamPage(content);
            break;
        case 'khachhang':
            loadKhachHangPage(content);
            break;
        case 'donhang':
            loadDonHangPage(content);
            break;
        case 'nhaphang':
            loadNhapHangPage(content);
            break;
        case 'thongke':
            loadThongKePage(content);
            break;
        default:
            loadTongQuanPage(content);
    }
}

function getPageTitle(pageName) {
    const titles = {
        'tongquan': 'Trang tổng quan',
        'sanpham': 'Quản lý sản phẩm',
        'khachhang': 'Quản lý khách hàng',
        'donhang': 'Quản lý đơn hàng',
        'nhaphang': 'Quản lý nhập hàng',
        'thongke': 'Thống kê doanh thu'
    };
    return titles[pageName] || 'Admin Panel';
}

/* ======== KHỐI 3: LOGIC QUẢN LÝ KHÁCH HÀNG (Admin 1) ======== */

let indexFlag;

function signUpFormReset() {
    document.getElementById('fullname').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('password').value = "";
    document.querySelector('.form-message-name').innerHTML = '';
    document.querySelector('.form-message-phone').innerHTML = '';
    document.querySelector('.form-message-password').innerHTML = '';
    const userStatus = document.getElementById("user-status");
    if (userStatus) userStatus.checked = true;
}

function showUserArr(arr) {
    let accountHtml = '';
    let tbody = document.getElementById('show-user');
    if (!tbody) return;

    if (arr.length == 0) {
        accountHtml = `<tr><td colspan="6" style="text-align: center; padding: 20px;">Không có dữ liệu</td></tr>`;
    } else {
        arr.forEach((account, index) => {
            let tinhtrang = account.status == 1 ? `<span style="color: green;">Hoạt động</span>` : `<span style="color: red;">Bị khóa</span>`;
            accountHtml += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${account.fullname}</td>
                    <td>${account.phone}</td>
                    <td>${formatDate(account.join)}</td>
                    <td>${tinhtrang}</td>
                    <td class="control control-table">
                        <button class="btn-edit" onclick="editAccount('${account.phone}')"><i class="fa-light fa-pen-to-square"></i></button>
                        <button class="btn-delete" onclick="deleteAcount('${account.phone}')"><i class="fa-regular fa-trash"></i></button>
                    </td>
                </tr>`;
        });
    }
    tbody.innerHTML = accountHtml;
}

window.showUser = function () {
    const tinhTrangSelect = document.getElementById("tinh-trang-user");
    const searchInput = document.getElementById("form-search-user");
    const timeStartInput = document.getElementById("time-start-user");
    const timeEndInput = document.getElementById("time-end-user");
    if (!tinhTrangSelect || !searchInput || !timeStartInput || !timeEndInput) return;

    let tinhTrang = parseInt(tinhTrangSelect.value);
    let ct = searchInput.value;
    let timeStart = timeStartInput.value;
    let timeEnd = timeEndInput.value;

    if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
        alert("Lựa chọn thời gian sai !");
        return;
    }

    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")).filter(item => item.userType == 0) : [];
    let result = tinhTrang == 2 ? accounts : accounts.filter(item => item.status == tinhTrang);

    result = ct == "" ? result : result.filter((item) => {
        return (item.fullname.toLowerCase().includes(ct.toLowerCase()) || item.phone.toString().toLowerCase().includes(ct.toLowerCase()));
    });

    if (timeStart != "" && timeEnd == "") {
        result = result.filter((item) => new Date(item.join) >= new Date(timeStart).setHours(0, 0, 0));
    } else if (timeStart == "" && timeEnd != "") {
        result = result.filter((item) => new Date(item.join) <= new Date(timeEnd).setHours(23, 59, 59));
    } else if (timeStart != "" && timeEnd != "") {
        result = result.filter((item) => (new Date(item.join) >= new Date(timeStart).setHours(0, 0, 0) && new Date(item.join) <= new Date(timeEnd).setHours(23, 59, 59)));
    }
    showUserArr(result);
}

window.cancelSearchUser = function () {
    const tinhTrangSelect = document.getElementById("tinh-trang-user");
    const searchInput = document.getElementById("form-search-user");
    const timeStartInput = document.getElementById("time-start-user");
    const timeEndInput = document.getElementById("time-end-user");
    if (tinhTrangSelect) tinhTrangSelect.value = 2;
    if (searchInput) searchInput.value = "";
    if (timeStartInput) timeStartInput.value = "";
    if (timeEndInput) timeEndInput.value = "";
    showUser();
}

window.deleteAcount = function (phone) {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let index = accounts.findIndex(item => item.phone == phone);

    if (index === -1) {
        alert("Lỗi: Không tìm thấy tài khoản để xóa!");
        return;
    }

    if (confirm("Bạn có chắc muốn xóa tài khoản " + accounts[index].fullname + "?")) {
        accounts.splice(index, 1);
        localStorage.setItem("accounts", JSON.stringify(accounts));
        showUser();
    }
}

window.editAccount = function (phone) {
    const modal = document.getElementById("account-modal");
    if (!modal) return;
    modal.classList.add("open");
    document.querySelectorAll(".add-account-e").forEach(item => item.style.display = "none");
    document.querySelectorAll(".edit-account-e").forEach(item => item.style.display = "block");
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    let index = accounts.findIndex(item => item.phone == phone);
    indexFlag = index;
    document.getElementById("fullname").value = accounts[index].fullname;
    document.getElementById("phone").value = accounts[index].phone;
    document.getElementById("password").value = accounts[index].password;
    document.getElementById("user-status").checked = accounts[index].status == 1;
}

function updateAccountHandler(e) {
    e.preventDefault();
    const accounts = JSON.parse(localStorage.getItem("accounts"));
    const fullname = document.getElementById("fullname").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    if (fullname == "" || phone == "" || password == "") {
        alert('Vui lòng nhập đầy đủ thông tin !');
    } else {
        accounts[indexFlag].fullname = fullname;
        accounts[indexFlag].phone = phone;
        accounts[indexFlag].password = password;
        accounts[indexFlag].status = document.getElementById("user-status").checked ? 1 : 0;
        localStorage.setItem("accounts", JSON.stringify(accounts));
        alert('Thay đổi thông tin thành công !');
        document.getElementById("account-modal").classList.remove("open");
        signUpFormReset();
        showUser();
    }
}

function addAccountHandler(e) {
    e.preventDefault();
    const fullNameUser = document.getElementById('fullname').value.trim();
    const phoneUser = document.getElementById('phone').value.trim();
    const passwordUser = document.getElementById('password').value.trim();
    const accounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : [];

    let isValid = true;

    if (fullNameUser.length < 3 || phoneUser.length != 10 || isNaN(phoneUser) || passwordUser.length < 6) {
        alert("Vui lòng nhập thông tin hợp lệ (tên > 3, SĐT=10 số, MK > 6)");
        isValid = false;
    } else {
        const isExist = accounts.some(account => account.phone == phoneUser);
        if (isExist) {
            alert('Số điện thoại này đã tồn tại !');
            isValid = false;
        }
    }

    if (isValid) {
        const user = {
            fullname: fullNameUser,
            phone: phoneUser,
            password: passwordUser,
            address: '',
            email: '',
            status: 1,
            join: new Date().toISOString().slice(0, 10),
            cart: [],
            userType: 0
        }

        accounts.push(user);
        localStorage.setItem('accounts', JSON.stringify(accounts));
        alert('Tạo thành công tài khoản !');
        document.getElementById("account-modal").classList.remove("open");
        showUser();
        signUpFormReset();
    }
}

/* ======== KHỐI 4: HÀM LOAD NỘI DUNG TRANG ======== */

function loadTongQuanPage(content) {
    content.innerHTML = `
        <div class="cards">
            <div class="card-single">
                <div class="box">
                    <div class="on-box">
                        <img src="./assets/img/admin/khach_hang.png" alt="" style="width: 200px;">
                        <h3>Khách hàng</h3>
                        <p>Khách hàng là những người yêu thích sự tinh tế và sang trọng trong từng sản phẩm thủy tinh. Chúng tôi luôn hướng đến việc mang đến trải nghiệm mua sắm an toàn, nhanh chóng và đáng tin cậy.</p>
                    </div>
                </div>
            </div>
            <div class="card-single">
                <div class="box">
                    <div class="on-box">
                        <img src="./assets/img/admin/san_pham.png" alt="" style="width: 200px;">
                        <h3>Sản phẩm</h3>
                        <p>Sản phẩm tại chúng tôi bao gồm các loại ly, bình, lọ và vật trang trí bằng thủy tinh cao cấp. Mỗi sản phẩm đều được chọn lọc kỹ lưỡng để đảm bảo độ trong suốt, bền đẹp và mang lại giá trị thẩm mỹ cao.</p>
                    </div>
                </div>
            </div>
            <div class="card-single">
                <div class="box">
                    <div class="on-box">
                        <img src="./assets/img/admin/doanh_thu.png" alt="" style="width: 200px;">
                        <h3>Doanh thu</h3>
                        <p>Doanh thu phản ánh kết quả hoạt động kinh doanh của cửa hàng. Chúng tôi không ngừng nỗ lực cải thiện chất lượng sản phẩm và dịch vụ để mang lại giá trị tốt nhất cho khách hàng và tăng trưởng doanh thu bền vững.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadSanPhamPage(content) {
    content.innerHTML = `
        <p>Danh sách sản phẩm sẽ hiển thị tại đây...</p>
    `;
}

function loadKhachHangPage(content) {
    content.innerHTML = `
        <div class="admin-control">
            <div class="admin-control-left">
                <select name="tinh-trang-user" id="tinh-trang-user" onchange="showUser()">
                    <option value="2">Tất cả</option>
                    <option value="1">Hoạt động</option>
                    <option value="0">Bị khóa</option>
                </select>
            </div>
            <div class="admin-control-center">
                <form action="" class="form-search">
                    <span class="search-btn"><i class="fa-solid fa-magnifying-glass"></i></span>
                    <input id="form-search-user" type="text" class="form-search-input" placeholder="Tìm kiếm khách hàng..." oninput="showUser()">
                </form>
            </div>
            <div class="admin-control-right">
                <form action="" class="fillter-date">
                    <div>
                        <label for="time-start">Từ</label>
                        <input type="date" class="form-control-date" id="time-start-user" onchange="showUser()">
                    </div>
                    <div>
                        <label for="time-end">Đến</label>
                        <input type="date" class="form-control-date" id="time-end-user" onchange="showUser()">
                    </div>
                </form>    
                <button class="btn-reset-order" onclick="cancelSearchUser()"><i class="fa-solid fa-arrow-rotate-right"></i></button>     
                <button id="btn-add-user" class="btn-control-large" onclick="openCreateAccount()"><i class="fa-solid fa-plus"></i> <span>Thêm khách hàng</span></button>          
            </div>
        </div>
        <div class="table">
            <table width="100%">
                <thead>
                    <tr>
                        <td>STT</td>
                        <td>Họ và tên</td>
                        <td>Liên hệ</td>
                        <td>Ngày tham gia</td>
                        <td>Tình trạng</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody id="show-user">
                </tbody>
            </table>
        </div>
    `;

    const updateAccount = document.getElementById("btn-update-account");
    const addAccount = document.getElementById("signup-button");

    if (updateAccount) {
        updateAccount.removeEventListener("click", updateAccountHandler);
        updateAccount.addEventListener("click", updateAccountHandler);
    }
    if (addAccount) {
        addAccount.removeEventListener("click", addAccountHandler);
        addAccount.addEventListener("click", addAccountHandler);
    }

    setTimeout(showUser, 10);
}

function loadDonHangPage(content) {
    content.innerHTML = `
        <p>Danh sách đơn hàng sẽ hiển thị tại đây...</p>
    `;
}

function loadNhapHangPage(content) {
    // Load toàn bộ module nhập hàng từ wrapper
    content.innerHTML = `
        <div id="nhaphang-module-wrapper">
            <div class="top-bar">
                <h2>Nhập hàng</h2>
                <button class="back-btn" onclick="backToAdminMenu()">🔄 Quay lại Menu chính</button>
            </div>

            <div class="nhaphang-main">
                <div class="left-panel">
                    <h3 id="current-mode-title">Khu hiển thị</h3>
                    <div id="display-area">
                        <div class="empty-state">
                            Chọn chức năng ở khung bên phải để bắt đầu.
                        </div>
                    </div>
                </div>

                <div class="right-panel">
                    <h3 style="color: #b8734e; margin-bottom: 10px;">Chọn loại chức năng</h3>
                    <button class="function-btn btn-phieu" onclick="showPhieuNhap()">Phiếu nhập hàng</button>
                    <button class="function-btn btn-chitiet" onclick="showChiTietPhieu()">Chi tiết phiếu nhập</button>
                    <button class="function-btn btn-loinhuan" onclick="showLoiNhuan()">
                        Lợi nhuận & Giá bán
                    </button>
                </div>
            </div>
        </div>
    `;

    // Khởi tạo logic Nhập Hàng sau khi DOM đã sẵn sàng
    setTimeout(() => {
        if (typeof backToMenu === 'function') {
            backToMenu();
            console.log('✅ Chức năng Nhập Hàng đã được khởi tạo.');
        } else {
            console.error('❌ Lỗi: Không tìm thấy backToMenu() từ NhapHang.js');
        }

        // Khởi tạo listener cho file input
        initializeFileInputListener();
    }, 100);
}

// Hàm back về menu chính của Admin (thay thế cho backToMenu trong context admin)
window.backToAdminMenu = function () {
    if (typeof backToMenu === 'function') {
        backToMenu();
    }
}

// Hàm khởi tạo listener cho input file (tránh lỗi khi NhapHang.js chưa load)
function initializeFileInputListener() {
    const fileInput = document.getElementById('ct-url-anh');
    const fileNameDisplay = document.getElementById('file-name-ct');

    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function () {
            if (this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
            } else {
                fileNameDisplay.textContent = 'Chưa có tệp nào được chọn';
            }
        });
        console.log('✅ File input listener đã được khởi tạo');
    }
}

function loadThongKePage(content) {
    content.innerHTML = `
        <p>Chức năng thống kê đang được phát triển...</p>
    `;
}

/* ======== KHỐI 5: KHỞI CHẠY CHÍNH ======== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 ========== KHỞI TẠO ADMIN PANEL KẾT HỢP ==========');

    if (!checkLogin()) {
        console.log('⛔ Truy cập bị từ chối.');
        return;
    }

    initAdminNavigation();
    console.log('✅ Navigation đã được khởi tạo');

    initLogout();
    console.log('✅ Logout đã được khởi tạo');

    console.log('✅ ========== ADMIN PANEL SẴN SÀNG ==========');
});

// ===================== ADMIN LOGIN =====================
const btnLogin = document.getElementById('btn-login');
const overlay = document.getElementById('overlay');
const warningPage = document.getElementById('warning-page');
const cancelBtn = document.getElementById('cancel');
const submitBtn = document.getElementById('login-submit');

// Khi nhấn nút đăng nhập
btnLogin.addEventListener('click', () => {
    warningPage.style.display = 'none';
    overlay.classList.remove('hidden');
});

// Khi nhấn Hủy
cancelBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    warningPage.style.display = 'block';
});

// Khi xác nhận đăng nhập
submitBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    let isValid = false;

    switch (username) {
        case "TranLeToan":
            if (email === "toantranle3@gmail.com" && password === "Toan123s") {
                isValid = true;
            }
            break;
        // sau này có thể thêm case khác cho admin khác
        default:
            isValid = false;
    }

    if (isValid) {
        localStorage.setItem("adminLogin", JSON.stringify({
            username: username,
            email: email,
            status: true
        }));

        alert("Đăng nhập thành công!");
        document.querySelector('.wrapper-login').style.display = 'none'; // ẩn login wrapper
    } else {
        alert("Sai thông tin đăng nhập!");
    }
});
