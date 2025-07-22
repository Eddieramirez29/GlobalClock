import './cards.css';

function App() {
  return (
    <div className="card-container">
      {Array.from({ length: 4 }).map((_, i) => 
        (
          <div className="card" key={i}>
            <div className="head-card">
              <div className="country">Mexico</div>
              <div className="UTC">UTC 0</div>
            </div>
            <div className="center">
              day
            </div>

            <div className="time">
              00:00:00
            </div>
          </div>
        ))}
    </div>
  );
}

export default App;
