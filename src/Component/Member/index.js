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

const Member = () => {
    const searchInput = React.useRef(null);
    const [searchText, setSearchText] = React.useState("");
    const [searchedColumn, setSearchedColumn] = React.useState("");
    const {loading,setLoading,collapsed} = React.useContext(Context)
    React.useEffect(()=>{
        setLoading(true)
    },[])
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters,confirm) => {
        clearFilters();
        setSearchText("");
        confirm();
    };

    const handleDelete = (record) => {

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
                        onClick={() => clearFilters && handleReset(clearFilters,confirm)}
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
            title: "Mã số nhân viên",
            dataIndex: "IDMember",
            key: "id",
            ...getColumnSearchProps("IDMember"),
        },
        {
            title: "Họ và tên",
            dataIndex: "Namebom",
            key: "name",
            ...getColumnSearchProps("Namebom"),
        },
        {
            title: "Bộ phận",
            dataIndex: "Unit",
            key: "member",
            ...getColumnSearchProps("Unit"),
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
                        <Tooltip title="E-Bom">
                            <FilePdfOutlined style={{ fontSize: '18px', color: '#08c' }} />
                        </Tooltip>
                    </a>
                    <a
                        style={{
                            color: "blue",
                        }}
                    >
                        <Tooltip title="M-Bom">
                            <FileMarkdownOutlined style={{ fontSize: '18px', color: '#08c' }} />
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
                            <Tooltip title="Xoá BOM">
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
                            height: "62vh",
                            fontFamily: "Tahoma",
                            width: "100%",
                        }}
                    >
                        <p style={{ padding: 10 }}>Quản lý Nhân sự</p>
                        <Divider style={{ margin: 5 }} />
                        <div style={{ padding: 10 }}>
                            <div style={{ textAlign: '-webkit-right' }}>
                                <Button
                                    type="primary"
                                    style={{
                                        marginBottom: 16,
                                        display: 'flex'
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

export default Member;