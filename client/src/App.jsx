import './App.css'
import Register from './components/Auth/Register.jsx'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Login from './components/Auth/Login.jsx'
import ProtectedRoute from './Components/ProtectedRoute.jsx'
import Home from './Pages/Home.jsx'
import CreateTask from './Pages/CreateTask.jsx'
import UpdateTask from './Pages/UpdateTask.jsx'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>

          <Route element={<ProtectedRoute/>}>
            <Route path='/' element={<Home/>}/>
            <Route path='/tasks/create' element={<CreateTask/>}/>
            <Route path='/tasks/update/:taskId' element={<UpdateTask />} />  {/* Add UpdateTask route */}
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
