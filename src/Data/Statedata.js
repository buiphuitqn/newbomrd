import React from "react";
import axios from "axios";
import { message, notification } from "antd";
import {
  WarningOutlined,
  AuditOutlined,
  CarOutlined,
  ContainerOutlined,
  DeliveredProcedureOutlined,
  SettingOutlined,
  KeyOutlined,
  IdcardOutlined,
  FilePptOutlined,
  FileExclamationOutlined,
  FileExcelOutlined,
  ExceptionOutlined,
  ExportOutlined
} from "@ant-design/icons";

const dataStorage = JSON.parse(window.localStorage.getItem("username"));
const initialState = () => {
  if (dataStorage) {
    return dataStorage;
  } else {
    window.localStorage.setItem("username", JSON.stringify([]));
    return [];
  }
};

const initialData = () => {
  var data2 = [];
  var url = "https://10.40.12.4:7978/api/material";
  axios
    .post(url)
    .then((res) => {
      if (res.data.length != 0) {
        var data = res.data;
        data.map((item, index) => {
          data2.push({
            key: index,
            col0: item.Tenhang,
            col1: item.mahang,
            col2: item.Vatlieu,
            col3: item.Xuatxu,
            col4: item.Quycach,
            col5: item.Quycachdotlo,
            col6: item.DVT,
            col7: item.Telinhkien,
            col8: item.malinhkien,
            col9: item.DVTLinhkien,
            col10: item.Slphoi,
            col11: item.Tieuhao,
            col12: item.Luongduphoi,
            col13: item.Quycachphoi,
            col14: item.Xuatxulinhkien,
            col15: item.thongso,
          });
        });
        console.log(data2)
      } else {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể tải dữ liệu",
          duration:2
        });
      }
    })
    .catch((error) => {
      notification["error"]({
        message: "Thông báo",
        description: "Không thể truy cập máy chủ",
        duration:2
      });
    });
  return data2;
};
const iconrender = (icon) => {
  switch (icon) {
    case 'AuditOutlined':
      return <AuditOutlined style={{ fontSize: '18px'}}/>
    case 'CarOutlined':
      return <CarOutlined style={{ fontSize: '18px'}}/>
    case 'ContainerOutlined':
      return <ContainerOutlined style={{ fontSize: '18px'}}/>
    case 'DeliveredProcedureOutlined':
      return <DeliveredProcedureOutlined style={{ fontSize: '18px'}}/>
    case 'ExportOutlined':
      return <ExportOutlined style={{ fontSize: '18px'}}/>
    case 'ExceptionOutlined':
      return <ExceptionOutlined style={{ fontSize: '18px'}}/>
    case 'FileExcelOutlined':
      return <FileExcelOutlined style={{ fontSize: '18px'}}/>
    case 'FileExclamationOutlined':
      return <FileExclamationOutlined style={{ fontSize: '18px'}}/>
    case 'FilePptOutlined':
      return <FilePptOutlined style={{ fontSize: '18px'}}/>
    case 'IdcardOutlined':
      return <IdcardOutlined style={{ fontSize: '18px'}}/>
    case 'KeyOutlined':
      return <KeyOutlined style={{ fontSize: '18px'}}/>
    case 'SettingOutlined':
      return <SettingOutlined style={{ fontSize: '18px'}}/>
    default:
      return <WarningOutlined style={{ fontSize: '18px'}}/>
  }
}
const initUnit = () => {
  var data2 = [];
  var url = "https://10.40.12.4:7978/api/Bomchild";
  axios
    .post(url)
    .then((res) => {
      if (res.data.length != 0) {
        var data = res.data;
        data.map((item, index) => {
          data2.push({
            key: index,
            ...item,
          });
        });
      }
    })
    .catch((error) => {
      notification["error"]({
        message: "Thông báo",
        description: "Không thể truy cập máy chủ",
        duration:2
      });
    });
  return data2;
};

const initMenu = () => {
  var data2 = [];
  var url = "https://10.40.12.4:7978/api/menulist";
  axios
    .post(url)
    .then((res) => {
      if (res.data.length != 0) {
        var data = res.data;
        data.map((item, index) => {
          data2.push({
            key: index,
            id:item.Id,
            label:item.label,
            icon:iconrender(item.icon),
            iconshow:item.icon,
            link:item.link,
            parentmenu:item.ParentMenu,
          });
        });
      } else {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể tải dữ liệu",
          duration:2
        });
      }
    })
    .catch((error) => {
      console.log(error)
      notification["error"]({
        message: "Thông báo",
        description: "Không thể truy cập máy chủ",
        duration:2
      });
    });
  return data2
};

const initMenuall = () => {
  var data2 = [];
  var url = "https://10.40.12.4:7978/api/menulist";
  axios
    .post(url)
    .then((res) => {
      if (res.data.length != 0) {
        var data = res.data;
        data.map((item, index) => {
          data2.push({
            key: index,
            id:item.Id,
            label:item.label,
            icon:iconrender(item.icon),
            iconshow:item.icon,
            link:`/BOMManager/${item.link}`,
            parentmenu:item.ParentMenu,
          });
        });
      } else {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể tải dữ liệu",
          duration:2
        });
      }
    })
    .catch((error) => {
      console.log(error)
      notification["error"]({
        message: "Thông báo",
        description: "Không thể truy cập máy chủ",
        duration:2
      });
    });
  return data2
};

export default function () {
  const [login, setLogin] = React.useState(false);
  const [username, setUsername] = React.useState(initialState);
  const [menu, setMenu] = React.useState(initMenu);
  const [allmenu,setAllmenu] = React.useState(initMenuall)
  const [show, setShow] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [idproject, setIDproject] = React.useState("");
  const [dataSource, setDatasource] = React.useState(initialData);
  const [bom, setBom] = React.useState("");
  const [keymenu, setKeymenu] = React.useState("");
  const [enovia, setEnovia] = React.useState([]);
  const [stateModalbom, setStateModalbom] = React.useState(false);
  const [stateModalmention, setStateModalmention] = React.useState(false);
  const [listBom, setListBom] = React.useState([]);
  const [dataebom, setDataebom] = React.useState([]);
  const [datachild, setDatachild] = React.useState([]);
  const [parentbom, setParentbom] = React.useState("");
  const [changepass, setChangepass] = React.useState(false);
  const [openkey,setOpenkey] = React.useState(null)
  const [selectkey,setSelectkey] = React.useState(null)
  const [loading, setLoading] = React.useState(true);
  const initState = {
    login,
    setLogin,
    username,
    setUsername,
    menu,
    setMenu,
    show,
    setShow,
    title,
    setTitle,
    idproject,
    setIDproject,
    dataSource,
    setDatasource,
    bom,
    setBom,
    keymenu,
    setKeymenu,
    enovia,
    setEnovia,
    stateModalbom,
    setStateModalbom,
    listBom,
    setListBom,
    dataebom,
    setDataebom,
    datachild,
    setDatachild,
    parentbom,
    setParentbom,
    changepass,
    setChangepass,
    allmenu,setAllmenu,
    iconrender,
    openkey,setOpenkey,
    selectkey,setSelectkey,
    stateModalmention, setStateModalmention,
    loading, setLoading
  };
  return { initState };
}
