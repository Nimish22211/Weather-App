import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [location, setLocation] = useState(null);
  const [details, setDetails] = useState(null);
  const [temp, setTemp] = useState('');
  const [cord, setCord] = useState(null)
  const [resCode, setResCode] = useState(null)
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
      const json = await response.json();
      console.log(response.status)
      setResCode(response.status)
      if (response.status !== 404) {
        setDetails(json);
        setTemp(json.main);
      }
    }

    const fetchCordData = async () => {
      const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${cord.lat}&lon=${cord.lon}&appid=${apiKey}`)
      const json = await response.json();
      setResCode(response.status)
      if (response.status !== 404) {
        setDetails(json);
        setTemp(json.main);
      }
    }
    if (resCode !== 404 && location) {
      setDetails(null)
      setTemp('')
      fetchData()
    }
    if (resCode !== 404 && cord) {
      setDetails(null)
      setTemp('')
      fetchCordData()
    }

  }, [location, cord])

  const handleSubmit = (e) => {
    setCord(null)
    e.preventDefault();
    setLocation(input);
    setInput('')
  }
  const convertToCelcius = (temp) => {
    return Math.floor(temp - 273.15);
  }

  const handleOnlocation = (e) => {
    setLocation(null)
    e.preventDefault()
    const sucessCallback = (position) => {
      setCord({ lat: position.coords.latitude, lon: position.coords.longitude })
    }
    const errorCallback = (err) => {
      alert(err)
    }
    navigator.geolocation.getCurrentPosition(sucessCallback, errorCallback)
  }
  let degOfwind = {}
  if (details) {
    let rotation = `rotate(${details.wind.deg}deg)`
    degOfwind = {
      transform: rotation,
      fontWeight: 800,
      marginLeft: '10px',
      fontSize: '30px'
    }
  }
  // console.log(details)
  if (resCode === 404) {
    return (
      <div>
        <header>Weather Forcast</header>
        <main style={{ textAlign: 'center', paddingTop: '50px' }}><h1>404 NOT FOUND!</h1><p>The weather of city you entered is not available</p></main>
      </div>
    )
  } else {
    return (
      <div className="App">
        <header>
          Weather Forcast
        </header>
        <main>
          <form>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Search weather of a city" />
            <div>
              <button onClick={handleSubmit}>Check Weather</button>
              <button className="btn-location" onClick={handleOnlocation}>Check for your location</button>
            </div>
          </form>

          <hr />
          {cord && <h1 className='location-name'>Weather of your location</h1>}
          {location && <h1 className='location-name'>Weather of {location.slice(0, 1).toUpperCase().concat(location.slice(1,))}</h1>}
          <div className="details">
            {!temp ? (
              <p> No data</p>
            ) : (
              <div className="temperature">
                <div className="head">
                  <div>
                    <h1>{convertToCelcius(temp.temp)} C</h1>
                    <p className="feelslike">Feels like {convertToCelcius(temp.feels_like)} C</p>
                  </div>
                  <div className="sub-description">
                    <p>
                      Max: {convertToCelcius(temp.temp_max)} C
                      <br />
                      Min: {convertToCelcius(temp.temp_min)} C
                    </p>
                  </div>
                </div>
                <div className="description">
                  <p>{temp && details.weather[0].description}</p>
                  <p>Wind Speed: {details.wind.speed}</p>
                  {details.wind.speed > 0 && <p className="wind-degree">Wind Direction: {details.wind.deg} <span style={degOfwind}>^</span></p>}
                </div>
              </div>
            )}
          </div>
        </main >
      </div >
    );
  }
}

export default App;
