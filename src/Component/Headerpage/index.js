import React from "react";
import {
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Avatar, notification } from "antd";
import Context from "../../Data/Context";
import "./style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { Header } = Layout;



const Headerpage = () => {
    const { itemsmenu, setMenu, username, keymenu, setKeymenu, setPhanquyen, ulrAPI } =
        React.useContext(Context);
    let navigate = useNavigate();
    React.useEffect(() => {
        var url = `${ulrAPI}/api/phan_quyen`
        var user = username.IDMember
        axios.post(url, { user: user })
            .then((res) => {
                setPhanquyen(res.data)
            }).catch((error) => {
                console.log(error);
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            });
    }, [])
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
                    {username && username.FullName}
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
