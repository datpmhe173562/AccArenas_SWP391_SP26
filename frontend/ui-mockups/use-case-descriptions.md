# AccArenas - Detailed Use Case Descriptions

---

## 2.1 Browse Game Account Listings

**AccArenas**

### Browse Game Accounts

This screen allows the Guest/Customer to browse, search, and filter available game account listings

**Layout:**
- Left sidebar: Filter panel
- Main content area: Product grid (3 columns on desktop)

**Filters Panel:**
- Category dropdown (All Games, MOBA, FPS, RPG)
- Price Range slider ($0 - $500)

**Product Cards Display:**
Each card shows:
- Image placeholder (150px height, gray background)
- Account name (e.g., "League of Legends Diamond Account")
- Rank badge (e.g., "Diamond II") - blue badge
- Server badge (e.g., "NA") - gray badge
- Price (large, bold, primary color)
- "View Details" button

**This screen allows the Guest or Customer to:**

- **Browse Accounts**: View grid of available game accounts with images and key information.
- **Filter by Category**: Select game category from dropdown (All Games, MOBA, FPS, RPG).
- **Filter by Price**: Use slider to set price range from $0 to $500.
- **View Account Info**: See account name, rank, server, and price at a glance.

**On the screen, s/he can also:**

- **Access Details**: Click "View Details" button on any card to view full account specifications.
- **Compare Accounts**: Browse multiple accounts side-by-side in grid layout.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Category Dropdown** | Select input; options: All Games, MOBA, FPS, RPG; filters products by game type. |
| **Price Range Slider** | Range input; interactive slider to set min/max budget from $0 to $500. |
| **Product Card** | Display card; shows account image placeholder, name, rank, server, and price. |
| **Rank Badge** | Badge component; displays account rank/level (e.g., "Diamond II", "AR 55"); primary blue color. |
| **Server Badge** | Badge component; displays server region (e.g., "NA", "Asia", "EU"); gray color. |
| **Price Display** | Text display; large bold text in primary color showing account price. |
| **View Details Button** | Action button; small size; opens detailed account information page. |

---

## 2.2 Register Account

**AccArenas**

### Create Your Account

This screen allows a Guest to register for a new account by providing personal information.

**Registration Form**
- Full Name (text input)
- Email Address (email input)
- Password (password input with strength indicator)
- Confirm Password (password input)
- Phone Number (optional, text input)
- Terms & Conditions checkbox

**This screen allows the Guest to:**

- **Enter Personal Information**: Provide required details including full name, email, and password.
- **Set Secure Password**: Create a password with strength validation (minimum 8 characters, uppercase, lowercase, number).
- **Accept Terms**: Review and accept the terms and conditions.
- **Submit Registration**: Click "Register" button to create account.

**On the screen, s/he can also:**

- **Navigate to Login**: Click "Already have an account? Login" link to go to login page.
- **View Password Requirements**: See real-time password strength feedback.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Full Name** | Text input; required field for user's full name. |
| **Email Address** | Email input; must be valid email format; used for login and verification. |
| **Password** | Password input; minimum 8 characters with complexity requirements. |
| **Confirm Password** | Password input; must match the password field. |
| **Phone Number** | Text input; optional field for contact purposes. |
| **Terms Checkbox** | Checkbox; must be checked to enable registration button. |
| **Register Button** | Action button; submits form and sends verification email. |

**Post-Registration Flow:**
- System sends verification email to provided address
- User must verify email before accessing full system features
- Redirect to email verification pending page

---

## 2.3 Login

**AccArenas**

### Welcome Back

This screen allows registered users (Guest/Customer) to authenticate and access the system.

**Login Form**
- Email Address (email input)
- Password (password input with show/hide toggle)
- Remember Me checkbox
- Forgot Password link

**This screen allows the User to:**

- **Enter Credentials**: Provide registered email and password.
- **Toggle Password Visibility**: Click eye icon to show/hide password.
- **Stay Logged In**: Check "Remember Me" to persist session.
- **Submit Login**: Click "Login" button to authenticate.

**On the screen, s/he can also:**

- **Reset Password**: Click "Forgot Password?" link to initiate password recovery.
- **Create Account**: Click "Don't have an account? Register" link to go to registration page.
- **View Login Errors**: See error messages for invalid credentials or unverified accounts.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Email Address** | Email input; must match registered email. |
| **Password** | Password input; with show/hide toggle icon. |
| **Remember Me** | Checkbox; keeps user logged in across sessions. |
| **Forgot Password** | Link; redirects to password recovery page. |
| **Login Button** | Action button; authenticates user and redirects to dashboard/home. |

**Authentication Flow:**
- System validates credentials against database
- Checks if email is verified
- Creates session token upon successful login
- Redirects to appropriate dashboard based on user role

---

## 2.4 Forgot Password

**AccArenas**

### Reset Your Password

This screen allows users to request a password reset link sent to their registered email.

**Password Reset Form**
- Email Address (email input)
- Submit button

**This screen allows the User to:**

- **Enter Email**: Provide the registered email address.
- **Request Reset Link**: Click "Send Reset Link" button to receive password reset email.
- **View Confirmation**: See success message confirming email was sent.

**On the screen, s/he can also:**

- **Return to Login**: Click "Back to Login" link to return to login page.
- **Resend Email**: Click "Didn't receive email? Resend" after waiting period.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Email Address** | Email input; must be registered in system. |
| **Send Reset Link** | Action button; triggers password reset email. |
| **Back to Login** | Link; returns user to login page. |

**Password Reset Flow:**
- System validates email exists in database
- Generates unique reset token with expiration time
- Sends email with reset link to user
- User clicks link and is redirected to password reset page
- User enters new password and confirms
- System updates password and invalidates reset token

---

## 2.5 View Promotions

**AccArenas**

### Active Promotions & Deals

This screen allows users (Guest/Customer) to view active promotions, discounts, and vouchers.

**Promotions Display**
- Featured promotion banners
- Voucher cards with discount codes
- Promotion filters (by game, discount type, expiry date)
- Search functionality

**This screen allows the User to:**

- **Browse Promotions**: View all active promotional offers and discounts.
- **Filter Promotions**: Filter by game category, discount percentage, or expiration date.
- **Search Promotions**: Use search bar to find specific promotions.
- **View Details**: Click on promotion card to see full terms and conditions.

**On the screen, s/he can also:**

- **Copy Voucher Code**: Click "Copy Code" button to copy discount code to clipboard.
- **Apply to Purchase**: Click "Shop Now" to browse accounts eligible for the promotion.
- **Save Promotions**: Bookmark favorite promotions for later use (Customer only).

### Field Description

| Field Name | Description |
|------------|-------------|
| **Search Bar** | Text input; searches promotions by name or code. |
| **Game Filter** | Dropdown; filters promotions by game category. |
| **Discount Filter** | Checkbox list; filters by discount percentage ranges. |
| **Promotion Card** | Display card; shows promotion image, title, discount, and expiry date. |
| **Copy Code Button** | Action button; copies voucher code to clipboard. |
| **Shop Now Button** | Action button; redirects to filtered product listings. |

---

## 2.6 Manage Profile

**AccArenas**

### My Profile

This screen allows a Customer to view and update personal profile information.

**Profile Sections**
- Personal Information (name, email, phone)
- Profile Picture upload
- Address Information
- Password Change section
- Account Statistics (orders, purchases, feedback submitted)

**This screen allows the Customer to:**

- **View Profile**: See current profile information and statistics.
- **Edit Information**: Update name, phone number, and address.
- **Upload Photo**: Change profile picture.
- **Change Password**: Update account password securely.

**On the screen, s/he can also:**

- **Save Changes**: Click "Save Changes" button to update profile.
- **Cancel Edits**: Click "Cancel" to discard unsaved changes.
- **View Order Summary**: See quick stats on total orders and purchases.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Full Name** | Text input; editable field for user's name. |
| **Email Address** | Email input; display only (cannot be changed). |
| **Phone Number** | Text input; editable contact number. |
| **Profile Picture** | Image upload; accepts JPG, PNG; max 2MB. |
| **Address** | Text area; editable shipping/billing address. |
| **Current Password** | Password input; required to change password. |
| **New Password** | Password input; with strength indicator. |
| **Save Changes** | Action button; updates profile information. |

---

## 2.7 View Order History

**AccArenas**

### My Orders

This screen allows a Customer to view a list of past orders.

**Order History Display**
- Order list with pagination
- Order status filters (All, Pending, Completed, Cancelled)
- Date range filter
- Search by order ID

**This screen allows the Customer to:**

- **View All Orders**: See complete order history with status indicators.
- **Filter Orders**: Filter by status (Pending, Completed, Cancelled, Refunded).
- **Search Orders**: Find specific orders by order ID or product name.
- **Sort Orders**: Sort by date, price, or status.

**On the screen, s/he can also:**

- **View Details**: Click on order row to view detailed order information.
- **Download Invoice**: Click "Download" icon to get order invoice PDF.
- **Reorder**: Click "Buy Again" button to repurchase same account type.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Search Bar** | Text input; searches by order ID or product name. |
| **Status Filter** | Dropdown; filters orders by status. |
| **Date Range** | Date picker; filters orders by date range. |
| **Order Row** | Clickable row; displays order ID, date, product, amount, status. |
| **View Details** | Link/Button; opens order detail page. |
| **Download Invoice** | Icon button; generates and downloads PDF invoice. |

---

## 2.8 View Order Detail

**AccArenas**

### Order Details

This screen allows a Customer to view detailed information of a selected order.

**Order Detail Sections**
- Order summary (ID, date, status)
- Product information (game account details)
- Payment information
- Delivery status
- Account credentials (if delivered)
- Timeline/tracking

**This screen allows the Customer to:**

- **View Complete Order Info**: See all details including product specs, pricing, and payment method.
- **Track Order Status**: View order fulfillment timeline and current status.
- **Access Credentials**: View delivered account login credentials (for completed orders).
- **Download Invoice**: Get PDF invoice for the order.

**On the screen, s/he can also:**

- **Copy Credentials**: Click "Copy" buttons to copy username/password.
- **Submit Feedback**: Click "Leave Feedback" button to review the purchase.
- **Contact Support**: Click "Need Help?" to open support chat for this order.
- **Request Refund**: Click "Request Refund" if eligible (within policy timeframe).

### Field Description

| Field Name | Description |
|------------|-------------|
| **Order ID** | Display text; unique order identifier. |
| **Order Status** | Badge; shows current status with color coding. |
| **Product Details** | Display section; shows game, rank, level, and features. |
| **Payment Method** | Display text; shows payment method used. |
| **Total Amount** | Display text; shows final price including discounts. |
| **Account Username** | Text with copy button; delivered account username. |
| **Account Password** | Password field with show/copy buttons; delivered password. |
| **Leave Feedback** | Action button; opens feedback submission form. |
| **Download Invoice** | Action button; generates PDF invoice. |

---

## 2.9 Purchase Game Accounts

**AccArenas**

### Checkout

This screen allows a Customer to select a game account and place an order.

**Checkout Sections**
- Selected account summary
- Quantity selector (if applicable)
- Voucher/promotion code input
- Payment method selection
- Order summary with pricing breakdown
- Terms and conditions

**This screen allows the Customer to:**

- **Review Selection**: See selected game account details and specifications.
- **Apply Voucher**: Enter and apply promotional codes for discounts.
- **Select Payment**: Choose payment method (credit card, e-wallet, bank transfer).
- **Review Total**: See price breakdown including discounts and fees.
- **Place Order**: Click "Complete Purchase" to finalize order.

**On the screen, s/he can also:**

- **Modify Cart**: Click "Edit" to change selected account.
- **Remove Voucher**: Click "Remove" to unapply discount code.
- **View Payment Options**: See available payment methods and fees.
- **Save for Later**: Add to wishlist instead of purchasing immediately.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Account Summary** | Display card; shows selected account details. |
| **Voucher Code** | Text input with "Apply" button; applies discount codes. |
| **Payment Method** | Radio buttons; selects payment option. |
| **Subtotal** | Display text; shows base price. |
| **Discount** | Display text; shows applied discount amount. |
| **Total** | Display text; shows final amount to pay. |
| **Terms Checkbox** | Checkbox; must accept terms to proceed. |
| **Complete Purchase** | Action button; processes payment and creates order. |

---

## 2.10 Make Online Payment

**AccArenas** → **Payment Gateway**

### Payment Processing

This screen/flow handles the integration with external payment systems.

**Payment Flow**
- Redirect to payment gateway
- Payment gateway interface (external)
- Payment confirmation
- Return to AccArenas with result

**This flow allows the System to:**

- **Send Payment Request**: Transmit order details to payment gateway API.
- **Receive Payment Status**: Get confirmation or failure response from gateway.
- **Update Order Status**: Mark order as paid or failed based on payment result.
- **Handle Callbacks**: Process webhook notifications from payment provider.

**During this process:**

- **Customer Interaction**: Customer enters payment details on secure gateway page.
- **Real-time Validation**: Payment gateway validates card/account information.
- **Security Measures**: All payment data is encrypted and PCI-compliant.
- **Error Handling**: System handles payment failures and timeout scenarios.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Payment Gateway URL** | External URL; secure payment page. |
| **Transaction ID** | System-generated; unique payment identifier. |
| **Amount** | Decimal value; total payment amount. |
| **Return URL** | Callback URL; where to redirect after payment. |
| **Payment Status** | Enum; Success, Failed, Pending, Cancelled. |
| **Payment Method** | String; credit card, e-wallet, bank transfer. |

---

## 2.11 Receive Account Credentials

**AccArenas** → **Email Service**

### Account Delivery

This flow handles the secure delivery of purchased account credentials via email.

**Delivery Flow**
- Order completion trigger
- Credential retrieval from inventory
- Email template generation
- Secure email transmission
- Delivery confirmation

**This flow allows the System to:**

- **Retrieve Credentials**: Fetch account username and password from secure storage.
- **Generate Email**: Create formatted email with order details and credentials.
- **Send Securely**: Transmit email through encrypted email service.
- **Log Delivery**: Record email sent status and timestamp.
- **Handle Failures**: Retry failed deliveries and notify staff.

**Email Contents Include:**

- **Order Confirmation**: Order ID, date, and product details.
- **Account Credentials**: Username and password (encrypted in transit).
- **Login Instructions**: Steps to access the purchased account.
- **Support Information**: Contact details for assistance.
- **Security Reminders**: Advice to change password after first login.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Recipient Email** | Customer's registered email address. |
| **Order ID** | Reference number for the order. |
| **Account Username** | Purchased account login username. |
| **Account Password** | Purchased account password (temporary). |
| **Email Template** | HTML formatted email with branding. |
| **Delivery Status** | Sent, Failed, Pending. |
| **Retry Count** | Number of send attempts. |

---

## 2.12 Submit Feedback

**AccArenas**

### Leave Feedback

This screen allows a Customer to submit feedback or reviews for purchased accounts.

**Feedback Form**
- Order/product selection
- Star rating (1-5 stars)
- Review title
- Detailed review text
- Image upload (optional)
- Recommendation checkbox

**This screen allows the Customer to:**

- **Select Purchase**: Choose which purchased account to review.
- **Rate Experience**: Provide star rating from 1 to 5.
- **Write Review**: Enter detailed feedback about the account quality.
- **Upload Images**: Add screenshots or proof (optional).
- **Submit Feedback**: Click "Submit Review" to post feedback.

**On the screen, s/he can also:**

- **Preview Review**: See how review will appear before submitting.
- **Save Draft**: Save incomplete review to finish later.
- **View Guidelines**: Read review guidelines and policies.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Order Selection** | Dropdown; lists eligible purchased orders. |
| **Star Rating** | Interactive stars; 1-5 rating scale. |
| **Review Title** | Text input; short summary of review (max 100 chars). |
| **Review Text** | Text area; detailed feedback (max 1000 chars). |
| **Image Upload** | File input; accepts JPG, PNG; max 5MB, up to 3 images. |
| **Recommend** | Checkbox; "Would you recommend this to others?" |
| **Submit Review** | Action button; posts feedback to system. |

---

## 2.13 Logout

**AccArenas**

### Logout Confirmation

This action allows the Customer to log out from the system securely.

**Logout Flow**
- User clicks logout button
- Optional confirmation dialog
- Session termination
- Redirect to home/login page

**This action allows the Customer to:**

- **End Session**: Securely terminate current login session.
- **Clear Tokens**: Remove authentication tokens from browser.
- **Confirm Logout**: See confirmation message before logging out.

**During logout process:**

- **Session Invalidation**: Server-side session is destroyed.
- **Token Removal**: Client-side tokens are cleared from storage.
- **Redirect**: User is redirected to public home page or login.
- **Security**: All cached sensitive data is cleared.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Logout Button** | Action button; initiates logout process. |
| **Confirmation Dialog** | Modal; "Are you sure you want to logout?" |
| **Confirm Button** | Action button; proceeds with logout. |
| **Cancel Button** | Action button; cancels logout and stays logged in. |

---

## 2.14 View Assigned Orders

**AccArenas**

### My Assigned Orders

This screen allows Sales Staff to view orders assigned to them by the system.

**Assigned Orders Display**
- Order list with assignment date
- Status filters (New, In Progress, Completed)
- Priority indicators
- Search and sort functionality

**This screen allows Sales Staff to:**

- **View Assignments**: See all orders assigned to them.
- **Filter by Status**: Filter orders by fulfillment status.
- **Sort Orders**: Sort by priority, date, or customer name.
- **Search Orders**: Find specific orders by ID or customer.

**On the screen, s/he can also:**

- **Open Order Details**: Click on order to view full information.
- **Update Status**: Quick-update order status from list view.
- **Contact Customer**: Click email/phone icon to contact customer.
- **View Statistics**: See summary of assigned vs completed orders.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Search Bar** | Text input; searches by order ID, customer name. |
| **Status Filter** | Dropdown; filters by order status. |
| **Priority Filter** | Dropdown; filters by priority level (High, Medium, Low). |
| **Order Row** | Display row; shows order ID, customer, product, status, priority. |
| **Status Dropdown** | Quick-action dropdown; updates order status. |
| **View Details** | Link/Button; opens detailed order view. |

---

## 2.15 Monitor Order Fulfillment

**AccArenas**

### Order Fulfillment Dashboard

This screen allows Sales Staff to monitor the delivery and fulfillment status of assigned orders.

**Fulfillment Dashboard**
- Order pipeline view (stages: New → Processing → Delivered → Confirmed)
- Timeline for each order
- Delivery status indicators
- Customer confirmation status

**This screen allows Sales Staff to:**

- **Track Progress**: Monitor orders through fulfillment pipeline.
- **View Timeline**: See detailed timeline of order processing steps.
- **Check Delivery**: Verify if credentials were sent and received.
- **Monitor Confirmations**: See which customers confirmed receipt.

**On the screen, s/he can also:**

- **View Delays**: Identify orders with delayed fulfillment.
- **Resend Credentials**: Trigger credential resend if customer didn't receive.
- **Add Notes**: Add internal notes about order fulfillment.
- **Generate Reports**: Export fulfillment statistics.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Pipeline View** | Kanban-style board; shows orders in different stages. |
| **Order Card** | Draggable card; displays order summary and current stage. |
| **Timeline** | Vertical timeline; shows order history and events. |
| **Delivery Status** | Badge; Email Sent, Delivered, Bounced, Confirmed. |
| **Resend Button** | Action button; resends account credentials. |
| **Notes Section** | Text area; internal notes about order. |

---

## 2.16 Update Order Status

**AccArenas**

### Update Order Status

This screen allows Sales Staff to update order status in exceptional cases (e.g., resend, refund).

**Status Update Form**
- Current order information
- Status selection dropdown
- Reason for update (required for certain statuses)
- Notes field
- Notification options

**This screen allows Sales Staff to:**

- **Change Status**: Update order to different status (Processing, Delivered, Refunded, Cancelled).
- **Provide Reason**: Enter reason for status change (required for refunds/cancellations).
- **Add Notes**: Include internal notes about the status change.
- **Notify Customer**: Choose whether to send customer notification email.

**On the screen, s/he can also:**

- **View History**: See previous status changes and who made them.
- **Attach Files**: Upload supporting documents (e.g., refund approval).
- **Set Follow-up**: Schedule follow-up action or reminder.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Order ID** | Display text; order being updated. |
| **Current Status** | Display badge; current order status. |
| **New Status** | Dropdown; select new status. |
| **Reason** | Text area; required for refund/cancellation. |
| **Internal Notes** | Text area; notes visible only to staff. |
| **Notify Customer** | Checkbox; send email notification to customer. |
| **Update Button** | Action button; saves status change. |

---

## 2.17 Handle Customer Inquiries

**AccArenas**

### Customer Support Inbox

This screen allows Sales Staff to respond to customer inquiries and after-sales support requests.

**Support Inbox**
- Inquiry list with status (New, In Progress, Resolved)
- Customer information panel
- Message thread view
- Quick response templates
- Attachment support

**This screen allows Sales Staff to:**

- **View Inquiries**: See all customer support requests.
- **Filter Requests**: Filter by status, priority, or category.
- **Read Messages**: View complete message thread with customer.
- **Respond**: Send replies to customer inquiries.
- **Use Templates**: Apply quick response templates for common questions.

**On the screen, s/he can also:**

- **Assign to Others**: Reassign inquiry to another staff member.
- **Change Priority**: Update inquiry priority level.
- **Attach Files**: Send files or screenshots to customer.
- **Close Inquiry**: Mark inquiry as resolved.
- **View Order**: Quick link to related order details.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Inquiry List** | Scrollable list; shows all support requests. |
| **Status Filter** | Dropdown; filters by New, In Progress, Resolved. |
| **Priority Badge** | Visual indicator; High, Medium, Low priority. |
| **Message Thread** | Chat-style display; shows conversation history. |
| **Reply Box** | Text area; compose response to customer. |
| **Template Selector** | Dropdown; inserts pre-written response templates. |
| **Send Button** | Action button; sends reply to customer. |
| **Resolve Button** | Action button; marks inquiry as resolved. |

---

## 2.18 View Sales Statistics

**AccArenas**

### My Sales Performance

This screen allows Sales Staff to view personal sales performance and statistics.

**Statistics Dashboard**
- Key metrics (total orders, revenue, completion rate)
- Time period selector (Today, Week, Month, Year)
- Performance charts and graphs
- Top products sold
- Customer satisfaction ratings

**This screen allows Sales Staff to:**

- **View Metrics**: See personal sales performance indicators.
- **Select Period**: Choose time range for statistics.
- **Analyze Trends**: View charts showing sales trends over time.
- **Compare Performance**: See how performance compares to team average.

**On the screen, s/he can also:**

- **Export Data**: Download statistics as PDF or Excel.
- **View Details**: Drill down into specific metrics.
- **Set Goals**: View personal sales targets and progress.
- **Filter by Product**: See statistics for specific game categories.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Total Orders** | Metric card; count of orders handled. |
| **Total Revenue** | Metric card; sum of order values. |
| **Completion Rate** | Metric card; percentage of successfully completed orders. |
| **Period Selector** | Dropdown; Today, This Week, This Month, This Year, Custom. |
| **Sales Chart** | Line/bar chart; visualizes sales over time. |
| **Top Products** | Table; lists best-selling products. |
| **Export Button** | Action button; downloads report. |

---

## 2.19 View Marketing Analytics

**AccArenas**

### Marketing Analytics Dashboard

This screen allows Marketing Staff to view analytics related to products, promotions, and customer engagement.

**Analytics Dashboard**
- Traffic metrics (page views, unique visitors)
- Conversion rates
- Promotion performance
- Product popularity
- Customer engagement metrics
- Revenue by category

**This screen allows Marketing Staff to:**

- **View Traffic**: See website traffic and visitor statistics.
- **Analyze Conversions**: Track conversion rates from browse to purchase.
- **Monitor Promotions**: See which promotions are performing best.
- **Track Engagement**: View customer interaction metrics.

**On the screen, s/he can also:**

- **Compare Periods**: Compare current vs previous period performance.
- **Filter by Category**: View analytics for specific game categories.
- **Export Reports**: Download analytics reports.
- **View Heatmaps**: See user behavior patterns on site.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Page Views** | Metric card; total page views in period. |
| **Conversion Rate** | Metric card; percentage of visitors who purchase. |
| **Active Promotions** | Metric card; count of running promotions. |
| **Revenue Chart** | Line chart; shows revenue trends. |
| **Product Table** | Sortable table; lists products by views/sales. |
| **Period Selector** | Date range picker; selects analysis period. |
| **Export Button** | Action button; downloads analytics report. |

---

## 2.20 Manage Product Listings

**AccArenas**

### Product Management

This screen allows Marketing Staff to create, update, and view game account product listings.

**Product Management Interface**
- Product list with search and filters
- Add new product button
- Edit/delete actions
- Product status toggle (Active/Inactive)
- Bulk actions

**This screen allows Marketing Staff to:**

- **View Products**: See all game account listings.
- **Add Product**: Click "Add New Product" to create listing.
- **Edit Product**: Click edit icon to modify product details.
- **Delete Product**: Remove product listings (with confirmation).
- **Toggle Status**: Activate or deactivate products.

**On the screen, s/he can also:**

- **Search Products**: Find products by name or game.
- **Filter Products**: Filter by game, rank, price range, status.
- **Sort Products**: Sort by date added, price, popularity.
- **Bulk Edit**: Select multiple products for batch operations.
- **Preview**: See how product appears to customers.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Search Bar** | Text input; searches products by name, game. |
| **Add Product** | Action button; opens product creation form. |
| **Product Row** | Display row; shows product image, name, game, rank, price, status. |
| **Edit Icon** | Icon button; opens edit form for product. |
| **Delete Icon** | Icon button; deletes product (with confirmation). |
| **Status Toggle** | Switch; activates/deactivates product listing. |
| **Bulk Select** | Checkboxes; selects multiple products. |

**Product Form Fields:**
- Game category
- Account level/rank
- Features/specifications
- Price
- Images (multiple upload)
- Description
- Stock quantity

---

## 2.21 Manage Promotions

**AccArenas**

### Promotions Management

This screen allows Marketing Staff to create, update, delete, and view promotions and vouchers.

**Promotions Management Interface**
- Promotions list with status indicators
- Add new promotion button
- Edit/delete actions
- Active/expired filters
- Preview functionality

**This screen allows Marketing Staff to:**

- **View Promotions**: See all promotions and vouchers.
- **Create Promotion**: Click "Add New Promotion" to create offer.
- **Edit Promotion**: Modify existing promotion details.
- **Delete Promotion**: Remove promotions (with confirmation).
- **View Performance**: See usage statistics for each promotion.

**On the screen, s/he can also:**

- **Filter Promotions**: Filter by status (Active, Scheduled, Expired).
- **Search Promotions**: Find promotions by code or name.
- **Duplicate Promotion**: Clone existing promotion as template.
- **Preview**: See how promotion appears to customers.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Search Bar** | Text input; searches by promotion name or code. |
| **Add Promotion** | Action button; opens promotion creation form. |
| **Promotion Row** | Display row; shows code, discount, start/end date, usage count, status. |
| **Edit Icon** | Icon button; opens edit form. |
| **Delete Icon** | Icon button; deletes promotion (with confirmation). |
| **Status Badge** | Visual indicator; Active, Scheduled, Expired. |
| **Usage Stats** | Display text; shows times used / usage limit. |

**Promotion Form Fields:**
- Promotion name
- Voucher code
- Discount type (percentage/fixed amount)
- Discount value
- Start date/time
- End date/time
- Usage limit
- Applicable products/categories
- Minimum purchase amount

---

## 2.22 Manage Blogs

**AccArenas**

### Blog Management

This screen allows Marketing Staff to create, update, delete, and view blog posts and news content.

**Blog Management Interface**
- Blog post list with thumbnails
- Add new post button
- Edit/delete/publish actions
- Status filters (Draft, Published, Scheduled)
- Category management

**This screen allows Marketing Staff to:**

- **View Posts**: See all blog posts and news articles.
- **Create Post**: Click "Add New Post" to write new content.
- **Edit Post**: Modify existing blog posts.
- **Delete Post**: Remove blog posts (with confirmation).
- **Publish/Unpublish**: Control post visibility.

**On the screen, s/he can also:**

- **Filter Posts**: Filter by status or category.
- **Search Posts**: Find posts by title or content.
- **Schedule Posts**: Set future publish date/time.
- **Preview**: See how post appears before publishing.
- **Manage Categories**: Create/edit blog categories.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Search Bar** | Text input; searches posts by title. |
| **Add Post** | Action button; opens blog post editor. |
| **Post Row** | Display row; shows thumbnail, title, author, date, status. |
| **Edit Icon** | Icon button; opens post editor. |
| **Delete Icon** | Icon button; deletes post (with confirmation). |
| **Status Badge** | Visual indicator; Draft, Published, Scheduled. |
| **Publish Button** | Action button; publishes draft post. |

**Blog Post Editor Fields:**
- Title
- Featured image
- Content (rich text editor)
- Excerpt/summary
- Category
- Tags
- SEO meta description
- Publish date/time
- Author

---

## 2.23 Manage Banners

**AccArenas**

### Banner Management

This screen allows Marketing Staff to manage banners displayed on the system.

**Banner Management Interface**
- Banner list with preview thumbnails
- Add new banner button
- Edit/delete actions
- Position/placement selector
- Active/inactive toggle
- Display order management

**This screen allows Marketing Staff to:**

- **View Banners**: See all promotional banners.
- **Add Banner**: Click "Add New Banner" to create banner.
- **Edit Banner**: Modify banner image, link, and settings.
- **Delete Banner**: Remove banners (with confirmation).
- **Reorder Banners**: Drag and drop to change display order.

**On the screen, s/he can also:**

- **Toggle Status**: Activate or deactivate banners.
- **Set Position**: Choose where banner appears (home, category pages).
- **Schedule Display**: Set start and end dates for banner.
- **Preview**: See how banner appears on site.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Add Banner** | Action button; opens banner creation form. |
| **Banner Row** | Display row; shows thumbnail, title, position, status, order. |
| **Preview Image** | Thumbnail; shows banner image. |
| **Edit Icon** | Icon button; opens edit form. |
| **Delete Icon** | Icon button; deletes banner (with confirmation). |
| **Status Toggle** | Switch; activates/deactivates banner. |
| **Drag Handle** | Icon; allows reordering banners. |

**Banner Form Fields:**
- Banner image (upload)
- Title/alt text
- Link URL
- Position (homepage, category page, etc.)
- Display order
- Start date/time
- End date/time
- Active status

---

## 2.24 Manage Sliders

**AccArenas**

### Homepage Slider Management

This screen allows Marketing Staff to manage homepage sliders.

**Slider Management Interface**
- Slider list with preview
- Add new slide button
- Edit/delete actions
- Display order management
- Active/inactive toggle
- Transition settings

**This screen allows Marketing Staff to:**

- **View Slides**: See all homepage slider images.
- **Add Slide**: Click "Add New Slide" to create slider item.
- **Edit Slide**: Modify slide image, text, and link.
- **Delete Slide**: Remove slides (with confirmation).
- **Reorder Slides**: Drag and drop to change display sequence.

**On the screen, s/he can also:**

- **Toggle Status**: Activate or deactivate slides.
- **Set Timing**: Configure slide duration and transition.
- **Preview Slider**: See how slider appears on homepage.
- **Configure Settings**: Set auto-play, navigation options.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Add Slide** | Action button; opens slide creation form. |
| **Slide Row** | Display row; shows thumbnail, title, link, order, status. |
| **Preview Image** | Thumbnail; shows slide image. |
| **Edit Icon** | Icon button; opens edit form. |
| **Delete Icon** | Icon button; deletes slide (with confirmation). |
| **Status Toggle** | Switch; activates/deactivates slide. |
| **Drag Handle** | Icon; allows reordering slides. |

**Slide Form Fields:**
- Slide image (upload, recommended size)
- Heading text
- Subheading text
- Call-to-action button text
- Link URL
- Display order
- Active status

**Slider Settings:**
- Auto-play enabled
- Slide duration (seconds)
- Transition effect
- Show navigation arrows
- Show pagination dots

---

## 2.25 Manage Account Categories

**AccArenas**

### Game Category Management

This screen allows Marketing Staff to create, update, and view game account categories.

**Category Management Interface**
- Category list with hierarchy
- Add new category button
- Edit/delete actions
- Category icon/image
- Active/inactive toggle

**This screen allows Marketing Staff to:**

- **View Categories**: See all game account categories.
- **Add Category**: Click "Add New Category" to create category.
- **Edit Category**: Modify category name, icon, and details.
- **Delete Category**: Remove categories (with confirmation, if no products).
- **Manage Hierarchy**: Set parent-child category relationships.

**On the screen, s/he can also:**

- **Toggle Status**: Activate or deactivate categories.
- **Reorder Categories**: Change display order on site.
- **View Products**: See products in each category.
- **Upload Icon**: Add category icon/image.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Add Category** | Action button; opens category creation form. |
| **Category Row** | Display row; shows icon, name, product count, status. |
| **Category Icon** | Image; visual identifier for category. |
| **Edit Icon** | Icon button; opens edit form. |
| **Delete Icon** | Icon button; deletes category (if empty). |
| **Status Toggle** | Switch; activates/deactivates category. |
| **Product Count** | Display text; number of products in category. |

**Category Form Fields:**
- Category name
- Category icon/image (upload)
- Description
- Parent category (for subcategories)
- Display order
- Active status
- SEO meta description

---

## 2.26 Manage User Accounts

**AccArenas**

### User Account Management

This screen allows Admin to create, update, view, and manage system user accounts.

**User Management Interface**
- User list with role badges
- Add new user button
- Edit/delete/suspend actions
- Role filter
- Status filter (Active, Suspended)
- Search functionality

**This screen allows Admin to:**

- **View Users**: See all system users (staff and customers).
- **Add User**: Click "Add New User" to create account.
- **Edit User**: Modify user information and settings.
- **Suspend User**: Temporarily disable user access.
- **Delete User**: Remove user accounts (with confirmation).

**On the screen, s/he can also:**

- **Filter by Role**: Filter users by role (Admin, Marketing, Sales, Customer).
- **Search Users**: Find users by name, email, or ID.
- **View Activity**: See user login history and activity.
- **Reset Password**: Force password reset for users.
- **Export Users**: Download user list as CSV/Excel.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Search Bar** | Text input; searches by name, email, ID. |
| **Add User** | Action button; opens user creation form. |
| **Role Filter** | Dropdown; filters by user role. |
| **Status Filter** | Dropdown; filters by Active, Suspended. |
| **User Row** | Display row; shows name, email, role, status, last login. |
| **Edit Icon** | Icon button; opens edit form. |
| **Suspend Icon** | Icon button; suspends/activates user. |
| **Delete Icon** | Icon button; deletes user (with confirmation). |

**User Form Fields:**
- Full name
- Email address
- Phone number
- Role assignment
- Password (for new users)
- Status (Active/Suspended)
- Profile picture

---

## 2.27 Re-assign User Role

**AccArenas**

### Role Assignment

This screen allows Admin to assign or change roles of system users.

**Role Assignment Interface**
- User selection
- Current role display
- New role selector
- Role permissions preview
- Confirmation dialog

**This screen allows Admin to:**

- **Select User**: Choose user whose role to change.
- **View Current Role**: See user's current role and permissions.
- **Assign New Role**: Select new role from dropdown.
- **Preview Permissions**: See what permissions new role grants.
- **Confirm Change**: Click "Update Role" to apply change.

**On the screen, s/he can also:**

- **View Role Details**: See detailed permissions for each role.
- **Bulk Assignment**: Assign roles to multiple users at once.
- **View History**: See role change history for user.
- **Notify User**: Send email notification about role change.

### Field Description

| Field Name | Description |
|------------|-------------|
| **User Selector** | Searchable dropdown; selects user to modify. |
| **Current Role** | Display badge; shows user's current role. |
| **New Role** | Dropdown; selects new role to assign. |
| **Permissions List** | Display list; shows permissions for selected role. |
| **Notify User** | Checkbox; sends email notification. |
| **Update Role** | Action button; applies role change. |
| **Cancel** | Action button; cancels operation. |

**Available Roles:**
- Admin (full system access)
- Marketing Staff (product, promotion, content management)
- Sales Staff (order fulfillment, customer support)
- Customer (browse and purchase)

---

## 2.28 Manage Roles

**AccArenas**

### Role Management

This screen allows Admin to create, update, delete, and view system roles.

**Role Management Interface**
- Role list with permission summary
- Add new role button
- Edit/delete actions
- Permission matrix
- User count per role

**This screen allows Admin to:**

- **View Roles**: See all system roles and their permissions.
- **Create Role**: Click "Add New Role" to create custom role.
- **Edit Role**: Modify role name and permissions.
- **Delete Role**: Remove custom roles (with confirmation, if no users).
- **Manage Permissions**: Configure what each role can access.

**On the screen, s/he can also:**

- **View Users**: See which users have each role.
- **Clone Role**: Duplicate existing role as template.
- **Preview Access**: See what pages/features role can access.
- **Set Default**: Mark role as default for new users.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Add Role** | Action button; opens role creation form. |
| **Role Row** | Display row; shows role name, user count, permissions summary. |
| **Edit Icon** | Icon button; opens edit form. |
| **Delete Icon** | Icon button; deletes role (if no users). |
| **User Count** | Display text; number of users with this role. |
| **Permissions** | Expandable list; shows all permissions. |

**Role Form Fields:**
- Role name
- Description
- Permission checkboxes:
  - View products
  - Manage products
  - View orders
  - Manage orders
  - View users
  - Manage users
  - View analytics
  - Manage promotions
  - Manage content
  - System settings

---

## 2.29 View Financial Reports

**AccArenas**

### Financial Reports Dashboard

This screen allows Admin to view system-wide financial and revenue reports.

**Financial Dashboard**
- Revenue metrics (total, by period)
- Payment method breakdown
- Refund statistics
- Profit margins
- Revenue by category
- Time period selector
- Export functionality

**This screen allows Admin to:**

- **View Revenue**: See total revenue and trends.
- **Analyze Payments**: View breakdown by payment method.
- **Track Refunds**: Monitor refund rates and amounts.
- **Compare Periods**: Compare current vs previous period.
- **View by Category**: See revenue per game category.

**On the screen, s/he can also:**

- **Select Period**: Choose time range (Day, Week, Month, Quarter, Year).
- **Export Reports**: Download as PDF or Excel.
- **View Charts**: See visual representations of financial data.
- **Drill Down**: Click metrics to see detailed transactions.
- **Set Alerts**: Configure alerts for revenue thresholds.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Total Revenue** | Metric card; sum of all revenue in period. |
| **Total Orders** | Metric card; count of completed orders. |
| **Avg Order Value** | Metric card; average transaction amount. |
| **Refund Rate** | Metric card; percentage of orders refunded. |
| **Period Selector** | Dropdown; selects reporting period. |
| **Revenue Chart** | Line/bar chart; visualizes revenue over time. |
| **Payment Breakdown** | Pie chart; shows payment method distribution. |
| **Category Table** | Sortable table; revenue by game category. |
| **Export Button** | Action button; downloads report. |

---

## 2.30 Configure System Settings

**AccArenas**

### System Configuration

This screen allows Admin to configure system parameters and operational settings.

**Settings Sections**
- General settings (site name, logo, contact)
- Email settings (SMTP configuration)
- Payment gateway settings
- Security settings (password policy, session timeout)
- Notification settings
- Maintenance mode

**This screen allows Admin to:**

- **Update General Info**: Modify site name, logo, contact information.
- **Configure Email**: Set up SMTP server for system emails.
- **Manage Payments**: Configure payment gateway credentials.
- **Set Security**: Define password policies and security rules.
- **Control Notifications**: Enable/disable system notifications.

**On the screen, s/he can also:**

- **Test Email**: Send test email to verify SMTP settings.
- **Enable Maintenance**: Put site in maintenance mode.
- **Backup Settings**: Export current configuration.
- **Restore Settings**: Import previous configuration.
- **View Logs**: Access system logs and error reports.

### Field Description

| Field Name | Description |
|------------|-------------|
| **Site Name** | Text input; name displayed on site. |
| **Site Logo** | Image upload; main logo file. |
| **Contact Email** | Email input; main contact address. |
| **SMTP Host** | Text input; email server hostname. |
| **SMTP Port** | Number input; email server port. |
| **SMTP Username** | Text input; email authentication username. |
| **SMTP Password** | Password input; email authentication password. |
| **Payment Gateway** | Dropdown; selects payment provider. |
| **API Key** | Text input; payment gateway API key. |
| **Min Password Length** | Number input; minimum password characters. |
| **Session Timeout** | Number input; minutes before auto-logout. |
| **Maintenance Mode** | Toggle switch; enables/disables maintenance. |
| **Save Settings** | Action button; saves all configuration changes. |

---

*End of Use Case Descriptions*
