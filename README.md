# Civic Issue Reporting System

A full-stack MERN web application for crowdsourced civic issue reporting and resolution, designed for municipal/government use.

## Features

- **OTP-based Authentication** — Passwordless login via email OTP for citizens
- **Role-based Access Control** — Three roles: Citizen, Councillor, Admin
- **Complaint Submission** — Citizens report civic issues with location, category, and image
- **Complaint Management** — Admins/Councillors can view, filter, and update complaint status
- **Ward Management** — Admin can create and manage municipal wards and councillors
- **Geolocation Support** — Map-based location picker for complaints

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas) + Mongoose |
| Auth | JWT + Nodemailer OTP |
| Maps | Leaflet.js |

## Project Structure

```
Civic Issue Reporting System/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── middleware/      # Auth middleware
│   ├── config/          # DB connection
│   ├── seed.js          # Sample data seeder
│   └── server.js        # Entry point
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Page-level components
        ├── context/     # Auth context
        └── api/         # Axios instance
```

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/civic-issue-reporting-system.git
cd civic-issue-reporting-system
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# Optional: for real email OTP delivery
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_google_app_password
```
> If Gmail credentials are not provided, OTP will be printed to the backend console for development.

### 4. Seed the Database (Optional)
```bash
cd backend
node seed.js
```
This creates sample wards, councillor accounts, and complaint data.

### 5. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 6. Run the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend (in a separate terminal):**
```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`  
Backend runs at `http://localhost:5000`

## Demo Accounts (after seeding)

| Role | Email |
|------|-------|
| Admin | admin@civic.gov |
| Councillor (Ward 1) | ward1@dindigul.gov |
| Citizen | arjun@example.com |

> OTP will print to the backend terminal if Gmail is not configured for only users.
