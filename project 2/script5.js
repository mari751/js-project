document.addEventListener("DOMContentLoaded", () => {
  const trainsArray = JSON.parse(sessionStorage.getItem("trainsArray"));
  const index = sessionStorage.getItem("indexOfBtn");
  const selectedTrain = trainsArray ? trainsArray[index] : null;

  if (selectedTrain) {
    document.getElementById("train-info").innerHTML = `
      <div class="train-card">
        <div class="train-info">
            <h2>#${selectedTrain.number}</h2>
            <h3>${selectedTrain.name}</h3>
        </div>
        <div class="route-from">
            <h2>${selectedTrain.from}</h2>
            <h3>${selectedTrain.departure}</h3>                    
        </div>
        <div class="route-to">
            <h2>${selectedTrain.to}</h2>
            <h3>${selectedTrain.arrive}</h3>               
        </div>
      </div>
    `;
  }

  const ticketIdEl = document.getElementById("ticket-id");
  const payDayEl = document.getElementById("payDay");

  const ticket = sessionStorage.getItem("ticket");
  const payDate = sessionStorage.getItem("payDate");

  if (ticketIdEl) ticketIdEl.textContent = ticket || "—";
  if (payDayEl) payDayEl.textContent = payDate || "—";

  const phone = sessionStorage.getItem("phone");
  const email = sessionStorage.getItem("email");

  const phoneInfo = document.getElementById("phone-info");
  const emailInfo = document.getElementById("email-info");

  if (phoneInfo) phoneInfo.textContent = phone || "—";
  if (emailInfo) emailInfo.textContent = email || "—";

    let ticketData = sessionStorage.getItem("ticketData");
    if (ticketData) {
    ticketData = JSON.parse(ticketData);
    const passengersList = document.getElementById("passengers-list");
    passengersList.innerHTML = "";

    const passengers = ticketData.people || ticketData.passengers || [];
    passengers.forEach((p, i) => {
        const passengerDiv = document.createElement("div");
        passengerDiv.classList.add("passenger-info");
        const seatLabel = sessionStorage.getItem(`passengerSeatName${i + 1}`);
        passengerDiv.innerHTML = `
            <p><strong>მგზავრი ${i + 1}:</strong> ${p.name} ${p.surname}</p>
            <p>პირადი ნომერი: ${p.idNumber}</p>
            <p>ადგილი: ${seatLabel}</p>
        `;
        passengersList.appendChild(passengerDiv);
    });
  } else {
      console.error("ticketData not found in sessionStorage");
  }

});
