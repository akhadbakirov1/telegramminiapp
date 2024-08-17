import React, { useState, useEffect } from 'react';
import axios from 'axios';

const zodiacSigns = [
  { name: 'Aries', period: 'Mar 21 - Apr 19', icon: '♈', sign: 'aries' },
  { name: 'Taurus', period: 'Apr 20 - May 20', icon: '♉', sign: 'taurus' },
];

const App = () => {
  const [language, setLanguage] = useState('en');
  const [selectedSign, setSelectedSign] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const userLang = tg.initDataUnsafe?.user?.language_code;
    setLanguage(userLang && userLang.startsWith('ru') ? 'ru' : 'en');
  }, []);

  const handleZodiacClick = async (sign) => {
    try {
      const response = await axios.post('https://poker247tech.ru/get_horoscope/', {
        sign,
        language: language === 'ru' ? 'original' : 'translated',
        period: 'today'
      });

      setDescription(response.data.description);
      setSelectedSign(sign);
    } catch (error) {
      console.error('Error fetching zodiac description:', error);
    }
  };

  const handleBackClick = () => {
    setSelectedSign(null);
    setDescription('');
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  };

  return (
    <div>
      <button onClick={handleLanguageToggle}>
        {language === 'ru' ? 'Switch to English' : 'Переключить на Русский'}
      </button>
      {selectedSign ? (
        <div>
          <button onClick={handleBackClick}>Back</button>
          <p>{description}</p>
        </div>
      ) : (
        <div>
          <h1>{language === 'ru' ? 'Гороскоп' : 'Horoscope'}</h1>
          {zodiacSigns.map((zodiac) => (
            <button key={zodiac.sign} onClick={() => handleZodiacClick(zodiac.sign)}>
              {zodiac.icon} {language === 'ru' ? zodiac.name : zodiac.name} ({zodiac.period})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;

