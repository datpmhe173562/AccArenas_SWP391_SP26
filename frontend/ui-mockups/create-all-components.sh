#!/bin/bash

# Comprehensive script to create ALL remaining UI mockup components

cd "$(dirname "$0")/src"

echo "🚀 Creating all remaining UI components for AccArenas..."

# ============================================
# SALES STAFF COMPONENTS (UC-14 to UC-18)
# ============================================

echo "📦 Creating Sales Staff components..."

# UC-14: View Assigned Orders
cat > components/sales/AssignedOrders.jsx << 'EOF'
import Table from '../common/Table';
import Badge from '../common/Badge';
import Card from '../common/Card';

export default function AssignedOrders() {
  const orders = [
    { id: 'ORD-001', customer: 'John Doe', product: 'League of Legends Diamond II', amount: '$150', status: 'pending', assignedDate: '2026-01-25' },
    { id: 'ORD-002', customer: 'Jane Smith', product: 'Valorant Immortal I', amount: '$200', status: 'processing', assignedDate: '2026-01-24' },
    { id: 'ORD-003', customer: 'Bob Johnson', product: 'Genshin Impact AR 55', amount: '$120', status: 'completed', assignedDate: '2026-01-23' },
  ];

  const columns = [
    { header: 'Order ID', accessor: 'id' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Product', accessor: 'product' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Assigned Date', accessor: 'assignedDate' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'processing' ? 'warning' : 'info'}>{row.status}</Badge>
    },
  ];

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Assigned Orders</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        This screen allows Sales Staff to view orders assigned to them by the system
      </p>
      <Card>
        <Table columns={columns} data={orders} />
      </Card>
    </div>
  );
}
EOF

# UC-18: View Sales Statistics
cat > components/sales/SalesStatistics.jsx << 'EOF'
import Card, { CardBody, CardHeader } from '../common/Card';

export default function SalesStatistics() {
  const stats = {
    totalOrders: 45,
    completedOrders: 38,
    pendingOrders: 7,
    totalRevenue: '$6,750',
    avgOrderValue: '$150',
    customerSatisfaction: '4.8/5.0'
  };

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Sales Statistics</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        This screen allows Sales Staff to view personal sales performance and statistics
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Total Orders</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.totalOrders}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Completed Orders</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{stats.completedOrders}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Pending Orders</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-warning)' }}>{stats.pendingOrders}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Total Revenue</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.totalRevenue}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Avg Order Value</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.avgOrderValue}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Customer Satisfaction</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{stats.customerSatisfaction}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
EOF

# ============================================
# MARKETING STAFF COMPONENTS (UC-19 to UC-25)
# ============================================

echo "📊 Creating Marketing Staff components..."

# UC-20: Manage Products
cat > components/marketing/ManageProducts.jsx << 'EOF'
import { useState } from 'react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

export default function ManageProducts() {
  const [products] = useState([
    { id: 1, name: 'League of Legends Diamond II', category: 'MOBA', price: '$150', stock: 5, status: 'active' },
    { id: 2, name: 'Valorant Immortal I', category: 'FPS', price: '$200', stock: 3, status: 'active' },
    { id: 3, name: 'Genshin Impact AR 55', category: 'RPG', price: '$120', stock: 0, status: 'out_of_stock' },
  ]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Product Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Price', accessor: 'price' },
    { header: 'Stock', accessor: 'stock' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <Badge variant={row.status === 'active' ? 'success' : 'danger'}>{row.status}</Badge>
    },
  ];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage Products</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            This screen allows Marketing Staff to create, update, and view game account product listings
          </p>
        </div>
        <Button>+ Add Product</Button>
      </div>
      <Card>
        <Table columns={columns} data={products} />
      </Card>
    </div>
  );
}
EOF

# ============================================
# ADMIN COMPONENTS (UC-26 to UC-30)
# ============================================

echo "👑 Creating Admin components..."

# UC-26: Manage Users
cat > components/admin/ManageUsers.jsx << 'EOF'
import { useState } from 'react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

export default function ManageUsers() {
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'active', createdAt: '2026-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Sales Staff', status: 'active', createdAt: '2026-01-10' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Marketing Staff', status: 'inactive', createdAt: '2026-01-05' },
  ]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Created At', accessor: 'createdAt' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <Badge variant={row.status === 'active' ? 'success' : 'gray'}>{row.status}</Badge>
    },
  ];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage Users</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            This screen allows Admin to create, update, view, and manage system user accounts
          </p>
        </div>
        <Button>+ Add User</Button>
      </div>
      <Card>
        <Table columns={columns} data={users} />
      </Card>
    </div>
  );
}
EOF

# UC-28: Manage Roles
cat > components/admin/ManageRoles.jsx << 'EOF'
import { useState } from 'react';
import Table from '../common/Table';
import Button from '../common/Button';
import Card from '../common/Card';

export default function ManageRoles() {
  const [roles] = useState([
    { id: 1, name: 'Admin', description: 'Full system access', userCount: 2 },
    { id: 2, name: 'Sales Staff', description: 'Manage orders and customers', userCount: 5 },
    { id: 3, name: 'Marketing Staff', description: 'Manage products and promotions', userCount: 3 },
    { id: 4, name: 'Customer', description: 'Browse and purchase accounts', userCount: 150 },
  ]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Role Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Users', accessor: 'userCount' },
  ];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage Roles</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            This screen allows Admin to create, update, delete, and view system roles
          </p>
        </div>
        <Button>+ Add Role</Button>
      </div>
      <Card>
        <Table columns={columns} data={roles} />
      </Card>
    </div>
  );
}
EOF

# ============================================
# CREATE PAGE WRAPPERS
# ============================================

echo "📄 Creating page wrappers..."

# Sales Staff Pages
cat > pages/AssignedOrdersPage.jsx << 'EOF'
import AssignedOrders from '../components/sales/AssignedOrders';
export default function AssignedOrdersPage() {
  return <AssignedOrders />;
}
EOF

cat > pages/SalesStatisticsPage.jsx << 'EOF'
import SalesStatistics from '../components/sales/SalesStatistics';
export default function SalesStatisticsPage() {
  return <SalesStatistics />;
}
EOF

# Marketing Staff Pages
cat > pages/ManageProductsPage.jsx << 'EOF'
import ManageProducts from '../components/marketing/ManageProducts';
export default function ManageProductsPage() {
  return <ManageProducts />;
}
EOF

# Admin Pages
cat > pages/ManageUsersPage.jsx << 'EOF'
import ManageUsers from '../components/admin/ManageUsers';
export default function ManageUsersPage() {
  return <ManageUsers />;
}
EOF

cat > pages/ManageRolesPage.jsx << 'EOF'
import ManageRoles from '../components/admin/ManageRoles';
export default function ManageRolesPage() {
  return <ManageRoles />;
}
EOF

echo "✅ All components created successfully!"
echo ""
echo "📊 Summary:"
echo "  - Sales Staff: 2 components"
echo "  - Marketing Staff: 1 component"
echo "  - Admin: 2 components"
echo "  - Page wrappers: 5 pages"
echo ""
echo "🎉 UI Mockups are ready!"
