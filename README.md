# StudyNotion - EdTech Platform

## 📌 Project Overview
StudyNotion is a comprehensive full-stack EdTech platform that allows educators to create and manage courses while enabling students to enroll, track progress, and complete learning modules. The platform provides user authentication, secure payments, and email notifications for various actions like account creation and course purchases.

---

## 🔑 User Authentication & Signup Flow
1. **User Registration**
   - Users sign up with email and password.
   - Passwords are hashed using **bcrypt**.
   - Email verification is required before logging in.

2. **Email Verification**
   - A unique verification link is sent to the user's email.
   - Clicking the link activates the account.

3. **User Login**
   - Users log in with their verified credentials.
   - JWT tokens are used for secure session handling.

---

## 🎓 Instructor Course Management
1. **Creating a Course**
   - Instructors can create courses with structured sections and subsections.
   - Courses include video lectures, PDFs, and quizzes.
   - Course content is stored using **Cloudinary**.
   
2. **Managing Courses**
   - Instructors can edit course content anytime.
   - Courses can be updated with new materials and pricing.

3. **Course Data Storage**
   - Metadata, student progress, and enrollments are stored in **MongoDB**.
   - Multimedia files are managed via **Cloudinary**.

---

## 📚 Student Course Access & Progress Tracking
1. **Enrolling in Courses**
   - Students can browse available courses and enroll after payment.
   - Courses are added to their profile upon successful transaction.

2. **Tracking Progress**
   - Progress is saved per lecture completion.
   - Students can resume from where they left off.
   - Completion percentage is displayed on the dashboard.

---

## ⭐ Ratings & Reviews
- Students can leave ratings and reviews for each lecture.
- Reviews help instructors improve course quality.
- Ratings influence future enrollments.

---

## 💳 Payment Flow
1. **User selects a course and proceeds to checkout.**
2. **Payment is processed securely via Razorpay.**
3. **Upon success:**
   - The course is added to the user’s profile.
   - A confirmation email is sent.
4. **Upon failure:**
   - The transaction is aborted, and no changes occur.

---

## 📩 Email System Overview
1. **Signup Email Flow**
   - Users receive a verification email upon registration.

2. **Course Purchase Email Flow**
   - Upon payment, an enrollment confirmation email is sent.

3. **Instructor Notifications**
   - Instructors receive an email when a new student enrolls in their course.

---

## 📊 Instructor Dashboard
- Displays total enrollments per course.
- Shows student progress statistics.
- Revenue generated from courses is updated dynamically.
- Course performance insights help improve content.

---

## 🎯 Student Dashboard
- Students can view all their enrolled courses.
- Course completion percentage is displayed.
- Certificates can be issued upon course completion (if enabled).
- Students can see feedback and ratings for their enrolled courses.

---

## 📂 Folder Structure
```
StudyNotion-EdTech-Platform/
  ├── public/               # Static assets
  ├── server/               # Backend API
  │   ├── config/           # Database & Payment Config
  │   ├── controllers/      # Route Controllers
  │   ├── middleware/       # Auth Middleware
  │   ├── models/           # Database Models
  │   ├── routes/           # API Routes
  │   ├── mail/             # Email Templates
  ├── client/               # React Frontend
  │   ├── src/
  │   │   ├── components/  # UI Components
  │   │   ├── pages/       # Page Components
  │   │   ├── services/    # API Calls
  ├── package.json          # Dependencies
  ├── README.md             # Project Documentation
```

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request




