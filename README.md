# Scaly - Modern URL Shortener & Analytics Platform

![Scaly Banner](/public/og-image.png)

**Scaly** is a blazing-fast, secure, and modern SaaS URL shortener and link management platform. Built with cutting-edge web technologies, Scaly allows you to create custom short links, generate QR codes, and track in-depth analytics for your audience in real-time.

🌐 **Live Frontend**: [https://scalyui.itsrishabh.tech](https://scalyui.itsrishabh.tech)  
⚙️ **Backend API**: [https://scaly.itsrishabh.tech](https://scaly.itsrishabh.tech)

---

## ✨ Features

- **Custom Short Links**: Create branded and memorable short aliases for your long URLs.
- **Link Expirations**: Set automatic expiration dates (`RFC 3339`) for your links so they deactivate precisely when you want them to.
- **QR Code Generation**: Instantly generate downloadable QR codes for your short URLs.
- **Advanced Analytics Dashboard**: Track your link performance with highly responsive area charts.
  - View data by **Hourly**, **Daily**, or **Weekly** timeframes.
  - Track **Top Countries**, **Top Referrers**, **Browsers**, **Operating Systems**, and **Devices**.
- **Link Management**: A dedicated `/links` dashboard with high-performance real-time search and sorting (Newest, Oldest, Most Clicks).
- **SEO & Social Sharing Optimized**: Fully integrated Open Graph (OG) tags, Twitter Cards, dynamic `sitemap.xml`, and JSON-LD schema markup.
- **Fully Responsive**: Beautifully optimized for both Desktop and Mobile devices using dynamic layouts.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **User Agent Parsing**: `ua-parser-js`
- **Link Previews**: `microlink.io` & Radix UI Hover Cards
- **Notifications**: `react-hot-toast`

### Infrastructure
- **Deployment**: Vercel (Frontend)
- **Architecture**: Next.js Server Components, API routes proxying, and fully typed TypeScript.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/rishabhpandey106/scalyui.git
cd scalyui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the project and define your backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
*(If left undefined, it will safely fallback to the production backend `https://scaly.itsrishabh.tech`)*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

---

## 📈 Analytics Engine

Scaly's analytics engine processes thousands of data points to generate rich insights. The frontend leverages `useMemo` hooks and the `recharts` library to perform lightning-fast client-side data aggregations (converting raw click data into beautifully mapped area charts) without lagging the UI.

---

## 👨‍💻 Author

**Rishabh Pandey**
- Twitter: [@18Rishabh](https://twitter.com/18Rishabh)
- Instagram: [@rishabhpandey___](https://instagram.com/rishabhpandey___)
- GitHub: [rishabhpandey106](https://github.com/rishabhpandey106)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
