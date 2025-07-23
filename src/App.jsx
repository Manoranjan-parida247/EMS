
import './App.css'
import LoginPage from "./components/login/LoginPage"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LayoutProvider } from './context/useLayoutContext'
import EmployeeList from './components/employee/EmployeeList'
import ProtectedRoute from './routes/ProtectedRoute'
import Layout from './components/commonComponents/Layout'
import { Provider } from 'react-redux'
import store from './app/store'
import AddEditEmployee from './components/employee/AddEditEmployee'
// import EmployeeDetails from './components/employee/EmployeeDetails'
import EmployeeDetailsShimmer from './components/employee/EmployeeDetailsShimmer'
import { lazy, Suspense } from 'react'
import { ConfirmDialogProvider } from './context/ConfirmDialogContext'
import Error from './components/commonComponents/Error'
import Home from './pages/Home'
const EmployeeDetails = lazy(()=>import('./components/employee/EmployeeDetails'))
function App() {


  return (
    <>
      <Provider store={store}>
        <ConfirmDialogProvider>
        <LayoutProvider>
          <AuthProvider>
            <BrowserRouter >
              <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/' element={<ProtectedRoute><Layout /></ProtectedRoute>} >
                  <Route path='/' element={<Home />} />
                  <Route path='employees' element={<EmployeeList />} />
                  <Route path='employees/new' element={<AddEditEmployee />} />
                  <Route path='employee-edit/:id' element={<AddEditEmployee />} />
                  <Route path="/employee-details/:id"
                    element={<Suspense fallback={<EmployeeDetailsShimmer />} >
                      <EmployeeDetails />
                    </Suspense>} />
                </Route>
                <Route path='*' element={<Error />} />
                {/* Protected Route */}
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LayoutProvider>
        </ConfirmDialogProvider>
      </Provider>
    </>
  )
}

export default App
