// ======== CHUYỂN MỤC SIDEBAR ========
const sidebarItems = document.querySelectorAll('.sidebar-list-item');
const sections = document.querySelectorAll('.section');

sidebarItems.forEach((item, index) => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        sidebarItems.forEach(i => i.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        this.classList.add('active');
        sections[index].classList.add('active');
    });
});

window.addEventListener('DOMContentLoaded', () => {
    sections.forEach((s, i) => s.classList.toggle('active', i === 0));
        cancelSearchUser();
});

// ======== BIẾN DỮ LIỆU KHÁCH HÀNG ========
let users = [];
// Format Date
function formatDate(date) {
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return dd + "/" + mm + "/" + yyyy;
}
// ======== HIỂN THỊ DANH SÁCH KHÁCH HÀNG ========
const showUser = () => {
    const tbody = document.getElementById("show-user");
    const statusFilter = document.getElementById("tinh-trang-user").value;
    const searchInput = document.getElementById("form-search-user").value.toLowerCase();
    const startDate = document.getElementById("time-start-user").value;
    const endDate = document.getElementById("time-end-user").value;

    tbody.innerHTML = "";

    const filteredUsers = users.filter(user => {
        if (statusFilter != 2 && user.status != statusFilter) return false;
        if (!user.fullname.toLowerCase().includes(searchInput) && !user.phone.includes(searchInput)) return false;
        if (startDate && user.date < startDate) return false;
        if (endDate && user.date > endDate) return false;
        return true;
    });

    filteredUsers.forEach((user, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.fullname}</td>
            <td>${user.phone}</td>
            <td>${formatDate(user.date)}</td>
            <td>${user.status ? "Hoạt động" : "Bị khóa"}</td>
            <td>
                <button onclick="editUser(${user.id})" class="btn-edit"><i class="fa-regular fa-pen-to-square"></i></button>
                <button onclick="deleteUser(${user.id})" class="btn-delete"><i class="fa-regular fa-trash-can"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

// ======== RESET TÌM KIẾM ========
const cancelSearchUser = () => {
    document.getElementById("tinh-trang-user").value = 2;
    document.getElementById("form-search-user").value = "";
    document.getElementById("time-start-user").value = "";
    document.getElementById("time-end-user").value = "";
    showUser();
};
document.querySelector(".btn-reset-order").addEventListener("click", cancelSearchUser);

// ======== POPUP THÊM & CHỈNH SỬA ========
const modal = document.querySelector(".modal.signup");
const form = document.querySelector(".signup-form");

// Mở popup thêm khách hàng
const openCreateAccount = () => {
    modal.classList.add("open");
    form.reset();

    document.querySelectorAll(".add-account-e").forEach(e => e.style.display = "block");
    document.querySelectorAll(".edit-account-e").forEach(e => e.style.display = "none");
};

// Đóng popup
const closeModal = () => {
    modal.classList.remove("open");
    form.reset();
};
document.querySelector(".modal-close").addEventListener("click", closeModal);

// ======== THÊM KHÁCH HÀNG ========
document.getElementById("signup-button").addEventListener("click", (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!fullname || !phone || !password) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    const newUser = {
        id: Date.now(),
        fullname,
        phone,
        date: new Date().toISOString().slice(0, 10),
        status: 1
    };

    users.push(newUser);
    showUser();
    closeModal();
});

// ======== CHỈNH SỬA KHÁCH HÀNG ========
let editUserId = null;

const editUser = (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    editUserId = id;
    modal.classList.add("open");

    document.querySelectorAll(".add-account-e").forEach(e => e.style.display = "none");
    document.querySelectorAll(".edit-account-e").forEach(e => e.style.display = "block");

    document.getElementById("fullname").value = user.fullname;
    document.getElementById("phone").value = user.phone;
    document.getElementById("password").value = "";
    document.getElementById("user-status").checked = !!user.status;
};

document.getElementById("btn-update-account").addEventListener("click", (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const status = document.getElementById("user-status").checked ? 1 : 0;

    if (!fullname || !phone) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    const user = users.find(u => u.id === editUserId);
    if (user) {
        user.fullname = fullname;
        user.phone = phone;
        user.status = status;
        showUser();
        closeModal();
    }
});

// ======== XÓA KHÁCH HÀNG ========
const deleteUser = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
        users = users.filter(u => u.id !== id);
        showUser();
    }
};

// ======== KHỞI TẠO BAN ĐẦU ========
showUser();


