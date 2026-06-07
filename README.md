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
