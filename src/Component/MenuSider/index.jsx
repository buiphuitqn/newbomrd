import React from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
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
import { Layout, Menu, notification } from "antd";
import Context from "../../Data/Context";
import "./style.css";
import logoauto from "../../Library/images/LOGO THACO AUTO.png"
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { Header, Sider } = Layout;



const MenuSider = () => {

    const {
        menu,
        setMenu,
        openkey,
        setOpenkey,
        selectkey,
        setSelectkey,
        allmenu,
        setLoading,
        collapsed, setCollapsed, ulrAPI, username
    } =
        React.useContext(Context);
    const [items, Setitems] = React.useState([])
    let navigate = useNavigate();
    function findChildren(node, arr) {
        node.children = arr.filter(item => item.parentmenu === node.id);
        if (node.children.length === 0)
            delete node['children']
        else
            node.children.forEach(child => findChildren(child, arr));
    }

    function convertToTree(arr) {
        // Tìm nút gốc (Parent = 0)
        const rootNode = arr.find(item => item.parentmenu === 0);
        // Gọi hàm đệ quy để tìm kiếm các con của nút gốc
        findChildren(rootNode, arr);
        return [rootNode];
    }
    const iconrender = (icon) => {
        switch (icon) {
            case 'AuditOutlined':
                return <AuditOutlined style={{ fontSize: '18px' }} />
            case 'CarOutlined':
                return <CarOutlined style={{ fontSize: '18px' }} />
            case 'ContainerOutlined':
                return <ContainerOutlined style={{ fontSize: '18px' }} />
            case 'DeliveredProcedureOutlined':
                return <DeliveredProcedureOutlined style={{ fontSize: '18px' }} />
            case 'ExportOutlined':
                return <ExportOutlined style={{ fontSize: '18px' }} />
            case 'ExceptionOutlined':
                return <ExceptionOutlined style={{ fontSize: '18px' }} />
            case 'FileExcelOutlined':
                return <FileExcelOutlined style={{ fontSize: '18px' }} />
            case 'FileExclamationOutlined':
                return <FileExclamationOutlined style={{ fontSize: '18px' }} />
            case 'FilePptOutlined':
                return <FilePptOutlined style={{ fontSize: '18px' }} />
            case 'IdcardOutlined':
                return <IdcardOutlined style={{ fontSize: '18px' }} />
            case 'KeyOutlined':
                return <KeyOutlined style={{ fontSize: '18px' }} />
            case 'SettingOutlined':
                return <SettingOutlined style={{ fontSize: '18px' }} />
            default:
                return <WarningOutlined style={{ fontSize: '18px' }} />
        }
    }
    React.useEffect(() => {
        var url = `${ulrAPI}/api/menulistuser`;
        var user = username.IDMember
        axios
            .post(url, { user: user })
            .then((res) => {
                if (res.data.length != 0) {
                    var data = res.data;
                    var data2 = [];
                    data.map((item, index) => {
                        data2.push({
                            key: index,
                            id: item.Id,
                            label: item.label,
                            icon: iconrender(item.icon),
                            iconshow: item.icon,
                            link: item.link,
                            parentmenu: item.ParentMenu,
                        });
                    });
                    Setitems(convertToTree(data2))
                    setMenu(data2)
                } else {
                    notification["error"]({
                        message: "Thông báo",
                        description: "Không thể tải dữ liệu",
                        duration: 2
                    });
                }
            })
            .catch((error) => {
                console.log(error)
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            });
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, []);
    return (
        <Sider trigger={null} collapsible collapsed={collapsed} style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
        }}>
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
                    {React.createElement(
                        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                        {
                            className: "trigger",
                            onClick: () => setCollapsed(!collapsed),
                        }
                    )}
                    {!collapsed && <img className="logoauto" src={logoauto} />}
                </div>
            </Header>
            <div className="menubutton">
                <Menu
                    theme="Light"
                    mode="inline"
                    className="menu-sider-main"
                    defaultOpenKeys={openkey}
                    defaultSelectedKeys={selectkey}
                    onClick={(e) => {
                        setSelectkey([e.key]);
                        if (menu.filter(da => da.key == e.key)[0].parentmenu > 0) {
                            setOpenkey([`${menu.filter(da=>da.id===menu.filter(da => da.key == e.key)[0].parentmenu)[0].key}`])
                        }
                        const { innerText } = e.domEvent.target;
                        navigate(`/BOMManager/${menu.filter(da => da.label == innerText).map(da => da.link)}`)
                    }}
                    items={items.length !== 0 && items[0].children}
                />
            </div>
        </Sider>
    );
};
export default MenuSider;
