import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../baseUrl";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Define tag types for cache invalidation
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/todos",
      // Provide tags for cache invalidation
      providesTags: (result) => 
        // If we have a successful response with todos
        result 
          ? [
              // Create a tag for each todo using its ID
              ...result.map(({ id }) => ({ type: 'Todo', id })),
              // Also create a general 'LIST' tag for the entire list
              { type: 'Todo', id: 'LIST' }
            ]
          : [{ type: 'Todo', id: 'LIST' }]
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: "/todos",
        method: "POST",
        body: todo,
      }),
      // Invalidate the todo list when a new todo is added
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }]
    }),
    updateTodo: builder.mutation({
      query: ({ id, ...todo }) => ({
        url: `/todos/${id}`,
        method: "PUT",
        body: todo,
      }),
      // Invalidate both the specific todo and the list
      invalidatesTags: (result, error, { id }) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' }
      ]
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      // Invalidate both the specific todo and the list
      invalidatesTags: (result, error, id) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' }
      ]
    }),
  }),
});

export const { 
  useGetTodosQuery, 
  useAddTodoMutation, 
  useUpdateTodoMutation, 
  useDeleteTodoMutation 
} = todoApi;