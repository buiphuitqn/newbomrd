// Bảng quản lý danh sách Enovia

import React from "react";
import {
    DownloadOutlined,
    InboxOutlined,
    SearchOutlined,
    DeleteOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import * as XLSX from 'xlsx';
import {
    Button,
    Col,
    Divider,
    Input,
    Row,
    Upload,
    Table,
    Space,
    Popconfirm,
    notification,
    Layout,
    message
} from "antd";
import Context from "../../Data/Context";
import filedownload from "../../Library/file/MasterData.xlsx";
import axios from "axios";
import Highlighter from "react-highlight-words";

import "./style.css";
import { useNavigate } from "react-router-dom";
import Headerpage from "../Headerpage";
import MenuSider from "../MenuSider";
import Footerpage from "../Footerpage";
import Loadding from "../Loadding";
const { Content } = Layout;
const { Dragger } = Upload;
const ImportMaterial = () => {
    let navigate = useNavigate();
    const { bom, dataSource, enovia, setEnovia, username, loading, setLoading, collapsed, ulrAPI } =
        React.useContext(Context);
    const [searchText, setSearchText] = React.useState("");
    const [hiden, setHiden] = React.useState(false)
    const [searchedColumn, setSearchedColumn] = React.useState("");
    const searchInput = React.useRef(null);
    const [datamaster, setDatamaster] = React.useState([])
    React.useEffect(() => {

    }, []);
    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileread = new FileReader();
            fileread.readAsArrayBuffer(file);
            fileread.onload = (e) => {
                const buffarray = e.target.result;
                const wb = XLSX.read(buffarray, { type: "buffer" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };
            fileread.onerror = (error) => {
                reject(error);
            };
        });
        promise.then((d) => {
            console.log(d)
        });
    };

    const handleFile = (file) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: true, defval: null });
            delete excelData[0]
            excelData.map((da, index) => {
                if (da[0] !== '' && da[0] !== null)
                    setDatamaster(datamaster => [...datamaster, {
                        key: index,
                        ma_vat_tu: da[0],
                        ten_vn: da[1],
                        ten_en: da[2],
                        vat_lieu: da[3],
                        xuat_xu: da[4],
                        noi_gia_cong: da[5],
                        ma_ban_ve: da[6],
                        thong_so_ky_thuat: da[7],
                        dvt: da[8],
                        ma_phoi: da[9],
                        ten_phoi: da[10],
                        thong_so_phoi: da[11],
                        xuat_xu_phoi: da[12],
                        ban_ve_vat_tu: da[13],
                        dvt_phoi: da[14],
                        khoi_luong: da[15],
                        ghi_chu: da[16],
                        chua_khuon: da[17],
                        khuon_tam: da[18],
                        da_co_khuon: da[19],
                        khong_khuon: da[20]
                    }])
            })
            // Làm gì đó với dữ liệu Excel ở đây
        };


        fileReader.readAsArrayBuffer(file);
    };
    const exportEbom = () => {
        setHiden(!hiden)
        var url = `${ulrAPI}/api/ImportMasterdata`;
        var data = datamaster;
        axios
            .post(url, {
                data: data
            })
            .then((res) => {
                if (res.data === 'OK') {
                    notification["success"]({
                        message: "Thông báo",
                        description: "Lưu thành công",
                    });
                    setDatamaster([])
                }
            })
            .catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            });
    };

    const handleBeforeUpload = (file) => {
        const fileType = file.type;
        const allowedTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (!allowedTypes.includes(fileType)) {
            message.error('Chỉ được tải lên các tệp Excel!');
            return false;
        }

        handleFile(file);
        return false; // Prevent file from uploading
    };

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

    const handleDelete = (record) => {
        var url = `${ulrAPI}/api/Deleteenovia`;
        var id = bom.id;
        var idmaterial = record.ID;
        axios
            .post(url, {
                id: id,
                idmaterial: idmaterial,
            })
            .then((res) => {
                notification["success"]({
                    message: "Thông báo",
                    description: "Xóa thành công",
                });
                const newData = enovia.filter((item) => item.key !== record.key);
                setEnovia(newData);
            })
            .catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            });
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
            title: 'Thông tin linh kiện',
            children: [{
                title: "Mã số",
                dataIndex: "ma_vat_tu",
                key: "col1",
                width: "120px",
                fixed: 'left',
                ...getColumnSearchProps("ma_vat_tu"),
            },
            {
                title: "Tên linh kiện",
                key: "col0",
                fixed: 'left',
                children: [{
                    title: "Tên tiếng việt",
                    dataIndex: "ten_vn",
                    key: "col0",
                    width: '150px',
                    fixed: 'left',
                    ...getColumnSearchProps("ten_vn"),
                }, {
                    title: "Tên tiếng anh",
                    key: "ten_en",
                    width: '150px',
                    fixed: 'left',
                }
                ]
            }]
        }
        , {
            title: "Thông tin kỹ thuật linh kiện",
            children: [
                {
                    title: "Vật liệu",
                    dataIndex: "vat_lieu",
                    key: "address",
                    width: '100px',
                },
                {
                    title: "Xuất xứ",
                    dataIndex: "xuat_xu",
                    width: '150px',
                }, {
                    title: "Nơi gia công",
                    dataIndex: 'noi_gia_cong',
                    key: "endday",
                    width: '150px',
                },
                {
                    title: "Thông tin kỹ thuật",
                    key: "endday",
                    children: [{
                        title: 'Bản vẽ',
                        dataIndex: 'ma_ban_ve',
                        width: '100px',
                        key: 'layout'
                    }, {
                        title: 'Thông số kỹ thuật',
                        dataIndex: 'thong_so_ky_thuat',
                        width: '100px',
                        key: 'info'
                    }]
                },
                {
                    title: "ĐVT",
                    dataIndex: "dvt",
                    width: '100px',
                    key: "endday",
                },
            ],
        },
        {
            title: "Thông tin phôi",
            children: [
                {
                    title: "mã số phôi",
                    dataIndex: "ma_phoi",
                    key: "endday",
                    width: '100px',
                    ...getColumnSearchProps("ma_phoi"),
                },
                {
                    title: <div><p>Tên phôi</p><p>(Chọn gia công)</p></div>,
                    dataIndex: "ten_phoi",
                    width: '150px',
                    key: "endday",
                }, {
                    title: "Thông số kỹ thuật",
                    dataIndex: 'thong_so_phoi',
                    width: '100px',
                    key: "endday",
                }, {
                    title: "Xuất xứ phôi",
                    dataIndex: "xuat_xu_phoi",
                    width: '100px',
                    key: "endday",
                }, {
                    title: "Mã bản vẽ",
                    key: "ban_ve_vat_tu",
                    width: '100px',
                },
                {
                    title: "ĐVT",
                    dataIndex: "dvt_phoi",
                    width: '100px',
                    key: "endday",
                }, {
                    title: "Khối lượng",
                    dataIndex: 'khoi_luong',
                    width: '100px',
                    key: "khoi_luong",
                }, {
                    title: "Ghi chú",
                    dataIndex: 'ghi_chu',
                    width: '100px',
                    key: "ghi_chu",
                }, {
                    title: 'Thông tin khuôn',
                    children: [{
                        title: "Chưa có",
                        dataIndex: "chua_khuon",
                        width: '100px',
                        key: "endday",
                    },
                    {
                        title: "Khuôn tạm",
                        dataIndex: "khuon_tam",
                        width: '100px',
                        key: "endday",
                    },
                    {
                        title: "Đã có",
                        dataIndex: "da_co_khuon",
                        width: '100px',
                        key: "endday",
                    },
                    {
                        title: "Không cần",
                        dataIndex: "khong_khuon",
                        width: '100px',
                        key: "endday",
                    }]
                }
            ],
        },
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
                            width: "-webkit-fill-available",
                        }}
                    >
                        <Row>
                            <Col span={18}>
                                <Divider orientation="left">
                                    <Button
                                        type="link"
                                        style={{
                                            fontFamily: "Tahoma",
                                            fontSize: 18,
                                            color: "black",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Cập nhật Master Data
                                    </Button>
                                </Divider>
                            </Col>
                            <Col span={6}>
                                <Divider orientation="right">
                                    {datamaster.length != 0 && (
                                        <Button
                                            type="primary"
                                            onClick={exportEbom}
                                            style={{
                                                marginBottom: 16,
                                                display: 'flex'
                                            }}>
                                            <div>
                                                <SaveOutlined
                                                    style={{ display: "inline-flex", marginRight: "5px" }}
                                                />
                                            </div>
                                            Lưu
                                        </Button>
                                    )}
                                </Divider>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}></Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <a
                                        className="logout"
                                        style={{
                                            marginLeft: "10px",
                                            display: "flex",
                                            fontFamily: "Tahoma",
                                        }}
                                        href={filedownload}
                                    >
                                        <div>
                                            <DownloadOutlined
                                                style={{ display: "inline-flex", marginRight: "5px" }}
                                            />
                                        </div>
                                        Tải file mẫu
                                    </a>
                                    {enovia.filter((da) => da.state == "new").length != 0 && (
                                        <a
                                            className="logout"
                                            style={{
                                                marginLeft: "10px",
                                                display: "flex",
                                                fontFamily: "Tahoma",
                                            }}
                                            onClick={() => {
                                                notification["success"]({
                                                    message: "Thông báo",
                                                    description: "Xóa thành công",
                                                });
                                                const newData = enovia.filter((item) => item.state == "old");
                                                setEnovia(newData);
                                            }}
                                        >
                                            <div>
                                                <DeleteOutlined
                                                    style={{ display: "inline-flex", marginRight: "5px" }}
                                                />
                                            </div>
                                            Xóa dữ liệu mới
                                        </a>
                                    )}
                                </div>
                                <Dragger
                                    disabled={enovia.length != 0 ? true : false}
                                    beforeUpload={handleBeforeUpload}
                                // onChange={(e) => {
                                //     const { status } = e.file;
                                //     if (status == "done") {
                                //         var file = e.file.originFileObj;
                                //         delete file["uid"];
                                //         readExcel(file);
                                //     }
                                // }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">
                                        Nhập chuột hoặc kéo thả file vào đây
                                    </p>
                                    <p className="ant-upload-hint">
                                        Vui lòng chọn file excel (*.xlsx) và format đúng với file mẫu từ
                                        hệ thống!
                                    </p>
                                </Dragger>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table
                                    className="tabledata"
                                    columns={columns}
                                    scroll={{
                                        x: 2000,
                                        y: 500,
                                    }}
                                    bordered
                                    pagination={{
                                        defaultPageSize: 100,
                                    }}
                                    dataSource={datamaster}
                                />
                            </Col>
                        </Row>
                    </div>
                </Content>
                <Footerpage />
            </Layout>
            {loading && <Loadding />}
        </Layout>
    );
};
export default ImportMaterial;
