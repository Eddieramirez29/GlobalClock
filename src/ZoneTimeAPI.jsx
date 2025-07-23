import { useEffect, useState } from "react";
import App from "./App";

let yaCargo = false;

function ZoneTimeAPI() {
  const [data, setData] = useState([]);

  const cities = [
    { city: "Ciudad de México", zone: "America", apiNameCity: "Mexico_City" },
    { city: "Guadalajara", zone: "America", apiNameCity: "Mexico_City" },
    { city: "Monterrey", zone: "America", apiNameCity: "Monterrey" },
    { city: "Tijuana", zone: "America", apiNameCity: "Tijuana" }
  ];

  useEffect(() => {
    if (yaCargo) return;
    yaCargo = true;

    Promise.all(
      cities.map(({ city, zone, apiNameCity }) =>
        fetch(`http://worldtimeapi.org/api/timezone/${zone}/${apiNameCity}`)
          .then(res => res.json())
          .then(data => {
            // guarda la hora en milisegundos y el offset en ms para actualizar después
            const datetime = new Date(data.datetime).getTime();
            const utcOffset = parseUTCOffset(data.utc_offset); // función que explico abajo
            return {
              ciudad: city,
              zone,
              apiNameCity,
              datetime,
              utcOffset,
            };
          })
      )
    ).then(results => {
      setData(results);
    });
  }, []);

  // Función para convertir "+05:00" a milisegundos
  function parseUTCOffset(offsetStr) {
    const sign = offsetStr[0] === "+" ? 1 : -1;
    const [hours, minutes] = offsetStr.slice(1).split(":").map(Number);
    return sign * (hours * 60 + minutes) * 60 * 1000;
  }

  // Estado para forzar actualización cada segundo
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  
  const updatedData = data.map(item => 
{
        if (!item.datetime) return item;
        const now = Date.now();
        const diff = now - item.datetime;
        const updatedDate = new Date(item.datetime + diff + item.utcOffset);
        return {
            ...item,
            hora: updatedDate.toISOString()
        };
});

  return <App data={updatedData} />;
}

export default ZoneTimeAPI;
