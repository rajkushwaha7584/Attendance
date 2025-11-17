📱 Attendance App – README

A simple and efficient Android Attendance Application designed for teachers/admins to manage student attendance with ease.
The app provides clean UI, fast performance, and supports features like adding students, marking attendance, and exporting records.

🚀 Features
✅ 1. Student Management

Add new students with details like:

Name

Roll Number

Mobile Number

Class & Section

Edit or delete student entries anytime.

📅 2. Daily Attendance Marking

Select a class → View student list → Mark Present / Absent.

One-tap attendance system.

Real-time UI updates.

📊 3. Attendance Records

View attendance history by date, student, or class.

Auto-calculated totals:

Total days present

Total days absent

Attendance percentage

📤 4. Export Attendance

Export attendance to:

Excel (.xlsx)

PDF

Neat and professional format.

☁️ 5. Local Database (Offline Support)

Fully offline

Uses Room Database (SQLite)

No internet required

🏗️ Tech Stack
Layer	Technology
Frontend	Android XML UI
Logic	Java / Kotlin
Database	Room (SQLite)
Exports	Apache POI (Excel), iText/Android-PDF (PDF)
📦 Project Structure
app/
│── java/
│   └── com.example.attendance/
│       ├── activities/
│       ├── adapters/
│       ├── database/
│       ├── models/
│       ├── utils/
│── res/
│   ├── layout/
│   ├── drawable/
│   ├── values/
└── AndroidManifest.xml

🔧 Installation

Clone or download the project

Open in Android Studio

Sync Gradle

Run on device/emulator

🖼️ Screens Included

Login (optional)

Home Dashboard

Add Student Page

Mark Attendance Page

Attendance History Page

Export Page

🔐 Permissions Required
android.permission.WRITE_EXTERNAL_STORAGE
android.permission.READ_EXTERNAL_STORAGE

🤝 Contribution

Pull requests are welcome.
For major changes, please open an issue first.

📞 Support

For queries or help, contact the developer (Raj).
