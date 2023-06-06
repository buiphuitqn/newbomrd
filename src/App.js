import { Routes, Route, useNavigate,useLocation } from "react-router-dom";
import ContextProvider from './Data/ContextProvider';
import './App.css';
import Login from './Component/Login';
import Statedata from './Data/Statedata';
import React from 'react';
import HomePage from './Component/Homepage';
import BOM from './Component/BOM';
import Ebom from './Component/EBom';
import MBomExport from './Component/MBomexport';
import MBom from "./Component/MBom";
import Member from "./Component/Member";
import Material from "./Component/Material";
import Functionlist from "./Component/Functionlist";
import Tablemanager from "./Component/Tablemanager";
import Approvebomchild from "./Component/Approvebomchild";
import Approvebomcum from "./Component/Approvebomcum";
import Viewebom from "./Component/ViewEbom"
import Deptmanager from "./Component/Deptmanager";
import ImportMaterial from "./Component/ImportMaterial";
import Functionlistgroup from "./Component/Functionlistgroup";
import Groupmanager from "./Component/Groupmanager";

function App({ history }) {
  const { initState } = Statedata()
  let navigate = useNavigate();
  const location = useLocation();
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
        <Route path='/BOMManager/Vat_tu/Quan-ly-vat-tu' element={<Material />}></Route>
        <Route path='/BOMManager/he-thong/chuc-nang' element={<Functionlist />}></Route>
        <Route path='/BOMManager/he-thong/vai-tro' element={<Functionlistgroup />}></Route>
        <Route path='/BOMManager/BOM/Ebom' element={<Ebom/>}></Route>
        <Route path='/BOMManager/BOM/phe-duyet-ebom-con' element={<Approvebomchild/>}></Route>
        <Route path='/BOMManager/BOM/phe-duyet-ebom-cum' element={<Approvebomcum/>}></Route>
        <Route path='/BOMManager/BOM/ebom-tong' element={<Viewebom/>}></Route>
        <Route path='/BOMManager/he-thong/quan-ly-bo-phan' element={<Deptmanager/>}></Route>
        <Route path='/BOMManager/he-thong/quan-ly-nhom' element={<Groupmanager/>}></Route>
        <Route path='/BOMManager/Vat_tu/Cap_nhat_vat_tu' element={<ImportMaterial/>}></Route>
      </Routes>
    </ContextProvider>
  );
}

export default App;
