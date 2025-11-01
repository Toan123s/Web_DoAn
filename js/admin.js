/* ======== KHỐI 1: HÀM KHỞI TẠO VÀ CHUNG ======== */

// KHỞI TẠO ADMIN MẶC ĐỊNH
(function initAdminAccount() {
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    // Kiểm tra xem đã có admin chưa
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
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));

    if (!currentUser || currentUser.userType === 0) {
        document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center; font-family: Arial, sans-serif;">
                <img src="https://png.pngtree.com/png-clipart/20230217/original/pngtree-stop-and-reject-sign-concept-png-image_8958043.png" alt="Access Denied" style="max-width: 300px;">
                <h1 style="color: red; font-size: 24px;">Truy cập bị từ chối</h1>
                <p>Bạn không có quyền truy cập vào trang này.</p>
                <button id="go-home" style="padding: 10px 20px; margin-top: 15px; cursor: pointer; border: none; background-color: #007BFF; color: white; border-radius: 5px;">Quay về trang chủ</button>
            </div>
        `;
        document.getElementById("go-home").addEventListener("click", () => {
            window.location.href = "index.html";
        });
        return false;
    }

    const nameAcc = document.getElementById("name-acc");
    if (nameAcc) {
        nameAcc.innerHTML = currentUser.fullname;
    }
}

// Xử lý chuyển tab
function setupTabs() {
    const sidebars = document.querySelectorAll(".sidebar-list-item.tab-content");
    const sections = document.querySelectorAll(".section");

    for (let i = 0; i < sidebars.length; i++) {
        sidebars[i].onclick = function () {
            document.querySelector(".sidebar-list-item.active").classList.remove("active");
            document.querySelector(".section.active").classList.remove("active");

            this.classList.add("active");
            sections[i + 1].classList.add("active");
        };
    }

    const dashboardTab = document.querySelector(".sidebar-list-item:not(.tab-content):not(.user-logout)");
    if (dashboardTab) {
        dashboardTab.onclick = function() {
            document.querySelector(".sidebar-list-item.active").classList.remove("active");
            document.querySelector(".section.active").classList.remove("active");
            this.classList.add("active");
            sections[0].classList.add("active");
        }
    }
}

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

/* ======== KHỐI 2: QUẢN LÝ KHÁCH HÀNG ======== */

let addAccount = document.getElementById('signup-button');
let updateAccount = document.getElementById("btn-update-account");

document.querySelector(".modal.signup .modal-close").addEventListener("click", () => {
    document.querySelector(".modal.signup").classList.remove("open");
    signUpFormReset();
});

function openCreateAccount() {
    document.querySelector(".signup").classList.add("open");
    document.querySelectorAll(".edit-account-e").forEach(item => {
        item.style.display = "none"
    });
    document.querySelectorAll(".add-account-e").forEach(item => {
        item.style.display = "block"
    });
}

function signUpFormReset() {
    document.getElementById('fullname').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('password').value = "";
    document.querySelector('.form-message-name').innerHTML = '';
    document.querySelector('.form-message-phone').innerHTML = '';
    document.querySelector('.form-message-password').innerHTML = '';
}

function showUserArr(arr) {
    let accountHtml = '';
    let tbody = document.getElementById('show-user');
    if (!tbody) return;

    if(arr.length == 0) {
        accountHtml = `<td colspan="6" style="text-align: center;">Không có dữ liệu</td>`;
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
                        <button class="btn-edit" id="edit-account" onclick="editAccount('${account.phone}')"><i class="fa-light fa-pen-to-square"></i></button>
                        <button class="btn-delete" id="delete-account" onclick="deleteAcount('${account.phone}')"><i class="fa-regular fa-trash"></i></button>
                    </td>
                </tr>`;
        });
    }
    tbody.innerHTML = accountHtml;
}

function showUser() {
    const tinhTrangSelect = document.getElementById("tinh-trang-user");
    if (!tinhTrangSelect) return;

    let tinhTrang = parseInt(tinhTrangSelect.value);
    let ct = document.getElementById("form-search-user").value;
    let timeStart = document.getElementById("time-start-user").value;
    let timeEnd = document.getElementById("time-end-user").value;

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

function cancelSearchUser() {
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")).filter(item => item.userType == 0) : [];
    showUserArr(accounts);
    document.getElementById("tinh-trang-user").value = 2;
    document.getElementById("form-search-user").value = "";
    document.getElementById("time-start-user").value = "";
    document.getElementById("time-end-user").value = "";
}

function deleteAcount(phone) {
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

let indexFlag;
function editAccount(phone) {
    document.querySelector(".signup").classList.add("open");
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

updateAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    let fullname = document.getElementById("fullname").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;

    if(fullname == "" || phone == "" || password == "") {
        alert('Vui lòng nhập đầy đủ thông tin !');
    } else {
        accounts[indexFlag].fullname = fullname;
        accounts[indexFlag].phone = phone;
        accounts[indexFlag].password = password;
        accounts[indexFlag].status = document.getElementById("user-status").checked ? 1 : 0;
        localStorage.setItem("accounts", JSON.stringify(accounts));
        alert('Thay đổi thông tin thành công !');
        document.querySelector(".signup").classList.remove("open");
        signUpFormReset();
        showUser();
    }
});

addAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let fullNameUser = document.getElementById('fullname').value.trim();
    let phoneUser = document.getElementById('phone').value.trim();
    let passwordUser = document.getElementById('password').value.trim();

    let fullNameIP = document.getElementById('fullname');
    let formMessageName = document.querySelector('.form-message-name');
    let formMessagePhone = document.querySelector('.form-message-phone');
    let formMessagePassword = document.querySelector('.form-message-password');
    let isValid = true;

    formMessageName.innerHTML = '';
    formMessagePhone.innerHTML = '';
    formMessagePassword.innerHTML = '';

    if (fullNameUser.length == 0) {
        formMessageName.innerHTML = 'Vui lòng nhập họ và tên';
        fullNameIP.focus();
        isValid = false;
    } else if (fullNameUser.length < 3) {
        formMessageName.innerHTML = 'Họ và tên phải lớn hơn 3 kí tự';
        isValid = false;
    }

    if (phoneUser.length == 0) {
        formMessagePhone.innerHTML = 'Vui lòng nhập vào số điện thoại';
        isValid = false;
    } else if (phoneUser.length != 10 || isNaN(phoneUser)) {
        formMessagePhone.innerHTML = 'Số điện thoại phải là 10 số';
        isValid = false;
    }

    if (passwordUser.length == 0) {
        formMessagePassword.innerHTML = 'Vui lòng nhập mật khẩu';
        isValid = false;
    } else if (passwordUser.length < 6) {
        formMessagePassword.innerHTML = 'Mật khẩu phải lớn hơn 6 kí tự';
        isValid = false;
    }

    if (isValid) {
        let user = {
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

        let accounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : [];
        let checkloop = accounts.some(account => account.phone == user.phone);
        if (!checkloop) {
            accounts.push(user);
            localStorage.setItem('accounts', JSON.stringify(accounts));
            alert('Tạo thành công tài khoản !');
            document.querySelector(".signup").classList.remove("open");
            showUser();
            signUpFormReset();
        } else {
            alert('Số điện thoại này đã tồn tại !');
        }
    }
});

// Đăng xuất
document.getElementById("logout-acc").addEventListener('click', (e) => {
    e.preventDefault();
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.removeItem("currentuser");
        window.location.href = "index.html";
    }
});

/* ======== KHỐI 3: KHỞI CHẠY CHÍNH ======== */

window.addEventListener('load', () => {
    checkLogin();
    setupTabs();
    showUser();

    const resetButton = document.querySelector(".btn-reset-order");
    if (resetButton) {
        resetButton.addEventListener("click", cancelSearchUser);
    }
});
