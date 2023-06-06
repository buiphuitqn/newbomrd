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
        member,
        ulrAPI,
        phanquyenuser,
        listmember,
        setListmember,
    } = React.useContext(Context);
    const [form] = Form.useForm();
    const [option, setOption] = React.useState([])
    const [optiongroup, setOptiongroup] = React.useState([])
    const [listdept, setListdept] = React.useState([])
    const [checkedList, setCheckedList] = React.useState('');
    const [namedept, setNamedept] = React.useState('');
    const [unitchange, setUnitchange] = React.useState('');
    const [valuefunction, setValuefunction] = React.useState('');
    const [functionlist, setFunctionlist] = React.useState([])
    React.useEffect(() => {
        setOption([])
        setValuefunction(null)
        setCheckedList(null)
        setUnitchange('')
        setNamedept('')
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
        //api/danh_sach_function
        var url2 = `${ulrAPI}/api/danh_sach_function`
        axios.post(url2)
            .then((res) => {
                setFunctionlist([])
                res.data.map((da, index) => {
                    setFunctionlist(functionlist => [...functionlist, {
                        key: index,
                        ...da
                    }])
                })
            }).catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            })
        ///api/danh_sach_vai_tro
        var url2 = `${ulrAPI}/api/danh_sach_vai_tro`
        axios.post(url2)
            .then((res) => {
                setListdept([])
                res.data.map((da, index) => {
                    setListdept(listdept => [...listdept, {
                        key: 0,
                        value: da.id,
                        label: da.ten_group
                    }])
                })
            }).catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            })
        if (phanquyenuser.length !== 0) {
            if (phanquyenuser.phong_ban)
                if (phanquyenuser.phong_ban[0].child.length !== 0) {
                    setUnitchange(phanquyenuser.phong_ban[0].child[0].id)
                    var value = phanquyenuser.phong_ban[0].child[0].id
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
                                    phanquyenuser.phong_ban[0].child[0].child.length !== 0 && setNamedept(phanquyenuser.phong_ban[0].child[0].child[0].id)
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
                }
            if (phanquyenuser.function) {

                setValuefunction(phanquyenuser.function.filter(da => da.trang_thai === 1)[0].id)
            }
            console.log(checkedList)
            member.idgroupuser && setCheckedList(member.idgroupuser)
        }
    }, [phanquyenuser])

    const onChange = (value) => {
        setUnitchange(value)
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

    const onChangegroup = (value) => {
        setNamedept(value)
    };

    const onChangelist = (e) => {
        setCheckedList(e.target.value);
    };

    const onChangefonction = (e) => {
        setValuefunction(e.target.value)
    }

    const onFinish = () => {
        var data = {
            idmember: member.IDMember,
            dept: unitchange === undefined ? '' : unitchange,
            group: namedept === undefined ? '' : namedept,
            function: valuefunction === undefined ? '' : valuefunction,
            listgroup: checkedList
        }
        var url = `${ulrAPI}/api/cai_dat_phan_quyen`
        axios.post(url, { data: data })
            .then((res) => {
                if (res.data === 'OK') {
                    setStateModalsetting(false)

                    console.log(listdept)
                    var newlist = [...listmember]
                    let objectToChange = newlist.find(obj => obj.IDMember === member.IDMember)
                    if (objectToChange) {
                        objectToChange.ma_phong_ban = unitchange === undefined ? '' : unitchange;
                        objectToChange.ma_nhom = namedept === undefined ? '' : namedept;
                        objectToChange.dept = option.filter(da=>da.value===unitchange).length!==0?option.filter(da=>da.value===unitchange)[0].label:''
                        objectToChange.group = optiongroup.filter(da=>da.value===namedept).length!==0?optiongroup.filter(da=>da.value===namedept)[0].label:''
                        objectToChange.function=functionlist.filter(da=>da.id===valuefunction).length!==0?functionlist.filter(da=>da.id===valuefunction)[0].ten_chuc_nang:''
                        objectToChange.groupuser = listdept.filter(da=>da.value===checkedList).length!==0?listdept.filter(da=>da.value===checkedList)[0].label:'';
                        objectToChange.idfunction = valuefunction === undefined ? '' : valuefunction;
                        objectToChange.idgroupuser = checkedList
                    }
                    setUnitchange('')
                    setNamedept('')
                    setValuefunction('')
                    setCheckedList([])
                }
            }).catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            })

    };

    return (
        <Modal
            title={`Phân quyền nhân sự: ${member && member.FullName}`}
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
                allowClear
                value={unitchange}
                style={{ width: '100%' }}
            />
            <p>Nhóm:</p>
            <Select
                placeholder='Vui lòng chọn nhóm'
                options={optiongroup}
                onChange={onChangegroup}
                allowClear
                value={namedept}
                style={{ width: '100%' }}
            />
            <p>Quyền:</p>
            <Radio.Group onChange={onChangefonction} value={valuefunction}>
                <Space direction="vertical">
                    {
                        functionlist.map((da, index) => (
                            <Radio key={index} value={da.id}>{da.ten_chuc_nang}</Radio>
                        ))
                    }
                </Space>
            </Radio.Group>
            <p>Vai trò:</p>
            <Radio.Group onChange={onChangelist} value={checkedList}>
                <Space direction="vertical">
                    {
                        listdept.map((da, index) => (
                            <Radio key={index} value={da.value}>{da.label}</Radio>
                        ))
                    }
                </Space>
            </Radio.Group>
        </Modal>
    );
}
