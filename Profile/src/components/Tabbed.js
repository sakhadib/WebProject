// function Tabbed(){
//     return (
        
//         <div>
//             <div>
//                 <div id="London" class="city">
//                 <h2>London</h2>
//                 <p>London is the capital of England.</p>
//             </div>

//             <div id="Paris" class="city" style="display:none">
//                 <h2>Paris</h2>
//                 <p>Paris is the capital of France.</p>
//             </div>

//             <div id="Tokyo" class="city" style="display:none">
//                 <h2>Tokyo</h2>
//                 <p>Tokyo is the capital of Japan.</p>
//             </div>

//             <div class="w3-bar w3-black">
//                 <button class="w3-bar-item w3-button" onclick="openCity('London')">London</button>
//                 <button class="w3-bar-item w3-button" onclick="openCity('Paris')">Paris</button>
//                 <button class="w3-bar-item w3-button" onclick="openCity('Tokyo')">Tokyo</button>
//             </div>

//             {/* function openCity(cityName) {
//                 var i;
//                 var x = document.getElementsByClassName("city");
//                 for (i = 0; i < x.length; i++) {
//                     x[i].style.display = "none";
//                 }
//                 document.getElementById(cityName).style.display = "block";
//             } */}


//         </div>
//     );
// }

// export default Tabbed;



import { useState } from "react";

function Tabbed() {
  const [activeCity, setActiveCity] = useState("London");

  return (
    <div>
      <div
        id="London"
        className="city"
        style={{ display: activeCity === "London" ? "block" : "none" }}
      >
        <h2>London</h2>
        <p>London is the capital of England.</p>
      </div>

      <div
        id="Paris"
        className="city"
        style={{ display: activeCity === "Paris" ? "block" : "none" }}
      >
        <h2>Paris</h2>
        <p>Paris is the capital of France.</p>
      </div>

      <div
        id="Tokyo"
        className="city"
        style={{ display: activeCity === "Tokyo" ? "block" : "none" }}
      >
        <h2>Tokyo</h2>
        <p>Tokyo is the capital of Japan.</p>
      </div>

      <div className="w3-bar w3-black">
        <button
          className="w3-bar-item w3-button"
          onClick={() => setActiveCity("London")}
        >
          London
        </button>
        <button
          className="w3-bar-item w3-button"
          onClick={() => setActiveCity("Paris")}
        >
          Paris
        </button>
        <button
          className="w3-bar-item w3-button"
          onClick={() => setActiveCity("Tokyo")}
        >
          Tokyo
        </button>
      </div>
    </div>
  );
}

export default Tabbed;
