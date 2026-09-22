"use strict";

/* ==========================================
   PENROSE PARTICLES
   GLOBAL AUDIENCE MAP
   ========================================== */


/* ------------------------------------------
   GOOGLE ANALYTICS DATA
   ------------------------------------------ */

const viewers = [

    {
        city: "Ashburn",
        region: "Virginia",
        country: "USA",
        lat: 39.0438,
        lng: -77.4874,
        users: 25
    },

    {
        city: "New York",
        region: "New York",
        country: "USA",
        lat: 40.7128,
        lng: -74.0060,
        users: 14
    },

    {
        city: "Aspen",
        region: "Colorado",
        country: "USA",
        lat: 39.1911,
        lng: -106.8175,
        users: 4
    },

    {
        city: "Dublin",
        region: "County Dublin",
        country: "Ireland",
        lat: 53.3498,
        lng: -6.2603,
        users: 2
    },

    {
        city: "Glenview",
        region: "Illinois",
        country: "USA",
        lat: 42.0698,
        lng: -87.7878,
        users: 2
    },

    {
        city: "Council Bluffs",
        region: "Iowa",
        country: "USA",
        lat: 41.2619,
        lng: -95.8608,
        users: 2
    },

    {
        city: "Murphy",
        region: "North Carolina",
        country: "USA",
        lat: 35.0876,
        lng: -84.0346,
        users: 2
    },

    {
        city: "Gallipolis",
        region: "Ohio",
        country: "USA",
        lat: 38.8098,
        lng: -82.2024,
        users: 2
    },

    {
        city: "Prineville",
        region: "Oregon",
        country: "USA",
        lat: 44.2998,
        lng: -120.8345,
        users: 2
    },

    {
        city: "Ridgeland",
        region: "South Carolina",
        country: "USA",
        lat: 32.4807,
        lng: -80.9804,
        users: 2
    },

    {
        city: "Bayreuth",
        region: "Bavaria",
        country: "Germany",
        lat: 49.9456,
        lng: 11.5713,
        users: 1
    },

    {
        city: "Reedley",
        region: "California",
        country: "USA",
        lat: 36.5963,
        lng: -119.4504,
        users: 1
    },

    {
        city: "San Jose",
        region: "California",
        country: "USA",
        lat: 37.3382,
        lng: -121.8863,
        users: 1
    },

    {
        city: "Aurora",
        region: "Colorado",
        country: "USA",
        lat: 39.7294,
        lng: -104.8319,
        users: 1
    },

    {
        city: "Gunnison",
        region: "Colorado",
        country: "USA",
        lat: 38.5458,
        lng: -106.9253,
        users: 1
    },

    {
        city: "Stamford",
        region: "Connecticut",
        country: "USA",
        lat: 41.0534,
        lng: -73.5387,
        users: 1
    },

    {
        city: "Bridgeville",
        region: "Delaware",
        country: "USA",
        lat: 38.7426,
        lng: -75.6044,
        users: 1
    },

    {
        city: "LaBelle",
        region: "Florida",
        country: "USA",
        lat: 26.7617,
        lng: -81.4384,
        users: 1
    },

    {
        city: "Monticello",
        region: "Florida",
        country: "USA",
        lat: 30.5452,
        lng: -83.8702,
        users: 1
    },

    {
        city: "Ocala",
        region: "Florida",
        country: "USA",
        lat: 29.1872,
        lng: -82.1401,
        users: 1
    },

    {
        city: "Sebastian",
        region: "Florida",
        country: "USA",
        lat: 27.8164,
        lng: -80.4706,
        users: 1
    },

    {
        city: "Cairo",
        region: "Georgia",
        country: "USA",
        lat: 30.8774,
        lng: -84.2013,
        users: 1
    },

    {
        city: "Metter",
        region: "Georgia",
        country: "USA",
        lat: 32.3971,
        lng: -82.0601,
        users: 1
    },

    {
        city: "Sparta",
        region: "Georgia",
        country: "USA",
        lat: 33.2757,
        lng: -82.9763,
        users: 1
    },

    {
        city: "Unadilla",
        region: "Georgia",
        country: "USA",
        lat: 32.2618,
        lng: -83.7366,
        users: 1
    },

    {
        city: "Rajkot",
        region: "Gujarat",
        country: "India",
        lat: 22.3039,
        lng: 70.8022,
        users: 1
    },

    {
        city: "Glenns Ferry",
        region: "Idaho",
        country: "USA",
        lat: 42.9549,
        lng: -115.3009,
        users: 1
    },

    {
        city: "Chicago",
        region: "Illinois",
        country: "USA",
        lat: 41.8781,
        lng: -87.6298,
        users: 1
    },

    {
        city: "Bloomington",
        region: "Indiana",
        country: "USA",
        lat: 39.1653,
        lng: -86.5264,
        users: 1
    },

    {
        city: "Columbia City",
        region: "Indiana",
        country: "USA",
        lat: 41.1573,
        lng: -85.4883,
        users: 1
    },

    {
        city: "Crawfordsville",
        region: "Indiana",
        country: "USA",
        lat: 40.0412,
        lng: -86.8745,
        users: 1
    },

    {
        city: "Paoli",
        region: "Indiana",
        country: "USA",
        lat: 38.5562,
        lng: -86.4683,
        users: 1
    },

    {
        city: "Pendleton",
        region: "Indiana",
        country: "USA",
        lat: 40.0045,
        lng: -85.7466,
        users: 1
    },

    {
        city: "Scottsburg",
        region: "Indiana",
        country: "USA",
        lat: 38.6856,
        lng: -85.7702,
        users: 1
    },

    {
        city: "Sheridan",
        region: "Indiana",
        country: "USA",
        lat: 40.1350,
        lng: -86.2205,
        users: 1
    },

    {
        city: "Des Moines",
        region: "Iowa",
        country: "USA",
        lat: 41.5868,
        lng: -93.6250,
        users: 1
    },

    {
        city: "Danville",
        region: "Kentucky",
        country: "USA",
        lat: 37.6456,
        lng: -84.7722,
        users: 1
    },

    {
        city: "Louisville",
        region: "Kentucky",
        country: "USA",
        lat: 38.2527,
        lng: -85.7585,
        users: 1
    },

    {
        city: "Vanceburg",
        region: "Kentucky",
        country: "USA",
        lat: 38.5992,
        lng: -83.3188,
        users: 1
    },

    {
        city: "Williamsburg",
        region: "Kentucky",
        country: "USA",
        lat: 36.7434,
        lng: -84.1597,
        users: 1
    },

    {
        city: "Winchester",
        region: "Kentucky",
        country: "USA",
        lat: 37.9901,
        lng: -84.1797,
        users: 1
    },

    {
        city: "Mumbai",
        region: "Maharashtra",
        country: "India",
        lat: 19.0760,
        lng: 72.8777,
        users: 1
    },

    {
        city: "Rumford",
        region: "Maine",
        country: "USA",
        lat: 44.5537,
        lng: -70.5509,
        users: 1
    },

    {
        city: "Windham",
        region: "Maine",
        country: "USA",
        lat: 43.8342,
        lng: -70.4384,
        users: 1
    },

    {
        city: "Hampstead",
        region: "Maryland",
        country: "USA",
        lat: 39.6048,
        lng: -76.8494,
        users: 1
    },

    {
        city: "Worcester",
        region: "Massachusetts",
        country: "USA",
        lat: 42.2626,
        lng: -71.8023,
        users: 1
    },

    {
        city: "Chesaning",
        region: "Michigan",
        country: "USA",
        lat: 43.1847,
        lng: -84.1149,
        users: 1
    },

    {
        city: "Howard City",
        region: "Michigan",
        country: "USA",
        lat: 43.3956,
        lng: -85.4678,
        users: 1
    },

    {
        city: "Lawton",
        region: "Michigan",
        country: "USA",
        lat: 42.1673,
        lng: -85.8467,
        users: 1
    },

    {
        city: "Perry",
        region: "Michigan",
        country: "USA",
        lat: 42.8264,
        lng: -84.2194,
        users: 1
    },

    {
        city: "Perryville",
        region: "Missouri",
        country: "USA",
        lat: 37.7242,
        lng: -89.8612,
        users: 1
    },

    {
        city: "Keene",
        region: "New Hampshire",
        country: "USA",
        lat: 42.9337,
        lng: -72.2781,
        users: 1
    },

    {
        city: "Santa Fe",
        region: "New Mexico",
        country: "USA",
        lat: 35.6870,
        lng: -105.9378,
        users: 1
    },

    {
        city: "Elmira",
        region: "New York",
        country: "USA",
        lat: 42.0898,
        lng: -76.8077,
        users: 1
    },

    {
        city: "Hamburg",
        region: "New York",
        country: "USA",
        lat: 42.7159,
        lng: -78.8295,
        users: 1
    },

    {
        city: "Irvington",
        region: "New York",
        country: "USA",
        lat: 41.0392,
        lng: -73.8682,
        users: 1
    },

    {
        city: "Dunn",
        region: "North Carolina",
        country: "USA",
        lat: 35.3063,
        lng: -78.6089,
        users: 1
    },

    {
        city: "Lincolnton",
        region: "North Carolina",
        country: "USA",
        lat: 35.4737,
        lng: -81.2545,
        users: 1
    },

    {
        city: "Weaverville",
        region: "North Carolina",
        country: "USA",
        lat: 35.6971,
        lng: -82.5607,
        users: 1
    },

    {
        city: "Marl",
        region: "North Rhine-Westphalia",
        country: "Germany",
        lat: 51.6567,
        lng: 7.0904,
        users: 1
    },

    {
        city: "East Liverpool",
        region: "Ohio",
        country: "USA",
        lat: 40.6187,
        lng: -80.5773,
        users: 1
    },

    {
        city: "Minford",
        region: "Ohio",
        country: "USA",
        lat: 38.8584,
        lng: -82.8621,
        users: 1
    },

    {
        city: "Springfield",
        region: "Ohio",
        country: "USA",
        lat: 39.9242,
        lng: -83.8088,
        users: 1
    },

    {
        city: "Waverly",
        region: "Ohio",
        country: "USA",
        lat: 39.1267,
        lng: -82.9855,
        users: 1
    },

    {
        city: "Carnot-Moon",
        region: "Pennsylvania",
        country: "USA",
        lat: 40.5184,
        lng: -80.2177,
        users: 1
    },

    {
        city: "Erie",
        region: "Pennsylvania",
        country: "USA",
        lat: 42.1292,
        lng: -80.0851,
        users: 1
    },

    {
        city: "Montreal",
        region: "Quebec",
        country: "Canada",
        lat: 45.5017,
        lng: -73.5673,
        users: 1
    },

    {
        city: "Providence",
        region: "Rhode Island",
        country: "USA",
        lat: 41.8240,
        lng: -71.4128,
        users: 1
    },

    {
        city: "Shanghai",
        region: "Shanghai",
        country: "China",
        lat: 31.2304,
        lng: 121.4737,
        users: 1
    },

    {
        city: "Karachi",
        region: "Sindh",
        country: "Pakistan",
        lat: 24.8607,
        lng: 67.0011,
        users: 1
    },

    {
        city: "Sao Jose dos Campos",
        region: "State of Sao Paulo",
        country: "Brazil",
        lat: -23.2237,
        lng: -45.9009,
        users: 1
    },

    {
        city: "Amarillo",
        region: "Texas",
        country: "USA",
        lat: 35.2219,
        lng: -101.8313,
        users: 1
    },

    {
        city: "Dallas",
        region: "Texas",
        country: "USA",
        lat: 32.7767,
        lng: -96.7970,
        users: 1
    },

    {
        city: "McKinney",
        region: "Texas",
        country: "USA",
        lat: 33.1972,
        lng: -96.6398,
        users: 1
    },

    {
        city: "San Antonio",
        region: "Texas",
        country: "USA",
        lat: 29.4241,
        lng: -98.4936,
        users: 1
    },

    {
        city: "Muhlhausen",
        region: "Thuringia",
        country: "Germany",
        lat: 51.2082,
        lng: 10.4584,
        users: 1
    },

    {
        city: "Alexandria",
        region: "Virginia",
        country: "USA",
        lat: 38.8048,
        lng: -77.0469,
        users: 1
    },

    {
        city: "Bristol",
        region: "Virginia",
        country: "USA",
        lat: 36.5965,
        lng: -82.1885,
        users: 1
    },

    {
        city: "Fort Gregg-Adams",
        region: "Virginia",
        country: "USA",
        lat: 37.2449,
        lng: -77.3467,
        users: 1
    },

    {
        city: "Kilmarnock",
        region: "Virginia",
        country: "USA",
        lat: 37.7104,
        lng: -76.3797,
        users: 1
    },

    {
        city: "Moses Lake",
        region: "Washington",
        country: "USA",
        lat: 47.1301,
        lng: -119.2781,
        users: 1
    },

    {
        city: "Elkins",
        region: "West Virginia",
        country: "USA",
        lat: 38.9259,
        lng: -79.8467,
        users: 1
    },

    {
        city: "Lewisburg",
        region: "West Virginia",
        country: "USA",
        lat: 37.8018,
        lng: -80.4456,
        users: 1
    }

];


/* ------------------------------------------
   CHECK LEAFLET
   ------------------------------------------ */

if (typeof L === "undefined") {

    document.getElementById("map").innerHTML = `
        <div style="
            color:white;
            padding:40px;
            font-family:Arial,sans-serif;
        ">
            The map library could not load.
            Check your internet connection.
        </div>
    `;

    throw new Error("Leaflet failed to load.");
}


/* ------------------------------------------
   CREATE MAP
   ------------------------------------------ */

const map = L.map("map", {

    zoomControl: true,

    minZoom: 2,

    maxZoom: 15,

    worldCopyJump: true

});


/* ------------------------------------------
   OPENSTREETMAP
   ------------------------------------------ */

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {

        maxZoom: 19,

        attribution:
            "&copy; OpenStreetMap contributors"

    }
).addTo(map);


/* ------------------------------------------
   MARKER SIZE
   ------------------------------------------ */

function markerRadius(users) {

    return 4 + Math.sqrt(users) * 3.5;

}


/* ------------------------------------------
   CREATE MARKERS
   ------------------------------------------ */

const markerGroup = L.featureGroup();


viewers.forEach(function (viewer) {

    const marker = L.circleMarker(
        [viewer.lat, viewer.lng],
        {
            radius: markerRadius(viewer.users),

            // electric-blue edge
            color: "#79cfff",

            weight:
                viewer.users > 2 ? 1.5 : 1,

            opacity: 0.95,

            // bright particle center
            fillColor: "#168cff",

            fillOpacity:
                viewer.users > 2 ? 0.85 : 0.65
        }
    );


    /* ---------- POPUP ---------- */

    marker.bindPopup(`

        <div class="popup-city">
            ${viewer.city}
        </div>

        <div class="popup-region">
            ${viewer.region},
            ${viewer.country}
        </div>

        <div class="popup-users">

            <strong>
                ${viewer.users}
            </strong>

            active
            ${viewer.users === 1 ? "user" : "users"}

        </div>

    `);


    /* ---------- HOVER ---------- */

    marker.on(
        "mouseover",
        function () {

            this.setStyle({
                color: "#d9f4ff",
                fillColor: "#5cc8ff",
                fillOpacity: 1,
                weight: 2.5
            });

            this.openPopup();
        }
    );


    marker.on(
        "mouseout",
        function () {

            this.setStyle({
                color: "#79cfff",
                fillColor: "#168cff",

                fillOpacity:
                    viewer.users > 2
                        ? 0.85
                        : 0.65,

                weight:
                    viewer.users > 2
                        ? 1.5
                        : 1
            });
        }
    );


    marker.addTo(markerGroup);

});


/* ------------------------------------------
   ADD MARKERS TO MAP
   ------------------------------------------ */

markerGroup.addTo(map);


/* ------------------------------------------
   CITY COUNT
   ------------------------------------------ */

const cityCount =
    document.getElementById("cityCount");

cityCount.textContent =
    viewers.length;


/* ------------------------------------------
   FIT MAP TO ALL LOCATIONS
   ------------------------------------------ */

map.fitBounds(
    markerGroup.getBounds(),
    {

        paddingTopLeft:
            [80, 100],

        paddingBottomRight:
            [80, 80],

        maxZoom:
            4

    }
);


/* ------------------------------------------
   FIX MAP SIZE AFTER PAGE LOAD
   ------------------------------------------ */

window.addEventListener(
    "load",
    function () {

        setTimeout(
            function () {

                map.invalidateSize();

            },
            100
        );

    }
);


/* ------------------------------------------
   FIX MAP WHEN WINDOW RESIZES
   ------------------------------------------ */

window.addEventListener(
    "resize",
    function () {

        map.invalidateSize();

    }
);


console.log(
    "Penrose Particles map loaded:",
    viewers.length,
    "cities"
);