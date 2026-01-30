import KanbanBoard from '../components/common/KanbanBoard';
import Button from '../components/common/Button';

export default function OrderFulfillmentPage() {
  const handleCardMove = (card, fromColumn, toColumn) => {
    console.log(`Moving ${card.title} from ${fromColumn} to ${toColumn}`);
  };

  const columns = [
    {
      id: 'new',
      title: 'New',
      cards: [
        { id: '1', title: 'ORD-105', description: 'League of Legends Diamond II', metadata: { customer: 'John Doe', priority: 'High' } },
        { id: '2', title: 'ORD-106', description: 'Valorant Immortal I', metadata: { customer: 'Jane Smith', priority: 'Medium' } },
      ]
    },
    {
      id: 'processing',
      title: 'Processing',
      cards: [
        { id: '3', title: 'ORD-103', description: 'Genshin Impact AR 55', metadata: { customer: 'Bob Johnson', priority: 'Low' } },
      ]
    },
    {
      id: 'delivered',
      title: 'Delivered',
      cards: [
        { id: '4', title: 'ORD-102', description: 'CS:GO Global Elite', metadata: { customer: 'Alice Brown', priority: 'High' } },
      ]
    },
    {
      id: 'confirmed',
      title: 'Confirmed',
      cards: [
        { id: '5', title: 'ORD-101', description: 'Dota 2 Divine Account', metadata: { customer: 'Charlie Wilson', priority: 'Medium' } },
      ]
    },
  ];

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Order Fulfillment Dashboard</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        Monitor the delivery and fulfillment status of assigned orders
      </p>

      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe' }}>
        <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
          💡 <strong>Tip:</strong> Drag and drop orders between columns to update their status
        </p>
      </div>

      <KanbanBoard columns={columns} onCardMove={handleCardMove} />
    </div>
  );
}
