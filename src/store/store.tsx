import { Todo } from '@/api/api'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
  reducer: {
    [Todo.reducerPath]: Todo.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 1. Иҷозат додан ба Action-ҳои RTK Query
        ignoredActions: [
          'Todo/executeMutation/fulfilled',
          'Todo/executeQuery/fulfilled',
          'Todo/executeQuery/pending',
        ],
        // 2. Иҷозат додан ба майдонҳои махсусе, ки файл ё объектҳои браузер доранд
        ignoredActionPaths: [
          'payload', 
          'meta.baseQueryMeta.request', 
          'meta.baseQueryMeta.response'
        ],
        // 3. Иҷозат додан ба худи стейти API
        ignoredPaths: [Todo.reducerPath],
      },
    }).concat(Todo.middleware),
})

setupListeners(store.dispatch)