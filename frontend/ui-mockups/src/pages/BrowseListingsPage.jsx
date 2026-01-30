import { useState } from 'react';
import Card, { CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';

export default function BrowseListingsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    { id: 1, name: 'League of Legends Diamond Account', rank: 'Diamond II', price: '$150', server: 'NA' },
    { id: 2, name: 'Valorant Immortal Account', rank: 'Immortal I', price: '$200', server: 'NA' },
    { id: 3, name: 'Genshin Impact AR 55', rank: 'AR 55', price: '$120', server: 'Asia' },
    { id: 4, name: 'CS:GO Global Elite', rank: 'Global Elite', price: '$180', server: 'EU' },
    { id: 5, name: 'Dota 2 Divine Account', rank: 'Divine V', price: '$160', server: 'SEA' },
    { id: 6, name: 'Overwatch Master Account', rank: 'Master', price: '$140', server: 'NA' },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.rank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Browse Game Accounts</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '1rem' }}>
        This screen allows the Guest/Customer to browse, search, and filter available game account listings
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <SearchBar
          placeholder="Search by game, rank, or skins..."
          onSearch={setSearchTerm}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        <div>
          <Card>
            <CardBody>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Filters</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Category</label>
                  <select style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-gray-300)' }}>
                    <option>All Games</option>
                    <option>MOBA</option>
                    <option>FPS</option>
                    <option>RPG</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Price Range</label>
                  <input type="range" min="0" max="500" style={{ width: '100%' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-gray-600)' }}>
                    <span>$0</span>
                    <span>$500</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <Card key={product.id} hover>
                <CardBody>
                  <div style={{ height: '150px', backgroundColor: 'var(--color-gray-200)', borderRadius: '0.5rem', marginBottom: '1rem' }}></div>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{product.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Badge variant="primary">{product.rank}</Badge>
                    <Badge variant="gray">{product.server}</Badge>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{product.price}</span>
                    <Button size="sm">View Details</Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
