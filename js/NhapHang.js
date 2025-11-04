// --- CẤU TRÚC DỮ LIỆU & LOCAL STORAGE ---
let phieuNhapList = JSON.parse(localStorage.getItem('phieuNhapList')) || [];
let chiTietPhieuList = JSON.parse(localStorage.getItem('chiTietPhieuList')) || [];
let productPrices = JSON.parse(localStorage.getItem('productPrices')) || {}; 

// Hàm lưu dữ liệu vào LocalStorage
function saveData() {
    localStorage.setItem('phieuNhapList', JSON.stringify(phieuNhapList));
    localStorage.setItem('chiTietPhieuList', JSON.stringify(chiTietPhieuList));
    localStorage.setItem('productPrices', JSON.stringify(productPrices));
}

// --- HÀM CHUNG: ĐÓNG/MỞ MODAL VÀ CHUYỂN KHU VỰC HIỂN THỊ ---

function backToMenu() {
    // Reset khu vực hiển thị về trạng thái ban đầu
    const displayArea = document.getElementById('display-area');
    if (displayArea) {
        displayArea.innerHTML = `<div class="empty-state">Chọn chức năng ở khung bên phải để bắt đầu.</div>`;
    }
    
    const title = document.getElementById('current-mode-title');
    if (title) title.textContent = 'Khu hiển thị';
    
    // Loại bỏ trạng thái active của các nút chức năng
    document.querySelectorAll('.function-btn').forEach(btn => btn.classList.remove('active'));
    
    // Xóa từ khóa tìm kiếm đã lưu
    localStorage.removeItem('currentPhieuSearchKeyword');
    localStorage.removeItem('currentChiTietSearchKeyword');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        if (modalId === 'modal-price-edit') {
            modal.remove();
        }
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// --- HÀM TÍNH TOÁN VÀ TIỆN ÍCH ---

function updatePhieuNhapTotal(maPhieu) {
    const phieuIndex = phieuNhapList.findIndex(p => p.maPhieu === maPhieu);
    if (phieuIndex === -1) return;

    const total = chiTietPhieuList
        .filter(ct => ct.maPhieuNhap === maPhieu)
        .reduce((sum, ct) => sum + (Number(ct.soLuong) * Number(ct.donGia)), 0); 

    phieuNhapList[phieuIndex].tongTien = total;
}

function generateUniqueCode(prefix) {
    let list;
    if (prefix === 'PN') {
        list = phieuNhapList;
    } else if (prefix === 'CT') {
        list = chiTietPhieuList;
    } else {
        return prefix + Date.now();
    }
    
    let maxNum = 0;
    list.forEach(item => {
        const code = prefix === 'PN' ? item.maPhieu : item.maChiTiet;
        const numPart = parseInt(code.replace(prefix, ''));
        if (!isNaN(numPart) && numPart > maxNum) {
            maxNum = numPart;
        }
    });
    
    const newNum = maxNum + 1;
    return prefix + newNum.toString().padStart(3, '0');
}


// =========================================================
//                   1. CHỨC NĂNG PHIẾU NHẬP HÀNG (PN)
// =========================================================
function renderPhieuNhapTable(dataToDisplay) {
    let tableHTML = `<div id="phieunhap-table-container">`;

    if (dataToDisplay.length === 0) {
        // ... (phần empty state)
    } else {
        tableHTML += `
            <table class="data-table">
                <thead>
                    <tr style="background-color: #A9D0F5; color: #154360;">
                        <th style="text-align: left;">Mã Phiếu</th>
                        <th style="text-align: left;">Nhà Cung Cấp</th>
                        <th style="text-align: center;">Ngày Nhập</th> <th style="text-align: right;">Tổng Tiền</th>
                        <th style="text-align: center;">Thao Tác</th> 
                    </tr>
                </thead>
                <tbody id="phieunhap-table-body">
        `;

        dataToDisplay.forEach(pn => {
            const ngayNhapFormatted = pn.ngayNhap || 'N/A';

            tableHTML += `
                <tr id="phieunhap-${pn.maPhieu}">
                    <td style="color: #1E88E5; font-weight: 600;">${pn.maPhieu}</td>
                    <td>${pn.nhaCungCap}</td>
                    <td style="text-align: center;">${ngayNhapFormatted}</td> <td style="text-align: right; font-weight: bold; color: #27AE60;">${Number(pn.tongTien).toLocaleString('vi-VN')} ₫</td>
                    <td style="text-align: center;"> <button class="action-btn edit-btn" style="background-color: #FFC107; color: #333; padding: 6px 10px; border-radius: 4px; border: none; cursor: pointer;" onclick="openEditPhieuNhapModal('${pn.maPhieu}')">Sửa</button>
                        <button class="action-btn delete-btn" style="background-color: #F44336; color: white; padding: 6px 10px; border-radius: 4px; border: none; cursor: pointer; margin-left: 5px;" onclick="deletePhieuNhap('${pn.maPhieu}')">Xóa</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;
    }
    tableHTML += `</div>`;
    return tableHTML;
}

/**
 * Hàm hiển thị toàn bộ màn hình Phiếu Nhập
 * Chỉ tạo thanh điều khiển (controls-bar) nếu chưa tồn tại
 */
function showPhieuNhap(data) {
    const dataToDisplay = data || phieuNhapList;
    const displayArea = document.getElementById('display-area');
    if (!displayArea) return; 

    // Kiểm tra xem đã vẽ thanh điều khiển (controls-bar) chưa
    const isInitialRender = !document.getElementById('phieu-search-input');
    
    if (isInitialRender || data === undefined) {
        const titleElement = document.getElementById('current-mode-title');
        if (titleElement) titleElement.textContent = '📝 Quản Lý Phiếu Nhập Hàng';
        
        document.querySelectorAll('.function-btn').forEach(btn => btn.classList.remove('active'));
        const btnPhieu = document.querySelector('.function-btn.btn-phieu');
        if (btnPhieu) btnPhieu.classList.add('active');

        // Lấy từ khóa đã lưu để điền vào ô input (lần đầu tiên)
        const currentKeyword = localStorage.getItem('currentPhieuSearchKeyword') || '';
        
        let contentHTML = `
            <div class="data-management-panel" style="max-width: 1100px; margin: 20px auto; padding: 0;">
                <h3 class="panel-title" style="text-align: center; color: #333;">DANH SÁCH PHIẾU NHẬP</h3>
                
                <div class="controls-bar"> 
                    <div style="display: flex; gap: 10px; height: 100%;">
                        <button class="action-btn add-btn" style="background-color: #4CAF50; color: white;" onclick="openAddPhieuModal()">➕ Thêm Phiếu</button>
                        <button class="action-btn show-all-btn" style="background-color: #2196F3; color: white;" onclick="showPhieuNhap()">📋 Hiển thị tất cả</button>
                    </div>
                    
                    <div style="display: flex; height: 100%;"> 
                        <input type="text" id="phieu-search-input" placeholder="Tìm Mã/NCC..." oninput="searchPhieuNhap()" value="${currentKeyword}" class="search-input-fix"> 
                        <button class="action-btn search-btn search-button-fix" onclick="searchPhieuNhap()">🔍 Tìm</button>
                    </div>
                </div>
                <div id="table-display-container"></div> 
            </div>
        `;
        displayArea.innerHTML = contentHTML;
    }
    
    // CHỈ CẬP NHẬT PHẦN BẢNG DỮ LIỆU
    const tableContainer = document.getElementById('table-display-container');
    if (tableContainer) {
        tableContainer.innerHTML = renderPhieuNhapTable(dataToDisplay);
    }
    
    const searchInput = document.getElementById('phieu-search-input');
    
    if (data === undefined) {
        // Chế độ hiển thị tất cả: Xóa từ khóa đã lưu
        localStorage.removeItem('currentPhieuSearchKeyword');
        if(searchInput) searchInput.value = '';
    } else if (searchInput) {
        // Chế độ hiển thị kết quả lọc: Giữ focus để gõ tiếp
        searchInput.focus();
    }
}

function searchPhieuNhap() {
    const searchInput = document.getElementById('phieu-search-input');
    if (!searchInput) return;
    const keyword = searchInput.value.toLowerCase().trim();
    
    // LƯU từ khóa ngay lập tức
    localStorage.setItem('currentPhieuSearchKeyword', searchInput.value);

    if (keyword === '') {
        localStorage.removeItem('currentPhieuSearchKeyword');
        return showPhieuNhap(); 
    }

    const filteredList = phieuNhapList.filter(phieu => 
        (phieu.maPhieu && phieu.maPhieu.toLowerCase().includes(keyword)) || 
        (phieu.nhaCungCap && phieu.nhaCungCap.toLowerCase().includes(keyword))
    );
    // GỌI HÀM VỚI DANH SÁCH ĐÃ LỌC (chỉ cập nhật bảng)
    showPhieuNhap(filteredList);
}

function openAddPhieuModal() {
    const title = document.getElementById('modal-phieu-title');
    if (title) title.textContent = '➕ Thêm Phiếu Nhập';

    const form = document.getElementById('form-phieu');
    if (form) form.onsubmit = handleAddPhieu;

    const maPhieuInput = document.getElementById('ma-phieu');
    if (maPhieuInput) {
        maPhieuInput.value = generateUniqueCode('PN');
        maPhieuInput.disabled = false;
    }

    const tongTienInput = document.getElementById('tong-tien');
    if (tongTienInput) tongTienInput.value = '0';

    const ngayNhapInput = document.getElementById('ngay-nhap');
    if (ngayNhapInput) ngayNhapInput.valueAsDate = new Date(); 

    openModal('modal-phieu');
}

function handleAddPhieu(e) {
    e.preventDefault();
    const maPhieu = document.getElementById('ma-phieu').value.trim();
    const nhaCungCap = document.getElementById('nha-cung-cap').value.trim();
    const ngayNhap = document.getElementById('ngay-nhap').value;
    const tongTien = 0;

    if (phieuNhapList.some(p => p.maPhieu === maPhieu)) {
        return alert(`Mã phiếu nhập ${maPhieu} đã tồn tại!`);
    }

    const newPhieu = { maPhieu, nhaCungCap, ngayNhap, tongTien };
    phieuNhapList.push(newPhieu);
    saveData();
    closeModal('modal-phieu');
    showPhieuNhap();
    alert('Thêm phiếu nhập thành công!');
}

function openEditPhieuModal(maPhieu) {
    const phieu = phieuNhapList.find(p => p.maPhieu === maPhieu);
    if (!phieu) return alert('Không tìm thấy Phiếu Nhập này.');

    const title = document.getElementById('modal-phieu-title');
    if (title) title.textContent = '✏️ Sửa Phiếu Nhập';

    const form = document.getElementById('form-phieu');
    if (form) form.onsubmit = (e) => handleEditPhieu(e, maPhieu);

    const maPhieuInput = document.getElementById('ma-phieu');
    if (maPhieuInput) {
        maPhieuInput.value = phieu.maPhieu;
        maPhieuInput.disabled = true;
    }
    
    const nhaCungCapInput = document.getElementById('nha-cung-cap');
    if (nhaCungCapInput) nhaCungCapInput.value = phieu.nhaCungCap;
    
    const ngayNhapInput = document.getElementById('ngay-nhap');
    if (ngayNhapInput) ngayNhapInput.value = phieu.ngayNhap;
    
    const tongTienInput = document.getElementById('tong-tien');
    if (tongTienInput) tongTienInput.value = (phieu.tongTien || 0).toLocaleString('vi-VN');
    
    openModal('modal-phieu');
}

function handleEditPhieu(e, maPhieu) {
    e.preventDefault();
    const index = phieuNhapList.findIndex(p => p.maPhieu === maPhieu);
    if (index === -1) return alert('Lỗi: Không tìm thấy phiếu để sửa.');

    const nhaCungCapInput = document.getElementById('nha-cung-cap');
    if (nhaCungCapInput) phieuNhapList[index].nhaCungCap = nhaCungCapInput.value.trim();
    
    const ngayNhapInput = document.getElementById('ngay-nhap');
    if (ngayNhapInput) phieuNhapList[index].ngayNhap = ngayNhapInput.value;
    
    saveData();
    closeModal('modal-phieu');
    showPhieuNhap();
    alert('Sửa phiếu nhập thành công!');
}

function deletePhieuNhap(maPhieu) {
    if (!confirm(`Bạn có chắc chắn muốn xóa Phiếu Nhập hàng có Mã: ${maPhieu} không? Việc này cũng sẽ XÓA TẤT CẢ Chi Tiết Phiếu liên quan!`)) {
        return;
    }

    phieuNhapList = phieuNhapList.filter(p => p.maPhieu !== maPhieu);
    chiTietPhieuList = chiTietPhieuList.filter(ct => ct.maPhieuNhap !== maPhieu);

    saveData();
    showPhieuNhap();
    alert(`Đã xóa Phiếu Nhập ${maPhieu} và tất cả Chi Tiết Phiếu liên quan.`);
}


// =========================================================
//              2. CHỨC NĂNG CHI TIẾT PHIẾU NHẬP HÀNG (CT)
// =========================================================

/**
 * Hàm chỉ render phần bảng Chi Tiết (table)
 * Đảm bảo thanh tìm kiếm không bị reset (mất focus)
 */
function renderChiTietTable(dataToDisplay) {
    let tableHTML = `<div id="chitiet-table-container">`;

    if (dataToDisplay.length === 0) {
        tableHTML += `<div class="empty-state">
                ${chiTietPhieuList.length === 0 ? 'Không có chi tiết phiếu nhập nào.' : 'Không tìm thấy kết quả phù hợp.'}
            </div>`;
    } else {
        tableHTML += `
            <table class="data-table">
                <thead>
                    <tr style="background-color: #F9E79F; color: #D68910;">
                        <th style="text-align: left;">Mã Phiếu Nhập</th>
                        <th style="text-align: left;">Mã Chi Tiết (ID)</th>
                        <th style="text-align: center;">Ảnh</th> <th style="text-align: left;">Mã SP</th>
                        <th style="text-align: left;">Tên SP</th>
                        <th style="text-align: center;">Số Lượng</th> <th style="text-align: right;">Đơn Giá</th>
                        <th style="text-align: right;">Thành Tiền</th>
                        <th style="text-align: center;">Thao Tác</th>
                    </tr>
                </thead>
                <tbody id="chitiet-table-body">
        `;
        dataToDisplay.forEach(ct => {
            const soLuong = Number(ct.soLuong) || 0;
            const donGia = Number(ct.donGia) || 0;
            const thanhTien = soLuong * donGia;
            const urlAnh = ct.urlAnh || ''; 
            
            tableHTML += `
                <tr id="chitiet-${ct.maChiTiet}">
                    <td style="color: #1E88E5; font-weight: 600;">${ct.maPhieuNhap}</td>
                    <td>${ct.maChiTiet}</td>
                    <td class="image-cell" style="text-align: center;"> <img src="${urlAnh}" alt="${ct.tenSP}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;" 
                             onerror="this.onerror=null;this.src='placeholder.jpg';">
                    </td>
                    <td>${ct.maSP}</td>
                    <td>${ct.tenSP}</td>
                    <td style="text-align: center;">${soLuong.toLocaleString('vi-VN')}</td> <td style="text-align: right;">${donGia.toLocaleString('vi-VN')} ₫</td>
                    <td style="text-align: right; font-weight: bold; color: #27AE60;">${thanhTien.toLocaleString('vi-VN')} ₫</td>
                    <td style="text-align: center;">
                        <button class="action-btn edit-btn" style="background-color: #FFC107; color: #333; padding: 6px 10px; border-radius: 4px; border: none; cursor: pointer;" onclick="openEditChiTietModal('${ct.maChiTiet}')">Sửa</button>
                        <button class="action-btn delete-btn" style="background-color: #F44336; color: white; padding: 6px 10px; border-radius: 4px; border: none; cursor: pointer; margin-left: 5px;" onclick="deleteChiTietPhieu('${ct.maChiTiet}')">Xóa</button>
                    </td>
                </tr>
            `;
        });
        tableHTML += `
                </tbody>
            </table>
        `;
    }
    tableHTML += `</div>`; 
    return tableHTML;
}

function showChiTietPhieu(data) {
    const dataToDisplay = data || chiTietPhieuList;
    const displayArea = document.getElementById('display-area');
    if (!displayArea) return; 

    // Kiểm tra xem đã vẽ thanh điều khiển (controls-bar) chưa
    const isInitialRender = !document.getElementById('chitiet-search-input');

    if (isInitialRender || data === undefined) {
        const titleElement = document.getElementById('current-mode-title');
        if (titleElement) titleElement.textContent = '📚 Quản Lý Chi Tiết Phiếu Nhập';
        
        document.querySelectorAll('.function-btn').forEach(btn => btn.classList.remove('active'));
        const btnChiTiet = document.querySelector('.function-btn.btn-chitiet');
        if (btnChiTiet) btnChiTiet.classList.add('active');

        const currentKeyword = localStorage.getItem('currentChiTietSearchKeyword') || '';

        let contentHTML = `
            <div class="data-management-panel" style="max-width: 1100px; margin: 20px auto; padding: 0;">
                <h3 class="panel-title" style="text-align: center; color: #333;">DANH SÁCH CHI TIẾT PHIẾU NHẬP</h3>
                
                <div class="controls-bar">
                    <div style="display: flex; gap: 10px; height: 100%;">
                        <button class="action-btn add-btn" style="background-color: #4CAF50; color: white;" onclick="openAddChiTietModal()">➕ Thêm Chi Tiết</button>
                        <button class="action-btn show-all-btn" style="background-color: #2196F3; color: white;" onclick="showChiTietPhieu()">📋 Hiển thị tất cả</button>
                    </div>
                    
                    <div style="display: flex; height: 100%;">
                        <input type="text" id="chitiet-search-input" placeholder="Tìm Mã CT/Tên SP..." oninput="searchChiTietPhieu()" value="${currentKeyword}" class="search-input-fix">
                        <button class="action-btn search-btn search-button-fix" onclick="searchChiTietPhieu()">🔍 Tìm</button>
                    </div>
                </div>
                <div id="table-display-container-ct"></div> 
            </div>
        `;
        displayArea.innerHTML = contentHTML;
    }

    // CHỈ CẬP NHẬT PHẦN BẢNG DỮ LIỆU
    const tableContainer = document.getElementById('table-display-container-ct');
    if (tableContainer) {
        tableContainer.innerHTML = renderChiTietTable(dataToDisplay);
    }
    
    const searchInput = document.getElementById('chitiet-search-input');
    
    if (data === undefined) {
        // Chế độ hiển thị tất cả: Xóa từ khóa đã lưu
        localStorage.removeItem('currentChiTietSearchKeyword');
        if(searchInput) searchInput.value = '';
    } else if (searchInput) {
        // Chế độ hiển thị kết quả lọc: Giữ focus để gõ tiếp
        searchInput.focus();
    }
}

function searchChiTietPhieu() {
    const searchInput = document.getElementById('chitiet-search-input');
    if (!searchInput) return;
    const keyword = searchInput.value.toLowerCase().trim();
    
    // Lưu từ khóa
    localStorage.setItem('currentChiTietSearchKeyword', searchInput.value);

    if (keyword === '') {
        localStorage.removeItem('currentChiTietSearchKeyword');
        return showChiTietPhieu();
    }

    const filteredList = chiTietPhieuList.filter(ct => 
        (ct.maChiTiet && ct.maChiTiet.toLowerCase().includes(keyword)) || 
        (ct.tenSP && ct.tenSP.toLowerCase().includes(keyword))
    );
    showChiTietPhieu(filteredList);
}

function openAddChiTietModal() {
    const title = document.getElementById('modal-chitiet-title');
    if (title) title.textContent = '➕ Thêm Chi Tiết Phiếu';
    
    const form = document.getElementById('form-chitiet');
    if (form) form.onsubmit = handleAddChiTiet;
    
    const maPhieuInput = document.getElementById('ct-ma-phieu');
    if (maPhieuInput) {
        maPhieuInput.value = ''; 
        maPhieuInput.disabled = false;
    }

    const maSPInput = document.getElementById('ct-ma-sp');
    if (maSPInput) maSPInput.value = '';
    
    const tenSPInput = document.getElementById('ct-ten-sp');
    if (tenSPInput) tenSPInput.value = '';
    
    const soLuongInput = document.getElementById('ct-so-luong');
    if (soLuongInput) soLuongInput.value = '';
    
    const donGiaInput = document.getElementById('ct-don-gia');
    if (donGiaInput) donGiaInput.value = '';

    // ⭐ CẬP NHẬT: Reset trường URL Ảnh
    const urlAnhInput = document.getElementById('ct-url-anh'); 
    if (urlAnhInput) urlAnhInput.value = ''; 
    
    openModal('modal-chitiet');
}

// Hàm chuyển đổi File sang chuỗi Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function handleEditChiTiet(e, maChiTiet, oldMaPhieu) {
    // ⭐ QUAN TRỌNG: Đảm bảo ngăn chặn mặc định (prevent default) chạy ngay lập tức.
    e.preventDefault(); 
    
    const index = chiTietPhieuList.findIndex(ct => ct.maChiTiet === maChiTiet);
    if (index === -1) return alert('Lỗi: Không tìm thấy chi tiết phiếu để sửa.');

    const maSP = document.getElementById('ct-ma-sp').value.trim().toUpperCase();
    const soLuong = Number(document.getElementById('ct-so-luong').value);
    const donGia = Number(document.getElementById('ct-don-gia').value);

// Xử lý tệp ảnh mới
    const fileInput = document.getElementById('ct-url-anh');
    let urlAnh = chiTietPhieuList[index].urlAnh; // Giữ lại ảnh cũ

    if (fileInput.files.length > 0) {
        try {
            // Nếu có tệp mới, thay thế bằng Base64 của tệp mới
            urlAnh = await getBase64(fileInput.files[0]);
        } catch (error) {
            console.error('Lỗi đọc file:', error);
            return alert('Lỗi: Không thể đọc tệp ảnh.');
        }
    }
    // Hết xử lý tệp ảnh

    if (isNaN(soLuong) || isNaN(donGia) || soLuong <= 0 || donGia <= 0) {
        return alert('Lỗi: Số lượng và Đơn giá phải là số dương.');
    }

    chiTietPhieuList[index].maSP = maSP;
    chiTietPhieuList[index].tenSP = document.getElementById('ct-ten-sp').value.trim();
    chiTietPhieuList[index].soLuong = soLuong;
    chiTietPhieuList[index].donGia = donGia;
    chiTietPhieuList[index].urlAnh = urlAnh; // Cập nhật Base64 mới (hoặc giữ nguyên cũ)

    updatePhieuNhapTotal(oldMaPhieu);
    saveData();
    closeModal('modal-chitiet');
    showChiTietPhieu();
    alert('Sửa chi tiết phiếu thành công!');
}

function openEditChiTietModal(maChiTiet) {
    const chiTiet = chiTietPhieuList.find(ct => ct.maChiTiet === maChiTiet);
    if (!chiTiet) return alert('Không tìm thấy Chi Tiết Phiếu này.');

    const title = document.getElementById('modal-chitiet-title');
    if (title) title.textContent = '✏️ Sửa Chi Tiết Phiếu';
    
    const form = document.getElementById('form-chitiet');
    if (form) form.onsubmit = (e) => handleEditChiTiet(e, maChiTiet, chiTiet.maPhieuNhap);

    const maPhieuInput = document.getElementById('ct-ma-phieu');
    if (maPhieuInput) {
        maPhieuInput.value = chiTiet.maPhieuNhap;
        maPhieuInput.disabled = true;
    }
    
    const maSPInput = document.getElementById('ct-ma-sp');
    if (maSPInput) maSPInput.value = chiTiet.maSP;
    
    const tenSPInput = document.getElementById('ct-ten-sp');
    if (tenSPInput) tenSPInput.value = chiTiet.tenSP;
    
    const soLuongInput = document.getElementById('ct-so-luong');
    if (soLuongInput) soLuongInput.value = chiTiet.soLuong;
    
    const donGiaInput = document.getElementById('ct-don-gia');
    if (donGiaInput) donGiaInput.value = chiTiet.donGia;

    // ⭐ CẬP NHẬT: Reset trường input type="file"
    const urlAnhInput = document.getElementById('ct-url-anh'); 
    if (urlAnhInput) urlAnhInput.value = ''; // Đây là cách reset file input
    
    openModal('modal-chitiet');
}

async function handleAddChiTiet(e) {
    // ⭐ QUAN TRỌNG: Đảm bảo ngăn chặn mặc định (prevent default) chạy ngay lập tức.
    e.preventDefault(); 

    const maPhieuNhap = document.getElementById('ct-ma-phieu').value.trim().toUpperCase();
    const maSP = document.getElementById('ct-ma-sp').value.trim().toUpperCase();
    const tenSP = document.getElementById('ct-ten-sp').value.trim();
    const soLuong = Number(document.getElementById('ct-so-luong').value);
    const donGia = Number(document.getElementById('ct-don-gia').value);
    
    // Xử lý tệp ảnh
    const fileInput = document.getElementById('ct-url-anh');
    let urlAnh = '';
    
    if (fileInput.files.length > 0) {
        try {
            urlAnh = await getBase64(fileInput.files[0]); 
        } catch (error) {
            console.error('Lỗi đọc file:', error);
            return alert('Lỗi: Không thể đọc tệp ảnh.');
        }
    }
    // Hết xử lý tệp ảnh

    const phieu = phieuNhapList.find(p => p.maPhieu === maPhieuNhap);
    if (!phieu) {
        return alert(`Lỗi: Không tìm thấy Phiếu Nhập có Mã: ${maPhieuNhap}. Vui lòng kiểm tra lại.`);
    }
    if (isNaN(soLuong) || isNaN(donGia) || soLuong <= 0 || donGia <= 0) {
        return alert('Lỗi: Số lượng và Đơn giá phải là số dương.');
    }

    const maChiTiet = generateUniqueCode('CT');
    const newChiTiet = { maChiTiet, maPhieuNhap, maSP, tenSP, soLuong, donGia, urlAnh }; 
    chiTietPhieuList.push(newChiTiet);

    updatePhieuNhapTotal(maPhieuNhap);
    saveData();
    closeModal('modal-chitiet');
    showChiTietPhieu();
    alert('Thêm chi tiết phiếu thành công!');
}

function deleteChiTietPhieu(maChiTiet) {
    const index = chiTietPhieuList.findIndex(ct => ct.maChiTiet === maChiTiet);
    if (index === -1) return;

    const maPhieuNhap = chiTietPhieuList[index].maPhieuNhap;

    if (!confirm(`Bạn có chắc chắn muốn xóa Chi Tiết Phiếu có ID: ${maChiTiet} không?`)) {
        return;
    }

    chiTietPhieuList.splice(index, 1);

    updatePhieuNhapTotal(maPhieuNhap);
    
    saveData();
    showChiTietPhieu();
    alert(`Đã xóa Chi Tiết Phiếu ${maChiTiet}.`);
}


// =========================================================
//              3. CHỨC NĂNG LỢI NHUẬN & GIÁ BÁN (LN)
// =========================================================

function getLatestImportPrice(maSP) {
    for (let i = chiTietPhieuList.length - 1; i >= 0; i--) {
        if (chiTietPhieuList[i].maSP === maSP) {
            return {
                tenSP: chiTietPhieuList[i].tenSP,
                donGiaNhap: Number(chiTietPhieuList[i].donGia) 
            };
        }
    }
    return null;
}

function showLoiNhuan() {
    const displayArea = document.getElementById('display-area');
    if (!displayArea) return; 
    
    const titleElement = document.getElementById('current-mode-title');
    if (titleElement) titleElement.textContent = '💰 Quản Lý Lợi Nhuận & Giá Bán';
    
    document.querySelectorAll('.function-btn').forEach(btn => btn.classList.remove('active'));
    const btnLoiNhuan = document.querySelector('.function-btn.btn-loinhuan');
    if (btnLoiNhuan) btnLoiNhuan.classList.add('active');

    productPrices = JSON.parse(localStorage.getItem('productPrices')) || {}; 
    
    const latestImportPrices = {};
    const uniqueProducts = new Set();
    
    // Duyệt ngược từ cuối để đảm bảo lấy giá nhập gần nhất
    [...chiTietPhieuList].reverse().forEach(ct => {
        if (!latestImportPrices[ct.maSP]) {
            latestImportPrices[ct.maSP] = {
                tenSP: ct.tenSP,
                donGiaNhap: Number(ct.donGia) || 0,
            };
        }
        uniqueProducts.add(ct.maSP);
    });
    
    let contentHTML = `
        <div class="data-management-panel" style="max-width: 900px; margin: 20px auto; padding: 0;">
            <h3 class="panel-title" style="text-align: center; color: #333;">TÍNH TOÁN LỢI NHUẬN VÀ ĐỊNH GIÁ BÁN</h3>
            <p style="text-align: center; color: #666; margin-bottom: 20px;">
                Dữ liệu được tính toán dựa trên **Giá Nhập Gần Nhất** của mỗi sản phẩm.
            </p>
    `;

    let tableHTML = `<div id="loinhuan-table-container">`;

    if (uniqueProducts.size === 0) {
        tableHTML += `
            <div class="empty-state">
                Không có sản phẩm nào được nhập để tính Lợi Nhuận.
            </div>
        `;
    } else {
        tableHTML += `
            <table class="data-table">
                <thead>
                    <tr style="background-color: #A9DFBF; color: #27AE60;">
                        <th style="text-align: left;">Mã SP</th>
                        <th style="text-align: left;">Tên SP</th>
                        <th style="text-align: right;">Giá Nhập Gần Nhất</th>
                        <th style="text-align: right;">Giá Bán Định Nghĩa</th>
                        <th style="text-align: center;">Lợi Nhuận (%)</th>
                        <th style="text-align: center;">Thao Tác</th>
                    </tr>
                </thead>
                <tbody id="loinhuan-table-body">
        `;

        uniqueProducts.forEach(maSP => {
            const latestPrice = latestImportPrices[maSP];
            if (!latestPrice) return; 
            
            const donGiaNhap = latestPrice.donGiaNhap;
            const defaultGiaBan = Math.ceil((donGiaNhap || 0) * 1.2 / 1000) * 1000;
            const currentGiaBan = Number(productPrices[maSP]?.giaBan) || defaultGiaBan;
            
            let LN_percent = 0;
            if (donGiaNhap > 0) {
                 LN_percent = (currentGiaBan - donGiaNhap) / donGiaNhap * 100;
            }

            tableHTML += `
                <tr id="price-${maSP}">
                    <td style="font-weight: 600;">${maSP}</td>
                    <td>${latestPrice.tenSP}</td>
                    <td style="text-align: right;">${donGiaNhap.toLocaleString('vi-VN')} ₫</td>
                    <td style="text-align: right; font-weight: bold; color: #E67E22;">${currentGiaBan.toLocaleString('vi-VN')} ₫</td>
                    <td style="text-align: center; font-weight: bold; color: ${LN_percent >= 5 ? '#27AE60' : '#E74C3C'};">
                        ${LN_percent.toFixed(2)} %
                    </td>
                    <td style="text-align: center;">
                        <button class="action-btn edit-btn" style="background-color: #3498DB; color: white; padding: 6px 10px; border-radius: 4px; border: none; cursor: pointer;" onclick="openEditPriceModal('${maSP}')">Sửa Giá Bán</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;
    }

    tableHTML += `</div>`; 
    
    displayArea.innerHTML = contentHTML + tableHTML + `</div>`; 
}

function openEditPriceModal(maSP) {
    productPrices = JSON.parse(localStorage.getItem('productPrices')) || {};
    
    const latestImportPrices = getLatestImportPrice(maSP);
    if (!latestImportPrices) return alert('Không tìm thấy giá nhập gần nhất cho sản phẩm này.');
    
    const donGiaNhap = latestImportPrices.donGiaNhap;
    const defaultGiaBan = Math.ceil((donGiaNhap || 0) * 1.2 / 1000) * 1000;
    const currentGiaBan = Number(productPrices[maSP]?.giaBan) || defaultGiaBan; 
    
    closeModal('modal-price-edit'); 
    
    const modalDiv = document.createElement('div');
    modalDiv.id = 'modal-price-edit';
    modalDiv.className = 'modal';
    modalDiv.style.display = 'block'; 
    
    modalDiv.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3 style="margin: 0;">✏️ Sửa Giá Bán cho ${latestImportPrices.tenSP} (${maSP})</h3>
                <button class="close-btn" onclick="closeModal('modal-price-edit')">&times;</button>
            </div>
            <form id="form-price-edit" onsubmit="handleEditPrice(event, '${maSP}', ${donGiaNhap})">
                <div class="form-group">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Giá Nhập Gần Nhất:</label>
                    <input type="text" value="${donGiaNhap.toLocaleString('vi-VN')} ₫" disabled style="background-color: #f7f7f7;">
                </div>
                <div class="form-group">
                    <label for="new-gia-ban" style="display: block; margin-bottom: 5px; font-weight: bold;">Giá Bán Mới (Phải lớn hơn Giá Nhập):</label>
                    <input type="number" id="new-gia-ban" value="${currentGiaBan}" required min="${donGiaNhap}">
                </div>
                <p style="margin-top: 10px; font-weight: bold;">Lợi Nhuận Dự Kiến: <span id="ln-du-kien" style="color: blue;">...</span></p>
                <div class="form-actions">
                    <button type="submit" class="btn-save">💾 Lưu</button>
                    <button type="button" class="btn-cancel" onclick="closeModal('modal-price-edit')">❌ Hủy</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modalDiv);
    
    const inputGiaBan = document.getElementById('new-gia-ban');
    const lnSpan = document.getElementById('ln-du-kien');
    const updateLNDuKien = () => {
        const newGiaBan = parseFloat(inputGiaBan.value);
        if (isNaN(newGiaBan) || newGiaBan < donGiaNhap) {
            lnSpan.textContent = 'Giá bán phải ≥ Giá nhập.';
            lnSpan.style.color = 'red';
            return;
        }
        let lnPercent = 0;
        if (donGiaNhap > 0) {
             lnPercent = (newGiaBan - donGiaNhap) / donGiaNhap * 100;
        }
        
        lnSpan.textContent = `${lnPercent.toFixed(2)} %`;
        lnSpan.style.color = lnPercent >= 5 ? 'green' : 'blue';
    };
    
    updateLNDuKien();
    inputGiaBan.addEventListener('input', updateLNDuKien);
}

function handleEditPrice(e, maSP, donGiaNhap) {
    e.preventDefault();
    const newGiaBanInput = document.getElementById('new-gia-ban');
    if (!newGiaBanInput) return;

    const newGiaBan = parseFloat(newGiaBanInput.value);
    
    if (newGiaBan < donGiaNhap) {
        return alert('Giá Bán phải lớn hơn hoặc bằng Giá Nhập!');
    }
    
    let lnPercent = 0;
    if (donGiaNhap > 0) {
        lnPercent = (newGiaBan - donGiaNhap) / donGiaNhap * 100;
    }

    productPrices[maSP] = {
        giaBan: newGiaBan,
        phanTramLN: lnPercent
    };
    
    localStorage.setItem('productPrices', JSON.stringify(productPrices));
    closeModal('modal-price-edit');
    showLoiNhuan();
    alert(`Đã cập nhật Giá Bán cho sản phẩm ${maSP}!`);
}


// --- KHỞI TẠO VÀ GẮN SỰ KIỆN ---
document.addEventListener('DOMContentLoaded', () => {
    const btnPhieu = document.querySelector('.function-btn.btn-phieu');
    const btnChiTiet = document.querySelector('.function-btn.btn-chitiet');
    const btnLoiNhuan = document.querySelector('.function-btn.btn-loinhuan');
    const backBtn = document.querySelector('.back-btn');

    if (btnPhieu) btnPhieu.onclick = showPhieuNhap;
    if (btnChiTiet) btnChiTiet.onclick = showChiTietPhieu;
    if (btnLoiNhuan) btnLoiNhuan.onclick = showLoiNhuan;
    if (backBtn) backBtn.onclick = backToMenu;
    
    backToMenu();
});

// ⭐ THÊM MỚI: Cập nhật tên file khi người dùng chọn ảnh
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('ct-url-anh');
    const fileNameDisplay = document.getElementById('file-name-ct');

    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                // Hiển thị tên file
                fileNameDisplay.textContent = this.files[0].name;
            } else {
                // Nếu hủy chọn
                fileNameDisplay.textContent = 'Chưa có tệp nào được chọn';
            }
        });
    }
});

