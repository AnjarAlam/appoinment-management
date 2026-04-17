# 🌿 Ayurved - Premium Healthcare SaaS Platform

A **production-ready, full-stack healthcare management platform** for Ayurvedic clinics with multi-hospital support, role-based dashboards, and enterprise-grade UI/UX.

## ✨ Features

### 🔐 Authentication & Access Control
- **Single unified login page** for all 4 roles
- **Role-based redirection** after login (SuperAdmin → Admin → Doctor → Receptionist)
- **JWT-based authentication** (mock implementation, ready for backend integration)
- **Multi-tenant architecture** with hospital-level data isolation

### 👑 SuperAdmin Dashboard
- **Platform Overview**: Total hospitals, admins, patients, platform usage
- **Hospital Management**: Full CRUD operations with status tracking
- **Admin Management**: Create, edit, and manage hospital administrators
- **Analytics Dashboard**: Platform-wide metrics, hospital growth charts
- **System Monitoring**: Uptime, API response time, database metrics

### 🏥 Admin Dashboard (Hospital-level)
- **Dashboard**: Key metrics (patients, appointments, medicines, revenue)
- **Doctor Management**: Add, edit, remove doctors with credentials
- **Receptionist Management**: Staff management with shift tracking
- **Patient Management**: Complete patient database with history
- **Appointment Management**: Schedule, filter, and track appointments
- **Medicine Inventory**: Stock management with low-stock alerts
- **Therapy Plans**: Create and manage treatment packages
- **Disease-Medicine Mapping**: **Split-panel UI** for clinical treatment templates
  - Left: Disease selection with search
  - Right: Medicine template editor with dosage, timing, duration
- **Analytics**: Appointment trends, patient demographics, revenue reports

### 👨‍⚕️ Doctor Dashboard
- **Today's Appointments**: Quick view of scheduled consultations
- **Patient Records**: Access full patient history and medical data
- **Prescriptions**: Create prescriptions using disease templates
- **Appointment Management**: Mark complete, add notes, cancel appointments

### 🧾 Receptionist Dashboard
- **Appointment Booking**: Schedule new patient appointments
- **Patient Management**: Register and update patient information
- **Pre-Medical Checkup**: Record vital signs (BP, weight, etc.)
- **Billing & Invoices**: Generate bills, calculate costs, manage payments
- **Revisit Scheduling**: Track follow-up appointments

### 🎨 UI/UX System
- **Dark Mode (Default) + Light Mode**: Smooth theme switching
- **Responsive Design**: Full mobile, tablet, and desktop support
- **Sidebar Navigation**: Dynamic menu based on user role
- **Data Tables**: 
  - Search functionality
  - Sorting (ascending/descending)
  - Pagination
  - Action buttons (Edit, Delete, etc.)
- **Modals**: Form submission and confirmations
- **Status Badges**: Color-coded status indicators
- **Charts & Graphs**: Bar charts, line charts, progress bars
- **Skeleton Loaders**: Smooth loading states
- **Animations**: Smooth transitions and hover effects

### 📊 Dashboard Metrics
- Real-time stats cards with trend indicators
- Interactive charts (revenue, appointments, patient growth)
- Activity feeds and recent actions
- Performance analytics and reports

## 🏗️ Project Structure

```
ayurved-appointment-system/
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Root layout
│   │   ├── page.tsx                        # Home redirect
│   │   ├── providers.tsx                   # Auth provider wrapper
│   │   ├── login/
│   │   │   └── page.tsx                    # Multi-role login
│   │   ├── superadmin/
│   │   │   ├── dashboard/
│   │   │   ├── hospitals/
│   │   │   ├── admins/
│   │   │   └── analytics/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── doctors/
│   │   │   ├── receptionists/
│   │   │   ├── patients/
│   │   │   ├── appointments/
│   │   │   ├── medicines/
│   │   │   ├── therapy-plans/
│   │   │   ├── disease-mapping/
│   │   │   └── analytics/
│   │   ├── doctor/
│   │   │   ├── dashboard/
│   │   │   ├── appointments/
│   │   │   ├── patients/
│   │   │   └── prescriptions/
│   │   └── receptionist/
│   │       ├── dashboard/
│   │       ├── appointments/
│   │       ├── patients/
│   │       ├── vitals/
│   │       └── billing/
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.tsx         # Reusable dashboard wrapper
│   │   │   ├── Sidebar.tsx                 # Dynamic sidebar navigation
│   │   │   └── Navbar.tsx                  # Top navbar with actions
│   │   ├── common/
│   │   │   ├── DataTable.tsx               # Advanced table with search/filter/pagination
│   │   │   ├── StatsCard.tsx               # Metric cards
│   │   │   ├── SkeletonLoader.tsx          # Loading placeholders
│   │   │   └── Modal.tsx                   # Reusable modal dialogs
│   │   └── ui/                             # Basic UI components
│   ├── context/
│   │   └── AuthContext.tsx                 # Global auth state & login logic
│   ├── lib/
│   │   └── validations/
│   │       └── auth.ts                     # Zod validation schemas
│   ├── types/
│   │   └── index.ts                        # TypeScript type definitions
│   └── app/
│       └── globals.css                     # Tailwind configuration
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd "c:\Users\Asus\Desktop\EZ_FORM_BUILDER\ayurved appoinment system"

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env.local
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔑 Demo Credentials

### Login Page
Visit: `http://localhost:3000/login`

Select your role and use:
- **Email**: `demo@ayurved.com`
- **Password**: `password123`

**Available Roles:**
1. **SuperAdmin** - Platform-wide control
2. **Admin** - Hospital management
3. **Doctor** - Patient consultation
4. **Receptionist** - Operations management

## 🛠️ Technology Stack

**Frontend:**
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form** + **Zod** (validation)
- **Lucide React** (icons)

**State Management:**
- React Context API (Authentication)

**Styling:**
- Tailwind CSS with dark mode support
- Custom gradient utilities
- Responsive utilities

## 📋 Key Features Breakdown

### 1. **Role-Based Dashboard System**
Each role has a customized dashboard with relevant modules:
- Dynamic sidebar navigation
- Role-specific pages
- Proper access control structure

### 2. **Advanced Data Table Component**
- Search across all columns
- Click-to-sort columns
- Pagination with page info
- Inline action buttons
- Empty state handling

### 3. **Multi-Hospital Support**
- Hospital ID-based data isolation
- Admin per hospital
- Cross-hospital analytics (SuperAdmin only)

### 4. **Professional Forms & Modals**
- Modal-based form submissions
- Input validation with Zod
- Error handling
- Loading states

### 5. **Analytics & Reports**
- Charts (bar, line, pie)
- Trend indicators
- Department-level statistics
- Revenue tracking

### 6. **Responsive Design**
- Mobile-first approach
- Tablet optimization
- Desktop full-width layouts
- Touch-friendly UI

## 🎯 Component Architecture

### Layout Components
- `DashboardLayout`: Wrapper for all dashboard pages (sidebar + navbar + content)
- `Sidebar`: Dynamic navigation menu
- `Navbar`: Top bar with notifications, theme toggle, user menu

### Common Components
- `DataTable`: Powerful table with search, sort, filter, paginate
- `StatsCard`: Metric display with trend indicator
- `Modal`: Reusable dialog for forms and confirmations
- `SkeletonLoader`: Loading placeholders

### Page Components
- Dashboard pages for each role
- Management pages (CRUD interfaces)
- Analytics pages

## 🔄 Authentication Flow

1. User visits `/login`
2. Selects role (SuperAdmin/Admin/Doctor/Receptionist)
3. Enters credentials
4. `AuthContext.login()` authenticates
5. Redirects to role-specific dashboard
6. Protected routes check `useAuth()` hook

```tsx
// Usage in pages
const { user, logout } = useAuth();
// Access user role, name, email, hospitalId
```

## 📱 Responsive Breakpoints

- **Mobile**: `< 640px` - Full-width, hamburger menu
- **Tablet**: `640px - 1024px` - Sidebar collapses
- **Desktop**: `> 1024px` - Full-width sidebar, all features

## 🎨 Theme System

### Dark Mode (Default)
- Primary: `slate-900` (bg), `slate-800` (cards)
- Accents: `green-600`, `blue-600`, `purple-600`
- Text: `white`, `slate-300`, `slate-400`

### Light Mode (Extensible)
- Can be implemented with Tailwind's dark mode

## 🔐 Security Considerations

- Role-based access control (RBAC)
- Protected routes at page level
- JWT token storage (localStorage)
- CORS-ready structure
- Input validation with Zod

## 🚀 Production Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.ayurved.com
JWT_SECRET=your_secret_key
DATABASE_URL=mongodb+srv://...
```

## 📦 Backend Integration

The frontend is ready to connect to any backend. Update `AuthContext.tsx`:

```tsx
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

All API endpoints are mock-friendly and can be easily swapped with real endpoints.

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Context API](https://react.dev/reference/react/useContext)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📝 Future Enhancements

- [ ] Real backend API integration
- [ ] Advanced analytics with more chart types
- [ ] Email notifications
- [ ] PDF report generation
- [ ] SMS alerts
- [ ] Appointment reminders
- [ ] Video consultation integration
- [ ] AI-powered prescription suggestions
- [ ] Multi-language support
- [ ] Payment gateway integration

## 🤝 Contributing

This is a frontend-only reference implementation. For backend development, create API endpoints that match the expected data structures in `src/types/index.ts`.

## 📄 License

Private - Ayurved SaaS Platform

## 📞 Support

For technical questions or issues, refer to the component documentation in each file.

---

**Built with ❤️ for Ayurvedic Healthcare**

*Ayurved - Where Ancient Wisdom Meets Modern Technology*
