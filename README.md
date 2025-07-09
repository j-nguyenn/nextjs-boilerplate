# 🚀 Full-Stack React Boilerplate

A modern, feature-rich React boilerplate built with TypeScript, TailwindCSS, and a complete authentication system. This template provides everything you need to kickstart your next web application with best practices and modern development tools.

## ✨ Features

- **React 19** for UI development with latest features
- **TypeScript** for type safety and better development experience
- **TailwindCSS** for utility-first styling and rapid UI development
- **shadcn/ui** for beautiful, accessible component library
- **React Hook Form with Zod** for robust form validation
- **React Context/Reducer** for efficient state management
- **TanStack Query** for powerful data fetching and caching
- **TanStack Table** for advanced data tables with sorting, filtering, and pagination
- **Complete Authentication Flow** with login and registration
- **Error Boundary** for graceful error handling
- **Dark/Light Theme** support
- **Responsive Design** with mobile-first approach

## 🛠️ Tech Stack

### Core Libraries

- **React**: Modern UI library for building user interfaces
- **TailwindCSS**: Utility-first CSS framework for rapid styling
- **shadcn/ui**: High-quality component library built on Radix UI primitives
- **React Hook Form with Zod**: Type-safe form handling with validation
- **React Context/Reducer**: State management for authentication and global state
- **TanStack Query**: Data fetching, caching, and synchronization
- **TanStack Table**: Powerful table component for data display

### Additional Libraries

- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, customizable icons
- **Date-fns**: Date manipulation utilities
- **Sonner**: Toast notifications
- **React Error Boundary**: Error handling and recovery

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nextjs-full-stack-bo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser** and visit `http://localhost:5173`

## 🎯 Usage Guide

### Authentication System

The boilerplate includes a complete authentication flow:

- **Login Form**: User authentication with email and password
- **Registration Form**: New user registration with validation
- **Context-based Auth State**: Global authentication state management
- **Protected Routes**: Route protection based on authentication status

```tsx
// Using authentication context
const { state, dispatch } = useAppContext();
const isAuthenticated = state.isAuthenticated;
```

### Form Validation with React Hook Form + Zod

Forms are built with React Hook Form and validated using Zod schemas:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### Data Fetching with TanStack Query

Efficient data fetching and caching:

```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

### Data Tables with TanStack Table

Advanced table functionality with sorting, filtering, and pagination:

- Column sorting
- Global search/filtering
- Row selection
- Pagination
- Responsive design

### Styling with TailwindCSS + shadcn/ui

Pre-built components with consistent design:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Welcome</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default">Get Started</Button>
  </CardContent>
</Card>;
```

### State Management

Global state is managed using React Context and useReducer:

```tsx
// Access global state
const { state, dispatch } = useAppContext();

// Update state
dispatch({ type: 'SET_USER', payload: user });
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   ├── AuthForms.tsx   # Authentication forms
│   ├── Layout.tsx      # App layout wrapper
│   └── UsersTable.tsx  # Data table component
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API calls
├── providers/          # App providers (Query, Theme)
└── styles/             # Global styles and theme
```

## 🎨 Customization

### Theme Configuration

The app supports dark/light themes through React Context:

```tsx
// Toggle theme
dispatch({ type: 'SET_THEME', payload: 'dark' });
```

### Adding New Components

1. Create components in `src/components/`
2. Use shadcn/ui components as building blocks
3. Apply TailwindCSS for styling
4. Add proper TypeScript types

### API Integration

Update `src/lib/api.ts` to connect with your backend:

```tsx
export const api = {
  async fetchUsers() {
    // Your API logic here
  },
};
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 License

This project is licensed under the MIT License.
