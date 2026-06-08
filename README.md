# Inventory Management System

## Intern Information

**Intern ID:** CITS3291

**Developed By:** Rivera Jovita

**Project:** Inventory Management System

---

## Project Overview

The Inventory Management System is a full-stack web application developed to simplify inventory tracking and stock management for organizations. The system provides secure role-based authentication and allows administrators and staff members to manage products efficiently through an interactive dashboard.

The application is built using modern web technologies and follows a client-server architecture, making it scalable and easy to maintain.

---

## Features

* Role-based authentication (Admin and Staff)
* Secure login system using JWT
* Interactive dashboard
* Product and inventory management
* Add, update, and delete inventory items
* Stock quantity monitoring
* Responsive and modern user interface
* MongoDB database integration
* RESTful API architecture

---

## Technology Stack

### Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Lucide React Icons
* React Hot Toast

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Token (JWT)

---

## Project Structure

```text
inventory-system/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/inventory-management-system.git
```

### Backend Setup

```bash
cd inventory-system/backend
npm install
npm run dev
```

### Frontend Setup

Open another terminal and run:

```bash
cd inventory-system/frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend folder and add:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## Running the Application

### Start MongoDB Service

Ensure MongoDB is installed and running.

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
npm run dev
```

### Open Application

```
http://localhost:3000
```

---

## Demo Accounts

### Admin

**Email:** [admin@inventory.com](mailto:admin@inventory.com)

**Password:** admin123

### Staff

**Email:** [staff@inventory.com](mailto:staff@inventory.com)

**Password:** staff123

---

## Future Enhancements

* Barcode scanning integration
* Email notifications
* Sales and purchase reports
* Multi-warehouse management
* Export inventory reports to PDF and Excel
* Cloud deployment
* Advanced analytics dashboard

---

## Learning Outcomes

This project helped in understanding:

* Full-stack web development
* REST API development
* MongoDB database integration
* User authentication with JWT
* React component architecture
* State management
* Backend and frontend integration
* Git and GitHub version control

---

## Author

**Rivera Jovita**

Karunya Institute of Technology and Sciences

Intern ID: **CITS3291**

---

## License

This project is developed for educational and internship purposes.
inventory-management-system/
│
├── 01  .gitignore
├── 02  README.md
├── 03  package.json
│
├── backend/
│   ├── 04  .env.example
│   ├── 05  server.js
│   ├── 06  package.json
│   │
│   ├── config/
│   │   └── 07  db.js
│   │
│   ├── controllers/
│   │   ├── 08  analyticsController.js
│   │   ├── 09  authController.js          
│   │   ├── 10  logController.js
│   │   ├── 11  productController.js
│   │   ├── 12  stockController.js
│   │   ├── 13  transactionController.js
│   │   └── 14  userController.js
│   │
│   ├── middleware/
│   │   ├── 15  auth.js                    
│   │   ├── 16  errorHandler.js
│   │   └── 17  rateLimiter.js
│   │
│   ├── models/
│   │   ├── 18  ActivityLog.js
│   │   ├── 19  Product.js
│   │   ├── 20  Transaction.js
│   │   └── 21  User.js                    
│   │
│   ├── routes/
│   │   ├── 22  analytics.js
│   │   ├── 23  auth.js
│   │   ├── 24  logs.js
│   │   ├── 25  products.js
│   │   ├── 26  stock.js
│   │   ├── 27  transactions.js
│   │   └── 28  users.js
│   │
│   └── utils/
│       ├── 29  logger.js
│       └── 30  seed.js
│
└── frontend/
    ├── 31  .env.example
    ├── 32  index.html
    ├── 33  package.json
    ├── 34  postcss.config.js
    ├── 35  tailwind.config.js
    ├── 36  vite.config.js
    │
    └── src/
        ├── 37  App.jsx
        ├── 38  index.css
        ├── 39  main.jsx
        │
        ├── components/
        │   ├── common/
        │   │   ├── 40  Modal.jsx
        │   │   ├── 41  Table.jsx
        │   │   └── 42  UI.jsx
        │   ├── layout/
        │   │   └── 43  Layout.jsx
        │   └── ui/
        │       ├── 44  SmokeyBackground.jsx   
        │       └── 45  login-form.jsx          
        │
        ├── context/
        │   └── 46  AuthContext.jsx
        │
        ├── pages/
        │   ├── 47  AnalyticsPage.jsx
        │   ├── 48  DashboardPage.jsx
        │   ├── 49  LoginPage.jsx              
        │   ├── 50  LogsPage.jsx
        │   ├── 51  ProductsPage.jsx
        │   ├── 52  StockPage.jsx
        │   ├── 53  TransactionsPage.jsx
        │   └── 54  UsersPage.jsx
        │
        └── services/
            └── 55  api.js
