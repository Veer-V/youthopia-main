# Youthopia - Event Management Platform

A modern event management platform with user registration, event tracking, points system, and leaderboard functionality.

## 🚀 Recent Updates

**✅ Backend API Integration Complete** (December 11, 2025)

All backend endpoints have been integrated using a centralized API service with axios. See [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) for details.

## 📚 Documentation

- **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** - Integration status and overview
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[QUICK_API_GUIDE.md](QUICK_API_GUIDE.md)** - Quick start guide with examples
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - Migration details from old structure
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and data flow

## 🏗️ Project Structure

```
youthopia-main/
├── components/          # React components
├── contexts/           # React context providers
│   └── DataContext.tsx # Main state management
├── services/           # API services
│   ├── api.ts         # Axios configuration
│   ├── apiService.ts  # Centralized API service ⭐
│   └── geminiService.ts # AI service
├── types.ts           # TypeScript type definitions
├── App.tsx            # Main app component
└── index.tsx          # Entry point
```

## 🔧 Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Framer Motion for animations
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI

## 📡 Backend API

**Base URL**: `http://35.244.42.115:6001`

### Available Endpoints

#### User Management
- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `GET /user/data/:rollNumber` - Get user data
- `GET /user/points/:rollNumber` - Get user points
- `POST /user/spin/:rollNumber` - User spin
- `PUT /user/redeem/:rollNumber` - User redemption

#### Event Management
- `POST /event` - Create event
- `GET /event` - Get all events
- `GET /event/:id` - Get specific event
- `PATCH /event/:id` - Update event
- `DELETE /event/:id` - Delete event

#### Transactions
- `POST /transaction` - Create transaction
- `GET /transaction` - Get all transactions
- `GET /transaction/:id` - Get specific transaction
- `PATCH /transaction` - Update transaction
- `DELETE /transaction/:id` - Delete transaction

#### Redemptions
- `POST /redeem` - Create redemption
- `GET /redeem` - Get all redemptions
- `GET /redeem/:id` - Get specific redemption
- `PATCH /redeem` - Update redemption
- `DELETE /redeem/:id` - Delete redemption

#### Leaderboard
- `POST /leaderboard` - Create entry
- `GET /leaderboard` - Get all entries
- `GET /leaderboard/:id` - Get specific entry
- `PATCH /leaderboard` - Update entry
- `DELETE /leaderboard/:id` - Delete entry

## 💻 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔌 Using the API Service

```typescript
import API from './services/apiService';

// Register a user
const result = await API.registerUser({
  name: "John Doe",
  institute: "Example University",
  mobile: 9876543210,
  class: "12th",
  stream: "Science",
  gender: "Male",
  age: 18,
  password: "securepass123"
});

if (result.error) {
  console.error(result.error);
} else {
  console.log('User registered:', result.data);
}

// Get all events
const events = await API.getAllEvents();
if (events.data) {
  console.log('Events:', events.data);
}
```

## 📋 Features

- ✅ User registration and authentication
- ✅ Event creation and management
- ✅ Points and rewards system
- ✅ Spin wheel functionality
- ✅ Redemption system
- ✅ Leaderboard tracking
- ✅ Transaction history
- ✅ Real-time data updates
- ✅ Responsive design
- ✅ Smooth animations

## 🔐 Authentication

The system uses **mobile number-based authentication**:

```typescript
// Login
const result = await API.loginUser({
  mobile: 9876543210,
  password: "yourpassword"
});
```

## 🎯 Key Components

### DataContext
Provides global state management for:
- User data
- Events
- Registrations
- Transactions
- Redemptions
- Leaderboard
- Feedback

### API Service
Centralized service for all backend communication:
- Type-safe API calls
- Consistent error handling
- Automatic request/response processing

## 🧪 Testing

Before deploying, test:
- [ ] User registration
- [ ] User login
- [ ] Event listing
- [ ] Event creation
- [ ] Points system
- [ ] Spin functionality
- [ ] Redemption flow
- [ ] Leaderboard display

## 📝 Error Handling

All API calls return a consistent structure:

```typescript
{
  data: T | null,
  error: string | null
}
```

Always check for errors:

```typescript
const result = await API.someFunction();

if (result.error) {
  // Handle error
  alert(result.error);
  return;
}

// Use data
const data = result.data;
```

## 🔄 Migration from Old Controllers

If you have old code using controllers:

```typescript
// ❌ Old way (deprecated)
import { AuthController } from './controllers/authController';
const result = await AuthController.login(email, password);

// ✅ New way
import API from './services/apiService';
const result = await API.loginUser({ mobile, password });
```

## 📦 Dependencies

```json
{
  "dependencies": {
    "@google/genai": "^1.31.0",
    "axios": "^1.13.2",
    "framer-motion": "^12.23.25",
    "lucide-react": "^0.556.0",
    "react": "^19.2.1",
    "react-dom": "^19.2.1"
  }
}
```

## 🤝 Contributing

1. Read the documentation files
2. Follow the existing code structure
3. Use the centralized API service
4. Add proper error handling
5. Update types as needed

## 📞 Support

For questions or issues:
1. Check the documentation files
2. Review the API guide
3. See the architecture diagram

## 📄 License

[Add your license here]

---

**Last Updated**: December 11, 2025  
**Status**: ✅ Production Ready
