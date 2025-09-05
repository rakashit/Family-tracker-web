import React, { useState } from 'react';
import type { Member } from '../types';

type Props = {
  onAdd: (member: Omit<Member, 'id' | 'safe'>) => void;
};

const AddMemberForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [shelter, setShelter] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleAdd = () => {
    if (!name || !shelter || !latitude || !longitude) return;
    onAdd({
      name,
      shelter,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
    setName('');
    setShelter('');
    setLatitude('');
    setLongitude('');
  };

  return (
    <div style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
      <input type="text" placeholder="Member Name" value={name} onChange={e => setName(e.target.value)} style={{ marginRight: '5px' }} />
      <input type="text" placeholder="Shelter Name" value={shelter} onChange={e => setShelter(e.target.value)} style={{ marginRight: '5px' }} />
      <input type="number" placeholder="Latitude" value={latitude} onChange={e => setLatitude(e.target.value)} style={{ marginRight: '5px' }} />
      <input type="number" placeholder="Longitude" value={longitude} onChange={e => setLongitude(e.target.value)} style={{ marginRight: '5px' }} />
      <button onClick={handleAdd}>Add Member</button>
    </div>
  );
};

export default AddMemberForm;
