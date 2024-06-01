const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mockAPIResponse = require('./mockAPI.js');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.static('dist'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Environment variables
const username = process.env.USERNAME;
const weatherbitKey = process.env.WEATHERBIT_KEY;
const pixabayKey = process.env.PIXABAY_KEY;
const PORT = process.env.PORT

// Routes
app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
    // res.sendFile(path.resolve('src/client/views/index.html'));
});

app.get('/test', function (req, res) {
    res.send(mockAPIResponse);
});

// Geonames API
const baseUrlGeonames = 'http://api.geonames.org/searchJSON';

// Weatherbit API 
const baseUrlWeatherbit = 'https://api.weatherbit.io/v2.0/current';

// Pixabay API 
const baseUrlPixabay = 'https://pixabay.com/api';
app.post('/add', async (req, res) => {

    const geonamesAPI = `${baseUrlGeonames}?q=${req.body.location}&maxRows=10&username=${username}`;

    try {

        const geonamesResponse =  await fetch(geonamesAPI);
        const geonamesData =  await geonamesResponse.json();

        const lng = geonamesData.geonames[0].lng;
        const lat = geonamesData.geonames[0].lat;
        const destination = geonamesData.geonames[0].name;
        
        const weatherbitAPI = `${baseUrlWeatherbit}?lat=${lat}&lon=${lng}&key=${weatherbitKey}`;
        const weatherbitResponse =  await fetch(weatherbitAPI);
        const weatherbitData =  await weatherbitResponse.json();
        const weather_temp = weatherbitData.data[0].app_temp;
        const icon = weatherbitData.data[0].weather.icon;
        const weather_icon = `https://www.weatherbit.io/static/img/icons/${icon}.png`

        const pixabayAPI = `${baseUrlPixabay}/?key=${pixabayKey}&q=${req.body.location}&image_type=photo`;
        const pixabayResponse =  await fetch(pixabayAPI);
        const pixabayData =  await pixabayResponse.json();
        const image_location =  pixabayData.hits[0].webformatURL;

        res.send({ destination, weather_temp, weather_icon, image_location});

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
app.listen(PORT, function () {
    console.log(`Travel App listening on port ${PORT}`);
});
