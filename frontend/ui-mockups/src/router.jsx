import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import BrowseListingsPage from './pages/BrowseListingsPage';
import ViewPromotionsPage from './pages/ViewPromotionsPage';
import ManageProfilePage from './pages/ManageProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import PurchaseAccountPage from './pages/PurchaseAccountPage';
import SubmitFeedbackPage from './pages/SubmitFeedbackPage';
// Sales Staff Pages
import AssignedOrdersPage from './pages/AssignedOrdersPage';
import OrderFulfillmentPage from './pages/OrderFulfillmentPage';
import UpdateOrderStatusPage from './pages/UpdateOrderStatusPage';
import CustomerInquiriesPage from './pages/CustomerInquiriesPage';
import SalesStatisticsPage from './pages/SalesStatisticsPage';
// Marketing Staff Pages
import MarketingAnalyticsPage from './pages/MarketingAnalyticsPage';
import ManageProductsPage from './pages/ManageProductsPage';
import ManagePromotionsPage from './pages/ManagePromotionsPage';
import ManageBlogsPage from './pages/ManageBlogsPage';
import ManageBannersPage from './pages/ManageBannersPage';
import ManageSlidersPage from './pages/ManageSlidersPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
// Admin Pages
import ManageUsersPage from './pages/ManageUsersPage';
import ReassignRolePage from './pages/ReassignRolePage';
import ManageRolesPage from './pages/ManageRolesPage';
import FinancialReportsPage from './pages/FinancialReportsPage';
import SystemSettingsPage from './pages/SystemSettingsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            // Guest/Customer Routes (UC-01 to UC-13)
            { path: 'register', element: <RegisterPage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'forgot-password', element: <ForgotPasswordPage /> },
            { path: 'browse', element: <BrowseListingsPage /> },
            { path: 'promotions', element: <ViewPromotionsPage /> },
            { path: 'profile', element: <ManageProfilePage /> },
            { path: 'orders', element: <OrderHistoryPage /> },
            { path: 'orders/:id', element: <OrderDetailPage /> },
            { path: 'purchase/:id', element: <PurchaseAccountPage /> },
            { path: 'feedback', element: <SubmitFeedbackPage /> },

            // Sales Staff Routes (UC-14 to UC-18)
            { path: 'sales/orders', element: <AssignedOrdersPage /> },
            { path: 'sales/fulfillment/:id', element: <OrderFulfillmentPage /> },
            { path: 'sales/update-status/:id', element: <UpdateOrderStatusPage /> },
            { path: 'sales/inquiries', element: <CustomerInquiriesPage /> },
            { path: 'sales/statistics', element: <SalesStatisticsPage /> },

            // Marketing Staff Routes (UC-19 to UC-25)
            { path: 'marketing/analytics', element: <MarketingAnalyticsPage /> },
            { path: 'marketing/products', element: <ManageProductsPage /> },
            { path: 'marketing/promotions', element: <ManagePromotionsPage /> },
            { path: 'marketing/blogs', element: <ManageBlogsPage /> },
            { path: 'marketing/banners', element: <ManageBannersPage /> },
            { path: 'marketing/sliders', element: <ManageSlidersPage /> },
            { path: 'marketing/categories', element: <ManageCategoriesPage /> },

            // Admin Routes (UC-26 to UC-30)
            { path: 'admin/users', element: <ManageUsersPage /> },
            { path: 'admin/reassign-role/:id', element: <ReassignRolePage /> },
            { path: 'admin/roles', element: <ManageRolesPage /> },
            { path: 'admin/financial-reports', element: <FinancialReportsPage /> },
            { path: 'admin/settings', element: <SystemSettingsPage /> },
        ],
    },
]);
