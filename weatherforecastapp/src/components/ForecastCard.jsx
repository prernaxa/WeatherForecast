import React from 'react';

const ForecastCard = ({ data }) => {
  if (!data || !data.weather || data.weather.length === 0) return null;

  const date = new Date(data.dt_txt).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-center space-y-2">
      <p className="font-semibold">{date}</p>
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt={data.weather[0].description}
        className="mx-auto h-16 w-16"
      />
      <p className="text-blue-600 text-sm">{data.weather[0].main}</p>
      <p className="text-xl font-bold text-gray-700">{Math.round(data.main.temp)}°C</p>
    </div>
  );
};

export default ForecastCard;
