import { useState } from 'react';
import './buttons.css';
import './cards.css';

function App() {

  const [switcher, setSwitcher] = useState(false);

  const changeBodyColor = () =>
  {
    switcher ? document.body.style.backgroundColor = '#ffffffff' : document.body.style.backgroundColor =  '#000000ff';
  }

  return (
    <>
      <div className="card-container">
      {Array.from({ length: 4 }).map((_, i) => 
        (
          <div className="card" key={i}
          style={{ border: switcher ? "1px solid white" : "1px solid black"}}
          >
            <div className="head-card">
              <div className="country" style={{ color: switcher ? " white" : " black"}}>Mexico</div>
              <div className="UTC"     style={{ color: switcher ? " white" : " black"}} >UTC 0</div>
            </div>
            <div className="center" style={{ color: switcher ? " white" : " black"}}>
              day
            </div>

            <div className="time" style={{ color: switcher ? " white" : " black"}}>
              00:00:00
            </div>
          </div>
        ))}
    </div>

    <div className="container-button_theme">
      <button id='theme-button'
      style={{ backgroundColor: switcher ? '#2B2B2B' :  '#F2F6F8',  color: switcher ? '#ffffffff' :  '#000000ff'}}
      onClick={() => {
        setSwitcher(switcher ? false : true);
        changeBodyColor();
      }}>
      {switcher ? 'White' : 'Dark'}
    </button>
    </div>
    </>
  );
}

export default App;
