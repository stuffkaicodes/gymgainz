import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home.js';
import Routine from './components/routine/index.js';
import Header from './components/header/index';
import PastRoutines from './components/pastRoutines/index';
import DataTable from './components/addNewExercise/index';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function App() {

  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/home" element={<Home />}/>
        <Route path='/routine/:name' element={<Routine/>}/>
        <Route path='/routine/:name/add/:exercise/' element={<DataTable/>}/>
        <Route path='/record' element={<PastRoutines/>}/>
      </Routes> 
    </Router>
  );
}

export default App;
