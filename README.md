# ⚡ VOLT-DASH: Personal Electric Bill Tracker

Volt-Dash একটি আধুনিক এবং শক্তিশালী ওয়েব অ্যাপ্লিকেশন যা আপনার ইলেকট্রিক বিল এবং রিচার্জ হিস্ট্রি ট্র্যাক করতে সাহায্য করে। এটি মূলত Next.js, MongoDB এবং Firebase দিয়ে তৈরি করা হয়েছে।

## 🚀 Live Demo
আপনার লাইভ ওয়েবসাইটটি এখানে দেখুন: [electric-billtracker.vercel.app](https://electric-billtracker.vercel.app)

## ✨ Features
* **Secure Google Login:** শুধুমাত্র নির্দিষ্ট ইমেইল (`sajjadjim15@gmail.com`) দিয়ে লগইন করার সুবিধা।
* **Real-time Synchronization:** মঙ্গোডিবি এটলাসের মাধ্যমে ডাটা সরাসরি সিঙ্ক হয়।
* **Interactive Visuals:** রিচার্জ এবং খরচের তুলনা করার জন্য সুন্দর বার চার্ট (Histogram)।
* **Monthly Filtering:** মাস ভিত্তিক ডাটা এবং ট্রানজ্যাকশন লগ দেখার সুবিধা।
* **Eye-Smoothing UI:** ডার্ক মোড এবং গ্লাস-মরফিজম ডিজাইনের সমন্বয়ে তৈরি আধুনিক ইন্টারফেস।

## 🛠️ Tech Stack
* **Frontend:** Next.js 14, Tailwind CSS, Framer Motion
* **Database:** MongoDB Atlas (Database: `electric_tracker`, Collection: `billing_db`)
* **Authentication:** Firebase Auth (Google Provider)
* **Deployment:** Vercel



## ⚙️ Installation & Setup

১. রিপোজিটরি ক্লোন করুন:
```bash
git clone https://github.com/sajjadjim/electric-bill-tracker.git
cd electric-bill-tracker
```

২. ডিপেন্ডেন্সি ইনস্টল করুন:

npm install

৩. .env.local ফাইল তৈরি করে নিচের ভ্যারিয়েবলগুলো যোগ করুন:
```bash
MONGODB_URI=your_mongodb_connection_string
ALLOWED_EMAIL=sajjadjim15@gmail.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
# অন্যান্য ফায়ারবেস কী-গুলো এখানে দিন
```
📸 Screenshots
আপনার ড্যাশবোর্ডের প্রধান অংশগুলো:

Balance Overview: বর্তমান ক্রেডিট এবং কুইক ট্রানজ্যাকশন প্যানেল।

Consumption Chart: মাসিক খরচের গ্রাফিকাল রিপ্রেজেন্টেশন।

📄 License
This project is for personal use and management.

Developed by Sajjad Hossain Jim ⚡