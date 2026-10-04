import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

interface UIState {
  notification: {
    open: boolean;
    message: string;
    type: AlertType;
    key: number; // برای ریست انیمیشن هنگام کلیک‌های متعدد
  };
}

const initialState: UIState = {
  notification: {
    open: false,
    message: '',
    type: 'info',
    key: 0,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type?: AlertType }>
    ) => {
      state.notification.open = true;
      state.notification.message = action.payload.message;
      state.notification.type = action.payload.type || 'info';
      state.notification.key = Date.now(); // تضمین رندر مجدد انیمیشن
    },
    hideNotification: (state) => {
      state.notification.open = false;
    },
  },
});

export const { showNotification, hideNotification } = uiSlice.actions;
export default uiSlice.reducer;