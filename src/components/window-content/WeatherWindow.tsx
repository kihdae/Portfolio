'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  MapPin,
  Calendar,
  Loader2,
} from 'lucide-react';

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    condition: string;
    icon: string;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

const WeatherIcon = ({
  condition,
  size = 'w-8 h-8',
  className = '',
}: {
  condition: string;
  size?: string;
  className?: string;
}) => {
  const baseClasses = `${size} ${className}`;

  switch (condition.toLowerCase()) {
    case 'sunny':
      return (
        <div className={`${baseClasses} relative`}>
          <Sun className='w-full h-full text-yellow-400' />
          {/* Cat eye glint */}
          <div className='absolute top-1 right-1 w-1 h-1 bg-white rounded-full opacity-80' />
        </div>
      );
    case 'partly cloudy':
    case 'cloudy':
      return (
        <div className={`${baseClasses} relative`}>
          <Cloud className='w-full h-full text-gray-300' />
          {/* Tiny cat ears on cloud */}
          <div className='absolute -top-1 left-2 w-2 h-1 bg-gray-300 rounded-t-full' />
          <div className='absolute -top-1 right-2 w-2 h-1 bg-gray-300 rounded-t-full' />
        </div>
      );
    case 'rainy':
      return (
        <div className={`${baseClasses} relative`}>
          <CloudRain className='w-full h-full text-blue-300' />
          {/* Rain drops as paw prints */}
          <div className='absolute bottom-0 left-1/4 w-1 h-2 bg-blue-300 rounded-full' />
          <div className='absolute bottom-0 right-1/4 w-1 h-2 bg-blue-300 rounded-full' />
        </div>
      );
    case 'snowy':
      return (
        <div className={`${baseClasses} relative`}>
          <CloudSnow className='w-full h-full text-blue-200' />
          {/* Snowflakes as tiny stars */}
          <div className='absolute bottom-0 left-1/3 w-1 h-1 bg-white rounded-full' />
          <div className='absolute bottom-0 right-1/3 w-1 h-1 bg-white rounded-full' />
        </div>
      );
    default:
      return <Cloud className={`${baseClasses} text-gray-300`} />;
  }
};

export default function WeatherWindow() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  // Get user's location and fetch weather data
  useEffect(() => {
    const fetchWeatherData = async (latitude: number, longitude: number) => {
      try {
        setLoadingState({ isLoading: true, error: null });

        const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        // Fallback to mock data if no API key is provided
        if (!API_KEY) {
          // Use mock data for demonstration
          const mockWeatherData: WeatherData = {
            location: 'Chicago, IL',
            current: {
              temperature: 72,
              condition: 'Partly Cloudy',
              icon: 'cloud-sun',
              feelsLike: 74,
              humidity: 65,
              windSpeed: 8,
            },
            forecast: [
              {
                day: 'Today',
                high: 78,
                low: 65,
                condition: 'Partly Cloudy',
                icon: 'cloud-sun',
              },
              {
                day: 'Tomorrow',
                high: 82,
                low: 68,
                condition: 'Sunny',
                icon: 'sun',
              },
              {
                day: 'Wednesday',
                high: 75,
                low: 62,
                condition: 'Cloudy',
                icon: 'cloud',
              },
              {
                day: 'Thursday',
                high: 70,
                low: 58,
                condition: 'Rainy',
                icon: 'cloud-rain',
              },
            ],
          };
          setWeatherData(mockWeatherData);
          setLoadingState({ isLoading: false, error: null });
          return;
        }

        // First, get the location name using reverse geocoding
        const geocodeResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
        );

        let cityName = 'Unknown Location';
        let countryCode = 'US';

        if (geocodeResponse.ok) {
          const geocodeData = await geocodeResponse.json();
          console.log('Geocoding response:', geocodeData);
          if (geocodeData.length > 0) {
            const location = geocodeData[0];
            cityName =
              location.name || location.local_names?.en || location.name;
            countryCode = location.country || 'US';
            console.log('Resolved location:', { cityName, countryCode });
          }
        } else {
          console.warn('Geocoding failed, trying alternative method');
          // Try alternative geocoding using a free service
          try {
            const altGeocodeResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );
            if (altGeocodeResponse.ok) {
              const altData = await altGeocodeResponse.json();
              console.log('Alternative geocoding response:', altData);
              if (altData.address) {
                cityName =
                  altData.address.city ||
                  altData.address.town ||
                  altData.address.village ||
                  altData.address.county ||
                  'Unknown';
                countryCode =
                  altData.address.country_code?.toUpperCase() || 'US';
                console.log('Alternative resolved location:', {
                  cityName,
                  countryCode,
                });
              }
            }
          } catch (error) {
            console.warn('Alternative geocoding also failed:', error);
          }
        }

        // Then get weather data
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        const currentWeather = data.list[0];

        const forecast = data.list
          .filter((item: any) => item.dt % 8 === 0) 
          .slice(0, 4) 
          .map((item: any) => {
            const date = new Date(item.dt * 1000);
            const dayNames = [
              'Today',
              'Tomorrow',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ];
            const dayName = dayNames[date.getDay()];

            return {
              day: dayName,
              high: Math.round(item.main.temp_max),
              low: Math.round(item.main.temp_min),
              condition: item.weather[0].main,
              icon: item.weather[0].main.toLowerCase(),
            };
          });

        const weatherData: WeatherData = {
          location: `${cityName}, ${countryCode}`,
          current: {
            temperature: Math.round(currentWeather.main.temp),
            condition: currentWeather.weather[0].main,
            icon: currentWeather.weather[0].main.toLowerCase(),
            feelsLike: Math.round(currentWeather.main.feels_like),
            humidity: currentWeather.main.humidity,
            windSpeed: Math.round(currentWeather.wind.speed),
          },
          forecast,
        };

        setWeatherData(weatherData);
        setLoadingState({ isLoading: false, error: null });
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoadingState({
          isLoading: false,
          error: 'Failed to load weather data. Please check your connection.',
        });
      }
    };

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log('Location obtained:', { latitude, longitude });
          fetchWeatherData(latitude, longitude);
        },
        error => {
          console.error('Geolocation error:', error);
          setLoadingState({
            isLoading: false,
            error:
              'Unable to get your location. Please enable location services.',
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000, 
        }
      );
    } else {
      setLoadingState({
        isLoading: false,
        error: 'Geolocation is not supported by this browser.',
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loadingState.isLoading) {
    return (
      <ScrollArea className='h-full'>
        <div className='p-6 space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-center space-y-4'
          >
            <div className='flex items-center justify-center'>
              <Loader2 className='w-8 h-8 animate-spin text-[var(--color-accent-primary)]' />
            </div>
            <div className='text-sm text-[var(--color-text-secondary)]'>
              Getting your location and weather data...
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    );
  }

  if (loadingState.error) {
    return (
      <ScrollArea className='h-full'>
        <div className='p-6 space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-center space-y-4'
          >
            <div className='text-lg font-medium text-[var(--color-text-primary)]'>
              Weather Unavailable
            </div>
            <div className='text-sm text-[var(--color-text-secondary)]'>
              {loadingState.error}
            </div>
            <div className='text-xs text-[var(--color-text-secondary)] italic'>
              you can still check the weather outside!
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    );
  }

  if (!weatherData) {
    return (
      <ScrollArea className='h-full'>
        <div className='p-6 space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-center space-y-4'
          >
            <div className='text-lg font-medium text-[var(--color-text-primary)]'>
              Weather Data Unavailable
            </div>
            <div className='text-sm text-[var(--color-text-secondary)]'>
              Unable to load weather information at this time.
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className='h-full'>
      <div className='p-6 space-y-6'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center space-y-2'
        >
          <div className='flex items-center justify-center gap-2 text-[var(--color-text-secondary)]'>
            <MapPin className='w-4 h-4' />
            <span className='text-sm font-medium'>{weatherData.location}</span>
          </div>
          <div className='text-xs text-[var(--color-text-secondary)]'>
            {currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className='border-subtle bg-subtle-gradient overflow-hidden relative'>
            <div className='absolute inset-0 opacity-5'>
              <div className='absolute top-4 right-4 w-8 h-6 bg-[var(--color-accent-primary)] rounded-full' />
              <div className='absolute top-6 right-6 w-4 h-4 bg-[var(--color-accent-primary)] rounded-full' />
              <div className='absolute top-6 right-2 w-4 h-4 bg-[var(--color-accent-primary)] rounded-full' />
            </div>

            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <div className='text-4xl font-bold text-[var(--color-text-primary)]'>
                    {weatherData.current.temperature}°
                  </div>
                  <div className='text-sm text-[var(--color-text-secondary)]'>
                    {weatherData.current.condition}
                  </div>
                  <div className='text-xs text-[var(--color-text-secondary)]'>
                    Feels like {weatherData.current.feelsLike}°
                  </div>
                </div>

                <motion.div
                  animate={{
                    rotate: weatherData.current.condition
                      .toLowerCase()
                      .includes('cloud')
                      ? [0, 2, -2, 0]
                      : 0,
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <WeatherIcon
                    condition={weatherData.current.condition}
                    size='w-16 h-16'
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='grid grid-cols-2 gap-4'
        >
          <Card className='border-subtle-ultra bg-subtle-card'>
            <CardContent className='p-4 text-center'>
              <div className='flex items-center justify-center gap-2 mb-2'>
                <Thermometer className='w-4 h-4 text-[var(--color-accent-primary)]' />
                <span className='text-xs text-[var(--color-text-secondary)]'>
                  Humidity
                </span>
              </div>
              <div className='text-lg font-semibold text-[var(--color-text-primary)]'>
                {weatherData.current.humidity}%
              </div>
            </CardContent>
          </Card>

          <Card className='border-subtle-ultra bg-subtle-card'>
            <CardContent className='p-4 text-center'>
              <div className='flex items-center justify-center gap-2 mb-2'>
                <Wind className='w-4 h-4 text-[var(--color-accent-primary)]' />
                <span className='text-xs text-[var(--color-text-secondary)]'>
                  Wind
                </span>
              </div>
              <div className='text-lg font-semibold text-[var(--color-text-primary)]'>
                {weatherData.current.windSpeed} mph
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className='border-subtle bg-subtle-gradient'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 mb-4'>
                <Calendar className='w-4 h-4 text-[var(--color-accent-primary)]' />
                <span className='text-sm font-medium text-[var(--color-text-primary)]'>
                  4-Day Forecast
                </span>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                {weatherData.forecast.map((day: any, index: number) => (
                  <motion.div
                    key={`${day.day}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    className='text-center space-y-2 p-3 rounded-lg border-subtle-ultra bg-subtle-card'
                  >
                    <div className='text-xs text-[var(--color-text-secondary)] font-medium'>
                      {day.day}
                    </div>

                    <div className='flex justify-center'>
                      <WeatherIcon condition={day.condition} size='w-8 h-8' />
                    </div>

                    <div className='space-y-1'>
                      <div className='text-sm font-semibold text-[var(--color-text-primary)]'>
                        {day.high}°
                      </div>
                      <div className='text-xs text-[var(--color-text-secondary)]'>
                        {day.low}°
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className='text-center'
        ></motion.div>
      </div>
    </ScrollArea>
  );
}
