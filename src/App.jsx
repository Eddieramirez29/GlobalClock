import { useEffect, useState } from "react";
import './buttons.css';
import './cards.css';

function App() {
  const [switcher, setSwitcher] = useState(false);
  const [selected, setSelected] = useState('Choose a city');
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState(3); // 0–3 rotating
  const [, setTick] = useState(0);

  const defaultCities = [
    { city: "Ciudad de México", zone: "America", apiNameCity: "Mexico_City" },
    { city: "Guadalajara",    zone: "America", apiNameCity: "Mexico_City" },
    { city: "Monterrey",      zone: "America", apiNameCity: "Monterrey" },
    { city: "Tijuana",        zone: "America", apiNameCity: "Tijuana" }
  ];

  function parseUTCOffset(offsetStr) {
    const sign = offsetStr[0] === "+" ? 1 : -1;
    const [hours, minutes] = offsetStr.slice(1).split(":").map(Number);
    return sign * (hours * 60 + minutes) * 60 * 1000;
  }

  // 1) Load default 4 cities
  useEffect(() => {
    Promise.all(
      defaultCities.map(({ city, zone, apiNameCity }) =>
        fetch(`http://worldtimeapi.org/api/timezone/${zone}/${apiNameCity}`)
          .then(res => res.json())
          .then(dt => ({
            ciudad: city,
            zone,
            apiNameCity,
            datetime: new Date(dt.datetime).getTime(),
            utcOffset: parseUTCOffset(dt.utc_offset)
          }))
      )
    ).then(results => setData(results));
  }, []);

  // 2) Tick every second
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // 3) Load all timezones for autocomplete
  useEffect(() => {
    fetch('http://worldtimeapi.org/api/timezone')
      .then(res => res.json())
      .then(list => setTimezones(list))
      .catch(err => console.error("Error loading zones:", err));
  }, []);

  // 4) Handle input change + filter suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.length > 1) {
      const filtered = timezones
        .filter(tz => {
          const cityName = tz.split('/').pop().replace(/_/g, ' ');
          return cityName.toLowerCase().startsWith(value.toLowerCase());
        })
        .slice(0, 10);
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (tz) => {
    const cityName = tz.split('/').pop().replace(/_/g, ' ');
    setSearchInput(cityName);
    setShowSuggestions(false);
  };

  // 5) On Search: fetch selected timezone and rotate replaceIndex
  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    const match = timezones.find(tz =>
      tz.split('/').pop().toLowerCase() === searchInput.toLowerCase()
    );
    if (!match) {
      alert("Zona no encontrada");
      return;
    }

    try {
      const res = await fetch(`http://worldtimeapi.org/api/timezone/${match}`);
      const result = await res.json();
      const datetime = new Date(result.datetime).getTime();
      const utcOffset = parseUTCOffset(result.utc_offset);

      const newCityData = {
        ciudad: searchInput,
        datetime,
        utcOffset
      };

      const newData = [...data];
      if (newData.length > replaceIndex) {
        newData[replaceIndex] = newCityData;
      } else {
        newData.push(newCityData);
      }
      setData(newData);
      setSelected(searchInput);

      // rotate replaceIndex: 3→2→1→0→3…
      setReplaceIndex(prev => prev > 0 ? prev - 1 : 3);

    } catch (err) {
      alert("Error al consultar la API");
      console.error(err);
    }
  };

  // calculate up‑to‑date times
  const updatedData = data.map(item => {
    if (!item.datetime) return item;
    const now = Date.now();
    const diff = now - item.datetime;
    return {
      ...item,
      hora: new Date(item.datetime + diff + item.utcOffset).toISOString()
    };
  });

  const changeBodyColor = () => {
    switcher
      ? (document.body.style.backgroundColor = '#ffffffff')
      : (document.body.style.backgroundColor = '#000000ff');
  };

  return (
    <>
      <div className="search-container" style={{ position: "relative" }}>
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder="Type a city"
          className={`search-input ${switcher ? 'dark' : 'light'}`}
        />
        <button
          onClick={handleSearch}
          className={`search-button ${switcher ? 'dark' : ''}`}
        >
          Add
        </button>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {filteredSuggestions.map((tz, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(tz)}
                className="suggestion-item"
              >
                {tz.split('/').pop().replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: '10px', color: switcher ? 'white' : 'black' }}>
        Selected City: {selected}
      </div>

      <div className="card-container">
        {updatedData.map((item, i) => (
          <div
            className="card"
            key={i}
            style={{
              border: switcher ? "1px solid white" : "1px solid black",
              boxShadow: switcher ? "0 5px 0px white" : "0 5px 0px black"
            }}
          >
            <div className="head-card">
              <div className="country" style={{ color: switcher ? "white" : "black" }}>
                {item.ciudad}
              </div>
              <div className="UTC" style={{ color: switcher ? "white" : "black" }}>
                UTC {item.utcOffset / 3600000}
              </div>
            </div>
            <div className="center" style={{ color: switcher ? "white" : "black" }}>
              {new Date(item.hora).toLocaleDateString()}
            </div>
            <div className="time" style={{ color: switcher ? "white" : "black" }}>
              {new Date(item.hora).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="container-button_theme">
        <button
          id="theme-button"
          style={{
            backgroundColor: switcher ? '#2B2B2B' : '#F2F6F8',
            color: switcher ? '#ffffffff' : '#000000ff'
          }}
          onClick={() => {
            setSwitcher(!switcher);
            changeBodyColor();
          }}
        >
          {switcher ? 'White' : 'Dark'}
        </button>
      </div>
    </>
  );
}

export default App;
