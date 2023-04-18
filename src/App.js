import { Routes, Route, useNavigate } from "react-router-dom";
import ContextProvider from './Data/ContextProvider';
import './App.css';
import Login from './Component/Login';
import Statedata from './Data/Statedata';
import React from 'react';
import HomePage from './Component/Homepage';
import BOM from './Component/BOM';
import Ebom from './Component/EBom';
import MBomExport from './Component/MBomexport';
import ViewEbom from './Component/ViewEbom';
import MBom from "./Component/MBom";
import Member from "./Component/Member";
import Material from "./Component/Material";
import Functionlist from "./Component/Functionlist";

function App({ history }) {
  const { initState } = Statedata()
  let navigate = useNavigate();
  React.useEffect(() => {
    if(initState.username.length!=0)
    initState.selectkey == null && navigate("/BOMManager")
    else {
      localStorage.clear()
      navigate("/")
    }
  }, [])
  return (
    <ContextProvider value={initState}>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/BOMManager' element={<HomePage />}></Route>
        <Route path='/BOMManager/BOM' element={<MBom />}></Route>
        <Route path='/BOMManager/BOM/ennovia' element={<BOM/>}></Route>
        <Route path='/BOMManager/he-thong/quan-ly-nhan-su' element={<Member />}></Route>
        <Route path='/BOMManager/Quan-ly-vat-tu' element={<Material />}></Route>
        <Route path='/BOMManager/he-thong/chuc-nang' element={<Functionlist />}></Route>
        <Route path='/BOMManager/he-thong/vai-tro' element={<Functionlist />}></Route>
        <Route path='/BOMManager/BOM/Ebom' element={<Ebom/>}></Route>
      </Routes>
    </ContextProvider>
  );
}

export default App;
