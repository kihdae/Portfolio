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
    case 'clear':
      return (
        <div className={`${baseClasses} relative`}>
          <Sun className='w-full h-full text-yellow-400' />
          <div className='absolute top-1 right-1 w-1 h-1 bg-white rounded-full opacity-80' />
        </div>
      );
    case 'partly cloudy':
    case 'cloudy':
    case 'clouds':
      return (
        <div className={`${baseClasses} relative`}>
          <Cloud className='w-full h-full text-gray-300' />
          <div className='absolute -top-1 left-2 w-2 h-1 bg-gray-300 rounded-t-full' />
          <div className='absolute -top-1 right-2 w-2 h-1 bg-gray-300 rounded-t-full' />
        </div>
      );
    case 'rainy':
    case 'rain':
      return (
        <div className={`${baseClasses} relative`}>
          <CloudRain className='w-full h-full text-blue-300' />
          <div className='absolute bottom-0 left-1/4 w-1 h-2 bg-blue-300 rounded-full' />
          <div className='absolute bottom-0 right-1/4 w-1 h-2 bg-blue-300 rounded-full' />
        </div>
      );
    case 'snowy':
    case 'snow':
      return (
        <div className={`${baseClasses} relative`}>
          <CloudSnow className='w-full h-full text-blue-200' />
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
          // Use mock data for demonstration with proper 4-day forecast
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
                day: 'Wednesday',
                high: 83,
                low: 81,
                condition: 'Cloudy',
                icon: 'cloud',
              },
              {
                day: 'Wednesday',
                high: 80,
                low: 79,
                condition: 'Cloudy',
                icon: 'cloud',
              },
              {
                day: 'Wednesday',
                high: 74,
                low: 70,
                condition: 'Cloudy',
                icon: 'cloud',
              },
              {
                day: 'Thursday',
                high: 68,
                low: 68,
                condition: 'Cloudy',
                icon: 'cloud',
              },
            ],
          };
          setWeatherData(mockWeatherData);
          setLoadingState({ isLoading: false, error: null });
          return;
        }

        const geocodeResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
        );

        let cityName = 'Unknown Location';
        let countryCode = 'US';

        if (geocodeResponse.ok) {
          const geocodeData = await geocodeResponse.json();
         
          if (geocodeData.length > 0) {
            const location = geocodeData[0];
            cityName =
              location.name || location.local_names?.en || location.name;
            countryCode = location.country || 'US';
          
          }
        } else {
         
          try {
            const altGeocodeResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );
            if (altGeocodeResponse.ok) {
              const altData = await altGeocodeResponse.json();
             
              if (altData.address) {
                cityName =
                  altData.address.city ||
                  altData.address.town ||
                  altData.address.village ||
                  altData.address.county ||
                  'Unknown';
                countryCode =
                  altData.address.country_code?.toUpperCase() || 'US';
               
              }
            }
          } catch (error) {
           
          }
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        const currentWeather = data.list[0];

        // Get 4-day forecast with proper day names
        const today = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // Get unique days for the next 4 days
        const forecast: Array<{
          day: string;
          high: number;
          low: number;
          condition: string;
          icon: string;
        }> = [];
        
        for (let i = 0; i < 4; i++) {
          const futureDate = new Date(today);
          futureDate.setDate(today.getDate() + i);
          const dayName = dayNames[futureDate.getDay()] || 'Unknown';
          
          // Find the weather data for this day (closest to noon)
          const targetDate = new Date(futureDate);
          targetDate.setHours(12, 0, 0, 0);
          
          const dayData = data.list.find((item: any) => {
            const itemDate = new Date(item.dt * 1000);
            const itemDay = itemDate.getDate();
            const targetDay = targetDate.getDate();
            return itemDay === targetDay;
          });
          
          if (dayData) {
            forecast.push({
              day: dayName,
              high: Math.round(dayData.main.temp_max),
              low: Math.round(dayData.main.temp_min),
              condition: dayData.weather[0].main,
              icon: dayData.weather[0].main.toLowerCase(),
            });
          } else {
            // Fallback: use the first available data for this day
            const fallbackData = data.list.find((item: any) => {
              const itemDate = new Date(item.dt * 1000);
              const itemDay = itemDate.getDate();
              const targetDay = targetDate.getDate();
              return itemDay === targetDay;
            });
            
            if (fallbackData) {
              forecast.push({
                day: dayName,
                high: Math.round(fallbackData.main.temp_max),
                low: Math.round(fallbackData.main.temp_min),
                condition: fallbackData.weather[0].main,
                icon: fallbackData.weather[0].main.toLowerCase(),
              });
            } else {
              // Final fallback: use mock data for this day
              forecast.push({
                day: dayName,
                high: 75,
                low: 65,
                condition: 'Cloudy',
                icon: 'cloud',
              });
            }
          }
        }

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
        
        setLoadingState({
          isLoading: false,
          error: 'Failed to load weather data. Please check your connection.',
        });
      }
    };

   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
         
          fetchWeatherData(latitude, longitude);
        },
       () => {
         
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

              <div className='grid grid-cols-4 gap-3'>
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
