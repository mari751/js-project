document.getElementById("mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

});

let totalPrice = sessionStorage.getItem('totalPrice')
let price = document.getElementById("price-point")
price.textContent = `Balance To Pay: ${totalPrice}₾`

let submit = document.getElementById("submit")
submit.addEventListener("click", (e) => {
  e.preventDefault();
  const ticketData = JSON.parse(sessionStorage.getItem("ticketData"));
  ticketData.people.forEach(p => p.payoutCompleted = true);

  fetch('https://railway.stepprojects.ge/api/tickets/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
  })
  .then(res => res.text())
  .then(data => {
      console.log('Raw response:', data);
      sessionStorage.setItem("ticket", data)
      const payDate = new Date();
      const formattedDate = `${String(payDate.getMonth() + 1).padStart(2, "0")}-${String(payDate.getDate()).padStart(2, "0")}-${payDate.getFullYear()}`;
      sessionStorage.setItem("payDate", formattedDate)
      location.href = "index5.html";
  })
  .catch(err => console.error("Error:", err));
});