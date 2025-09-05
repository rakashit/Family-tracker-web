import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AddMemberForm from '../components/AddMemberForm';
import AddShelterForm from '../components/AddShelterForm';
import type { Member, Shelter } from '../types';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [showMemberForm, setShowMemberForm] = useState(true);
  const [showShelterForm, setShowShelterForm] = useState(true);

  const addMember = (memberData: Omit<Member, 'id' | 'safe'>) => {
    const newMember: Member = { id: Date.now().toString(), safe: true, ...memberData };
    setMembers(prev => [...prev, newMember]);
  };

  const toggleSafe = (id: string) => {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, safe: !m.safe } : m)));
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const addShelter = (shelterData: Omit<Shelter, 'id'>) => {
    const newShelter: Shelter = { id: Date.now().toString(), ...shelterData };
    setShelters(prev => [...prev, newShelter]);
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>🌍 Family Tracker with Shelters</h2>

      {/* Toggle Forms */}
      <button onClick={() => setShowMemberForm(prev => !prev)} style={{ marginRight: '10px' }}>
        {showMemberForm ? 'Hide Member Form' : 'Show Member Form'}
      </button>
      <button onClick={() => setShowShelterForm(prev => !prev)}>
        {showShelterForm ? 'Hide Shelter Form' : 'Show Shelter Form'}
      </button>

      {/* Forms */}
      {showMemberForm && <AddMemberForm onAdd={addMember} />}
      {showShelterForm && <AddShelterForm onAdd={addShelter} />}

      {/* Member List */}
      <div style={{ marginBottom: '1rem', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
        <h3>Member List</h3>
        {members.length === 0 && <p>No members added yet.</p>}
        {members.map(member => (
          <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <strong>{member.name}</strong> | 
            <button onClick={() => toggleSafe(member.id)}>{member.safe ? 'Safe ✅' : 'Missing ⚠️'}</button> | 
            <button onClick={() => removeMember(member.id)}>Remove ❌</button>
          </div>
        ))}
      </div>

      {/* Map */}
      <MapContainer center={[28.6139, 77.209]} zoom={13} style={{ height: '500px', width: '100%', borderRadius: '10px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

        {/* Member Markers */}
        {members.map(member => (
          <Marker key={member.id} position={[member.latitude, member.longitude]}>
            <Tooltip direction="top" permanent>
              {member.safe ? '👤🏠' : '👤❌'} {member.name} ({member.latitude.toFixed(4)}, {member.longitude.toFixed(4)})
            </Tooltip>
            <Popup>
              <div>
                <span style={{ fontSize: '1.5rem' }}>{member.safe ? '👤🏠' : '👤❌'}</span> {member.name}
                <br />
                Coordinates: {member.latitude}, {member.longitude}
                <br />
                Status: {member.safe ? 'Safe ✅' : 'Missing ⚠️'}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Shelter Markers */}
        {shelters.map(shelter => (
          <Marker key={shelter.id} position={[shelter.latitude, shelter.longitude]}>
            <Tooltip direction="top" permanent>
              🏠 {shelter.name} ({shelter.latitude.toFixed(4)}, {shelter.longitude.toFixed(4)})
            </Tooltip>
            <Popup>
              <div>
                <span style={{ fontSize: '1.5rem' }}>🏠</span> {shelter.name}
                <br />
                Coordinates: {shelter.latitude}, {shelter.longitude}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
