# 🏥 Doctors Appointment Platform

A full-stack **Next.js** web application for booking and managing doctor appointments — featuring authentication, video consultations, a credit-based booking system, and an admin dashboard.

🔗 **Live Demo:** [doctors-appointment-platform-olive.vercel.app](https://doctors-appointment-platform-olive.vercel.app)

---

## 🚀 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Authentication | [Clerk](https://clerk.com/) (`@clerk/nextjs`) |
| Database ORM | [Prisma 7](https://www.prisma.io/) + Neon adapter |
| Video Calls | [Vonage](https://www.vonage.com/) (`@vonage/server-sdk`) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Forms | React Hook Form + Zod validation |
| Notifications | Sonner |
| Theming | next-themes |

---

## 📁 Project Structure

```
doctors-appointment-platform/
├── actions/                    # Server actions
│   ├── admin.js
│   ├── appointments.js
│   ├── credits.js
│   ├── doctor.js
│   ├── doctors-listing.js
│   ├── onboarding.js
│   ├── patient.js
│   └── payout.js
│
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Sign-in / Sign-up routes (Clerk)
│   └── (main)/                 # Protected app routes
│       ├── admin/
│       ├── appointments/
│       ├── doctor/
│       ├── doctors/
│       ├── onboarding/
│       ├── pricing/
│       └── video-call/
│
├── components/                 # Reusable UI components
│   ├── ui/                     # shadcn/ui primitives
│   ├── appointment-card.jsx
│   ├── header.jsx
│   ├── page-header.jsx
│   ├── pricing.jsx
│   └── theme-provider.jsx
│
├── hooks/
│   └── use-fetch.js            # Custom data-fetching hook
│
├── lib/
│   ├── checkUser.js            # Clerk user sync helper
│   ├── data.js                 # Static/shared data
│   ├── prisma.js               # Prisma client instance
│   └── schema.js               # Zod schemas
│
├── prisma/                     # Prisma schema & migrations
├── public/                     # Static assets
├── .env                        # Environment variables
├── next.config.mjs
└── package.json
```

---

## ✨ Features

- **Authentication** — Secure sign-up/sign-in via Clerk with theme support
- **Doctor Listings** — Browse and filter available doctors
- **Appointment Booking** — Book, view, and manage appointments
- **Video Consultations** — In-app video calls powered by Vonage
- **Credits System** — Credit-based booking with a pricing/plans page
- **Doctor Onboarding** — Guided flow for doctors to set up their profile
- **Admin Dashboard** — Manage users, doctors, appointments, and payouts
- **Dark / Light Mode** — Theme switching via `next-themes`
- **Form Validation** — React Hook Form + Zod schemas throughout

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech/))
- [Clerk](https://clerk.com/) account
- [Vonage](https://dashboard.nexmo.com/) account (for video calls)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Tikesh097/-Doctors-Appointment-Platform.git
cd -Doctors-Appointment-Platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Vonage (Video Calls)
VONAGE_APPLICATION_ID=your_vonage_app_id
VONAGE_PRIVATE_KEY=your_vonage_private_key
```

4. **Set up the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run postinstall  # Auto-runs prisma generate after install
```

---

## 🌐 Deployment

The easiest way to deploy is via [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Import the repo on Vercel
3. Add all environment variables from your `.env`
4. Deploy!

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
