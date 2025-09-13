# 🎯 Weekendly - Weekend Planner

A comprehensive weekend planning web application that helps users design their perfect weekend by choosing activities, meals, and moods, then arranging them into a personalized Saturday–Sunday schedule.

![Weekendly Preview](https://weekendlyio.vercel.app/)

## ✨ Features

### 🎯 Core Features
- **Activity Library**: Browse 100+ predefined activities across 8 categories
- **Weekend Scheduling**: Create personalized Saturday–Sunday schedules
- **Drag & Drop**: Intuitive drag-and-drop interface for activity arrangement
- **Time Management**: 8 AM to 11 PM time slot management with conflict detection
- **Activity Editing**: Full CRUD operations for scheduled activities

### 🎨 Visual & Personalization
- **5 Beautiful Themes**: Relaxed, Adventurous, Social, Productive, Family
- **Mood Tracking**: 10 different mood categories for activity filtering
- **Color-Coded Categories**: Visual organization with emoji icons
- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **Gradient Backgrounds**: Modern glass morphism design elements

### 🚀 Advanced Features
- **Holiday Integration**: Automatic long weekend detection with Indian holidays API
- **Export Functionality**: Generate and share weekend plans as PNG images
- **Search & Filtering**: Advanced search with category and mood filtering
- **Performance Optimized**: React.memo, lazy loading, and efficient re-rendering
- **Accessibility**: Full WCAG compliance with keyboard navigation and screen reader support

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI framework
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **React Icons** - Icon library

### Drag & Drop
- **React DnD** - Drag-and-drop functionality
- **React DnD HTML5 Backend** - HTML5 drag-and-drop support

### Data & API
- **React Query** - API state management
- **Indian Holidays API** - Holiday data integration

### Export & Performance
- **html2canvas** - Image export functionality
- **React Window** - Virtualization for large lists
- **Lazy Loading** - Dynamic component loading

## 📁 Project Structure

```
src/
├── components/
│   ├── ActivityCard.jsx          # Individual activity display
│   ├── ActivityLibrary.jsx       # Activity browsing and filtering
│   ├── WeekendSchedule.jsx       # Main schedule display
│   ├── DaySchedule.jsx          # Individual day schedule
│   ├── TimeSlot.jsx             # Time slot management
│   ├── ScheduleActivity.jsx     # Scheduled activity component
│   ├── HolidaySuggestions.jsx   # Holiday integration
│   ├── ActivityModal.jsx        # Activity creation/editing
│   ├── ExportButton.jsx         # Export functionality
│   ├── Layout/                  # Layout components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   └── ui/                      # Reusable UI components
│       ├── Button.jsx
│       ├── Card.jsx
│       └── Chip.jsx
├── data/
│   └── activitiesData.js        # 928+ predefined activities
├── hooks/
│   ├── useLocalStorage.js       # localStorage management
│   ├── useSchedule.js          # Schedule utilities
│   └── useIndianHolidays.js    # Holiday API integration
├── redux/
│   └── slices/                  # Redux state management
│       ├── scheduleSlice.js
│       ├── activitiesSlice.js
│       └── themeSlice.js
├── pages/
│   ├── HomePage.jsx            # Main application page
│   └── PreviewPage.jsx         # Export preview page
└── utils/
    └── exportHelper.js         # Export utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weekendly.git
   cd weekendly
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
yarn build
```

## 🎮 Usage

### Creating Your Weekend Plan

1. **Browse Activities**
   - Use the search bar to find specific activities
   - Filter by category (Food, Outdoor, Entertainment, etc.)
   - Filter by mood (Social, Relaxed, Active, etc.)

2. **Add Activities to Schedule**
   - Drag activities from the library to your desired time slot
   - Use the "Quick Add" button for instant Saturday scheduling
   - Activities automatically snap to appropriate time slots

3. **Customize Your Schedule**
   - Drag to reorder activities within the same day
   - Move activities between Saturday and Sunday
   - Edit activity details by clicking the edit button
   - Remove activities you no longer want

4. **Personalize Your Experience**
   - Choose from 5 different themes
   - Select your preferred weekend days
   - View holiday suggestions for long weekends

5. **Export and Share**
   - Click "Preview" to see your formatted weekend plan
   - Choose from multiple color schemes and layouts
   - Export as PNG image to share with friends

## 🎨 Themes

- **🌊 Relaxed**: Calm blues and teals for peaceful weekends
- **🏔️ Adventurous**: Vibrant greens for outdoor adventures
- **🎉 Social**: Purple and pink tones for social gatherings
- **⚡ Productive**: Orange and yellow for focused activities
- **👨‍👩‍👧‍👦 Family**: Rose and pink for family time

## 📱 Responsive Design

Weekendly is fully responsive and works seamlessly across:
- **Desktop**: Full-featured experience with drag-and-drop
- **Tablet**: Touch-friendly interface with optimized layouts
- **Mobile**: Streamlined mobile experience with hamburger menu

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: Comprehensive ARIA labels and descriptions
- **High Contrast**: Clear visual indicators and focus states
- **Semantic HTML**: Proper use of semantic elements
- **Focus Management**: Logical tab order and focus indicators

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage
- **ActivityCard Component**: Rendering, interactions, accessibility
- **useSchedule Hook**: Utility functions and memoization
- **HolidaySuggestions Component**: Holiday integration and UI states

## 🚀 Performance Optimizations

- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Optimizes event handlers
- **Lazy Loading**: Dynamic imports for heavy components
- **Debounced Search**: Optimized search functionality
- **Code Splitting**: Reduced initial bundle size

## 📊 Activity Categories

| Category | Count | Examples |
|----------|-------|----------|
| 🍽️ Food | 10+ | Brunch, Cooking, Food Tours |
| 🏃‍♂️ Outdoor | 10+ | Hiking, Cycling, Beach Activities |
| 🎬 Entertainment | 10+ | Movies, Concerts, Games |
| 🧘‍♀️ Relaxation | 10+ | Reading, Meditation, Spa |
| 💪 Wellness | 10+ | Exercise, Yoga, Health Activities |
| 🎨 Cultural | 10+ | Museums, Art Galleries, Events |
| 🛍️ Leisure | 10+ | Shopping, Socializing, Hobbies |
| 🎯 Other | 20+ | Miscellaneous activities |

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_HOLIDAYS_API_URL=https://api.example.com/holidays
REACT_APP_APP_NAME=Weekendly
```

### Customization
- **Themes**: Add new themes in `src/redux/slices/themeSlice.js`
- **Activities**: Modify `src/data/activitiesData.js` to add/remove activities
- **Time Slots**: Adjust time range in `src/components/DaySchedule.jsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Atlan** for the Frontend Engineering Internship Challenge
- **React DnD** for the excellent drag-and-drop functionality
- **Tailwind CSS** for the utility-first styling approach
- **React Icons** for the comprehensive icon library
- **Indian Holidays API** for holiday data integration

## 📞 Support

If you have any questions or need help, please:
+91 8529817616


---

**Built with ❤️ for better weekend planning**

*Weekendly - Making every weekend memorable, one plan at a time.*