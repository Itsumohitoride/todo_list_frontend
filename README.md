# TodoList Frontend

[![React Native](https://img.shields.io/badge/React%20Native-0.76.6-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~52.0.29-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-State%20Management-orange)](https://github.com/pmndrs/zustand)

A modern, cross-platform task management application built with React Native and Expo, featuring a refined "paper & ink" design aesthetic.

## Features

- 🎨 **Paper & Ink Design** - Minimalist, analog-inspired UI with neutral warm palette
- 🔐 **JWT Authentication** - Secure user authentication and session management
- 📝 **Task Management** - Create, organize, and track tasks across multiple lists
- 🎯 **Task Types** - Categorize tasks as Today, Important, or Featured
- 📊 **Statistics & Charts** - Visual progress tracking with interactive charts
- 🔗 **List Sharing** - Share lists via QR codes or shareable links
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 🌐 **Offline Support** - Queue operations when offline and sync when connected
- 🔄 **Real-time Sync** - Automatic data synchronization with backend

## Technologies

- **React Native** 0.76.6 with Expo ~52.0.29
- **TypeScript** 5.3.3 for type safety
- **Expo Router** for navigation
- **Zustand** for state management
- **Axios** for HTTP requests
- **React Native Chart Kit** for data visualization
- **Expo Secure Store** for secure token storage
- **React Native QR Code SVG** for QR code generation

## Design System

### Paper & Ink Aesthetic

The app features a unique "paper & ink" design language that evokes the feel of analog stationery:

**Color Palette:**
```typescript
{
  ink: '#1A1A1A',           // Main text (carbón)
  inkMedium: '#4A4A4A',
  inkLight: '#6B6B6B',
  inkFaded: '#9A9A9A',
  parchment: '#FAF7F2',     // Main background (crema)
  cardBackground: '#FEFDFB',
  accent: '#8B7355',         // Terracotta accent
  border: '#E8E3DA',
}
```

**Design Principles:**
- Subtle borders (1px) instead of heavy shadows
- Small border-radius (4-6px) for organic feel
- Left border stripes (3-4px) mimicking ruled paper
- Letter-spacing on all typography for readability
- Organic, subtle shadows with minimal opacity

## Prerequisites

- Node.js 18+ or higher
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Backend API running at `http://localhost:8080`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-list-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Running

### Development mode

```bash
# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Build for production

```bash
# iOS
npm run build:ios

# Android
npm run build:android

# Web
npm run build:web
```

## Project Structure

```
todo-list-frontend/
├── src/
│   ├── api/                    # API client and endpoints
│   │   ├── client.ts           # Axios configuration with JWT
│   │   ├── auth.api.ts         # Authentication endpoints
│   │   ├── lists.api.ts        # Lists endpoints
│   │   ├── tasks.api.ts        # Tasks endpoints
│   │   ├── sharing.api.ts      # Sharing endpoints
│   │   └── statistics.api.ts   # Statistics endpoints
│   ├── components/             # Reusable components
│   │   ├── common/             # Common UI components
│   │   ├── lists/              # List-related components
│   │   ├── modals/             # Modal dialogs
│   │   ├── navigation/         # Navigation components
│   │   ├── stats/              # Statistics components
│   │   └── tasks/              # Task-related components
│   ├── navigation/             # Navigation configuration
│   │   └── MainNavigator.tsx   # Main app navigator
│   ├── screens/                # Screen components
│   │   ├── auth/               # Authentication screens
│   │   ├── lists/              # List management screens
│   │   ├── progress/           # Statistics screens
│   │   └── profile/            # Profile screens
│   ├── store/                  # Zustand state management
│   │   ├── authStore.ts        # Authentication state
│   │   ├── listsStore.ts       # Lists state
│   │   └── tasksStore.ts       # Tasks state
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Shared types and interfaces
│   ├── utils/                  # Utility functions
│   │   ├── colors.ts           # Design system colors
│   │   ├── connectivity.ts     # Network connectivity
│   │   ├── offlineQueue.ts     # Offline operations queue
│   │   └── responsive.ts       # Responsive design utilities
│   └── hooks/                  # Custom React hooks
├── .interface-design/          # Design system documentation
│   └── system.md               # Complete design guidelines
├── especs/                     # API specifications
│   └── API_ENDPOINTS.md        # Backend API documentation
├── App.tsx                     # App entry point
├── package.json
└── README.md
```

## Configuration

### Environment Setup

The app connects to the backend API at `http://localhost:8080` by default. To change this:

**Edit `src/api/client.ts`:**
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Offline Support

The app includes offline support with operation queuing:
- Operations are stored locally when offline
- Automatically synced when connection is restored
- Cached data available for offline viewing

## Main Features

### Authentication
- User registration with validation
- Secure JWT-based login
- Persistent sessions with Expo SecureStore
- Profile management

### Lists Management
- Create custom lists with colors
- Edit list name and appearance
- Delete lists with confirmation
- Search and filter lists
- Share lists with others

### Tasks Management
- Create tasks with descriptions and dates
- Mark tasks as complete/pending
- Categorize as Today, Important, or Featured
- Filter tasks by status and type
- Delete tasks with swipe gestures

### List Sharing
- Generate shareable links
- QR code generation for easy sharing
- Join shared lists via link or QR scan
- View shared users
- Collaborative list editing

### Statistics & Progress
- Task completion rate
- Progress charts over time
- Task distribution by category
- Visual insights into productivity

## API Integration

The app integrates with the TodoList backend API:

**Base URL:** `http://localhost:8080/api`

**Key Endpoints:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /lists` - Get user's lists
- `POST /lists` - Create new list
- `POST /sharing/lists/{listId}` - Share a list
- `POST /sharing/join/{token}` - Join shared list
- `GET /statistics/users/{userId}` - Get user statistics

See `especs/API_ENDPOINTS.md` for complete API documentation.

## Design Guidelines

The app follows a strict design system documented in `.interface-design/system.md`:

### Typography
- Letter-spacing on all text elements
- Font weights: 300, 400, 500, 600, 700
- Hierarchical sizing with subtle contrasts

### Spacing
- Based on 4px grid system
- Consistent padding and margins
- Optical alignment over mathematical perfection

### Components
- Signature left border stripes (3-4px)
- Subtle borders (1px) throughout
- Small border-radius (4-6px)
- Minimal shadows with organic feel

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Known Issues & Limitations

1. **Shared Lists Display** - Backend currently only returns owned lists, not shared lists. The endpoint `GET /api/lists?userId={userId}` needs to be updated to include lists where the user is in `sharedUserIds`.

2. **Chart Rendering** - Some chart configurations may need adjustment based on data volume.

## Roadmap

- [ ] Push notifications for task updates
- [ ] Dark mode support
- [ ] Task attachments and notes
- [ ] Recurring tasks
- [ ] Calendar integration
- [ ] Export data (PDF, CSV)
- [ ] Multi-language support

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Code Conventions

- Use TypeScript for all new files
- Follow the established design system
- Keep components small and focused
- Use Zustand stores for state management
- Write clear, descriptive commit messages
- Maintain consistent naming conventions

## Architecture Decisions

### State Management
We use Zustand for its simplicity and React-like API:
- Minimal boilerplate
- No providers needed
- Built-in TypeScript support
- Easy to test

### Navigation
Expo Router provides:
- File-based routing
- Type-safe navigation
- Deep linking support
- Seamless transitions

### Offline Support
Custom implementation with:
- Local operation queue
- Automatic retry logic
- Conflict resolution
- Cache management

## Performance Optimization

- Lazy loading of screens
- Memoized components
- Optimized re-renders with Zustand selectors
- Image caching
- Debounced search inputs

## Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npm start -- --reset-cache
```

**iOS build issues:**
```bash
cd ios && pod install && cd ..
```

**Android build issues:**
```bash
cd android && ./gradlew clean && cd ..
```

## Contact

For questions or suggestions, please open an issue in the repository.

---

Built with React Native and Expo • Design inspired by analog stationery
