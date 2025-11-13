# Rivorea-notes

https://res.cloudinary.com/dfyafxdwe/image/upload/v1762937469/Image_1_evlya2.jpg

> Note taker app powered by AI — clean, fast, and built with Next.js + TypeScript.

[Live demo](https://rivorea-notes.vercel.app) • **TypeScript** • **Next.js** • **Prisma**

---

## 🎯 What is Rivorea-notes?

Rivorea-notes is a modern AI-powered note-taking application built with **Next.js** and **TypeScript**. It provides a clean and minimal user experience while leveraging modern web technologies for performance, scalability, and developer productivity.

---

## ✨ Key Features

* ✍️ Create, edit, and delete notes with ease
* 🤖 AI-powered enhancements for summarizing and tagging notes
* 🔐 Secure authentication system (Google Auth & BetterAuth)
* ☁️ Cloud image uploads via Cloudinary
* 💳 Stripe integration for premium features or subscriptions
* 📱 Fully responsive design
* 🚀 Optimized for Vercel deployment

---

## 🧰 Tech Stack

* **Next.js (App Router)** + **TypeScript**
* **Prisma** ORM
* **BetterAuth** for authentication
* **Cloudinary** for image storage
* **Stripe** for payments
* **OpenAI API** for AI-powered notes
* **PostgreSQL** database
* **Deployed on Vercel**

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/imranDv1/Rivorea-notes.git
cd Rivorea-notes
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set up your `.env` file

Create a `.env` file in the project root and add the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Encryption
PASSWORD_ENCRYPTION_KEY="your-password-encryption-key"
ENCRYPTION_KEY="your-encryption-key"

# Authentication
BETTER_AUTH_URL="your-auth-url"
BETTER_AUTH_SECRET="your-auth-secret"
GOOGLE_CLIENT_ID_WEB="your-google-client-id-web"
GOOGLE_CLIENT_ID_ANDROID="your-google-client-id-android"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> ⚠️ Make sure to fill in the actual credentials for your environment.

### 4. Set up Prisma

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📦 Build & Production

```bash
npm run build
npm run start
```

Deploy directly to **Vercel** — just connect your GitHub repository and add the same environment variables in the Vercel dashboard.

---

## 🧪 Testing

If tests are included, run them with:

```bash
npm test
```

---

## ♻️ Contributing

Contributions are always welcome!

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request 🎉

---





## 🙏 Credits

Developed by [Imran Ahmed](https://github.com/imranDv1)

* GitHub: [Rivorea-notes](https://github.com/imranDv1/Rivorea-notes)
* Live Demo: [rivorea-notes.vercel.app](https://rivorea-notes.vercel.app)

---

✨ *"Rivorea-notes — Capture, organize, and think better."*
