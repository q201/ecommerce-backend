# 🛍️ ShopHub - E-commerce Frontend

A modern, responsive e-commerce frontend built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🏠 **Pages**
- **Home Page** - Hero section, features, categories, and call-to-action
- **Products Page** - Product listing with filters, search, and grid/list views
- **Product Detail Page** - Detailed product view with image gallery, reviews, and add to cart
- **Cart Page** - Shopping cart management with quantity updates
- **Checkout Page** - Multi-step checkout process with address and payment forms
- **Login/Register Pages** - User authentication with form validation

### 🎨 **Design & UX**
- **Modern UI** - Clean, professional design with Tailwind CSS
- **Responsive Design** - Mobile-first approach, works on all devices
- **Interactive Elements** - Hover effects, loading states, and smooth transitions
- **Accessibility** - Proper ARIA labels and keyboard navigation

### 🔧 **Functionality**
- **Authentication** - JWT-based auth with context management
- **Shopping Cart** - Add, remove, and update cart items
- **Product Management** - Search, filter, and sort products
- **Wishlist** - Save products for later
- **Order Management** - Complete checkout flow

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Footer, Layout components
│   └── ProductCard.tsx # Product display component
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── CartContext.tsx # Shopping cart state management
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Products.tsx    # Product listing page
│   ├── ProductDetail.tsx # Product detail page
│   ├── Cart.tsx        # Shopping cart page
│   └── Checkout.tsx    # Checkout page
├── services/           # API services
│   └── api.ts         # API client and endpoints
├── types/              # TypeScript type definitions
│   └── index.ts       # All type interfaces
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.tsx            # Main app component
└── index.css          # Global styles with Tailwind
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Icon library
- **Axios** - HTTP client
- **Context API** - State management

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6 to #1E3A8A)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Components
- **Buttons**: Primary, Secondary, Outline variants
- **Cards**: Product cards, info cards
- **Forms**: Input fields, validation states
- **Badges**: Status indicators
- **Loading**: Spinners and skeletons

## 🔌 API Integration

The app is configured to work with your NestJS backend at `http://localhost:3000`. Key endpoints:

- **Authentication**: `/auth/login`, `/auth/register`
- **Products**: `/products`, `/products/:id`
- **Cart**: `/cart`, `/cart/items`
- **Orders**: `/orders`
- **Users**: `/users/profile`

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy!

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_APP_NAME=ShopHub
```

### Tailwind Configuration
Customize colors, spacing, and components in `tailwind.config.js`.

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@shophub.com or create an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
