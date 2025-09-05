import React, { useState } from 'react';
import { Shelter } from '../types';

type Props = {
  onAdd: (shelter: Omit<Shelter, 'id'>) => void;
};

const AddShelterForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleAdd = () => {
    if (!name || !latitude || !longitude) return;
    onAdd({
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
    setName('');
    setLatitude('');
    setLongitude('');
  };

  return (
    <div style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
      <input type="text" placeholder="Shelter Name" value={name} onChange={e => setName(e.target.value)} style={{ marginRight: '5px' }} />
      <input type="number" placeholder="Latitude" value={latitude} onChange={e => setLatitude(e.target.value)} style={{ marginRight: '5px' }} />
      <input type="number" placeholder="Longitude" value={longitude} onChange={e => setLongitude(e.target.value)} style={{ marginRight: '5px' }} />
      <button onClick={handleAdd}>Add Shelter</button>
    </div>
  );
};

export default AddShelterForm;
