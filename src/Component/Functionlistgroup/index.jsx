import React from "react";
import { Button, Divider, Layout, Table, Tooltip, Popconfirm, Space, notification } from 'antd'
import MenuSider from "../MenuSider";
import Headerpage from "../Headerpage";
import Footerpage from "../Footerpage";
import Highlighter from "react-highlight-words";
import Context from "../../Data/Context";
import { FileMarkdownOutlined, FilePdfOutlined, DeleteOutlined, SearchOutlined, UserAddOutlined, SettingOutlined } from "@ant-design/icons";
import Loadding from "../Loadding";
import axios from "axios";
import Modalsetting from "./Modalsetting";
import Modaladdgroup from "./Modaladdgroup";

const { Content } = Layout

const Functionlistgroup= () => {
    const {
        ulrAPI,
        iconrender,
        loading,
        setLoading,
        collapsed,
        setStateModalsettinggroup,
        setStateModaladdgroup,
        listgroup,setListgroup,
        setGroupselect
      } = React.useContext(Context);
    const columns = [
        {
            title: "TT",
            dataIndex: "no",
            key: "id",
            width:100,
            align:'center'
        },
        {
            title: "Tên nhóm",
            dataIndex: "ten_group",
            key: "ten_group",
        },
        {
            title: "Chức năng",
            key: "address",
            width: "15%",
            render: (record) =>
            (
                <Space size="middle">
                    <a
                        style={{
                            color: "blue",
                        }}
                        onClick={() => {
                            setGroupselect(record)
                            setStateModalsettinggroup(true)
                        }}
                    >
                        <Tooltip title="Cài đặt">
                            <SettingOutlined style={{ fontSize: '18px', color: '#08c' }} />
                        </Tooltip>
                    </a>
                    <Popconfirm
                        title="Bạn có muốn xóa không?"
                        onConfirm={() => handleDelete(record)}
                    >
                        <a
                            style={{
                                color: "red",
                            }}
                        >
                            <Tooltip title="Xoá vai trò">
                                <DeleteOutlined style={{ fontSize: '18px', color: '#08c' }} />
                            </Tooltip>
                        </a>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const handleDelete = arr =>{
        var id = arr.id
        var url = `${ulrAPI}/api/xoa_vai_tro`
        axios.post(url,{id:id})
        .then((res)=>{
            if(res.data.message==='success'){
                notification["success"]({
                    message: "Thông báo",
                    description: "Xoá thành công",
                    duration: 2
                });
                setListgroup(listgroup.filter(da=>da.id!==arr.id))
            }
            else {
                console.log(res.data)
                notification["error"]({
                    message: "Thông báo",
                    description: "Xoá thất bại",
                    duration: 2
                });
            }
        })
        .catch((error)=>{
            console.log(error)
            notification["error"]({
                message: "Thông báo",
                description: "Không thể truy cập máy chủ",
                duration: 2
            });
        })
    }

    React.useEffect(()=>{
        setLoading(true)
        var url = `${ulrAPI}/api/danh_sach_vai_tro`
        axios.post(url)
        .then((res)=>{
            if(res.data.length!==0){
                setListgroup([])
                res.data.map((da,index)=>{
                    setListgroup(datasource=>[
                        ...datasource,
                        {
                            key:index,
                            no:index+1,
                            ...da
                        }
                    ])
                })
            }
        }).catch((error) => {
            notification["error"]({
                message: "Thông báo",
                description: "Không thể truy cập máy chủ",
                duration: 2
            });
        })
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
                        <p style={{ padding: 10 }}>Danh mục vai trò</p>
                        <Divider style={{ margin: 5 }} />
                        <div style={{ padding: 10 }}>
                        <div style={{ textAlign: '-webkit-right' }}>
                                <Button
                                    type="primary"
                                    style={{
                                        marginBottom: 16,
                                        display: 'flex'
                                    }}
                                    onClick={() => { setStateModaladdgroup(true) }}
                                >
                                    <div>
                                        <UserAddOutlined
                                            style={{ display: "inline-flex", marginRight: "5px" }}
                                        />
                                    </div>
                                    Thêm mới
                                </Button>
                            </div>
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
                                dataSource={listgroup}
                                bordered
                            />
                        </div>
                    </div>
                </Content>
                <Footerpage />
            </Layout>
            {loading&&<Loadding/>}
            <Modalsetting/>
            <Modaladdgroup/>
        </Layout>
    )
}

export default Functionlistgroup;