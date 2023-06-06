import React from "react";
import { Button, Divider, Layout, Table, Tooltip, Popconfirm, Space, Input, Select, notification } from 'antd'
import MenuSider from "../MenuSider";
import Headerpage from "../Headerpage";
import Footerpage from "../Footerpage";
import Highlighter from "react-highlight-words";
import Context from "../../Data/Context";
import { FileMarkdownOutlined, FilePdfOutlined, DeleteOutlined, SearchOutlined, UserAddOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";
import Loadding from "../Loadding";
import axios from "axios";
import Modaladdgroup from "./Modaladdgroup";

const { Content } = Layout

const Groupmanager = () => {
    const searchInput = React.useRef(null);
    const [searchText, setSearchText] = React.useState("");
    const [searchedColumn, setSearchedColumn] = React.useState("");
    const { loading, setLoading, collapsed, ulrAPI, setStateModaladdgroupb,datatable,setDatatable,setDeptselect } = React.useContext(Context)
    const [datadept,setDatadept] = React.useState([])
    const [option, setOption] = React.useState([])
    React.useEffect(() => {
        setLoading(true)
        setOption([])
        setDeptselect('')
        var url = `${ulrAPI}/api/ds_phong`
        axios.post(url)
        .then((res)=>{
            
            res.data.map(da => {
                setOption(option => [...option, { key: da.key, value: da.id, label: da.ten_phong }])
            })
        })
        .catch((error)=>{

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
        var url = `${ulrAPI}/api/tai_nhom`
        setDeptselect(value)
        axios.post(url, { dept: value })
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
                            ten_nhom:da.ten_nhom,
                            sl_nhan_su:da.child.length,
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
            title: "Tên nhóm",
            dataIndex: "ten_nhom",
            key: "name",
            align: 'center',
        },{
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
                        <Tooltip title="Xem DS NSự">
                            <EyeOutlined style={{ fontSize: '18px', color: '#08c' }} />
                        </Tooltip>
                    </a>
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
                        <p style={{ padding: 10 }}>Quản lý Nhóm</p>
                        <Divider style={{ margin: 5 }} />
                        <div style={{ padding: 10 }}>
                            <div style={{ textAlign: '-webkit-right', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                <Select
                                    placeholder='Vui lòng chọn phòng ban'
                                    options={option}
                                    allowClear
                                    onChange={onChange}
                                />
                                <Button
                                    type="primary"
                                    style={{
                                        marginBottom: 16,
                                        display: 'flex'
                                    }}
                                    onClick={()=>{
                                        setStateModaladdgroupb(true)
                                    }}
                                >
                                    <div>
                                        <SettingOutlined
                                            style={{ display: "inline-flex", marginRight: "5px" }}
                                        />
                                    </div>
                                    Cài đặt
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
            <Modaladdgroup/>
        </Layout>

    )
}

export default Groupmanager;