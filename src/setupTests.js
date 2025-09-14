// src/setupTests.js
import '@testing-library/jest-dom';

// Mock react-dnd
jest.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, jest.fn()],
  DndProvider: ({ children }) => children,
}));

// Mock react-dnd-html5-backend
jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: {},
}));

// Mock react-redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock react-router-dom (only if needed)
// jest.mock('react-router-dom', () => ({
//   useNavigate: () => jest.fn(),
//   useLocation: () => ({ pathname: '/' }),
// }));

// Mock environment variables
process.env.REACT_APP_CALENDARIFIC_API_KEY = 'test-api-key';
