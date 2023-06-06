import React from "react";
import {
    SearchOutlined,
    CheckCircleOutlined,
    SaveOutlined,
    CloseOutlined,
    EditOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { Layout, Form, Table, notification, Modal, Row, Col, Button, Divider, Popconfirm, Input, Space, Tag, Checkbox, Select, Typography } from "antd";
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
const CheckboxGroup = Checkbox.Group;
const { Header, Sider, Content } = Layout;
const exportLevel = (level) => {
    var newLevel = [];
    level.map((item) => {
        var ar = [];
        for (var i = 1; i <= 7; i++) {
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
        for (var i = 1; i <= 7; i++) {
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

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 6,
        span: 18,
    },
};
const Approvebomcum = () => {
    const [form] = Form.useForm();
    const [searchText, setSearchText] = React.useState("");
    const [searchedColumn, setSearchedColumn] = React.useState("");
    const searchInput = React.useRef(null);
    const [showfinish, setShowfinish] = React.useState(false);
    const [stateModalbom, setStateModalbom] = React.useState(false)
    const defaultCheckedList = [];
    const [indeterminate, setIndeterminate] = React.useState(true);
    const [checkAll, setCheckAll] = React.useState(false);
    const [checkedList, setCheckedList] = React.useState(defaultCheckedList);
    const [itemcheck, setItemcheck] = React.useState([])
    const [editingKey, setEditingKey] = React.useState("");
    const { collapsed, loading, setLoading, dataebom, setDataebom, bom, setBom, username, dataSource, dropdvt, dropnoigiacong, dropxuatxu, ulrAPI } = React.useContext(Context);
    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        var inputNode = <Input />;
        if (dataIndex == 'xuat_xu') {
            inputNode = (
                <Select options={dropxuatxu} onChange={(value) => record.xuat_xu = value} />
            );
        }
        if (dataIndex == 'noi_gia_cong') {
            inputNode = (
                <Select options={dropnoigiacong} onChange={(value) => record.noi_gia_cong = value} />
            );
        }
        if (dataIndex == 'dvt') {
            inputNode = (
                <Select options={dropdvt} onChange={(value) => record.dvt = value} />
            );
        }
        const arraydrop = ['xuat_xu', 'noi_gia_cong', 'dvt']
        if (arraydrop.filter(da => da == dataIndex).length == 0)
            if (children[1] != null && children[1] != undefined && children[1] != "0" && children[1] != "")
                editing = false;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    React.useEffect(() => {
        setLoading(true)
        //Tải dữ liệu từ bảng ebom
        var url = `${ulrAPI}/api/Enovia`;
        var id = bom.id;
        var idmember = username.IDMember;
        axios
            .post(url, { id: id, IDMember: idmember })
            .then((res) => {
                if (res.data.length != 0) {
                    var data = res.data;
                    var lever = exportLevel(data.map((en) => en.Level));
                    var Slxe = exportSLxe(
                        data.map((en) => en.Level),
                        data.map((en) => en.Amount)
                    );
                    url = `${ulrAPI}/api/LoadEbomtempcum`;
                    axios
                        .post(url, { id: id })
                        .then((res2) => {
                            setDataebom([]);
                            if (res2.data.length != 0) {
                                var data2 = res2.data;
                                data.map((item, index) => {
                                    var dt = data2.filter(da => da.idenovia === item.id2);
                                    var ds = dataSource.filter(da => da.ma_vat_tu === item.ID)
                                    setDataebom((dataebom) => [
                                        ...dataebom,
                                        {
                                            key: index,
                                            no: index + 1,
                                            level: lever[index],
                                            level2: item.Amount,
                                            ma_vat_tu: dt.length != 0 ? dt[0].ma_vat_tu : item.ID,
                                            ten_vn: dt.length != 0 ? dt[0].ten_vn : item.Name,
                                            ten_en: dt.length != 0 ? dt[0].ten_en : ds.length != 0 ? ds[0].ten_en : "0",
                                            vat_lieu: dt.length != 0 ? dt[0].vat_lieu : ds.length != 0 ? ds[0].vat_lieu : "0",
                                            xuat_xu: dt.length != 0 ? dt[0].xuat_xu : ds.length != 0 ? ds[0].xuat_xu : "0",
                                            noi_gia_cong: dt.length != 0 ? dt[0].noi_gia_cong : ds.length != 0 ? ds[0].noi_gia_cong : "0",
                                            ma_ban_ve: dt.length != 0 ? dt[0].ma_ban_ve : ds.length != 0 ? ds[0].ma_ban_ve : "0",
                                            thong_so_ky_thuat: dt.length != 0 ? dt[0].thong_so_ky_thuat : ds.length != 0 ? ds[0].thong_so_ky_thuat : "0",
                                            slcum: dt.length != 0 ? dt[0].slcum : item.Amount,
                                            slxe: Slxe[index],
                                            dvt: dt.length != 0 ? dt[0].dvt : ds.length != 0 ? ds[0].dvt : "0",
                                            ma_phoi: dt.length != 0 ? dt[0].ma_phoi : ds.length != 0 ? ds[0].ma_phoi : "0",
                                            ten_phoi: dt.length != 0 ? dt[0].ten_phoi : ds.length != 0 ? ds[0].ten_phoi : "0",
                                            thong_so_phoi: dt.length != 0 ? dt[0].thong_so_phoi : ds.length != 0 ? ds[0].thong_so_phoi : "0",
                                            xuat_xu_phoi: dt.length != 0 ? dt[0].xuat_xu_phoi : ds.length != 0 ? ds[0].xuat_xu_phoi : "0",
                                            ban_ve_vat_tu: dt.length != 0 ? dt[0].ban_ve_vat_tu : ds.length != 0 ? ds[0].ban_ve_vat_tu : "0",
                                            dvt_phoi: dt.length != 0 ? dt[0].dvt_phoi : ds.length != 0 ? ds[0].dvt_phoi : "0",
                                            khoi_luong: dt.length != 0 ? dt[0].khoi_luong : ds.length != 0 ? ds[0].khoi_luong : "0",
                                            ghi_chu: dt.length != 0 ? dt[0].ghi_chu : ds.length != 0 ? ds[0].ghi_chu : "0",
                                            idenovia: item.id2
                                        },
                                    ]);
                                });
                                setShowfinish(true);
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
                }
            })
            .catch((error) => {
                console.log(error);
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
                    placeholder={`Nhập nôi dung`}
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
                    editable: true
                }]
            },
            {
                title: "Vật liệu",
                dataIndex: "vat_lieu",
                key: "vat_lieu",
                width: '100px',
                editable: true
            },
            {
                title: "Xuất xứ",
                dataIndex: "xuat_xu",
                key: "xuat_xu",
                width: '150px',
                ...getColumnSearchProps("xuat_xu"),
                editable: true
            },
            {
                title: "Nơi gia công thành phẩm",
                dataIndex: "noi_gia_cong",
                key: "noi_gia_cong",
                width: '150px',
                ...getColumnSearchProps("noi_gia_cong"),
                editable: true
            }, {
                title: 'Thông tin kỹ thuật',
                children: [{
                    title: 'Bản vẽ',
                    dataIndex: 'ma_ban_ve',
                    width: '100px',
                    ...getColumnSearchProps("ma_ban_ve"),
                },
                {
                    title: "Thông số kỹ thuật",
                    dataIndex: "thong_so_ky_thuat",
                    key: "thong_so_ky_thuat",
                    width: '100px',
                    ...getColumnSearchProps("thong_so_ky_thuat"),
                }]
            },
            {
                title: "ĐVT",
                dataIndex: "dvt",
                width: '100px',
                key: "dvt",
                ...getColumnSearchProps("dvt"),
                editable: true
            },
            {
                title: "SL/Cụm",
                dataIndex: "slcum",
                width: '80px',
                editable: true
            },
            {
                title: "SL/Xe",
                dataIndex: "slxe",
                key: "sl2",
                width: '80px',
                editable: true
            }]
        }, {
            title: 'Thông tin phôi',
            children: [{
                title: "Mã số phôi",
                dataIndex: "ma_phoi",
                key: "ma_phoi",
                width: '100px',
                ...getColumnSearchProps("ma_phoi"),
                editable: true
            },
            {
                title: <div><p>Tên phôi</p><p>(Chọn gia công)</p></div>,
                dataIndex: "ten_phoi",
                key: "ten_phoi",
                width: '100px',
                editable: true
            }, {
                title: 'Thông số kỹ thuật',
                dataIndex: 'thong_so_phoi',
                width: '100px',
                editable: true
            }, {
                title: 'Xuất xứ phôi',
                dataIndex: 'xuat_xu_phoi',
                width: '100px',
                editable: true
            }, {
                title: 'Mã số bản vẽ phôi',
                dataIndex: 'ban_ve_vat_tu',
                width: '100px',
                editable: true
            }, {
                title: 'ĐVT',
                dataIndex: 'dvt_phoi',
                width: '100px',
                editable: true
            }, {
                title: 'Khôi lượng phôi/xe',
                dataIndex: 'khoi_luong',
                width: '100px',
                editable: true
            }]
        }, {
            title: 'Ghi chú',
            dataIndex: 'ghi_chu',
            width: '100px',
            editable: true
        },
        {
            title: "Chức năng",
            key: "edit",
            width: '100px',
            fixed: 'right',
            render: (_, record) => {
                const editable = isEditing(record);
                return record.key === 0 && (editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            <SaveOutlined />
                        </Typography.Link>
                        <Popconfirm title="Bạn có muốn đóng?" onConfirm={cancel}>
                            <CloseOutlined color="red" />
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link
                        disabled={editingKey !== ""}
                        onClick={() => edit(record)}
                    >
                        <EditOutlined />
                    </Typography.Link>
                ));
            },
        },
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
                                editing: isEditing(record),
                            }),
                        };
                        return col;
                    }
                    else {
                        if (!chil.children) return col
                        else {
                            chil.children.map((chi, index2) => {
                                if (chi.editable) {
                                    col.children[index].children[index2] = {
                                        ...chi,
                                        onCell: (record) => ({
                                            record,
                                            dataIndex: chi.dataIndex,
                                            title: chi.title,
                                            editing: isEditing(record),
                                        }),
                                    };
                                    return col;
                                }
                            })
                        }
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
                editing: isEditing(record),
            }),
        };
    });

    const handleApprove = () => {
        var url = `${ulrAPI}/api/updatestatusbomcum`
        var id = bom.id
        axios.post(url, { id: id, status: 2 })
            .then((res) => {
                if (res.data === 'OK') {
                    setBom({ ...bom, status: 2 })
                    notification["success"]({
                        message: 'Thông báo',
                        description: "Phê duyệt thành công",
                        duration: 2
                    })
                }
            }).catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            })
    }

    const handleDeny = () => {
        setItemcheck([])
        bom.child.map((da, index) => {
            setItemcheck(itemcheck => [...itemcheck, {
                key: index,
                value: da.id,
                label: da.name
            }]);
        })
        setStateModalbom(true)
    }

    const handleDenysubmit = () => {
        var url = `${ulrAPI}/api/denystatusbomcum`
        var id = bom.id
        axios.post(url, { id: id, data: checkedList })
            .then((res) => {
                if (res.data === 'OK') {
                    setBom({ ...bom, status: 1 })
                    var newbom = [...bom.child]
                    for (let i = 0; i < newbom.length; i++) {
                        if (checkedList.includes(newbom[i].id)) {
                            newbom[i].status = 2;
                        }
                    }
                    setBom({ ...bom, status: 1, child: newbom })
                    notification["success"]({
                        message: 'Thông báo',
                        description: "Từ chối thành công",
                        duration: 2
                    })
                    setStateModalbom(false)
                    setCheckedList([])
                }
            }).catch((error) => {
                console.log(error)
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            })
    }

    const onCheckAllChange = (e) => {
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        if (e.target.checked) {
            const allValues = itemcheck.map(option => option.value);
            setCheckedList(allValues);
        } else {
            setCheckedList([]);
        }
    };
    const onChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < itemcheck.length);
        setCheckAll(list.length === itemcheck.length);
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            var arr = ['BUS THACO', 'TẢI THACO', 'THACO ROYAL', 'LUXURY CAR']
            if (arr.includes(row.noi_gia_cong) && row.dvt !== 'Bộ') {
                if (row.ma_phoi === '0') {
                    notification["error"]({
                        message: "Thông báo",
                        description: "Không để trống thông tin phôi",
                        duration: 2
                    });
                } else {
                    const newData = [...dataebom];
                    const index = newData.findIndex((item) => key === item.key);
                    if (index > -1) {
                        const item = newData[index];
                        newData.splice(index, 1, { ...item, ...row });
                        setDataebom(newData);
                        setEditingKey("");
                        var url = `${ulrAPI}/api/Insertebomchild`;
                        axios.post(url, { id: bom.id, data: { ...item, ...row } }).then((res) => {
                        })
                    } else {
                        newData.push(row);
                        setDataebom(newData);
                        setEditingKey("");
                    }
                }
            }
            else {
                const newData = [...dataebom];
                const index = newData.findIndex((item) => key === item.key);
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, { ...item, ...row });
                    setDataebom(newData);
                    setEditingKey("");
                    var url = `${ulrAPI}/api/Insertebomchild`;
                    axios.post(url, { id: bom.id, data: { ...item, ...row } }).then((res) => {
                    })
                } else {
                    newData.push(row);
                    setDataebom(newData);
                    setEditingKey("");
                }
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey("");
    };
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
                                    {
                                        bom && bom.child.filter(re => re.status === 3).length === bom.child.length ? bom.status === 2 ?
                                            <Tag icon={<CheckCircleOutlined />} color="success">
                                                Đã duyệt
                                            </Tag> : (<div>
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
                                                <Button type="danger" onClick={handleDeny}>
                                                    Từ chối
                                                </Button></div>) : bom.status === 0 ? <Tag icon={<ClockCircleOutlined />} color="warning">
                                                    Đang cập nhật
                                                </Tag> : <Tag icon={<ClockCircleOutlined />} color="warning">
                                            Cần hiệu chỉnh
                                        </Tag>
                                    }
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
                                        components={{
                                            body: {
                                                cell: EditableCell,
                                            },
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
                    <Modal
                        title="Chọn cụm lỗi"
                        centered
                        open={stateModalbom}
                        okButtonProps={{
                            htmlType: "submit",
                        }}
                        onCancel={() => setStateModalbom(false)}
                        footer={[<Button type="primary" onClick={handleDenysubmit}>
                            Xác nhận
                        </Button>,
                        <Button danger onClick={() => setStateModalbom(false)}>
                            Hủy
                        </Button>]}
                    >
                        <Row>
                            <Col span={24}>
                                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                    Chọn tất cả
                                </Checkbox>
                                <CheckboxGroup options={itemcheck} value={checkedList} onChange={onChange} style={{ display: 'flex', flexDirection: 'column' }} />
                            </Col>
                        </Row>
                    </Modal>
                </Content>
                <Footerpage />
            </Layout>
            {loading && <Loadding />}
        </Layout>
    );
};
export default Approvebomcum;
