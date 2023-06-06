import React from "react";
import { Button, Divider, Layout, Table, Tooltip, Popconfirm, Space, Input } from 'antd'
import MenuSider from "../MenuSider";
import Headerpage from "../Headerpage";
import Footerpage from "../Footerpage";
import Highlighter from "react-highlight-words";
import Context from "../../Data/Context";
import { FileMarkdownOutlined, FilePdfOutlined, DeleteOutlined, SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import Loadding from "../Loadding";

const { Content } = Layout

const Functionlist = () => {
    const {
        allmenu,
        iconrender,
        loading,
        setLoading,
        collapsed
      } = React.useContext(Context);
      const [datasource,setDatasource] = React.useState([])
    const columns = [
        {
            title: "Mã số",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên chức năng",
            dataIndex: "label",
            key: "label",
        },
        {
            title: "Icon",
            dataIndex: "iconshow",
            key: "iconshow",
        },
        {
            title: "URL",
            dataIndex: "link",
            key: "link",
        },
        {
            title: "Chức năng cha",
            dataIndex: "parentmenu",
            key: "parentmenu",
        },
    ];
    React.useEffect(()=>{
        console.log(allmenu)
        setLoading(true)
        setTimeout(()=>{
            allmenu.map((da,index)=>{
                setDatasource(datasource=>[...datasource,{
                    ...da,
                    iconshow:iconrender(da.iconshow)
                }])
            })
        },500)
    },[])
    return (
        <Layout className="homelayout">
            <MenuSider />
            <Layout className="site-layout" style={{marginLeft:collapsed?80:200}}>
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
                            height: "65vh",
                            fontFamily: "Tahoma",
                            width: "100%",
                        }}
                    >
                        <p style={{ padding: 10 }}>Danh mục chức năng</p>
                        <Divider style={{ margin: 5 }} />
                        <div style={{ padding: 10 }}>
                            <Table
                                className="tblistbom"
                                style={{
                                    height: "65vh",
                                    fontFamily: "Tahoma",
                                    width: "inherit",
                                }}
                                scroll={{
                                    y: 240,
                                }}
                                pagination={{
                                    defaultPageSize: 50,
                                }}
                                columns={columns}
                                dataSource={datasource}
                                bordered
                            />
                        </div>
                    </div>
                </Content>
                <Footerpage />
            </Layout>
            {loading&&<Loadding/>}
        </Layout>

    )
}

export default Functionlist;