GoodGuys is a web-based platform built to manage and streamline data flow between clients and vendors for design-based services. This system allows both parties to collaborate efficiently through tools like purchase tracking, challan generation, activity logging, and payment management.

🚀 Project Overview
The GoodGuys website serves as a centralized platform for seamless collaboration between clients and vendors in design-based services.

Clients can submit design requirements, view proposals, monitor project progress, and generate challans, invoices, and proformas. The system maintains a complete transactional history of purchases, sales, and payments involving both vendors and clients.

All financial activities and exchanges are managed transparently by the GoodGuys team. At any point, a detailed account summary PDF can be generated, providing a comprehensive view of all project-related data—enabling smooth communication and decision-making for further processing.



⚙️ Installation
To install and run the project locally, follow these steps:

bash
Copy
Edit
# Step 1: Install PHP dependencies
composer install

# Step 2: Generate application key
php artisan key:generate

# Step 4: Seed The Database

the following command will seed the database with dummy user.
username: admin@admin.com
password: @Admin123

php artisan db:seed



# Step 3: Install Node.js dependencies
npm install

# Step 4: Build frontend assets
npm run build or run via local server by npm run dev

# Step 5: Start the Laravel server
php artisan serve
Once started, visit the provided local address (typically http://127.0.0.1:8000) to access the application.

🧑‍💻 Available Commands
To build assets for production, run:

bash
Copy
Edit
npm run build
📦 Features
🧾 Purchase List & Challan Management

📅 Activity Tracking (Clients & Vendors)

💰 Payment Flow and Balances

📊 Dashboard Overview

🔐 Authentication (Login/Register/Forgot Password)

🎨 Responsive UI (Based on Sneat Laravel Template)

📁 Pages Included
Account Settings

Login / Register / Forgot Password

Error and Maintenance Pages

User Dashboard

Purchase List, Vendor Management

Payment Summary and History

🖥️ Tech Stack
Laravel (PHP backend)

Inertia.js + React (Frontend)

MySQL

Bootstrap 5 (via Sneat)

Npm, Vite


Tested on the latest versions of:

Chrome, Firefox and Safari
