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
import MBom from "./MBom";
import MenuSider from "../MenuSider";
import Headerpage from "../Headerpage";
import Footerpage from "../Footerpage";
const { Header, Sider, Content } = Layout;
const MBomExport = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { menu, setMenu, username, keymenu, setKeymenu } =
    React.useContext(Context);
  let navigate = useNavigate();
  return (
    <Layout className="homelayout">
      <MenuSider/>
      <Layout className="site-layout">
        <Headerpage/>
        <Content
          className="site-layout-background"
          style={{
            margin: 5,
            padding: 5,
            minHeight: 280,
          }}
        >
          <MBom />
        </Content>
        <Footerpage/>
      </Layout>
    </Layout>
  );
};
export default MBomExport;
