const fetch = require('node-fetch');

async function handleSubmit(event) {
    event.preventDefault();

    console.log("::: Form Submitted :::");
    let location = document.getElementById('location').value;
    let departure = document.getElementById('date').value;

    // Caculate Day Difference
    // Get today's date
    const today = new Date();

    // Convert the input date to a Date object
    const targetDate = new Date(departure);

    // Calculate the difference in milliseconds
    const differenceInMs = targetDate.getTime() - today.getTime();

    // Convert the difference back to days
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

    // Init Data
    let data = {
        "location": location,
        "departure": departure
    }
    try {
        await fetch('/add', {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);

                document.getElementById('results_trip').classList.remove('results');
                document.getElementById('count_day').innerHTML = `Your trip will start ${differenceInDays} days from now`;
                document.getElementById('destination').innerHTML = `Location: ${result.destination}`;
                document.getElementById('current_weather').innerHTML = `Current weather: ${result.weather_temp} C°`;
                document.getElementById('weather_icon').src = result.weather_icon;
                document.getElementById('picture').innerHTML = "<p>Picture from destination</p>";
                document.getElementById('location_img').src = result.image_location;
            })
    }
    catch (error) {
        console.log("Error fetching data:", error)
    };
}

export { handleSubmit };
