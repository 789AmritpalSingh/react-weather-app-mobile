// Changing the background images of the card element according to the weather
const public_url = process.env.PUBLIC_URL
const backgroundWeatherImages = {
    Clear: public_url + '/images/clear1.jpg',
    Clouds: public_url + '/images/cloudy.jpg',
    Rain: public_url + '/images/rainy.jpg',
    Snow: public_url + '/images/snowy.jpg',
    Thunderstorm: public_url + '/images/thunderstorm.jpg',
    Mist: public_url + '/images/mist.jpg',
    // Smoke: public_url + '/images/smoke.jpg',
    Haze: public_url + '/images/haze.jpg',
    // Dust: public_url + '/images/dust.jpg',
    Fog: public_url + '/images/foggy.jpg',
    // Sand: public_url + '/images/sand.jpg',
    // Ash: public_url + '/images/ash.jpg',
    // Squall: public_url + './images/squall.jpg',
    Tornado: public_url + '/images/tornado.jpg',
  };
  
export default backgroundWeatherImages;