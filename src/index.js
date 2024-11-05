import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from './components/Home';
import Header from "./components/layout/Header";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import History from "./components/History";
import Lists from "./components/Lists";
import CreateProfessor from "./components/Create/Professor";
import CreateStudent from "./components/Create/Student";
import EditAbsence from "./components/EditAbsence";

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <Router>
        <Header/>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/history" element={<History/>}/>
            <Route path="/lists/:id" element={<Lists/>}/>
            <Route path="/edit-absence/:id?/:date?" element={<EditAbsence/>}/>
            <Route path="/create">
                <Route path="student" element={<CreateStudent/>}/>
                <Route path="professor" element={<CreateProfessor/>}/>
            </Route>
        </Routes>
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
