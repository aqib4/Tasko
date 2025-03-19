import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todo: null, // To store logged-in user details
};

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        setTodo(state, action) {
            state.todo = action.payload.todo;
        },

    },
});


export const { setTodo } = todoSlice.actions;
export default todoSlice.reducer;
