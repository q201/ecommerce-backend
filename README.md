# 🛍️ ShopHub - Full Stack E-commerce Application

A complete e-commerce platform built with **NestJS** (Backend) and **React** (Frontend).

## 🚀 Features

### Backend (NestJS)
- **Authentication & Authorization** - JWT-based auth with role-based access
- **User Management** - Customer, Admin, and Seller roles
- **Product Management** - CRUD operations with categories and variants
- **Order Management** - Complete order lifecycle
- **Shopping Cart** - Persistent cart functionality
- **Payment Integration** - Ready for Stripe integration
- **Review System** - Product reviews and ratings
- **Wishlist** - User wishlist management
- **Search & Filtering** - Advanced product search
- **Admin Dashboard** - Complete admin interface
- **API Documentation** - Swagger/OpenAPI docs

### Frontend (React)
- **Modern UI** - Beautiful Tailwind CSS design
- **Responsive Design** - Mobile-first approach
- **User Authentication** - Login/Register with JWT
- **Product Catalog** - Grid/List views with filtering
- **Shopping Cart** - Real-time cart management
- **Checkout Process** - Multi-step checkout
- **User Profile** - Complete user management
- **Admin Panel** - Product, Order, and User management
- **Wishlist** - Save and manage favorite products
- **Reviews** - Product review system
- **Search** - Advanced search functionality

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport.js
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Heroicons

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd your-repo-name
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Database setup**
```bash
# Create PostgreSQL database
createdb ecommerce_db

# Run migrations (if using TypeORM migrations)
npm run migration:run
```

5. **Start the backend**
```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ecommerce-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API URL
```

4. **Start the frontend**
```bash
npm start
```

The frontend will run on `http://localhost:3001`

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=ecommerce_db

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_NAME=ShopHub
REACT_APP_ENABLE_MOCK_DATA=true
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:3000/api`
- **API Endpoints**: All RESTful endpoints documented

## 🗄️ Database Schema

The application includes the following main entities:
- **Users** - Customer, Admin, Seller roles
- **Products** - With categories, images, variants
- **Orders** - Complete order management
- **Cart** - Shopping cart functionality
- **Reviews** - Product reviews and ratings
- **Addresses** - User address management
- **Categories** - Product categorization

## 🚀 Deployment

### Backend Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve the build folder
npm install -g serve
serve -s build -l 3001
```

## 🧪 Testing

### Backend Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests
```bash
npm test
```

## 📁 Project Structure

```
├── src/                    # Backend source code
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── products/          # Product management
│   ├── orders/            # Order management
│   ├── cart/              # Shopping cart
│   ├── reviews/           # Review system
│   ├── categories/        # Category management
│   └── database/          # Database configuration
├── ecommerce-frontend/    # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── docs/                  # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please open an issue on GitHub.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript
- [Unsplash](https://unsplash.com/) - Beautiful free images

---

**Happy Coding! 🎉**
