// localStorage.clear();

// THÊM DOMContentLoaded ĐẦU TIÊN
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM đã tải xong');
    initializeAll();
});

function initializeAll() {
    createProduct();
    createauthor();
    createnewbook();
    rederpage('all'); 
    resetActivePage();
    initializeEvents();
}

function createProduct() {
    if (localStorage.getItem('product') === null) {
        var productArray = [
            { productId: 1, src: 'assets/images/sanpham1.webp', category: 'tuoitho', name: 'Tôi thấy hoa vàng trên cỏ xanh', price: 99000 },
            { productId: 2, src: 'assets/images/sanpham2.webp', category: 'kynangsong', name: '3 người thầy vỹ đại', price: 60000 },
            { productId: 3, src: 'assets/images/sanpham3.webp', category: 'kynangsong', name: 'nếu chỉ còn một ngày để sống', price: 200000 },
            { productId: 4, src: 'assets/images/sanpham4.webp', category: 'tuoitho', name: 'cây cam ngọt của tôi', price: 220000 },
            { productId: 5, src: 'assets/images/sanpham5.webp', category: 'kynangsong', name: 'đừng chỉ đẹp mà không hiểu chuyện', price: 139000 },
            { productId: 6, src: 'assets/images/sanpham6.webp', category: 'tinhcam', name: 'nhà nàng ở cạnh nhà tôi', price: 290000 },
            { productId: 7, src: 'assets/images/sanpham7.webp', category: 'chualanh', name: 'hiểu về trái tim', price: 99000 },
            { productId: 8, src: 'assets/images/sanpham8.webp', category: 'chualanh', name: 'trong con say níu sợi dây đứt', price: 230000 },
            { productId: 9, src: 'assets/images/sanpham9.webp', category: 'tinhcam', name: 'nàng và con mèo của nàng', price: 99000 },
            { productId: 10, src: 'assets/images/sanpham10.webp', category: 'kynangsong', name: 'nhà đầu tư vĩ đại', price: 260000 },
            { productId: 11, src: 'assets/images/sanpham11.webp', category: 'tuoitho', name: 'đi qua hoa cúc', price: 180000 },
            { productId: 12, src: 'assets/images/sanpham12.webp', category: 'lichsu', name: 'Việt Nam sử lược', price: 60000 },
            { productId: 13, src: 'assets/images/sanpham13.webp', category: 'tuoitho', name: 'hoàng tử bé', price: 130000 },
            { productId: 14, src: 'assets/images/sanpham14.webp', category: 'lichsu', name: 'Đạo đức kinh', price: 99000 },
            { productId: 15, src: 'assets/images/sanpham15.webp', category: 'kynangsong', name: 'giải mã hóc-môn dopamine', price: 270000 },
            { productId: 16, src: 'assets/images/sanpham16.webp', category: 'lichsu', name: 'lược sử loài người', price: 139000 },
            { productId: 17, src: 'assets/images/sanpham17.webp', category: 'lichsu', name: 'lịch sử tư tưởng trung quốc', price: 300000 },
            { productId: 18, src: 'assets/images/sanpham18.webp', category: 'chualanh', name: 'yêu những điều không hoàn hảo', price: 230000 },
            { productId: 19, src: 'assets/images/sanpham19.webp', category: 'tinhcam', name: '5cm/s', price: 99000 },
            { productId: 20, src: 'assets/images/sanpham20.webp', category: 'lichsu', name: 'đàm đạo cùng Khổng Tử', price: 240000 },
            { productId: 21, src: 'assets/images/sanpham21.webp', category: 'lichsu', name: 'những tù nhân của địa lý', price: 139000 },
            { productId: 22, src: 'assets/images/sanpham22.webp', category: 'tuoitho', name: 'tuổi thơ dữ dội', price: 130000 },
            { productId: 23, src: 'assets/images/sanpham23.webp', category: 'tinhcam', name: 'hạ đỏ', price: 260000 },
            { productId: 24, src: 'assets/images/sanpham24.webp', category: 'tinhcam', name: 'em sẽ đến cùng cơn mưa', price: 230000 },
            { productId: 25, src: 'assets/images/sanpham25.webp', category: 'kynangsong', name: 'thao túng tâm lý', price: 240000 },
            { productId: 26, src: 'assets/images/sanpham26.webp', category: 'chualanh', name: 'mẹ làm gì có ước mơ', price: 139000 },
            { productId: 27, src: 'assets/images/sanpham27.webp', category: 'tinhcam', name: 'Yêu miêu', price: 99000 },
            { productId: 28, src: 'assets/images/sanpham28.webp', category: 'tinhcam', name: 'trường an ly ca', price: 130000 },
            { productId: 29, src: 'assets/images/sanpham29.webp', category: 'kynangsong', name: 'từ tốt đến vỹ đại', price: 270000 },
            { productId: 30, src: 'assets/images/sanpham30.webp', category: 'kynangsong', name: 'Sống Chậm', price: 260000 },
            { productId: 31, src: 'assets/images/sanpham31.webp', category: 'chualanh', name: 'trèo lên mái nhà để khóc', price: 99000 },
            { productId: 32, src: 'assets/images/sanpham32.webp', category: 'chualanh', name: 'những kẻ lãng du', price: 220000 },
            { productId: 33, src: 'assets/images/sanpham33.webp', category: 'kynangsong', name: 'làm sao học ít hiểu nhiều', price: 270000 },
            { productId: 34, src: 'assets/images/sanpham34.webp', category: 'kynangsong', name: 'tiểu sử Elon Musk', price: 99000 },
            { productId: 35, src: 'assets/images/sanpham35.webp', category: 'kynangsong', name: 'Trump đừng bao giờ bỏ cuộc', price: 230000 },
            { productId: 36, src: 'assets/images/sanpham36.webp', category: 'kynangsong', name: 'V.Putin sự vĩ đại của nước Nga', price: 290000 },
            { productId: 37, src: 'assets/images/sanpham37.webp', category: 'kynangsong', name: 'sự ly kỳ của cậu bé giao báo', price: 300000 },
            { productId: 38, src: 'assets/images/sanpham38.webp', category: 'lichsu', name: 'lược sử tôn giáo', price: 270000 },
            { productId: 39, src: 'assets/images/sanpham39.webp', category: 'lichsu', name: 'chiến tranh tiền tệ', price: 180000 },
            { productId: 40, src: 'assets/images/sanpham40.webp', category: 'tinhcam', name: 'Vẽ em bằng màu nội nhớ', price: 220000 },
            { productId: 41, src: 'assets/images/sanpham41.webp', category: 'tinhcam', name: 'kiếp nào ta cũng tìm thấy nhau', price: 99000 },
            { productId: 42, src: 'assets/images/sanpham42.webp', category: 'lichsu', name: 'các triều đại Việt Nam', price: 290000 },
            { productId: 43, src: 'assets/images/sanpham43.webp', category: 'tinhcam', name: 'Ngày xưa có một chuyện tình', price: 270000 },
            { productId: 44, src: 'assets/images/sanpham44.webp', category: 'lichsu', name: 'Vì sao Phật giáo giàu chân lý', price: 180000 },
            { productId: 45, src: 'assets/images/sanpham45.webp', category: 'kynangsong', name: 'Thép đã tôi thế đấy', price: 139000 }
        ];
        localStorage.setItem('product', JSON.stringify(productArray));
    }
}

function createauthor(){
    if (localStorage.getItem('infobooks') === null) {
        const infobooks1 = [
            { productId: 1, content: "Tác phẩm như một tập nhật ký xoay quanh cuộc sống của những đứa trẻ ở một vùng quê Việt Nam nghèo khó, nổi bật lên là thông điệp về tình anh em, tình làng nghĩa xóm và những tâm tư của tuổi mới lớn.", author: "Nguyễn Nhật Ánh" },
            // ... (giữ nguyên các thông tin sách khác)
        ];
        localStorage.setItem('infobooks', JSON.stringify(infobooks1));
    }
}

const productsinfo = JSON.parse(localStorage.getItem('infobooks'));
const arrProducts = JSON.parse(localStorage.getItem('product'));

if (localStorage.getItem('productscategory') === null) {
    const productscategory = [
        {category: 'tuoitho', categoryname: "Thiếu nhi & tuổi thơ"},
        {category: 'kynangsong', categoryname: "Phát triển kỹ năng sống"},
        {category: 'tinhcam', categoryname: "Tiểu thuyết & tình cảm"},
        {category: 'chualanh', categoryname: "Tâm lý & chữa lành"},
        {category: 'lichsu', categoryname: "Lịch sử & tôn giáo"},
    ];
    localStorage.setItem('productscategory', JSON.stringify(productscategory));
}

const productscategory = JSON.parse(localStorage.getItem('productscategory'));

function createnewbook() {
    if (localStorage.getItem('newbook') === null) {
        var newbookarray = [
            { productId: 1, src: 'assets/images/sanpham1.webp', category: 'thiếu nhi & tuổi thơ', name: 'Tôi thấy hoa vàng trên cỏ xanh', price: 120000 },
            { productId: 3, src: 'assets/images/sanpham3.webp', category: 'phát triển bản thân', name: 'nếu chỉ còn một ngày để sống', price: 200000 },
            { productId: 24, src: 'assets/images/sanpham24.webp', category: 'hồi ký & tình cảm', name: 'nhà nàng ở cạnh nhà tôi', price: 230000 },
            { productId: 39, src: 'assets/images/sanpham39.webp', category: 'kinh tế & lịch sử', name: 'chiến tranh tiền tệ', price: 299000 },
        ];
        localStorage.setItem('newbook', JSON.stringify(newbookarray));
    }
    const newbooks = JSON.parse(localStorage.getItem('newbook'));
    const arrnewproduct = document.getElementsByClassName('item-newproducts');
    for (let i = 0; i < arrnewproduct.length; i++) {
        let s = `
            <div class="images-newbook"><img src="${newbooks[i].src}" alt=""></div>
            <div class="info-book name">${newbooks[i].name}</div>
            <div class="info-book categorynew"><i class="fa-solid fa-tag"></i>${newbooks[i].category}</div>
            <div class="info-book price"> <i class="fas fa-coins newcoin"></i>giá: ${newbooks[i].price}Đ</div>`;
        arrnewproduct[i].innerHTML = s;
    }
}

function changePage1(pageNumber) {
    let pages = document.querySelectorAll('.page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activePage');
    }
    let currentPage = document.getElementsByClassName(`page${pageNumber}`);
    if (currentPage.length > 0) {
        currentPage[0].classList.add('activePage');
    }
}

function resetActivePage() {
    let page1 = document.querySelectorAll('.page');
    for (let i = 0; i < page1.length; i++) {
        page1[i].classList.remove('activePage');
    }
    let pagedefaut = document.querySelector('.page1');
    if (pagedefaut) {
        pagedefaut.classList.add('activePage');
    }
}

function rederpage(categoryproducts) {
    if (!localStorage.getItem('product')) {
        createProduct();
    }
    const arrProducts = JSON.parse(localStorage.getItem('product'));
    var arrdisplay = [];
    
    if (!arrProducts) {
        console.log("Không có sản phẩm");
        return;
    }
    
    if (categoryproducts == 'all') {
        arrdisplay = arrProducts;
    } else if (categoryproducts === 'priceup') {
        arrdisplay = [...arrProducts].sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (categoryproducts === 'pricedown') {
        arrdisplay = [...arrProducts].sort(function(a, b) {
            return b.price - a.price;
        });
    } else {
        arrdisplay = arrProducts.filter(function(product) {
            return product.category === categoryproducts;
        });
    }
    
    let result = arrdisplay.length;
    let numberpage = Math.ceil(result / 8);
    var pagination = document.querySelector('.pagination');
    let pagesHtml = '';
    
    for (let i = 1; i <= numberpage; i++) {
        pagesHtml += `<div class="page page${i}" onclick="changePage1(${i})">${i}</div>`;
    }
    pagination.innerHTML = pagesHtml;
    
    const pages = document.querySelectorAll('.page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].addEventListener('click', function() {
            const pageNumber = i + 1;
            showproduct(pageNumber, arrdisplay);
        });
    }
    
    showproduct(1, arrdisplay);
    resetActivePage();
}

function showproduct(page, arrdisplay1) {
    if (!arrdisplay1 || arrdisplay1.length === 0) {
        console.log("Không có sản phẩm để hiển thị");
        return;
    }
    
    let productsinPage = 8;
    let startIndex = (page - 1) * productsinPage;
    let endIndex = page * productsinPage;
    if (endIndex > arrdisplay1.length) {
        endIndex = arrdisplay1.length;
    }
    
    var s = '';
    var renderproduct = document.querySelector('.products');
    if (!renderproduct) {
        console.log("Không tìm thấy phần tử .products");
        return;
    }
    
    renderproduct.innerHTML = '';
    for (let i = startIndex; i < endIndex; i++) {
        s += `<div class="productitems">
            <img class="product-img" src="${arrdisplay1[i].src}" alt="sanpham">
            <div class="product-name">${arrdisplay1[i].name}</div>
            <div class="product-price">${arrdisplay1[i].price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</div>
            <div class="iconfreeship">
                <i class="fa-solid fa-truck"></i>
                <div class="freeship">Freeship</div>
            </div>
            <div class="add-cart" onclick="displayinfo(${arrdisplay1[i].productId})">xem chi tiết</div>
        </div>`;
    }
    renderproduct.innerHTML = s;
}

function changecategory(category) {
    var changecate = document.querySelectorAll('.category');
    for (let i = 0; i < changecate.length; i++) {
        changecate[i].classList.remove('activePage');
    }
    var categorynow = document.querySelector(`.category${category}`);
    if (categorynow) {
        categorynow.classList.add('activePage');
    }
}

function findObjectByProperty(objects, property, value) {
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        if (obj[property] === value) {
            return obj;
        }
    }
    return null;
}

function displayinfo(productid) {
    const productinfo = document.getElementById('showinfoproduct');
    if (!productinfo) {
        console.log('Không tìm thấy phần tử showinfoproduct');
        return;
    }
    
    productinfo.style.display = 'grid';
    productinfo.innerHTML = '';
    
    const result = findObjectByProperty(productsinfo, "productId", productid);
    if (!result) {
        console.log('Không tìm thấy thông tin sản phẩm');
        return;
    }
    
    const product = arrProducts.find(p => p.productId === productid);
    if (!product) {
        console.log('Không tìm thấy sản phẩm');
        return;
    }
    
    productinfo.innerHTML = `
        <div class="productinfo-img"> 
            <img src="${product.src}" alt="" class="info-img">
        </div>
        <div class="productinfo-info">
            <div class="info1 name1">${product.name}</div>
            <div class="info1 author"><i class="fa-solid fa-tag taginfo"></i>Tác giả: ${result.author}</div>
            <div class="info1 price1">${product.price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</div>
            <div class="info1 content1">${result.content}</div>
            <div class="camket">
                <i class="fa-solid fa-file-shield"></i>Nhận sản phẩm như mô tả. Thông tin thẻ của bạn được bảo mật và không được chia sẻ với người bán.
            </div>
        </div>
        <div class="addtocart1" id="addtocart1">thêm vào giỏ</div>
        <div class="closeinfo" id="close1"><i class="fa-solid fa-xmark"></i></div>
    `;
    
    const closeButton = document.getElementById('close1');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            productinfo.style.display = 'none';
        });
    }
    
    const addToCartBtn = document.getElementById('addtocart1');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const userAccount = localStorage.getItem("userLogin");
            if (userAccount == null) {
                const modal = document.querySelector(".modal");
                if (modal) {
                    modal.style.display = "flex";
                }
            } else {
                const user = JSON.parse(userAccount);
                addToCart(user, productid);
            }
        });
    }
}

function addToCart(user, productid) {
    const existingCarts = JSON.parse(localStorage.getItem("shoppingCarts")) || [];
    let userCart = existingCarts.find(cart => cart.UserID === user.UserID);

    if (!userCart) {
        userCart = {
            UserID: user.UserID,
            items: []
        };
        existingCarts.push(userCart);
    }

    if (!userCart.items) {
        userCart.items = [];
    }

    const productExists = userCart.items.find(item => item.productId === productid);
    if (!productExists) {
        userCart.items.push({ productId: productid });
        localStorage.setItem("shoppingCarts", JSON.stringify(existingCarts));
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
    } else {
        alert("Sản phẩm đã có trong giỏ hàng!");
    }
}

function initializeEvents() {
    // SỬA LỖI DÒNG 492 - THÊM KIỂM TRA NULL
    var sanpham = document.getElementById('sanpham');
    var themsanpham = document.querySelector('.themsanpham');
    
    if (sanpham && themsanpham) {
        sanpham.onclick = function() {
            themsanpham.style.display = "block";
            const mangsanpham = JSON.parse(localStorage.getItem('product'));
            let s = '';
            for (let i = 0; i < mangsanpham.length; i++) {
                s += `<div class="chuasanpham"><img class="anhsanpham" src="${mangsanpham[i].src}" alt=""><div class="tensanpham">${mangsanpham[i].name}</div><div class="suasanpham" onclick="suasp(${mangsanpham[i].productId})"><i class="fa-solid fa-gear"></i></div><div class="xoasanpham" onclick="removeProductById(${mangsanpham[i].productId})"><i class="fa-solid fa-xmark"></i></div></div>`;
            }
            s += `<div class="them" onclick="themsp()">Thêm sản phẩm</div>`;
            themsanpham.innerHTML = s;
        };
    }

    const addProductButton = document.getElementById("addProductButton");
    if (addProductButton) {
        addProductButton.onclick = function() {
            var bookName = document.getElementById("bookName").value;
            var bookPrice = document.getElementById("bookPrice").value;
            var bookCategory = document.getElementById("bookCategory").value;
            var imageFile = document.getElementById("imageFile").files[0];

            if (!bookName || !bookPrice || !bookCategory || !imageFile) {
                alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
                return;
            }

            var reader = new FileReader();
            reader.onload = function(event) {
                var newProduct = {
                    productId: (JSON.parse(localStorage.getItem('product')) || []).length + 1,
                    src: 'assets/images/comingsoon.png',
                    category: bookCategory,
                    name: bookName,
                    price: parseInt(bookPrice)
                };

                var products = JSON.parse(localStorage.getItem('product')) || [];
                products.push(newProduct);
                localStorage.setItem('product', JSON.stringify(products));

                alert("Sản phẩm đã được thêm thành công!");
                
                const mangsanpham = JSON.parse(localStorage.getItem('product'));
                let s = '';
                for (let i = 0; i < mangsanpham.length; i++) {
                    s += `<div class="chuasanpham"><img class="anhsanpham" src="${mangsanpham[i].src}" alt=""><div class="tensanpham">${mangsanpham[i].name}</div><div class="suasanpham" onclick="suasp(${mangsanpham[i].productId})"><i class="fa-solid fa-gear"></i></div><div class="xoasanpham" onclick="removeProductById(${mangsanpham[i].productId})"><i class="fa-solid fa-xmark"></i></div></div>`;
                }
                s += `<div class="them" onclick="themsp()">Thêm sản phẩm</div>`;
                if (themsanpham) {
                    themsanpham.innerHTML = s;
                }
                
                var outra = document.querySelector('.themsuaxoa');
                if (outra) {
                    outra.style.display = "none";
                }
            };
            reader.readAsDataURL(imageFile);
        };
    }

    const imageFile = document.getElementById("imageFile");
    if (imageFile) {
        imageFile.addEventListener("change", function(event) {
            var file = event.target.files[0];
            var reader = new FileReader();

            reader.onload = function(e) {
                var imagePreview = document.getElementById("imagePreview");
                if (imagePreview) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = "block";
                }
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        });
    }
}

function thoatra() {
    var themsanpham = document.querySelector('.themsanpham');
    if (themsanpham) {
        themsanpham.style.display = "none";
    }
}

function themsp() {
    var themsuaxoa = document.querySelector('.themsuaxoa');
    if (themsuaxoa) {
        themsuaxoa.style.display = "block";
        document.querySelector('.a111').style.display = "block";
        document.querySelector('.a222').style.display = "none";
    }
}

function removeProductById(productId1) {
    const isConfirmed = confirm("Bạn có chắc muốn xóa sản phẩm này?");
    
    if (isConfirmed) {
        let products = JSON.parse(localStorage.getItem('product')) || [];
        products = products.filter(product => product.productId !== productId1);
        localStorage.setItem('product', JSON.stringify(products));
        
        alert("Sản phẩm đã được xóa!");
        const mangsanpham = JSON.parse(localStorage.getItem('product'));
        let s = '';
        for (let i = 0; i < mangsanpham.length; i++) {
            s += `<div class="chuasanpham"><img class="anhsanpham" src="${mangsanpham[i].src}" alt=""><div class="tensanpham">${mangsanpham[i].name}</div><div class="suasanpham" onclick="suasp(${mangsanpham[i].productId})"><i class="fa-solid fa-gear"></i></div><div class="xoasanpham" onclick="removeProductById(${mangsanpham[i].productId})"><i class="fa-solid fa-xmark"></i></div></div>`;
        }
        s += `<div class="them" onclick="themsp()">Thêm sản phẩm</div>`;
        var themsanpham = document.querySelector('.themsanpham');
        if (themsanpham) {
            themsanpham.innerHTML = s;
        }
    }
}

function suasp(productId) {
    var themsuaxoa = document.querySelector('.themsuaxoa');
    if (themsuaxoa) {
        themsuaxoa.style.display = "block";
        document.querySelector('.a111').style.display = "none";
        document.querySelector('.a222').style.display = "block";
        
        const addProductButton = document.getElementById("addProductButton");
        if (addProductButton) {
            addProductButton.onclick = function() {
                var bookName = document.getElementById("bookName").value;
                var bookPrice = document.getElementById("bookPrice").value;
                var bookCategory = document.getElementById("bookCategory").value;
                if (!bookName || !bookPrice || !bookCategory) {
                    alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
                    return;
                }
                saveProductData(productId, bookName, bookPrice, bookCategory);
            };
        }
    }
}

function saveProductData(productId, bookName, bookPrice, bookCategory) {
    var products = JSON.parse(localStorage.getItem('product')) || [];
    var productIndex = products.findIndex(product => product.productId == productId);
    
    if (productIndex !== -1) {
        products[productIndex] = {
            productId: productId,
            src: products[productIndex].src,
            category: bookCategory,
            name: bookName,
            price: parseInt(bookPrice)
        };
        
        localStorage.setItem('product', JSON.stringify(products));
        alert("Sản phẩm đã được sửa thành công!");
        
        var themsuaxoa = document.querySelector(".themsuaxoa");
        if (themsuaxoa) {
            themsuaxoa.style.display = "none";
        }
    } else {
        alert("Không tìm thấy sản phẩm để sửa.");
    }
}

function outra1() {
    var outra = document.querySelector('.themsuaxoa');
    if (outra) {
        outra.style.display = "none";
    }
}