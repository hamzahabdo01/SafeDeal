# SafeDeal Frontend

A modern, production-ready React frontend for the SafeDeal escrow platform built with TypeScript, Tailwind CSS, and Vite.

## 🚀 Features

- **Modern Stack**: React 18 + TypeScript + Vite for fast development
- **Beautiful UI**: Tailwind CSS with dark mode support
- **Authentication**: Complete auth system with JWT tokens and refresh
- **Responsive Design**: Mobile-first approach with excellent UX
- **State Management**: React Context for global state
- **Form Handling**: React Hook Form with Zod validation
- **API Integration**: Axios with interceptors and error handling
- **Routing**: React Router with protected routes
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Code splitting and lazy loading

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Animation**: Framer Motion

## 📦 Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

3. **Update environment variables** in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=SafeDeal
VITE_APP_VERSION=1.0.0
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🏗️ Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── forms/          # Form components
│   ├── layout/         # Layout components (Header, Footer)
│   └── auth/           # Authentication components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── escrow/         # Escrow-related pages
│   └── payment/        # Payment-related pages
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── services/           # API services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## 🔐 Authentication

The app includes a complete authentication system:

- **Login/Register**: Form validation with error handling
- **JWT Tokens**: Access and refresh token management
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Token Refresh**: Automatic token refresh on expiry
- **Logout**: Secure logout with token cleanup

## 🎨 UI Components

### Button
```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
```

### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error="Error message"
  leftIcon={<Mail />}
/>
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

## 🌙 Dark Mode

Dark mode is automatically handled by the ThemeProvider:

```tsx
import { useTheme } from './contexts/ThemeContext';

const { theme, toggleTheme, isDark } = useTheme();
```

## 🔌 API Integration

API calls are handled through services:

```tsx
import { authService } from './services/auth';
import { escrowService } from './services/escrow';

// Login user
await authService.login({ email, password });

// Create escrow
await escrowService.createEscrow(escrowData);
```

## 📱 Responsive Design

The app is built mobile-first with responsive breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

Run tests:
```bash
npm run test
```

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔧 Configuration

### Environment Variables

- `VITE_API_BASE_URL`: Backend API URL
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

### Tailwind CSS

Custom theme configuration in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: { /* custom primary colors */ },
    },
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out',
    },
  },
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.
