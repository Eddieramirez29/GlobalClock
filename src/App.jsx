import { useState } from 'react';
import "./ZoneTimeAPI";
import './buttons.css';
import './cards.css';

function App({ data }) {
  const [switcher, setSwitcher] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Choose a city');

  const defaultCities = ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Tijuana'];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const changeBodyColor = () => {
    switcher
      ? document.body.style.backgroundColor = '#ffffffff'
      : document.body.style.backgroundColor = '#000000ff';
  };

  return (
    <>
      <div style={{ position: 'relative', width: '200px' }}>
        <button onClick={toggleDropdown} style={{ width: '100%' }} id='toggleButton'>
          {selected}
        </button>

        {isOpen && (
          <ul className="dropdown-menu" style={{
            backgroundColor: switcher ? "black" : "white",
            color: switcher ? "white" : "black"
          }}>
            {defaultCities.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className="dropdown-item"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card-container">
        {(data || []).map((item, i) => (
          <div className="card" key={i}
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
                UTC {item.utc}
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
        <button id='theme-button'
          style={{
            backgroundColor: switcher ? '#2B2B2B' : '#F2F6F8',
            color: switcher ? '#ffffffff' : '#000000ff'
          }}
          onClick={() => {
            setSwitcher(!switcher);
            changeBodyColor();
          }}>
          {switcher ? 'White' : 'Dark'}
        </button>
      </div>
    </>
  );
}

export default App;
