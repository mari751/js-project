window.addEventListener('DOMContentLoaded', function () {
    const trainsArray = JSON.parse(sessionStorage.getItem("trainsArray"));
    const index = sessionStorage.getItem("indexOfBtn");
    const selectedTrain = trainsArray[index];

    const modeToggle = document.getElementById("mode-toggle");
    modeToggle.addEventListener("click", function () {
    if (modeToggle.textContent === "Toggle Dark Mode") {
        document.body.classList.add("dark-mode");
        modeToggle.textContent = "Toggle Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        modeToggle.textContent = "Toggle Dark Mode";
    }
    });

    document.getElementById("picked-ticket").innerHTML = `
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

    const passengerCount = parseInt(sessionStorage.getItem("მგზავრები")) || 0;
    const container = document.getElementById("passenger-inputs");

    for (let i = 1; i <= passengerCount; i++) {
        const passengerDiv = document.createElement("div");
        passengerDiv.classList.add("passenger-block");
        passengerDiv.innerHTML = `
            <div class="passenger-info1">
                <h3>Passenger ${i}</h3>
                <div class="passenger-details">
                    <div class="seat-num">Seat: </div>
                    <input type="text" name="passengerName${i}" placeholder="First name" required>
                    <input type="text" name="passengerName${i}" placeholder="Last name" required>
                    <input type="text" name="passengerAge${i}" placeholder="Personal number" required>
                    <button class="seat-button" type="button">Choose Seat</button>
                </div>
            </div>    
        `;
        container.appendChild(passengerDiv);
    }

    const vagonModal = document.getElementById("vagonModal");
    const seatModal = document.getElementById("seatModal");

    let vagons = [];
    let currentPassenger = null;
    let seatSelectionActive = false;
    let selectedSeatsGlobal = new Set();
    (async () => {
        try {
            const res = await fetch(`https://railway.stepprojects.ge/api/vagons`);
            const allVagons = await res.json();
            vagons = allVagons.filter(v => v.trainId == selectedTrain.id);
            console.log("Vagons for this train:", vagons);
        } catch (err) {
            console.error("Error fetching vagons:", err);
        }
    })();

    document.getElementById("passenger-inputs").addEventListener("click", (e) => {
        if (!e.target.classList.contains("seat-button")) return;
        e.preventDefault();

        if (seatSelectionActive) {
            alert("Finish selecting the current passenger’s seat before choosing another.");
            return;
        }

        seatSelectionActive = true;
        currentPassenger = e.target.closest(".passenger-block");


        const vagonContainer = vagonModal.querySelector(".vagon-options");
        vagonContainer.innerHTML = "";

        vagons.forEach(v => {
            const btn = document.createElement("button");
            btn.textContent = v.name;
            btn.dataset.vagonId = v.id;
            vagonContainer.appendChild(btn);
        });

        vagonModal.style.display = "block";
    });

    vagonModal.querySelector(".close").addEventListener("click", () => {
        vagonModal.style.display = "none";
    });

    vagonModal.querySelector(".vagon-options").addEventListener("click", (e) => {
        e.preventDefault();
        const vagonId = e.target.dataset.vagonId;
        if (!vagonId) return;

        console.log("Selected vagon ID:", vagonId);
        vagonModal.style.display = "none";
        loadSeats(vagonId);
    });

    let seatsArr = [];
    function loadSeats(vagonId) {
        fetch(`https://railway.stepprojects.ge/api/getvagon/${vagonId}`)
            .then(res => res.json())
            .then(seats => {
                seatsArr = seats[0].seats.sort((a, b) => {
                    const matchA = a.number.match(/^(\d+)([A-Z])$/);
                    const matchB = b.number.match(/^(\d+)([A-Z])$/);
                    if (!matchA || !matchB) return a.number.localeCompare(b.number);
                    const numA = parseInt(matchA[1]);
                    const numB = parseInt(matchB[1]);
                    const letterA = matchA[2];
                    const letterB = matchB[2];
                    if (numA !== numB) return numA - numB;
                    return letterA.localeCompare(letterB);
                });

                let seat1 = document.getElementById("seat-option1");
                let seat2 = document.getElementById("seat-option2");
                seat1.innerHTML = "";
                seat2.innerHTML = "";

                seatsArr.forEach((seat, i) => {
                    const btn = document.createElement("button");
                    btn.classList.add("seat-button-option");
                    btn.textContent = seat.number;
                    btn.dataset.seatId = seat.seatId;
                    btn.dataset.status = seat.status;

                    if (seat.isOccupied || selectedSeatsGlobal.has(seat.seatId)) {
                        btn.disabled = true;
                        btn.style.backgroundColor = seat.isOccupied ? "var(--primary-dark)" : "#df82cd";
                    }

                    if (currentPassenger.dataset.seatId === seat.seatId) {
                        btn.classList.add("selected");
                        btn.disabled = false;
                        btn.style.backgroundColor = "";
                    }

                    if (i < 20) seat1.appendChild(btn);
                    else seat2.appendChild(btn);
                });

                seatModal.style.display = "block";
            })
            .catch(err => console.error("Error fetching seats:", err));

        }

    document.getElementById("seatModal").addEventListener("click", (e) => {
        if (!e.target.classList.contains("seat-button-option")) return;
        e.preventDefault();
        if (!currentPassenger) return;

        const seatBtn = e.target;
        const seatDisplay = currentPassenger.querySelector(".seat-num");
        const seatId = seatBtn.dataset.seatId;

        const previousSeatId = currentPassenger.dataset.seatId;
        if (previousSeatId && previousSeatId !== seatId) {
            selectedSeatsGlobal.delete(previousSeatId);
            const prevBtn = document.querySelector(`.seat-button-option[data-seat-id="${previousSeatId}"]`);
            if (prevBtn) {
                prevBtn.classList.remove("selected");
                prevBtn.disabled = false;
                prevBtn.style.backgroundColor = "";
            }
            delete currentPassenger.dataset.seatObj;
        }

        if (seatBtn.classList.contains("selected")) {
            seatBtn.classList.remove("selected");
            seatDisplay.textContent = "Seat: ";
            delete currentPassenger.dataset.seatId;
            delete currentPassenger.dataset.seatObj;
            selectedSeatsGlobal.delete(seatId);
        } else {
            seatBtn.classList.add("selected");
            seatDisplay.textContent = `Seat: ${seatBtn.textContent}`;
            currentPassenger.dataset.seatId = seatId;

            const seatData = seatsArr.find(s => s.seatId === seatId);
            currentPassenger.dataset.seatObj = JSON.stringify(seatData);


            selectedSeatsGlobal.add(seatId);

            document.querySelectorAll(".passenger-block").forEach(passenger => {
                if (passenger !== currentPassenger && passenger.dataset.seatId === seatId) {
                    delete passenger.dataset.seatId;
                    delete passenger.dataset.seatObj;
                    passenger.querySelector(".seat-num").textContent = "Seat: ";
                }
            });
        }

        let priceDetails = document.getElementsByClassName("price")[0];
        let totalPrice = 0;
        document.querySelectorAll(".passenger-block").forEach(passenger => {
            if (passenger.dataset.seatObj) {
                const seat = JSON.parse(passenger.dataset.seatObj);
                totalPrice += seat.price;
            }
        });
        console.log("Total Price:", totalPrice);
        priceDetails.innerHTML = ``;
        priceDetails.innerHTML = `
            <div id="categories">
                <h4>seat</h4>
                <h4>price</h4>
            </div>
            <div id="chosenSeats"></div>
            <div class="total">
                <p>total: </p>
                <p>${totalPrice}₾</p>
            </div>
            <button id="proceed-button">Proceed to Payment</button>
        </div>            
        `;
        const chosenSeatsContainer = document.getElementById("chosenSeats");
        chosenSeatsContainer.innerHTML = "";


        document.querySelectorAll(".passenger-block").forEach(passenger => {
            if (passenger.dataset.seatObj) {
                const seat = JSON.parse(passenger.dataset.seatObj);
                const row = document.createElement("div");
                row.innerHTML = `
                    <div class="seat-row">
                        <p>${seat.number}</p>
                        <p>${seat.price}₾</p>
                    </div>
                `;
                chosenSeatsContainer.appendChild(row);
            }
        });

        sessionStorage.setItem("totalPrice", totalPrice);

    });

    seatModal.querySelector(".close").addEventListener("click", () => {
        seatModal.style.display = "none";
        seatSelectionActive = false;
        currentPassenger = null;

        let priceButton = document.getElementById("proceed-button");
        priceButton.addEventListener("click", (e) => {
            e.preventDefault();
            let dateValue = sessionStorage.getItem("dateValue")
            const ticketData = {
            trainId: selectedTrain.id,
            date: dateValue,
            email: document.getElementById("email-input").value,
            phoneNumber: document.getElementById("phone-input").value,
            people: [] 
            };

            document.querySelectorAll(".passenger-block").forEach(passenger => {
            const seatId = passenger.dataset.seatId || null;
            const inputs = passenger.querySelectorAll('input');

            const person = {
                seatId: seatId,
                name: inputs[0].value,
                surname: inputs[1].value,
                idNumber: inputs[2].value,
                status: "isOccupied", 
                payoutCompleted: false
            };
            ticketData.people.push(person);
            });

            document.querySelectorAll(".passenger-block").forEach((passenger, index) => {
                const seatName = passenger.dataset.seatObj ? JSON.parse(passenger.dataset.seatObj).number : "—";
                sessionStorage.setItem(`passengerSeatName${index + 1}`, seatName);
                console.log(`Saved seat name for passenger ${index + 1}: ${seatName}`);
            });
            sessionStorage.setItem("ticketData", JSON.stringify(ticketData));
            sessionStorage.setItem("email", document.getElementById("email-input").value)
            sessionStorage.setItem("phone", document.getElementById("phone-input").value)
            alert("Proceeding to payment...");
            location.href = "index4.html";
            
        })
    });

});
