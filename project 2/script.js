window.addEventListener('DOMContentLoaded', function () {
  let goingFrom = document.getElementById('fromStation');
  let goingTo = document.getElementById('toStation');

  fetch("https://railway.stepprojects.ge/api/stations")
    .then(res => res.json())
    .then(stations => {
      stations.forEach(station => {
        let optionFrom = document.createElement("option");
        optionFrom.value = station.id;
        optionFrom.textContent = station.name;

        let optionTo = optionFrom.cloneNode(true);

        goingFrom.appendChild(optionFrom);
        goingTo.appendChild(optionTo);
      });
    })
    .catch(err => {
      console.error("Failed to load stations:", err);
    });

  function updateOptions() {
    const fromVal = goingFrom.value;
    const toVal = goingTo.value;

    Array.from(goingFrom.options).forEach(option => {
      if (option.value === "") return;
      option.disabled = option.value === toVal;
    });

    Array.from(goingTo.options).forEach(option => {
      if (option.value === "") return;
      option.disabled = option.value === fromVal;
    });
  }

  goingFrom.addEventListener('change', updateOptions);
  goingTo.addEventListener('change', updateOptions);


    function getGeorgianWeekDay(dateString){
      let days = [
          "კვირა",
          "ორშაბათი",
          "სამშაბათი",
          "ოთხშაბათი",
          "ხუთშაბათი",
          "პარასკევი",
          "შაბათი"
      ]
      let dayIndex = new Date(dateString).getDay()
      return days[dayIndex]
  }

  document.getElementById("bookingForm").addEventListener("submit", function(e){
    e.preventDefault();
    location.href = "index2.html";

    let fromInputValue = document.getElementById("fromStation").selectedOptions[0].textContent;
    let toInputValue = document.getElementById("toStation").selectedOptions[0].textContent;
    let dateValue = document.getElementById("date").value;
    let passengersValue = document.getElementById("passengers").value;

    sessionStorage.setItem("საიდან", fromInputValue);
    sessionStorage.setItem("სად", toInputValue);
    sessionStorage.setItem("კვირისდღე", getGeorgianWeekDay(dateValue));
    sessionStorage.setItem("dateValue", dateValue)
    sessionStorage.setItem("მგზავრები", passengersValue);

  });

    let dateInput = document.getElementById('date');
 
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;
    dateInput.setAttribute('min', minDate);



  const body = document.body;
  const trainImg = document.getElementById('train-img');
  const suitcaseImg = document.getElementById('pink-suitcase');
  const toggleBtn = document.getElementById('mode-toggle');

  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (trainImg) {
      if (body.classList.contains('dark-mode')) {
        trainImg.src = './images/depositphotos_562876254-stock-video-white-picture-of-train-on.jpg';
      } else {
        trainImg.src = './images/steam-train-concept-illustration_114360-12168.jpg';
      }
    }

    if (suitcaseImg) {
      if (body.classList.contains('dark-mode')) {
        suitcaseImg.src = './images/suitcase-drawing-black-and-white-clipart.png';
      } else {
        suitcaseImg.src = './images/Pastel Pink Travel Dream.png';
      }
    }
  })
});



