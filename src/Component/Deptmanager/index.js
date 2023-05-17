import React from "react";
import { Button, Divider, Layout, Table, Tooltip, Popconfirm, Space, Input, Select, notification } from 'antd'
import MenuSider from "../MenuSider";
import Headerpage from "../Headerpage";
import Footerpage from "../Footerpage";
import Highlighter from "react-highlight-words";
import Context from "../../Data/Context";
import { FileMarkdownOutlined, FilePdfOutlined, DeleteOutlined, SearchOutlined, UserAddOutlined, EyeOutlined } from "@ant-design/icons";
import Loadding from "../Loadding";
import axios from "axios";
import Modaldept from "./Modaldept";

const { Content } = Layout

const Deptmanager = () => {
    const searchInput = React.useRef(null);
    const [searchText, setSearchText] = React.useState("");
    const [searchedColumn, setSearchedColumn] = React.useState("");
    const { loading, setLoading, collapsed, ulrAPI, unit,stateModaldept, setStateModaldept } = React.useContext(Context)
    const [datadept,setDatadept] = React.useState([])
    const [datatable,setDatatable] = React.useState([])
    const [option, setOption] = React.useState([])
    React.useEffect(() => {
        setLoading(true)
        setOption([])
        unit.map(da => {
            setOption(option => [...option, { key: da.key, value: da.id, label: da.nameunit }])
        })
    }, [])
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText("");
        confirm();
    };

    const onChange = (value) => {
        var url = `${ulrAPI}/api/tai_phong_ban`
        axios.post(url, { unit: value })
            .then((res) => { 
                setDatadept([])
                setDatatable([])
                if(res.data.length!==0){
                    setDatadept(res.data)
                    res.data.map((da,index)=>{
                        setDatatable(datatable=>[...datatable,{
                            key:index,
                            tt:(index+1),
                            id:da.id,
                            ten_phong:da.ten_phong,
                            sl_nhan_su:da.child.length,
                            sl_nhom:da.group.length
                        }])
                    })
                }
             })
            .catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            })
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Nhập nội dung`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Tìm
                    </Button>
                    <Button
                        type="ghost"
                        onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Xoá
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: "STT",
            dataIndex: "tt",
            key: "id",
            width: 60,
            align: 'center',
        },
        {
            title: "Tên phòng ban",
            dataIndex: "ten_phong",
            key: "name",
            align: 'center',
        }, {
            title: "Số lượng nhóm",
            dataIndex: "sl_nhom",
            key: "name",
            align: 'center',
        }, {
            title: "Số lượng nhân sự",
            dataIndex: "sl_nhan_su",
            key: "name",
            align: 'center',
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
                    >
                        <Tooltip title="Xem DS nhóm">
                            <EyeOutlined style={{ fontSize: '18px', color: '#08c' }} />
                        </Tooltip>
                    </a>
                    <a
                        style={{
                            color: "blue",
                        }}
                    >
                        <Tooltip title="Xem DS NSự">
                            <EyeOutlined style={{ fontSize: '18px', color: '#08c' }} />
                        </Tooltip>
                    </a>
                    <Popconfirm
                        title="Bạn có muốn xóa không?"
                    //onConfirm={() => handleDelete(record)}
                    >
                        <a
                            style={{
                                color: "red",
                            }}
                        >
                            <Tooltip title="Xoá phòng">
                                <DeleteOutlined style={{ fontSize: '18px', color: '#08c' }} />
                            </Tooltip>
                        </a>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    return (
        <Layout className="homelayout">
            <MenuSider />
            <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 200 }}>
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
                            height: "62vh",
                            fontFamily: "Tahoma",
                            width: "100%",
                        }}
                    >
                        <p style={{ padding: 10 }}>Quản lý Phòng ban</p>
                        <Divider style={{ margin: 5 }} />
                        <div style={{ padding: 10 }}>
                            <div style={{ textAlign: '-webkit-right', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                <Select
                                    placeholder='Vui lòng chọn đơn vị'
                                    options={option}
                                    onChange={onChange}
                                />
                                <Button
                                    type="primary"
                                    style={{
                                        marginBottom: 16,
                                        display: 'flex'
                                    }}
                                    onClick={()=>{
                                        setStateModaldept(true)
                                        console.log('da')
                                    }}
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
                                bordered
                                dataSource={datatable}
                            />
                        </div>
                    </div>
                </Content>
                <Footerpage />
            </Layout>
            {loading && <Loadding />}
            <Modaldept/>
        </Layout>

    )
}

export default Deptmanager;