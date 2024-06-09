# Neverforever Admin

## Overview
Neverforever Admin is the administrative interface for the Neverforever E-commerce platform. It is a full-stack web application designed for managing products, orders, suppliers, and users within the Neverforever E-commerce system. The front-end is built with React, and the back-end is powered by Node.js, Express, and MySQL.

## Features
- Admin authentication and authorization
- User management
- Supplier Management
- Product management 
- Order management
- Dashboard with key metrics and statistics

## Technologies Used
- **Front-end:** React
- **Back-end:** Node.js, Express
- **Database:** MySQL
- **Styling:** TailwindCSS, Bootstrap

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- MySQL

## Installation

### Clone the Repository
```bash
git clone https://github.com/isabellelbgn/neverforever-admin.git
cd neverforever-admin

## Backend Setup
1. Install dependencies
```bash
cd backend
npm install
```

2. Database Configuration:
- Create a MySQL database.
- Update the environment variables (.env) with your database credentials.
```bash
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

3. Run Migrations:
```bash
npx sequelize db:migrate
```

4. Start the Backend Server:
```bash
npm start
```

## Frontend Setup
1. Install Dependencies:
```bash
cd ../frontend
npm install
```

2. Environment Variables:
- Update .env and update the environment variables if needed.
```bash
REACT_APP_API_URL=http://localhost:5000
```

3. Start the Frontend Server:
```bash
npm start
```

# Usage
## Admin Authentication
- Admins can log in using their credentials to access the admin panel.
## User Management
- Admins can view, add, edit, and delete users.
## Supplier Management
- Admins can manage supplier information, including adding, updating, and deleting suppliers.
## Product Management
- Admins can manage product listings, including adding new products, editing existing ones, and deleting products.
## Order Management
- Admins can view and manage customer orders, update order statuses, and handle returns.
## Dashboard
- The dashboard provides key metrics and statistics about the e-commerce platform, such as total sales, number of users, and order statistics.

