import React from "react";
import {
    Form,
    Radio,
    Modal,
    Row,
    Input,
    Button,
    notification,
    Select,
    Checkbox,
    Space
} from "antd";
import Context from "../../Data/Context";
import axios from "axios";
import "./style.css";
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
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

export default function Modalsetting() {
    const {
        stateModalsetting,
        setStateModalsetting,
        listBom,
        setListBom,
        username,
        datachild,
        setDatachild,
        ulrAPI,
        phanquyen,
    } = React.useContext(Context);
    const [form] = Form.useForm();
    const [option, setOption] = React.useState([])
    const [optiongroup, setOptiongroup] = React.useState([])
    const [listdept, setListdept] = React.useState([])
    const [checkedList, setCheckedList] = React.useState([]);
    const [showadd, setShowadd] = React.useState(false);
    const [namedept, setNamedept] = React.useState('');
    const [unitchange, setUnitchange] = React.useState('');
    React.useEffect(() => {
        setOption([])
        setListdept([{
            key: 0,
            value: 1,
            label: 'Administrator'
        }])
        var url = `${ulrAPI}/api/ds_phong`
        axios.post(url)
            .then((res) => {
                res.data.map((da, index) => {
                    setOption(option => [...option, {
                        key: index,
                        value: da.id,
                        label: da.ten_phong
                    }])
                })
            }).catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            })
    }, [])

    const onChange = (value) => {
        var url = `${ulrAPI}/api/ds_nhom_phong`
        axios.post(url, { id: value })
            .then((res) => {
                setOptiongroup([])
                if (res.data.length !== 0) {
                    res.data.map((da, index) => {
                        setOptiongroup(optiongroup => [...optiongroup, {
                            key: index,
                            value: da.id,
                            label: da.ten_nhom
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

    const onChangelist = (list) => {
        setCheckedList(list);
    };

    const onFinish = () => {
        console.log('?')
        var url = `${ulrAPI}/api/cai_dat_phong`
        axios.post(url, { idunit: unitchange, dept: checkedList })
            .then((res) => {
                if (res.data === 'NG')
                    notification["error"]({
                        message: "Thông báo",
                        description: "Đã có lỗi sảy ra",
                        duration: 2
                    });
                else
                    setStateModalsetting(false)
            })
            .catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            })
    };

    const handleAdddept = () => {
        setShowadd(false)
        var url = `${ulrAPI}/api/them_phong`
        axios.post(url, { name: namedept })
            .then((res) => {
                setListdept(listdept => [...listdept, {
                    key: listdept.length,
                    value: res.data.insertId,
                    label: namedept
                }])
            })
            .catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            })
    }

    return (
        <Modal
            title="Phân quyền nhân sự"
            centered
            open={stateModalsetting}
            okButtonProps={{
                htmlType: "submit",
            }}
            onCancel={() => setStateModalsetting(false)}
            footer={[<div style={{ display: 'flex', justifyContent: 'end' }}><Button type="primary" htmlType="button" onClick={onFinish}>
                Xác nhận
            </Button>
                <Button htmlType="button" onClick={() => setStateModalsetting(false)}>
                    Hủy
                </Button></div>]}
        >
            <p>Phòng ban:</p>
            <Select
                placeholder='Vui lòng chọn phòng ban'
                options={option}
                onChange={onChange}
            />
            <p>Nhóm:</p>
            <Select
                placeholder='Vui lòng chọn nhóm'
                options={optiongroup}
                onChange={onChange}
            />
            <p>Quyền:</p>
            <Radio.Group>
                <Space direction="vertical">
                    <Radio value={1}>Quản lý dự án</Radio>
                    <Radio value={2}>Trưởng phòng</Radio>
                    <Radio value={3}>Trưởng nhóm</Radio>
                    <Radio value={4}>Chuyên viên</Radio>
                </Space>
            </Radio.Group>
            <p>Vai trò:</p>
            <CheckboxGroup options={listdept} value={checkedList} onChange={onChangelist} style={{ display: 'flex', flexDirection: 'column' }} />
            {showadd && <Space.Compact
                style={{
                    width: '100%',
                }}
            >
                <Input placeholder="Nhập tên phòng ban" value={namedept} onChange={(e) => { setNamedept(e.target.value) }} />
                <Button type="primary" onClick={handleAdddept}>Xác nhận</Button>
            </Space.Compact>}
        </Modal>
    );
}
