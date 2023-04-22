import React from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CrownOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Avatar } from "antd";
import Context from "../../Data/Context";
import "./style.css";
import { useNavigate } from "react-router-dom";
import Ebomexport from "./Ebom";
import MenuSider from "../MenuSider";
import Headerpage from "../Headerpage";
import Footerpage from "../Footerpage";
import Loadding from "../Loadding";
const { Header, Sider, Content } = Layout;
const Ebom = () => {
  const {collapsed,loading,setLoading} = React.useContext(Context);
  React.useEffect(()=>{
    setLoading(true)
  },[])
  return (
    <Layout className="homelayout">
      <MenuSider/>
      <Layout className="site-layout" style={{marginLeft:collapsed?80:200}}>
        <Headerpage/>
        <Content
          className="site-layout-background"
          style={{
            margin: 5,
            padding: 5,
            minHeight: 280,
          }}
        >
          <Ebomexport />
        </Content>
        <Footerpage/>
      </Layout>
      {loading&&<Loadding/>}
    </Layout>
  );
};
export default Ebom;
