const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const ticketID = document.getElementById("ticketID").value.trim();

  if (!ticketID) return alert("გთხოვთ შეიყვანოთ ბილეთის ნომერი");

  try {
    const res = await fetch(`https://railway.stepprojects.ge/api/tickets/checkstatus/${ticketID}`);
    const data = await res.json();

    if (!data || !data.id) return alert("ბილეთი ვერ მოიძებნა!");

    // Show the whole ticket container
    const ticketContainer = document.querySelector(".ticket-container");
    ticketContainer.style.display = "block";

    // Fill ticket header
    document.getElementById("ticket-id").textContent = `ბილეთის ნომერი: ${data.id}`;
    document.getElementById("payDay").textContent = `გადახდის თარიღი: ${data.date || "-"}`;

    // Fill train info
    const train = data.train;
    const trainInfoDiv = document.getElementById("train-info");
    trainInfoDiv.innerHTML = `
      <div class="train-card">
        <div class="train-info">
          <h2>#${train.number}</h2>
          <h3>${train.name}</h3>
        </div>
        <div class="route-from">
          <h2>${train.from}</h2>
          <h3>${train.departure} (${data.date || "-"})</h3>
        </div>
        <div class="route-to">
          <h2>${train.to}</h2>
          <h3>${train.arrive}</h3>
        </div>
      </div>
    `;

    // Fill contact info
    document.getElementById("phone-info").textContent = `ტელეფონი: ${data.phone || "-"}`;
    document.getElementById("email-info").textContent = `Email: ${data.email || "-"}`;

    // Fill passengers info
    const passengersList = document.getElementById("passengers-list");
    passengersList.innerHTML = "";
    const passengers = data.persons || [];
    passengers.forEach((p, i) => {
      const passengerDiv = document.createElement("div");
      passengerDiv.classList.add("passenger-info");
      passengerDiv.innerHTML = `
        <p><strong>მგზავრი ${i + 1}:</strong> ${p.name} ${p.surname}</p>
        <p>პირადი ნომერი: ${p.idNumber}</p>
        <p>ადგილი: ${p.seat?.number || "—"}</p>
      `;
      passengersList.appendChild(passengerDiv);
    });

    // Fill payment info
    const paymentInfo = document.querySelector(".payment-info");
    paymentInfo.innerHTML = `
      <h3>გადახდის ინფორმაცია</h3>
      <p>თანხა: ${data.ticketPrice} ₾</p>
      <p>სტატუსი: ${passengers[0]?.payoutCompleted ? "გადახდილია ✅" : "გადაუხდელი ❌"}</p>
    `;

  } catch (err) {
    console.error(err);
    alert("დაფიქსირდა შეცდომა ბილეთის მოძიებისას.");
  }
});
