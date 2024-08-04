import { Route, Router, Routes } from 'react-router-dom'
import Topics from './pages/Topics'
import Login from './pages/login';
import Signup from './pages/signup';
import AddProblem from './pages/addProb';
import ProblemPage from './pages/probPage';
import Navbar from './components/Navbar';
import Contests from './pages/contest';
import './App.css';
import ProblemList from './pages/probList';
import Playground from './pages/playground';
import Contestpage from './pages/Contestpage';
import Homepage from './pages/Homepage';
import { AuthProvider } from './contexts/AuthContext';
import Newlogin from './pages/test';
import ErrorPage from './pages/ErrorPage';
import AddContestForm from './pages/addContest';
import Topicwise from './pages/topicwiseProbs';
import ContestProbpage from './pages/contestProbpage';
import AddAdmin from './pages/addAdmin';
import { ToastContainer} from "react-toastify";




function App() {
  return (
    <>
      <AuthProvider>
        
          <Navbar />
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/contests' element={<Contests />} />
            {/* <Route path='/login' element={<Login />} /> */}
            <Route path='/signup' element={<Signup />} />
            <Route path='/addprob' element={<AddProblem />} />
            <Route path='/problems' element={<ProblemList />} />
            <Route path='/problems/:id' element={<ProblemPage />} />
            <Route path='/playground' element={<Playground />} />
            <Route path='/topics' element={<Topics />} />
            <Route path='/topics/:topic' element={<Topicwise/>} />
            <Route path='/contests/:contestId' element={<Contestpage />} />
            <Route path='/login' element={<Newlogin/>}/>
            <Route path='/addcontest' element={ <AddContestForm/>} />
            <Route path='/addadmin' element={ <AddAdmin/>} />
            <Route path="/contests/:contestId/problem/:problemId" element={<ContestProbpage/>} />
            <Route path='/addadmin' element={ <AddAdmin/>}/>
            <Route path='*' element={<ErrorPage/>}/>
          </Routes>
          
          <ToastContainer />
      </AuthProvider>
    </>

  )
}

export default App
