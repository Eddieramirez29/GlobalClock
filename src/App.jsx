import './cards.css';

function App() {
  return (
    <div className="card-container">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="card" key={i}></div>
      ))}
    </div>
  );
}

export default App;
