import React from "react";
import {
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Avatar } from "antd";
import Context from "../../Data/Context";
import "./style.css";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
const { Header } = Layout;



const Headerpage = () => {
    const { itemsmenu, setMenu, username, keymenu, setKeymenu } =
        React.useContext(Context);
    let navigate = useNavigate();

    return (
        <Header
            className="headerbutton site-layout-background align-items-center"
            style={{
                padding: 0,
                justifyContent: "space-between",
                position: 'sticky',
                top: 0,
                zIndex: 1,
            }}
        >
            <div className="d-flex align-items-center">
                <p
                    style={{
                        fontFamily: "Tahoma",
                        padding: 25,
                        margin: 10,
                        fontSize: 18,
                    }}
                >
                    PHẦN MỀM QUẢN TRỊ BOM VẬT TƯ
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
    );
};
export default Headerpage;
