import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import { router } from './routes/index.tsx'
import { store } from './store/index.ts'
import { ThemeProviderContext } from './context/ThemeContext.tsx'
import './i18n/i18n';
import { useAppDispatch } from './hooks/redux.tsx'
import { hideNotification } from './api/uiSlice.ts'
import Notification from './components/common/Notification.tsx'
import type { RootState } from './types/index.ts'

const App = () => {
  const dispatch = useAppDispatch();
  const { open, message, type, key } = useSelector((state: RootState) => state.ui.notification);

  const handleClose = () => {
    dispatch(hideNotification());
  };

  return (
    <ThemeProviderContext>
      <RouterProvider router={router} />
      <Notification
        key={key}
        open={open}
        close={handleClose}
        content={message}
        type={type}
      />
    </ThemeProviderContext>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)