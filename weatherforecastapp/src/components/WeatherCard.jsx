import React from 'react';

const WeatherCard = ({ weather }) => {
  const {
    name,
    main: { temp, humidity },
    wind: { speed },
    weather: weatherDetails,
  } = weather;

  const { icon, description, main } = weatherDetails[0];

  return (
    <div className="mt-6 mx-auto bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg p-6 w-full max-w-md text-center text-gray-800">
      <h2 className="text-3xl font-semibold mb-2">{name}</h2>

      <img
        src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
        alt={description}
        className="mx-auto mb-2"
      />

      <p className="text-lg capitalize">{description}</p>
      <p className="text-5xl font-bold text-blue-700 mt-2">{Math.round(temp)}°C</p>

      <div className="mt-4 text-sm space-y-1 text-gray-700">
        <p>☁️ Condition: {main}</p>
        <p>💧 Humidity: {humidity}%</p>
        <p>🌬 Wind Speed: {speed} km/h</p>
      </div>
    </div>
  );
};

export default WeatherCard;
