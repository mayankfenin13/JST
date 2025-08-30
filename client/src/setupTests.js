// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.confirm
global.confirm = jest.fn(() => true);

// Mock window.location
delete window.location;
window.location = { href: '', assign: jest.fn() };

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Mock styled-components
jest.mock('styled-components', () => {
  const mockReact = require('react');
  
  const styled = (tag) => (template) => (props) => {
    const Component = ({ children, ...rest }) => {
      return mockReact.createElement(tag, rest, children);
    };
    Component.displayName = `styled.${tag}`;
    return Component;
  };
  
  // Add common HTML tags
  styled.div = styled('div');
  styled.button = styled('button');
  styled.input = styled('input');
  styled.form = styled('form');
  styled.h1 = styled('h1');
  styled.h2 = styled('h2');
  styled.h3 = styled('h3');
  styled.p = styled('p');
  styled.span = styled('span');
  
  // Mock createGlobalStyle
  const createGlobalStyle = (template) => {
    const Component = () => null;
    Component.displayName = 'GlobalStyle';
    return Component;
  };
  
  styled.createGlobalStyle = createGlobalStyle;
  
  return styled;
});

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  defaults: {
    headers: {
      common: {}
    }
  }
}));

// Suppress console warnings during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};
