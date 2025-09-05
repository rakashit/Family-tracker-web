import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AddMemberForm from '../components/AddMemberForm';
import type { Member } from '../types';

// Fix default Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(true);

  const addMember = (memberData: Omit<Member, 'id' | 'safe'>) => {
    const newMember: Member = {
      id: Date.now().toString(),
      safe: true,
      ...memberData,
    };
    setMembers(prev => [...prev, newMember]);
  };

  const toggleSafe = (id: string) => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, safe: !m.safe } : m))
    );
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>🌍 Family Tracker</h2>

      {/* Toggle Add Member Form */}
      <button
        onClick={() => setShowForm(prev => !prev)}
        style={{ marginBottom: '1rem', padding: '5px 10px', cursor: 'pointer' }}
      >
        {showForm ? 'Hide Add Member Form' : 'Show Add Member Form'}
      </button>

      {/* Add Member Form */}
      {showForm && <AddMemberForm onAdd={addMember} />}

      {/* Member List */}
      <div style={{ marginBottom: '1rem', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
        <h3>Member List</h3>
        {members.length === 0 && <p>No members added yet.</p>}
        {members.map(member => (
          <div key={member.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', gap: '10px' }}>
            <strong>{member.name}</strong> ({member.shelter}) |{' '}
            <button onClick={() => toggleSafe(member.id)} style={{ cursor: 'pointer' }}>
              {member.safe ? 'Safe ✅' : 'Missing ⚠️'}
            </button>{' '}
            | <button onClick={() => removeMember(member.id)} style={{ cursor: 'pointer' }}>Remove ❌</button>
          </div>
        ))}
      </div>

      {/* Map */}
      <MapContainer center={[28.6139, 77.209]} zoom={13} style={{ height: '500px', width: '100%', borderRadius: '10px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {members.map(member => (
          <Marker key={member.id} position={[member.latitude, member.longitude]}>
            {/* Dynamic emoji tooltip */}
            <Tooltip direction="top" offset={[0, -15]} opacity={1} permanent>
              {member.safe ? '👤🏠' : '👤❌'} {member.name} ({member.latitude.toFixed(4)}, {member.longitude.toFixed(4)})
            </Tooltip>
            <Popup>
              <div style={{ fontSize: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{member.safe ? '👤🏠' : '👤❌'}</span> {member.name}
                <br />
                Shelter: {member.shelter}
                <br />
                Coordinates: {member.latitude}, {member.longitude}
                <br />
                Status: {member.safe ? 'Safe ✅' : 'Missing ⚠️'}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
