# 🚀 Leave Management System (LMS)

A **full-stack Leave Management System** built with **Node.js, Express, Sequelize (PostgreSQL/MySQL)** on the backend and **React.js** on the frontend.

The system provides two roles:  
👨‍💼 **HR/Admin** – Manage employees, approve/reject leave requests, view reports.  
👩‍💻 **Employees** – Apply for leave, view leave history, check balances.

---

## 🏗️ System Architecture

### 🔗 Frontend–Backend Interaction

**Authentication:** JWT-based login for both HR and Employees.

**Employees**  
- Apply for leave → `POST /api/v1/leaves/apply`  
- View leave requests → `GET /api/v1/leaves/my`  
- View profile → `GET /api/v1/employees/:id`

**HR/Admin**  
- Manage employees → `GET/POST/PUT/DELETE /api/v1/employees`  
- Approve/Reject leave → `PUT /api/v1/leaves/:id/status`  
- View leave directory → `GET /api/v1/leaves`

---

## ⚙️ Setup Instructions

### 1. Clone Repository
git clone <repository-url>
cd leave-management-system

text

### 2. Backend Setup

- Create a `.env` file in the root directory with the following environment variables:
PORT=3502
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=<your_email_password>
BCRYPT_SALT_ROUNDS=10
JWT_SECRET=<super_secure_random_string>
JWT_EXPIRES=1h
HR_EMAIL=hr@company.com
HR_PASSWORD=Symplora-Hr@12345

text

- Run database migrations:
npx sequelize db:migrate

text

- Start the backend server:
npm run dev

text

### 3. Frontend Setup

- Update backend URL in `src/utils/apiClient.js` if needed.

- Start the frontend:
npm start

text

---

## 📂 Project Structure

backend/
src/
config/
controllers/
middlewares/
models/
repositories/
routes/
services/
utils/
migrations/
seeders/
frontend/
src/
components/
pages/
utils/
apiClient.js

text

---

## 👨‍💼 HR Dashboard Features
- View all employees (directory).  
- Add/Edit/Delete employees.  
- View individual employee profile (with joining date & last taken leave).  
- Approve/Reject leave requests.  
- View leave requests sorted by status.

## 👩‍💻 Employee Features
- Apply for leave (with type, dates, reason).  
- View leave history with status.  
- Check remaining leave balance.  
- Edit profile details (optional).

---

## 📌 Assumptions
- Only **one HR/Admin account** is seeded via `.env`.  
- Employees are created by HR (auto-generates login credentials).  
- Leave balance is initialized with **44 days** per employee.  
- Emails are sent via configured Gmail SMTP (`EMAIL_USER`, `EMAIL_PASS`).

---

## 🔮 Potential Improvements
- ✅ Role-based access control (RBAC middleware)  
- ✅ Pagination & filtering in employee/leave directory  
- ✅ Attendance integration  
- ✅ Reporting dashboard (monthly leave trends, department-level stats)  
- ✅ Notification system (Slack/Teams/Email)  
- ✅ Dockerize frontend & backend for deployment

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Axios, CSS  
- **Backend:** Node.js, Express, Sequelize ORM  
- **Database:** PostgreSQL / MySQL  
- **Authentication:** JWT (Access + Refresh tokens)  
- **Email:** Nodemailer (SMTP)

---

## 📌 Author
[Your Name]  
📧 Contact: [jyotiranjan.pvt@gmail.com]
---