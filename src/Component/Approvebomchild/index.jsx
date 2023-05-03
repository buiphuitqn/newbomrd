import React from "react";
import {
    SearchOutlined,
    MenuUnfoldOutlined,
    CrownOutlined,
    UserOutlined,
    VideoCameraOutlined,
    LogoutOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import { Layout, Form, Table, notification, Row, Col, Button, Divider, Popconfirm, Input, Space,Tag } from "antd";
import Context from "../../Data/Context";
import "./style.css";
import { useNavigate } from "react-router-dom";
import logo from "../../Library/images/LOGO THACO AUTO.png";
import Highlighter from "react-highlight-words";
import MenuSider from "../MenuSider";
import Headerpage from "../Headerpage";
import Footerpage from "../Footerpage";
import Loadding from "../Loadding";
import axios from "axios";
const { Header, Sider, Content } = Layout;
const exportLevel = (level) => {
    var newLevel = [];
    level.map((item) => {
        var ar = [];
        for (var i = 2; i <= 7; i++) {
            if (i == item) ar.push(1);
            else ar.push(0);
        }
        newLevel.push(ar);
    });
    if (newLevel[0][0] == 0) return [];
    var endlevel = [];
    var leve = [0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < newLevel.length; i++) {
        var id = "";
        for (var j = 0; j < newLevel[i].length; j++) {
            if (newLevel[i][j] == 1) {
                leve[j] = leve[j] + 1;
                for (var n = j + 1; n < 7; n++) {
                    leve[n] = 0;
                }
                for (var m = 0; m < leve.length; m++) {
                    if (leve[m] != 0) {
                        if (id == "") id = leve[m];
                        else id += `.${leve[m]}`;
                    }
                }
            }
        }
        endlevel.push(id);
    }
    return endlevel;
};

const exportSLxe = (level, slcum) => {
    var newLevel = [];
    level.map((item) => {
        var ar = [];
        for (var i = 2; i <= 7; i++) {
            if (i == item) ar.push(1);
            else ar.push(0);
        }
        newLevel.push(ar);
    });
    if (newLevel[0][0] == 0) return [];
    var endlevel = [];
    var leve = [0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < newLevel.length; i++) {
        var id = "";
        for (var j = 0; j < newLevel[i].length; j++) {
            if (newLevel[i][j] == 1) {
                leve[j] = slcum[i];
                for (var n = j + 1; n < 7; n++) {
                    leve[n] = 0;
                }
                for (var m = 0; m < leve.length; m++) {
                    if (leve[m] != 0) {
                        if (id == "") id = `${leve[m]}`;
                        else id *= `${leve[m]}`;
                    }
                }
            }
        }
        endlevel.push(id);
    }
    return endlevel;
};
const Approvebomchild = () => {
    const [form] = Form.useForm();
    const [searchText, setSearchText] = React.useState("");
    const [searchedColumn, setSearchedColumn] = React.useState("");
    const searchInput = React.useRef(null);
    const [showfinish, setShowfinish] = React.useState(false);
    const { collapsed, loading, setLoading, dataebom, setDataebom, bom,setBom } = React.useContext(Context);
    React.useEffect(() => {
        setLoading(true)
        //Tải dữ liệu từ bảng ebom
        var url = "https://113.174.246.52:7978/api/LoadEbomtemp";
        var id = bom.id;
        axios
            .post(url, { id: id })
            .then((res) => {
                setDataebom([]);
                if (res.data.length != 0) {
                    var data = res.data;
                    var lever = exportLevel(data.map((en) => en.level));
                    var Slxe = exportSLxe(
                        data.map((en) => en.level),
                        data.map((en) => en.slcum)
                    );
                    data.map((item, index) => {
                        setDataebom((dataebom) => [
                            ...dataebom,
                            {
                                key: index,
                                no: index + 1,
                                level: lever[index],
                                level2: item.level,
                                ma_vat_tu: item.ma_vat_tu,
                                ten_vn: item.ten_vn,
                                ten_en: item.ten_en,
                                vat_lieu: item.vat_lieu,
                                xuat_xu: item.xuat_xu,
                                noi_gia_cong: item.noi_gia_cong,
                                ma_ban_ve: item.ma_ban_ve,
                                thong_so_ky_thuat: item.thong_so_ky_thuat,
                                slcum: item.slcum,
                                slxe: Slxe[index],
                                dvt: item.dvt,
                                ma_phoi: item.ma_phoi,
                                ten_phoi: item.ten_phoi,
                                thong_so_phoi: item.thong_so_phoi,
                                xuat_xu_phoi: item.xuat_xu_phoi,
                                ban_ve_vat_tu: item.ban_ve_vat_tu,
                                dvt_phoi: item.dvt_phoi,
                                khoi_luong: item.khoi_luong,
                                ghi_chu: item.ghi_chu
                            },
                        ]);
                    });
                    setShowfinish(true);
                }
            })
            .catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            });
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = ''; // some message to prompt user to confirm leaving the page
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [])
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
                        onClick={() => clearFilters && handleReset(clearFilters)}
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
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const handleApprove = ()=>{
        var url = "https://113.174.246.52:7978/api/updatestatusbomchild"
    var id = bom.id
    var status = 1
    axios.post(url,{id:id,status:3})
    .then((res)=>{
      if(res.data==='OK')
      {
        setBom({...bom,status:3,statuschild:<Tag icon={<CheckCircleOutlined />} color="success">
        Đã duyệt
      </Tag>})
        notification["success"]({
          message:'Thông báo',
          description:"Phê duyệt thành công",
          duration:2
        })
      }
    }).catch((error)=>{
      notification["error"]({
        message: "Thông báo",
        description: "Không thể truy cập máy chủ",
        duration: 2
      });
    })
    }

    const handleDeny = () =>{
        var url = "https://113.174.246.52:7978/api/updatestatusbomchild"
    var id = bom.id
    var status = 1
    axios.post(url,{id:id,status:2})
    .then((res)=>{
      if(res.data==='OK')
      {
        setBom({...bom,status:2,statuschild:<Tag icon={<CloseCircleOutlined />} color="error">
        Từ chối
      </Tag>})
        notification["success"]({
          message:'Thông báo',
          description:"Từ chối thành công",
          duration:2
        })
      }
    }).catch((error)=>{
      notification["error"]({
        message: "Thông báo",
        description: "Không thể truy cập máy chủ",
        duration: 2
      });
    })
    }
    
    const columns = [
        {
            title: "STT",
            dataIndex: "no",
            key: "id",
            width: '80px',
            fixed: 'left',
        },
        {
            title: "Phân cấp",
            dataIndex: "level",
            width: '150px',
            key: "id",
            fixed: 'left',
            ...getColumnSearchProps("level"),
        }, {
            title: 'Thông tin linh kiện',
            children: [{
                title: "Mã hàng hóa",
                dataIndex: "ma_vat_tu",
                key: "mahang",
                width: '150px',
                ...getColumnSearchProps("ma_vat_tu"),
            }, {
                title: "Tên hàng hoá",
                children: [{
                    title: "Tên hàng hóa (VN)",
                    dataIndex: "ten_vn",
                    width: '150px',
                    key: "ten_vn",
                    ...getColumnSearchProps("ten_vn"),
                },
                {
                    title: "Tên hàng hóa (EN)",
                    dataIndex: 'ten_en',
                    key: "member",
                    width: '150px',
                }]
            },
            {
                title: "Vật liệu",
                dataIndex: "vat_lieu",
                key: "vat_lieu",
                width: '100px',
            },
            {
                title: "Xuất xứ",
                dataIndex: "xuat_xu",
                key: "xuat_xu",
                width: '150px',
                ...getColumnSearchProps("xuat_xu"),
            },
            {
                title: "Nơi gia công thành phẩm",
                dataIndex: "noi_gia_cong",
                key: "noi_gia_cong",
                width: '150px',
                ...getColumnSearchProps("noi_gia_cong"),
            }, {
                title: 'Thông tin kỹ thuật',
                children: [{
                    title: 'Bản vẽ',
                    dataIndex: 'ma_ban_ve',
                    width: '100px',
                },
                {
                    title: "Thông số kỹ thuật",
                    dataIndex: "thong_so_ky_thuat",
                    key: "thong_so_ky_thuat",
                    width: '100px',
                }]
            },
            {
                title: "ĐVT",
                dataIndex: "dvt",
                width: '100px',
                key: "dvt",
                ...getColumnSearchProps("dvt"),
            },
            {
                title: "SL/Cụm",
                dataIndex: "slcum",
                width: '80px',
            },
            {
                title: "SL/Xe",
                dataIndex: "slxe",
                key: "sl2",
                width: '80px',
            }]
        }, {
            title: 'Thông tin phôi',
            children: [{
                title: "Mã số phôi",
                dataIndex: "ma_phoi",
                key: "ma_phoi",
                width: '100px',
                ...getColumnSearchProps("ma_phoi"),
            },
            {
                title: <div><p>Tên phôi</p><p>(Chọn gia công)</p></div>,
                dataIndex: "ten_phoi",
                key: "ten_phoi",
                width: '100px',
            }, {
                title: 'Thông số kỹ thuật',
                dataIndex: 'thong_so_phoi',
                width: '100px',
            }, {
                title: 'Xuất xứ phôi',
                dataIndex: 'xuat_xu_phoi',
                width: '100px',
            }, {
                title: 'Mã số bản vẽ phôi',
                dataIndex: 'ban_ve_vat_tu',
                width: '100px',
            }, {
                title: 'ĐVT',
                dataIndex: 'dvt_phoi',
                width: '100px',
            }, {
                title: 'Khôi lượng phôi/xe',
                dataIndex: 'khoi_luong',
                width: '100px',
            }]
        }, {
            title: 'Ghi chú',
            dataIndex: 'ghi_chu',
            width: '100px',
        }
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            if (!col.children) return col;
            else {
                col.children.map((chil, index) => {
                    if (chil.editable) {
                        col.children[index] = {
                            ...chil,
                            onCell: (record) => ({
                                record,
                                dataIndex: chil.dataIndex,
                                title: chil.title,
                            }),
                        };
                        return col;
                    }
                });
            }
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
            }),
        };
    });
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
                                        E-BOM {bom.name && ` (${bom.name})`}
                                    </Button>
                                </Divider>
                            </Col>
                            <Col span={6}>
                                <Divider orientation="right">
                                    {(bom.status === 1) ? (
                                        <div>
                                            <Popconfirm
                                                title="Bạn muốn phê duyệt?"
                                                okText="Có"
                                                cancelText="Không"
                                            onConfirm={handleApprove}
                                            >
                                                <Button type="primary">
                                                    Duyệt
                                                </Button>
                                            </Popconfirm>
                                            <Popconfirm
                                                title="Bạn muốn từ chối?"
                                                okText="Có"
                                                cancelText="Không"
                                            onConfirm={handleDeny}
                                            >
                                                <Button type="danger">
                                                    Từ chối
                                                </Button></Popconfirm></div>) : bom.status === 3&&bom.statuschild}
                                </Divider>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6} className="ebomtitle">
                                <img src={logo} className="imgnav"></img>
                            </Col>
                            <Col span={12} className="ebomtitle align-items-center text-center">
                                <div style={{ width: "100%" }}>
                                    <h5>DANH MỤC VẬT TƯ THIẾT KẾ</h5>
                                    <h5>{bom.Namebom}</h5>
                                </div>
                            </Col>
                            <Col span={6} className="ebomtitle">
                                <div style={{ width: "100%" }}>
                                    <p>Mã hóa: QT.RDOT.TTTK/01- BM07</p>
                                    <p>Đơn vị: R&D Ô tô</p>
                                    <p>{`Số: ${bom.nobom}`}</p>
                                    <p>{`Ngày: ${new Date(bom.TimeCreate).getDate()}/${new Date(bom.TimeCreate).getMonth() + 1
                                        }/${new Date(bom.TimeCreate).getFullYear()}`}</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form form={form} component={false}>
                                    <Table
                                        className="tbebomchild"
                                        style={{
                                            fontFamily: "Tahoma",
                                            fontSize: 14
                                        }}
                                        scroll={{
                                            x: 2000,
                                            y: 5000,
                                        }}
                                        pagination={{
                                            defaultPageSize: 50,
                                        }}
                                        columns={mergedColumns}
                                        rowClassName={(record, index) =>
                                            record.xuatxu == "BUS THACO" &&
                                                record.dvt == "Chi tiết" &&
                                                record.Malinhkien == "0"
                                                ? "red"
                                                : "green"
                                        }
                                        bordered
                                        dataSource={dataebom}
                                    />
                                </Form>
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
export default Approvebomchild;
