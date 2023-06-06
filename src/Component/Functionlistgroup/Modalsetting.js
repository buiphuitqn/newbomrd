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
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import "./style.css";
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const { Group } = Checkbox;

function findChildren(node, arr) {
    node.children = arr.filter(item => item.parentmenu === node.id);
    if (node.children.length === 0)
        delete node['children']
    else
        node.children.forEach(child => findChildren(child, arr));
}

function convertToTree(arr) {
    // Tìm nút gốc (Parent = 0)
    const rootNode = arr.find(item => item.parentmenu === 0);
    // Gọi hàm đệ quy để tìm kiếm các con của nút gốc
    findChildren(rootNode, arr);
    return [rootNode];
}
export default function Modalsetting() {
    const {
        stateModalsettinggroup, setStateModalsettinggroup,
        allmenu,
        ulrAPI,
        setGroupselect,
        groupselect
    } = React.useContext(Context);

    const [listgroup, setListgroup] = React.useState([])
    const [checkedValues, setCheckedValues] = React.useState([]);

    const handleCheckboxChange = (value) => {
        console.log(value)
        setCheckedValues(value)
    };
    React.useEffect(() => {
        setListgroup([])
        allmenu.length !== 0 && setListgroup(convertToTree(allmenu)[0].children)
        var id=groupselect.id
        var url = `${ulrAPI}/api/tai_menu_group`
        axios.post(url,{id:id})
        .then((res)=>{
            setCheckedValues(res.data.map(da=>da.idmenu))
        })
        .catch((error)=>{
            notification["error"]({
                message: "Thông báo",
                description: "Không thể truy cập máy chủ",
                duration: 2
            });
        })
    }, [groupselect])
    const onFinish = () => {
        console.log(checkedValues)
        var id=groupselect.id
        var url = `${ulrAPI}/api/cai_dat_menu_vai_tro`
        axios.post(url,{id:id,data:checkedValues})
        .then((res)=>{
            if(res.data ==='NG')
            notification["error"]({
                message: "Thông báo",
                description: "Cài đặt thất bại",
                duration: 2
            });
            else{
                notification["success"]({
                    message: "Thông báo",
                    description: "Cài đặt thành công",
                    duration: 2
                });
                setStateModalsettinggroup(false)
            }
        })
        .catch((error)=>{
            notification["error"]({
                message: "Thông báo",
                description: "Không thể truy cập máy chủ",
                duration: 2
            });
        })
    };
    return (
        <Modal
            title={`Cài đặt nhóm: ${groupselect.ten_group}`}
            centered
            open={stateModalsettinggroup}
            okButtonProps={{
                htmlType: "submit",
            }}
            onCancel={() => setStateModalsettinggroup(false)}
            footer={[<Button type="primary" onClick={onFinish}>
                Xác nhận
            </Button>]}
        >
            <Checkbox.Group value={checkedValues} onChange={handleCheckboxChange} style={{ display: 'flex', flexDirection: 'column' }}>
                {listgroup.length !== 0 && listgroup.map((parent) => (
                    <Checkbox key={parent.id} value={parent.id}>
                        {parent.label}
                        {parent.children && parent.children.length > 0 && 
                        <div style={{ display: 'flex', flexDirection: 'column' }}>{parent.children.map((child) => (
                            <Checkbox key={child.id} value={child.id}>
                                {child.label}
                            </Checkbox>
                        ))}</div>}
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </Modal>
    );
}
