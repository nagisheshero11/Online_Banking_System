# 🏦 BANKIFY — Online Banking System

**BANKIFY** is a full-stack online banking web application built using **React (frontend)** and **Spring Boot (backend)**, featuring secure user authentication, account management, money transfers, and transaction history tracking.

This project simulates core online banking operations — from creating an account to transferring money securely, viewing account balances, and tracking transaction histories.

---

## 📘 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Architecture](#-architecture)
5. [Backend Overview](#-backend-overview)
6. [Frontend Overview](#-frontend-overview)
7. [API Endpoints](#-api-endpoints)
8. [Setup & Installation](#-setup--installation)
9. [Database Schema](#-database-schema)
10. [Security](#-security)
11. [Screens & Flow](#-screens--flow)
12. [Testing Guide](#-testing-guide)
13. [Future Enhancements](#-future-enhancements)
14. [Contributors](#-contributors)
15. [License](#-license)

---

## 📄 Overview

BANKIFY is a mock online banking system that demonstrates:

* Secure user onboarding with account creation
* JWT-based authentication
* Account and balance management
* Secure money transfer operations with validations
* Real-time transaction history with categorized views

It’s designed to model **real-world banking workflows**, focusing on clean architecture, reusability, and maintainability.

---

## ⚙️ Features

### User & Account Management

* Register users with unique account numbers (e.g., `BKSV1234567`, `BKCR1234567`)
* Automatic account creation on signup
* Default balance initialization (`₹200,000`)
* Separate account types: **Savings** and **Current**
* View account profile and details

### Security & Authentication

* JWT (JSON Web Token) based authentication and authorization
* BCrypt password hashing
* Role-based access (default: `USER`)
* Full CORS integration with frontend

### Transaction System

* Transfer funds between accounts with limit validation
* Enforced transaction limits:

  * Savings: ₹50,000 max
  * Current: ₹200,000 max
* Real-time debit/credit balance updates
* Transaction history persisted in MySQL
* Differentiated transaction views:

  * “Debited” for sender
  * “Credited” for receiver

### Transaction History Page

* Displays live data fetched from backend
* Filter by type (`Debited`, `Credited`, `All`)
* Search by transaction ID or remarks
* Option to download statement
* Clean modern UI with responsive design

---

## 💻 Tech Stack

| Layer           | Technology                              |
| --------------- | --------------------------------------- |
| **Frontend**    | React.js, React Router, Fetch API, CSS3 |
| **Backend**     | Spring Boot 3.x, Java 17                |
| **Security**    | Spring Security 6.x, JWT                |
| **Database**    | MySQL 8.x                               |
| **ORM**         | Hibernate / JPA                         |
| **Build Tools** | Maven (backend), npm (frontend)         |

---

## 🏗️ Architecture

**Layered architecture pattern** (presentation → business → persistence):

```
Frontend (React)
│
└── REST API calls via Fetch
    │
    ▼
Spring Boot (Controller → Service → Repository)
│
└── MySQL Database
```

Communication between frontend and backend occurs through secure REST endpoints authenticated via JWT tokens.

---

## 🔧 Backend Overview

**Package Structure**

```
com.banking.server
│
├── config
│   └── CorsConfig.java
├── controller
│   ├── AuthController.java
│   ├── AccountController.java
│   └── TransferController.java
├── dto
│   ├── SignupRequest.java
│   ├── LoginRequest.java
│   ├── TransferRequest.java
│   ├── TransferResponse.java
│   └── AccountResponse.java
├── entity
│   ├── User.java
│   ├── Account.java
│   └── Transaction.java
├── repository
│   ├── UserRepository.java
│   ├── AccountRepository.java
│   └── TransactionRepository.java
├── service
│   ├── AuthService.java
│   ├── TransferService.java
│   └── UserService.java
└── security
    ├── JwtUtils.java
    ├── JwtAuthenticationFilter.java
    └── SecurityConfig.java
```

**Core Responsibilities**

* **AuthService** – handles registration, login, and token generation
* **TransferService** – processes fund transfers atomically using `@Transactional`
* **AccountController** – fetches user accounts and allows limit updates
* **TransferController** – performs transfer operations and returns transaction data
* **TransactionRepository** – persists and fetches transaction logs

---

## 🎨 Frontend Overview

**Folder Structure**

```
client/
│
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Profile.jsx
│   │   ├── AccountDetails.jsx
│   │   ├── TransferMoney.jsx
│   │   └── Transactions.jsx
│   ├── services/
│   │   ├── authAPI.js
│   │   ├── accountAPI.js
│   │   └── transactionAPI.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Layout.jsx
│   └── styles/
│       ├── AccountDetails.css
│       ├── TransferMoney.css
│       └── Transaction.css
```

### Frontend Features

* Fully token-based authentication flow (login, protected routes)
* Reusable service API modules
* Inline editable transaction limit (PATCH request)
* Dynamic transaction table (color-coded credits/debits)
* Responsive dashboard UI

---

## 🔗 API Endpoints

### **Authentication**

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| POST   | `/api/user/signup` | Register a new user         |
| POST   | `/api/user/login`  | Login and receive JWT token |

### **Account Management**

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| GET    | `/api/account/me`    | Get logged-in user’s account     |
| PUT    | `/api/account/limit` | Update transaction limit         |
| GET    | `/api/account/all`   | Get all accounts (admin/testing) |

### **Transactions**

| Method | Endpoint                    | Description                             |
| ------ | --------------------------- | --------------------------------------- |
| POST   | `/api/account/transfer`     | Transfer money between accounts         |
| GET    | `/api/account/transactions` | Get all transactions for logged-in user |

---

## ⚙️ Setup & Installation

### Prerequisites

* Java 17+
* Maven 3+
* MySQL 8+
* Node.js 18+
* npm or yarn

---

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/bankify.git
cd bankify/server

# Configure application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/banking_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# Build & Run
mvn clean install
mvn spring-boot:run
```

Server runs on:
👉 `http://localhost:6060`

---

### Frontend Setup

```bash
cd bankify/client
npm install
npm start
```

Frontend runs on:
👉 `http://localhost:3000`

---

## 🗃️ Database Schema

**User Table**

| Column        | Type         | Description       |
| ------------- | ------------ | ----------------- |
| id            | bigint       | Primary key       |
| firstName     | varchar(50)  | User’s first name |
| username      | varchar(50)  | Unique username   |
| email         | varchar(100) | Unique email      |
| password      | varchar(255) | Encrypted         |
| accountNumber | varchar(20)  | Linked account    |
| role          | varchar(10)  | Role (USER/ADMIN) |

**Account Table**

| Column           | Type          | Description         |
| ---------------- | ------------- | ------------------- |
| id               | bigint        | Primary key         |
| username         | varchar(50)   | Linked username     |
| accountNumber    | varchar(20)   | Account number      |
| balance          | decimal(15,2) | Current balance     |
| ifscCode         | varchar(10)   | Bank IFSC           |
| accountType      | varchar(20)   | Savings/Current     |
| transactionLimit | decimal(15,2) | Max transfer amount |

**Transaction Table**

| Column            | Type          | Description         |
| ----------------- | ------------- | ------------------- |
| transactionId     | bigint        | Primary key         |
| fromAccountNumber | varchar(20)   | Sender account      |
| toAccountNumber   | varchar(20)   | Receiver account    |
| amount            | decimal(15,2) | Transfer amount     |
| status            | varchar(20)   | COMPLETED / FAILED  |
| remarks           | varchar(255)  | Transaction message |
| createdAt         | timestamp     | Transaction time    |

---

## 🔒 Security

* **JWT Authentication**

  * Token issued during login
  * Required in Authorization header for all `/api/account/**` calls
  * Expiration: 1 hour

* **CORS Configured For:**

  * `http://localhost:3000` (React frontend)
  * Methods: GET, POST, PUT, PATCH, DELETE

* **Spring Security Chain:**

  * Stateless session
  * Preflight OPTIONS allowed
  * Custom JWT authentication filter

---

## 🧭 Screens & Flow

1. **Signup →** Validate form → Auto-create account
2. **Login →** Receive JWT → Store in localStorage
3. **Dashboard →** Displays profile & account details
4. **Transfer Money →** Secure API call → Balance updates
5. **Transaction History →** Shows all past transfers with type-based styling

---

## 🧪 Testing Guide

**Manual Testing with Postman**

1. `POST /api/user/signup` – create test users
2. `POST /api/user/login` – obtain JWT
3. `GET /api/account/me` – verify token access
4. `POST /api/account/transfer` – perform fund transfers
5. `GET /api/account/transactions` – verify transaction logs

**Frontend Testing**

* Validate form input restrictions
* Test token expiry handling
* Check CORS preflight success
* Validate debit/credit rendering per user

---

## 🚀 Future Enhancements

* Add Admin Dashboard (view all users & transactions)
* Implement OTP-based transfer authentication
* Enable file download for statements (PDF/CSV)
* Add date range & pagination filters to transactions
* Integrate real-time notifications via WebSocket
* Add dark mode UI

---

## 👥 Contributors

** Teammate Developers (Backend & Frontend) **

* M. Sravan Kumar
* P. Hemanth Sai
* Y. Saran Kumar



