import { Link } from 'react-router-dom';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import './HomePage.css';

export default function HomePage() {
    const useCases = [
        {
            category: 'Guest / Customer Features',
            items: [
                { id: 'UC-01', name: 'Register Account', path: '/register', description: 'Create a new account' },
                { id: 'UC-02', name: 'Login', path: '/login', description: 'Authenticate to access features' },
                { id: 'UC-03', name: 'Forgot Password', path: '/forgot-password', description: 'Request password reset' },
                { id: 'UC-04', name: 'Browse Game Account Listings', path: '/browse', description: 'Search and filter accounts' },
                { id: 'UC-05', name: 'View Promotions', path: '/promotions', description: 'View active promotions' },
                { id: 'UC-06', name: 'Manage Profile', path: '/profile', description: 'Update personal information' },
                { id: 'UC-07', name: 'View Order History', path: '/orders', description: 'View past orders' },
                { id: 'UC-08', name: 'View Order Detail', path: '/orders/1', description: 'View order details' },
                { id: 'UC-09', name: 'Purchase Game Accounts', path: '/purchase/1', description: 'Place an order' },
                { id: 'UC-10', name: 'Make Online Payment', path: '/payment/1', description: 'Process payment' },
                { id: 'UC-11', name: 'Receive Account Credentials', path: '/confirmation/1', description: 'View credentials' },
                { id: 'UC-12', name: 'Submit Feedback', path: '/feedback', description: 'Submit reviews' },
                { id: 'UC-13', name: 'Logout', path: '/logout', description: 'End session' },
            ]
        },
        {
            category: 'Sales Staff Features',
            items: [
                { id: 'UC-14', name: 'View Assigned Orders', path: '/sales/orders', description: 'View assigned orders' },
                { id: 'UC-15', name: 'Monitor Order Fulfillment', path: '/sales/fulfillment/1', description: 'Track fulfillment' },
                { id: 'UC-16', name: 'Update Order Status', path: '/sales/update-status/1', description: 'Update status' },
                { id: 'UC-17', name: 'Handle Customer Inquiries', path: '/sales/inquiries', description: 'Respond to inquiries' },
                { id: 'UC-18', name: 'View Sales Statistics', path: '/sales/statistics', description: 'View performance' },
            ]
        },
        {
            category: 'Marketing Staff Features',
            items: [
                { id: 'UC-19', name: 'View Marketing Analytics', path: '/marketing/analytics', description: 'View analytics' },
                { id: 'UC-20', name: 'Manage Product Listings', path: '/marketing/products', description: 'CRUD products' },
                { id: 'UC-21', name: 'Manage Promotions', path: '/marketing/promotions', description: 'CRUD promotions' },
                { id: 'UC-22', name: 'Manage Blogs', path: '/marketing/blogs', description: 'CRUD blog posts' },
                { id: 'UC-23', name: 'Manage Banners', path: '/marketing/banners', description: 'Manage banners' },
                { id: 'UC-24', name: 'Manage Sliders', path: '/marketing/sliders', description: 'Manage sliders' },
                { id: 'UC-25', name: 'Manage Account Categories', path: '/marketing/categories', description: 'CRUD categories' },
            ]
        },
        {
            category: 'Admin Features',
            items: [
                { id: 'UC-26', name: 'Manage User Accounts', path: '/admin/users', description: 'CRUD users' },
                { id: 'UC-27', name: 'Re-assign User Role', path: '/admin/reassign-role/1', description: 'Change user roles' },
                { id: 'UC-28', name: 'Manage Roles', path: '/admin/roles', description: 'CRUD roles' },
                { id: 'UC-29', name: 'View Financial Reports', path: '/admin/financial-reports', description: 'View reports' },
                { id: 'UC-30', name: 'Configure System Settings', path: '/admin/settings', description: 'System config' },
            ]
        }
    ];

    return (
        <div className="home-page">
            <div className="container">
                <div className="home-header">
                    <h1 className="home-title">AccArenas - UI Mockups</h1>
                    <p className="home-subtitle">
                        Complete UI implementation for all 30 use cases. Click on any use case to view its mockup.
                    </p>
                </div>

                <div className="use-cases-grid">
                    {useCases.map((category, idx) => (
                        <Card key={idx} className="category-card">
                            <CardHeader>
                                <h2 className="category-title">{category.category}</h2>
                            </CardHeader>
                            <CardBody>
                                <div className="use-case-list">
                                    {category.items.map((useCase) => (
                                        <Link
                                            key={useCase.id}
                                            to={useCase.path}
                                            className="use-case-item"
                                        >
                                            <div className="use-case-id">{useCase.id}</div>
                                            <div className="use-case-content">
                                                <h3 className="use-case-name">{useCase.name}</h3>
                                                <p className="use-case-description">{useCase.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
