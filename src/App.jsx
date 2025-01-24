// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
// import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
// import Tes from "./pages/Tes";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>}/>
        {/* <Route path="/tes" element={<Tes/>}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
