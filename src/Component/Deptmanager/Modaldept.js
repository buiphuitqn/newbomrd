import React from "react";
import {
    Form,
    Col,
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

export default function Modaldept() {
    const {
        stateModaldept,
        setStateModaldept,
        listBom,
        setListBom,
        username,
        datachild,
        setDatachild,
        ulrAPI,
        phanquyen,
        unit, setUnit
    } = React.useContext(Context);
    const [form] = Form.useForm();
    const [option, setOption] = React.useState([])
    const [listdept, setListdept] = React.useState([])
    const [checkedList, setCheckedList] = React.useState([]);
    const [showadd, setShowadd] = React.useState(false);
    const [namedept, setNamedept] = React.useState('');
    const [unitchange, setUnitchange] = React.useState('');
    React.useEffect(() => {
        setOption([])
        unit.map(da => {
            setOption(option => [...option, { key: da.key, value: da.id, label: da.nameunit }])
        })
        var url = `${ulrAPI}/api/ds_phong`
        axios.post(url)
            .then((res) => {
                setListdept([])
                res.data.map((da, index) => {
                    setListdept(listdept => [...listdept, {
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
        setUnitchange(value)
        var url = `${ulrAPI}/api/tai_phong_ban`
        axios.post(url, { unit: value })
            .then((res) => {
                setCheckedList([])
                if (res.data.length !== 0) {
                    setCheckedList(res.data.map(da => da.id))
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
        axios.post(url,{idunit:unitchange,dept:checkedList})
        .then((res)=>{
            if(res.data==='NG') 
            notification["error"]({
                message: "Thông báo",
                description: "Đã có lỗi sảy ra",
                duration: 2
            });
            else
            setStateModaldept(false)
        })
        .catch((error)=>{
            notification["error"]({
                message: "Thông báo",
                description: "Không thể truy cập máy chủ",
                duration: 2
            });
        })
    };

    const handleAdddept = ()=>{
        setShowadd(false)
        var url = `${ulrAPI}/api/them_phong`
        axios.post(url,{name:namedept})
        .then((res)=>{
            setListdept(listdept=>[...listdept,{
                key:listdept.length,
                value:res.data.insertId,
                label:namedept
            }])
        })
        .catch((error)=>{
            notification["error"]({
                message: "Thông báo",
                description: "Không thể truy cập máy chủ",
                duration: 2
            });
        })
    }

    return (
        <Modal
            title="Cài đặt phòng ban"
            centered
            open={stateModaldept}
            okButtonProps={{
                htmlType: "submit",
            }}
            onCancel={() => setStateModaldept(false)}
            footer={[<div style={{ display: 'flex', justifyContent: 'space-between' }}><Button type="primary" onClick={() => setShowadd(true)}>
                Thêm phòng
            </Button><div style={{ display: 'flex', justifyContent: 'end' }}><Button type="primary" htmlType="button" onClick={onFinish}>
                Xác nhận
            </Button>
                    <Button htmlType="button" onClick={() => setStateModaldept(false)}>
                        Hủy
                    </Button></div></div>]}
        >
            <Select
                placeholder='Vui lòng chọn đơn vị'
                options={option}
                onChange={onChange}
                allowClear
            />
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
