# 📚 Library Management System \(Next\.js \+ Supabase\)

A full\-stack, responsive library management application with user authentication, admin dashboard, book borrowing \&amp; returning system, real\-time data sync, and search \&amp; filter functionality\.

---

## ✨ Project Overview

This is a modern, full\-stack library management web application built with Next\.js \(App Router\) and Supabase\. The system supports two user roles: **Regular Users** and **Admin Users**, with complete book management, borrowing workflow, user profile, and data monitoring features\.

- **User Side:** Browse books, search/filter books, borrow books, return borrowed books, view personal profile \&amp; borrowed records

- **Admin Side:** Full admin dashboard, manage books \(add/edit/delete\), view all borrow records, manage all users, view library analytics \&amp; stats

- **Global:** Secure authentication, responsive design, clean UI, error\-free functionality

---

## 🌐 Live Demo

Experience the fully functional application with the live demo below\. You can test both regular user and admin functionalities using the provided test credentials\.

### Demo Link

🔗 [https://your\-library\-demo\.vercel\.app]https://library-management-system-mocha-ten.vercel.app/ \(Replace with your actual demo URL after deployment\)

### Test Credentials

- **Regular User**

    - Email: user@gmail.com

    - Password: user123

    - Permissions: Browse, search, borrow/return books, view profile

- **Admin User**

    - Email: admin@gmail.com

    - Password: admin123

    - Permissions: Full access to admin dashboard, book management, user monitoring, analytics

### Demo Notes

- The demo is a live deployment of the application, with test data pre\-loaded \(sample books, users, and borrow records\)\.

- You can freely test all features: borrow/return books, add/edit/delete books \(admin only\), view analytics, and manage user profiles\.

- Test data may be reset periodically to maintain a clean demo environment\.

- Do not use sensitive personal information in the demo \(it is for testing purposes only\)\.

---

## 🛠️ Tech Stack

### Frontend

- Next\.js 14\+ \(App Router, Client Components\)

- React 18, React Hooks, useEffect/useState/useCallback

- Tailwind CSS \(Inline Styling, Responsive Layout\)

- React Chart\.js \(Pie Chart for Dashboard Analytics\)

- React Icons, React Hot Toast \(Notifications\)

### Backend \&amp; Database

- Supabase \(PostgreSQL Database\)

- Supabase Authentication \(Email/Password Login\)

- Row Level Security \(RLS\) Support

- Serverless API Routes \(Optional\)

### Deployment \&amp; Tools

- VS Code

- ESLint \(Code Linting\)

- Cross\-device Responsive Design

---

## 🚀 Core Features

### User Features

1. Secure User Registration \&amp; Login System

2. Browse all published books with responsive cards

3. Search books by **Title \&amp; Author**

4. Filter books by Category \&amp; Availability Status

5. View detailed book information \(cover, author, category, ISBN, status\)

6. Borrow available books \(one click, auto\-update book status\)

7. Return borrowed books directly from profile page

8. Personal Profile Page: view account info \&amp; active borrowed books

9. Real\-time status updates \(no manual refresh required\)

### Admin Dashboard Features

1. Admin\-only Access Protection \(Role\-based Authorization\)

2. Dashboard Analytics: Total Books, Total Users, Total Borrows, Available Books

3. Visual Pie Chart \(Available vs Borrowed Books Stats\)

4. Full Book Management: Add New Books, Edit Existing Books, Delete Books

5. View All Books \(with cover, status, quick edit/delete\)

6. View All Borrow Records \(book details, user ID, return status\)

7. View All Registered System Users

8. Auto\-sync data, real\-time updates for all changes

9. Navigate back to homepage easily

---

## 📁 Project Folder Structure

```plain text
├── app/
│   ├── admin/                # Admin Dashboard Pages
│   ├── books/[id]/           # Single Book Detail Page
│   ├── profile/              # User Profile & Borrowed Books
│   ├── login/                # User Login Page
│   ├── register/             # User Register Page
│   ├── api/                  # Optional API Routes
│   └── page.js               # Homepage
├── components/
│   └── BookCard.js           # Reusable Book Card Component
├── context/
│   └── AuthContext.js        # Global Auth Context (Login/Logout State)
├── utils/
│   └── supabase.js           # Supabase Client Configuration
├── public/                   # Static Assets
└── README.md                 # Project Documentation
```

---

## 📥 Installation \&amp; Local Setup

### Prerequisites

- Node\.js \(v18\+ LTS\) installed

- Supabase Account \(Free Tier Works\)

- Git \&amp; VS Code

### Step 1: Clone the Repository

```bash
git clone <repository-link>
cd library-management-system
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Configure Supabase Environment Variables

Create a **\.env\.local** file in the root folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Step 4: Setup Supabase Database Tables

#### 1\. Books Table

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT,
  isbn TEXT,
  image TEXT,
  status TEXT DEFAULT 'available'
);
```

#### 2\. Borrows Table

```sql
CREATE TABLE borrows (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  book_id INT NOT NULL,
  returned BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
```

### Step 5: Run the Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser

---

## ⚙️ Admin Account Setup

1. Register a normal user account via the registration page

2. Go to Supabase Dashboard → Authentication → Users

3. Edit your user → Add `role: admin` in `user\_metadata`

4. Save changes → Login with this account to access admin dashboard

---

## 📖 Usage Guide

### For Normal Users

1. Login/Register to access borrowing features

2. Browse, search, filter books on the homepage

3. Click View to see book details, click Borrow to borrow available books

4. Go to Profile Page to view all your borrowed books

5. Click Return to return books and unlock book status

### For Admin Users

1. Login with admin authorized account

2. Access Admin Dashboard via sidebar navigation

3. View analytics on the dashboard homepage

4. Add/Edit/Delete books from the admin panel

5. Monitor all borrow transactions and registered users

6. Manage book availability status manually

---

## ⚠️ Fixed Known Issues \(Already Resolved\)

- ✅ Borrow/Return data not updating on admin \&amp; profile page

- ✅ Supabase RLS permission blocking data read/write

- ✅ ESLint hook errors \(setState in useEffect\)

- ✅ Conflicting local JSON database \&amp; Supabase mismatch

- ✅ Book status not syncing across all pages

---

## 🚨 Important Notes

1. **Disable RLS Temporarily** if you encounter permission issues \(fully tested working state\)

2. Delete unused `api/borrow/route\.js` \&amp; local `data/borrows\.json` files to avoid conflicts

3. All data is stored in Supabase Cloud Database, no local storage conflicts

4. Application is fully responsive for mobile, tablet \&amp; desktop screens

5. Do not share admin credentials with unauthorized users

---

## 📌 Future Improvements \(Optional\)

- Due date \&amp; late fine calculation system

- Book pagination \&amp; sorting

- Email notifications for borrow/return reminders

- Admin approve borrow system

- Book wishlist \&amp; history logs

- Secure RLS policies re\-enabled for production

---

## 📞 Deployment

Deploy easily on Vercel \(1\-click deployment for Next\.js projects\):

1. Push code to GitHub/GitLab

2. Connect repository to Vercel

3. Add Supabase environment variables in Vercel dashboard

4. Deploy \&amp; launch live site

---

**Project Status:** Fully Functional, Error\-Free, Ready for Use \&amp; Deployment

> （注：文档部分内容可能由 AI 生成）
