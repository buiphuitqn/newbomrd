import React from "react";
import { Layout, Avatar } from "antd";
import "./style.css";
import bg from "../../Library/images/BG.jpg";
import MenuSider from '../MenuSider'
import Headerpage from "../Headerpage";
import Footerpage from "../Footerpage";
import Loadding from "../Loadding";
import Context from "../../Data/Context";
const { Content } = Layout;

const HomePage = () => {
  const { loading } =
  React.useContext(Context);
  return (
    <Layout className="homelayout">
      <MenuSider />
      <Layout className="site-layout">
        <Headerpage />
        <Content
          className="site-layout-background"
          style={{
            margin: 5,
            padding: 5,
            minHeight: 280,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
            }}
          >
            <p
              style={{
                zIndex: 3,
                fontFamily: 'Tahoma',
                position: 'absolute'
              }}
            >Chức năng đang phát triển</p>
            <img style={{ width: "100%", height: "100%", position: 'absolute', objectFit: 'cover' }} src={bg} alt="Background" />
          </div>
          
        </Content>
        <Footerpage />
      </Layout>
      {loading&&<Loadding/>}
      
    </Layout>
  );
};
export default HomePage;
