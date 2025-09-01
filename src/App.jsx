import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/InterviewManager/Login';
import MainPage from './Pages/InterviewManager/MainPage'
import Dashboard from './Pages/InterviewManager/Dashboard';
import Leads from './Pages/InterviewManager/Leads';
import TotalLeads from './Pages/InterviewManager/TotalLeads';
import ViewClientForm from './Pages/InterviewManager/ViewClientForm';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Router>
         <Routes>
        <Route path='/' element={<Login/>}/>


         <Route path="/dashboard" element={
          <Dashboard>
            <MainPage />
          </Dashboard>
        } />

         <Route path="/leads" element={
          <Dashboard>
            <Leads />
          </Dashboard>
        } />
         <Route path="/total-leads" element={
          <Dashboard>
            <TotalLeads />
          </Dashboard>
        } />
         <Route path="/View-form" element={
          <Dashboard>
            <ViewClientForm />
          </Dashboard>
        } />
        </Routes>
  </Router>
    </>
  )
}

export default App
