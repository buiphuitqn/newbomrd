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
import View from "./View";
const { Header, Sider, Content } = Layout;
const ViewEbom = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { menu, setMenu, username, keymenu, setKeymenu } =
    React.useContext(Context);
  let navigate = useNavigate();
  return (
    <Layout className="homelayout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          {collapsed ? (
            <h5
              style={{
                color: "#fff",
                fontFamily: "Tahoma",
                fontWeight: "bold",
                padding: 0,
                margin: 0,
              }}
            >
              R&D
            </h5>
          ) : (
            <h5
              style={{
                color: "#fff",
                fontFamily: "Tahoma",
                fontWeight: "bold",
                padding: 0,
                margin: 0,
              }}
            >
              R&D AUTO
            </h5>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(e) => {
            const { innerText } = e.domEvent.target;
            setMenu(innerText);
            setKeymenu(e.key);
            navigate("/Homepage");
          }}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,

              label: "BOM",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "VẬT TƯ",
            },
            username.filter((da) => da.level == 8).length > 0 && {
              key: "3",
              icon: <CrownOutlined />,
              label: "Administrator",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background align-items-center"
          style={{
            padding: 0,
            justifyContent: "space-between",
          }}
        >
          <div className="d-flex align-items-center">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            <p
              style={{
                fontFamily: "Tahoma",
                fontWeight: "bold",
                padding: 0,
                margin: 0,
                fontSize: 16,
              }}
            >
              {menu}
            </p>
          </div>
          <div className="d-flex align-items-center mx-2">
            <Avatar
              style={{ backgroundColor: "#00549A", margin: 1 }}
              size={30}
              icon={<UserOutlined style={{ display: "inline-flex" }} />}
            />
            <p
              className="m-0 p-0"
              style={{
                fontFamily: "Tahoma",
                fontSize: 15,
              }}
            >
              {username[0].FullName}
            </p>
            <a
              className="logout"
              style={{ marginLeft: "10px", display: "flex" }}
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              <div>
                <LogoutOutlined
                  style={{ display: "inline-flex", marginRight: "5px" }}
                />
              </div>
              Đăng xuất
            </a>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: 5,
            padding: 5,
            minHeight: 280,
          }}
        >
          <View />
        </Content>
      </Layout>
    </Layout>
  );
};
export default ViewEbom;
