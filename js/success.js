document.addEventListener("DOMContentLoaded", () => {
  const order = JSON.parse(localStorage.getItem("order"));
  const box = document.querySelector(".success-box");

  if (order) {
    const summary = order.items.map(i =>
      `<li>${i.name} (${i.qty} × ${vnd(i.price)})</li>`
    ).join("");

    const total = vnd(order.total);
    const infoHTML = `
      <p><strong>Người nhận:</strong> ${order.receiver.name}</p>
      <p><strong>Điện thoại:</strong> ${order.receiver.phone}</p>
      <p><strong>Địa chỉ:</strong> ${order.receiver.address}</p>
      <ul style="text-align:left;list-style:disc;margin-left:20px;">${summary}</ul>
      <p><strong>Tổng thanh toán:</strong> ${total}</p>
    `;
    box.insertAdjacentHTML("beforeend", infoHTML);
  }

  document.getElementById("home-btn").addEventListener("click", () => {
    localStorage.removeItem("order");
    window.location.href = "index.html";
  });
});

function vnd(price) {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
