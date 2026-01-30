# AccArenas UI Mockups

Complete frontend UI implementation for all 30 use cases in the AccArenas system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📋 Features

This project contains UI mockups for all 30 use cases:

### Guest / Customer Features (UC-01 to UC-13)
- ✅ UC-01: Register Account
- ✅ UC-02: Login
- ✅ UC-03: Forgot Password
- ✅ UC-04: Browse Game Account Listings
- ✅ UC-05: View Promotions
- ✅ UC-06: Manage Profile
- ✅ UC-07: View Order History
- ✅ UC-08: View Order Detail
- ✅ UC-09: Purchase Game Accounts
- ✅ UC-10: Make Online Payment
- ✅ UC-11: Receive Account Credentials
- ✅ UC-12: Submit Feedback
- ✅ UC-13: Logout

### Sales Staff Features (UC-14 to UC-18)
- ✅ UC-14: View Assigned Orders
- ✅ UC-15: Monitor Order Fulfillment
- ✅ UC-16: Update Order Status
- ✅ UC-17: Handle Customer Inquiries
- ✅ UC-18: View Sales Statistics

### Marketing Staff Features (UC-19 to UC-25)
- ✅ UC-19: View Marketing Analytics
- ✅ UC-20: Manage Product Listings
- ✅ UC-21: Manage Promotions
- ✅ UC-22: Manage Blogs
- ✅ UC-23: Manage Banners
- ✅ UC-24: Manage Sliders
- ✅ UC-25: Manage Account Categories

### Admin Features (UC-26 to UC-30)
- ✅ UC-26: Manage User Accounts
- ✅ UC-27: Re-assign User Role
- ✅ UC-28: Manage Roles
- ✅ UC-29: View Financial Reports
- ✅ UC-30: Configure System Settings

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   └── StarRating.jsx
│   ├── layout/          # Layout components
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   ├── guest/           # Guest/Customer components
│   │   └── RegisterForm.jsx
│   ├── sales/           # Sales Staff components
│   ├── marketing/       # Marketing Staff components
│   └── admin/           # Admin components
├── pages/               # Page components (30 pages)
├── styles/              # CSS files
│   └── index.css        # Design system & global styles
├── App.jsx              # Main app component
├── router.jsx           # Route configuration
└── main.jsx             # Entry point
```

## 🎨 Design System

The project uses a comprehensive design system with:

- **CSS Variables** for colors, spacing, typography
- **Utility Classes** for rapid development
- **Responsive Design** (mobile, tablet, desktop)
- **Modern Aesthetics** with gradients and animations
- **Accessibility** standards (WCAG 2.1 AA)

### Color Palette
- Primary: `#2563EB` (Blue)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Yellow)
- Danger: `#EF4444` (Red)
- Info: `#3B82F6` (Light Blue)

## 🧩 Components

### Common Components
- **Button**: Multiple variants (primary, secondary, outline, danger, success, ghost)
- **Input**: With label, icon, and error state support
- **Card**: Container with header, body, and footer
- **Badge**: Status indicators with color variants
- **Modal**: Dialog/popup component
- **Table**: Data table with custom rendering
- **StarRating**: Interactive 5-star rating

### Layout Components
- **Header**: Top navigation with logo and menu
- **Layout**: Main layout wrapper with header and footer

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Vanilla CSS with CSS Variables
- **Icons**: Heroicons
- **State Management**: React Hooks (useState, useEffect)

## 📝 Notes

- This is a **UI-only implementation** with no backend integration
- All data is mocked for demonstration purposes
- Focus is on visual design and user experience
- Components are reusable and well-structured

## 🚧 Development

To add a new component:

1. Create component file in appropriate directory
2. Create corresponding CSS file
3. Add route in `router.jsx` if needed
4. Import and use in page component

## 📄 License

This project is part of the AccArenas system.
