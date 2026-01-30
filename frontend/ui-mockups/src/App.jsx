import { Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import './styles/index.css';

function App() {
  // Mock user - in real app this would come from auth context
  const user = null; // Set to { name: 'John Doe', role: 'customer' } to simulate logged in user

  return (
    <Layout user={user}>
      <Outlet />
    </Layout>
  );
}

export default App;
