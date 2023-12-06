import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { WEATHER_API_KEY } from '@env';

export const useGetWeather = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const res = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError('could not fetch weather');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherData(location.latitude, location.longitude);
    }
  }, [location]);

  return [loading, error, weather];
};
