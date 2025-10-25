Marketing Automation System

A modern web platform designed to help companies efficiently manage marketing, sales, and operational data.
This project includes Company, Marketer, and Sales dashboards, each with tailored tools and insights.

🧭 Overview

This system allows businesses to:

Register their companies and manage teams (marketers and sales staff).

Track marketing campaigns, leads, and client engagement.

Monitor sales performance and manage transactions.

Visualize real-time analytics across departments using Supabase and React.

🏗️ Tech Stack
Category	Technology
Frontend	React + Vite + Tailwind CSS + shadcn/ui + Lucide Icons
Backend	Supabase (PostgreSQL, Auth, Storage, Realtime)
Deployment	Vercel / Netlify (Frontend), Supabase (Backend)
State Management	Context API
Authentication	Supabase Auth (Email/Password)


🧩 Database Schema (Supabase)
🏢 companies
Column	Type	Description
id	uuid	Primary key
name	text	Company name
business_type	text	e.g., Retail, Services, etc.
location	text	Company location
phone	text	Contact number
email	text	Company email
created_at	timestamp	Record creation date
👨‍💼 users
Column	Type	Description
id	uuid	Primary key
company_id	uuid	FK → companies.id
name	text	Full name
email	text	Email address
phone	text	Contact number
role	text	Enum: admin, marketer, sales
password	text	(Managed by Supabase Auth)
created_at	timestamp	Record creation date
📊 campaigns
Column	Type	Description
id	uuid	Primary key
company_id	uuid	FK → companies.id
marketer_id	uuid	FK → users.id
name	text	Campaign name
description	text	Campaign details
budget	numeric	Allocated budget
start_date	date	Campaign start date
end_date	date	Campaign end date
status	text	Enum: active, paused, completed
created_at	timestamp	Record creation date
💰 sales
Column	Type	Description
id	uuid	Primary key
company_id	uuid	FK → companies.id
sales_person_id	uuid	FK → users.id
client_name	text	Customer name
product	text	Product sold
amount	numeric	Sale amount
date	date	Date of sale
status	text	Enum: pending, paid, cancelled
created_at	timestamp	Record creation date
📈 leads
Column	Type	Description
id	uuid	Primary key
marketer_id	uuid	FK → users.id
company_id	uuid	FK → companies.id
name	text	Lead name
email	text	Lead email
phone	text	Lead phone
status	text	Enum: new, contacted, converted, lost
source	text	Campaign or channel
created_at	timestamp	Record creation date
🧭 User Roles and Dashboards
👨‍💼 Company Admin

Manage company information and team members.

Add marketers and sales team accounts.

View global performance analytics.

Assign campaigns or targets.

📣 Marketer Dashboard

Create and manage marketing campaigns.

Add and track leads.

Measure campaign performance.

Collaborate with sales teams.

💵 Sales Dashboard

Manage customer sales and transactions.

Update payment statuses.

Track sales targets and history.

View commissions and performance charts.

🧠 Features

✅ Company registration & authentication
✅ Role-based dashboard access
✅ Campaign & lead management
✅ Sales tracking & analytics
✅ Real-time data with Supabase
✅ Responsive, modern UI with Tailwind & shadcn/ui

⚙️ Setup Instructions
1. Clone the Repository
git clone https://github.com/yourusername/business-platform.git
cd business-platform

2. Install Dependencies
npm install

3. Add Environment Variables

Create a .env file:

VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

4. Run the App
npm run dev

5. Deploy

Frontend: Deploy to Vercel
 or Netlify

Backend: Supabase auto-deployment

🧑‍💻 Contributing

Fork the repo

Create a new branch (feature/new-feature)

Commit your changes

Push and create a Pull Request

📄 License

This project is licensed under the MIT License — free for personal and commercial use.

📞 Contact

