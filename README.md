# 📱 Student Career Office – Mobile App

A cross-platform mobile application built with React Native and Firebase to help students connect with career services, schedule appointments with experts, explore job listings, attend events, and manage their professional growth.

---

## 🚀 Features

- **User Authentication** – Email and password login using Firebase Authentication.
- **Student Dashboard** – Personalized dashboard with access to career services.
- **Appointment Booking** – Book one-on-one sessions with career counselors or experts.
- **Job & Internship Listings** – Admins can post and manage opportunities directly from the app.
- **Event Management** – View and RSVP to career events, workshops, and seminars.
- **Resume Upload** – Students can upload their resumes in PDF format to Firebase Storage.
- **Notifications** – Basic notification system to alert users about new events or updates.
- **Role-based Access** – Separate views and privileges for admins and students.
- **Live Chat Support** – Integrated with Tawk.to for real-time support and offline fallback.

---

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Firebase (Authentication, Firestore, Storage)
- **Build Tool:** EAS Build (Expo Application Services)
- **Chat Integration:** Tawk.to via WebView
- **Other Libraries:** 
  - `expo-image-picker`
  - `expo-document-picker`
  - `firebase`
  - `react-navigation`

---

## 📷 Screenshots

![Login](https://github.com/user-attachments/assets/a51df429-c284-418b-9630-45993a5a3df0)
![ManageEventScreen](https://github.com/user-attachments/assets/a68b81b2-ea1d-42f4-9f02-83152df41c40)
![ManageExpertScreen](https://github.com/user-attachments/assets/7fa4a5d9-72c1-4b19-8032-38e568ddfba3)
![StudentAppointmentScreen](https://github.com/user-attachments/assets/6d43cc77-3c38-4526-9d69-cb56624efa9a)
![AdminAppointmentScreen](https://github.com/user-attachments/assets/abb23e65-5885-42c0-9185-1307e8f9f5ea)
![ExpertScreen](https://github.com/user-attachments/assets/76d8317c-3562-46da-9263-b33e06d2fdf7)
![ProfileScreen](https://github.com/user-attachments/assets/530473ba-facb-4b66-bab3-cccbd2f957e7)
![StudentDashboard](https://github.com/user-attachments/assets/f4c2aac4-cf97-4e51-b9ed-28a5fa701045)

---

##  Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/student-career-office.git
   cd student-career-office

## Install dependencies:
npm install
## Set up Firebase:
Create a Firebase project.
Enable Authentication (Email/Password).
Create Firestore collections: users, appointment, experts, jobs, events.
Enable Firebase Storage for image and resume uploads.
Update the Firebase config in firebase.js.
## Run the app:
npx expo start
To build APK:
eas build --platform android --profile preview

