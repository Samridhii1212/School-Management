const db = require('../config/db');

const haversineDistance = (coords1, coords2) => {
  const toRad = x => (x * Math.PI) / 180;
  
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lon - coords1.lon);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
};

const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).send('Invalid input data');
  }

  const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) throw err;
    res.send('School added successfully');
  });
};

const listSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).send('Latitude and longitude are required');
  }

  const userLocation = {
    lat: parseFloat(latitude),
    lon: parseFloat(longitude)
  };

  const sql = 'SELECT * FROM schools';
  db.query(sql, (err, results) => {
    if (err) throw err;

    const schoolsWithDistance = results.map(school => ({
      ...school,
      distance: haversineDistance(userLocation, {
        lat: school.latitude,
        lon: school.longitude
      })
    }));

    const sortedSchools = schoolsWithDistance.sort((a, b) => a.distance - b.distance);
    res.json(sortedSchools);
  });
};

module.exports = { addSchool, listSchools };
