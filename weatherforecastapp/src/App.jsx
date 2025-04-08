import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    setHistory(storedHistory);
  }, []);

  const updateHistory = (cityName) => {
    let updated = [cityName, ...history.filter((c) => c.toLowerCase() !== cityName.toLowerCase())];
    if (updated.length > 5) updated = updated.slice(0, 5);
    setHistory(updated);
    localStorage.setItem('weatherHistory', JSON.stringify(updated));
  };

  const getWeather = async (cityName = city) => {
    if (!cityName) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      setWeather(data);
      updateHistory(cityName);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();
      const filtered = forecastData.list.filter((entry) => entry.dt_txt.includes('12:00:00'));
      setForecast(filtered);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') getWeather();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200 text-gray-800 px-4 py-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-6 tracking-tight">
          🌤 Weather Dashboard
        </h1>

        {/* Search + Refresh */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter city..."
            className="w-full sm:w-64 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-md border border-blue-300 focus:outline-none shadow-md"
          />
          <button
            onClick={() => getWeather()}
            className="px-6 py-2 bg-blue-600 text-black rounded-xl font-semibold shadow hover:bg-blue-700 transition"
          >
            Search
          </button>
          <button
            onClick={() => getWeather(city)}
            disabled={!weather}
            className={`px-6 py-2 rounded-xl font-semibold shadow transition ${
              weather ? 'bg-purple-500 hover:bg-purple-600 text-black' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Refresh 🔄
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {history.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  setCity(c);
                  getWeather(c);
                }}
                className="text-sm px-4 py-2 rounded-full bg-blue-100 text-black font-medium shadow hover:bg-blue-200 transition"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Loader */}
        {loading && <p className="text-blue-900">Loading...</p>}

        {/* Error */}
        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold mb-4">
            {error}
          </p>
        )}

        {/* Weather Now */}
        {weather && <WeatherCard weather={weather} />}

        {/* Forecast */}
        {forecast.length > 0 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <ForecastCard key={index} data={day} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
