window.addEventListener('DOMContentLoaded', function () {
    const trainDiv = document.getElementById("trainTable");
    let popularityData = {};

    fetch("https://railway.stepprojects.ge/api/departures")
    .then((response) => response.json())
    .then((data) => {
        let wantedTrains = [];

        data.forEach((item) => {
        if (
            item.source === sessionStorage.getItem("საიდან") &&
            item.destination === sessionStorage.getItem("სად") &&
            item.date === sessionStorage.getItem("კვირისდღე")
        ) {
            wantedTrains.push(...item.trains);
        }
        });


        let tr = "";
        
    if (wantedTrains.length > 0) {
    wantedTrains.forEach((i) => {
        tr += `
    <div class="train-card">
        <div class="train-info">
        <h2>#${i.number}</h2>
        <h3>${i.name}</h3>
        </div>

        <div class="route-from">
        <h2>${i.from}</h2>
        <h3>${i.departure}</h3>                    
        </div>

        <div class="route-to">
        <h2>${i.to}</h2>
        <h3>${i.arrive}</h3>               
        </div>

        <div class="train-actions">
        <button class="btn">Select</button>
        <div id="popularity-${i.id}"></div>
        </div>
    </div>
        `;
    });
    } else {
    alert("ვერ მოიძებნა");
    }

        trainDiv.innerHTML = tr;

        const btns = document.querySelectorAll(".btn");
        console.log(btns);

        btns.forEach((btn, index) =>
        btn.addEventListener("click", function () {
            window.location.href = "./index3.html";

            sessionStorage.setItem("indexOfBtn", index);
            sessionStorage.setItem("trainsArray", JSON.stringify(wantedTrains));
        })
        );

        wantedTrains.forEach((train) => {
        const trainId = train.id;
        fetch(`https://railway.stepprojects.ge/api/trains/${trainId}`)
            .then((res) => res.json())
            .then((data) => {
            let booked = 0;
            let total = 0;

            let vagonPromises = data.vagons.map((vagon) => {
                return fetch(
                `https://railway.stepprojects.ge/api/getvagon/${vagon.id}`
                )
                .then((res) => res.json())
                .then((vagonData) => {
                    vagonData[0].seats.forEach((seat) => {
                    total++;
                    if (seat.isOccupied) booked++;
                    });
                });
            });

            Promise.all(vagonPromises).then(() => {
                const percent = total > 0 ? Math.round((booked / total) * 100) : 0;
                popularityData[trainId] = { booked, total, percent };

                const percentCell = document.querySelector(
                `#popularity-${trainId}`
                );
                if (percentCell) {
                const percent = popularityData[train.id].percent;
                percentCell.innerHTML = `
                <div style="width: 100px; padding: 5px; background: var(--white); border-radius: 5px; border: 1px solid #a891a6ff;">
                    <div style="width: ${percent}%; background: ${
                    percent > 80 ? "#2d0d36ff" : percent > 50 ? "#7c088cff" : "#ff76e6ff"
                }; height: 12px;"></div>
                </div>
                <p>${percent}% occupied</p>
                `;
                } 
            });
            });
        });
    })
    .catch((err) => {
    alert('ERROR', err)
    });

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


});