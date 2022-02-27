const get_data = new XMLHttpRequest();
var age_data = [];
var data = [];
const button = document.querySelector(".btn-show-data");

//funkcja uruchamijąca się po naciśnięciu przyciku
button.onclick = function loadData() {
   document.querySelector(".loader").style.display = "block";
   //opóźnienie zostało dodane na potrzeby prezentacji loadera, wcześniej dane pobierały się tak szybko że nie dało się zobaczyć efektu
   setTimeout(() => {
      get_data.onreadystatechange = function() {
         if (get_data.readyState === 4 && get_data.status === 200) {
            data = JSON.parse(get_data.responseText);
            for (const element of data.results) 
               age_data.push(element.dob.age);
            showChart();
            showTable();
         }
      };
      get_data.open("GET", "https://randomuser.me/api/?results=1000&gender=male&nat=fr", true);
      get_data.send();
      document.querySelector(".loader").style.display = "none";
   }, 2000);
};

//funkcja generująca wykres
function showChart() {
   const labels = ['20-29', '30-39', '40-49', '50-59', '60-69', '70-79'];
   const data = {
      labels: labels,
      datasets: [{
        label: 'Liczba mężczyzn według wieku',
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
        data: [age_sort(20), age_sort(30), age_sort(40), age_sort(50), age_sort(60), age_sort(70)]
      }]
   };
   const config = {
      type: 'bar',
      data: data,
      options: {}
   };
   const main_chart = new Chart(
      document.getElementById('age-chart'),
      config
   );
};

//funkcja grupująca wartość wieku
const age_sort = (age) => {
   var count = 0;
   for(const element of age_data) {
      if (element > age-1 && element < age+10) count++;
   }
   return count;
};

function showTable() {

   //wyszukanie indeksów 10 najstarszych osób
   const top_ten = [];
   for(let i=0; i<10; i++) {
      let index = Math.max.apply(Math, age_data);
      top_ten.push(age_data.findIndex(x => x === index));
      age_data[age_data.findIndex(x => x === index)] = 0;
   };

   //wyświetlenie tabeli z 10 najstarszymi osobami
   const table = document.querySelector('#people_table');
   let line = "<tr><th>Imię</th><th>Nazwisko</th><th>Wiek</th></tr>";
   top_ten.forEach(element => {
      line += `<tr>
      <td>${data.results[element].name.first}</td>
      <td>${data.results[element].name.last}</td>
      <td>${data.results[element].dob.age}</td>
      </tr>`;
   });
   table.innerHTML = line;
};

function backgroundValue() {
   if(sessionStorage.getItem("count")) {
      let refresh_count = sessionStorage.getItem("count");
      refresh_count ++;
      if(sessionStorage.getItem("count") == 5) {
         document.querySelector(".text-content-2").style.background = "rgba(75, 192, 192, 0.3)";
         sessionStorage.removeItem("count");
         refresh_count = 1;
      }
      sessionStorage.removeItem("count");
      sessionStorage.setItem("count", refresh_count)
   }
   else {
      sessionStorage.setItem("count", 1);
   }
};