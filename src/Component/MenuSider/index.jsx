import React from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from "@ant-design/icons";
import { Layout, Menu, Avatar } from "antd";
import Context from "../../Data/Context";
import "./style.css";
import logoauto from "../../Library/images/LOGO THACO AUTO.png"
import { useNavigate } from "react-router-dom";
const { Header, Sider } = Layout;



const MenuSider = () => {
    const [collapsed, setCollapsed] = React.useState(false);
    const {
        menu,
        openkey,
        setOpenkey,
        selectkey,
        setSelectkey,
        allmenu,
        setLoading
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
    React.useEffect(() => {
        setTimeout(() => {
            menu.length!=0&&Setitems(convertToTree(menu))
            setLoading(false)
        }, 500);
    }, [menu]);
    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
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
                        if(allmenu.filter(da=>da.key==e.key)[0].parentmenu>1)
                        {
                            setOpenkey([`${items[0].children.filter(da=>da.id==allmenu.filter(da=>da.key==e.key)[0].parentmenu)[0].key}`])
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
