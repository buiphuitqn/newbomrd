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

export default function Modalmember() {
    const {
        stateModalmember, setStateModalmember,
        member,
        ulrAPI,
        listmember,setListmember
    } = React.useContext(Context);
    const [form] = Form.useForm();
    const [option, setOption] = React.useState([])
    const [listdept, setListdept] = React.useState([])
    const [checkedList, setCheckedList] = React.useState([]);
    const [showadd, setShowadd] = React.useState(false);
    const [namedept, setNamedept] = React.useState('');
    const [unitchange, setUnitchange] = React.useState('');
    React.useEffect(() => {
    }, [])


    const onFinish = (values) => {
        if (listmember.map(da => da.IDMember).includes(values.idmember))
            notification["error"]({
                message: "Thông báo",
                description: "Mã nhân viên đã tồn tại",
                duration: 2
            });
        else {
            var url = `${ulrAPI}/api/them_nhan_su`
            axios.post(url, { data: values })
                .then((res) => {
                    if (res.data === 'NG')
                        notification["error"]({
                            message: "Thông báo",
                            description: "Đã có lỗi sảy ra",
                            duration: 2
                        });
                    else {
                        setListmember(listmember => [...listmember, {
                            FullName: values.name,
                            IDMember: values.idmember,
                            dept: '',
                            function: '',
                            group: '',
                            groupuser:'',
                            idfunction: '',
                            idgroupuser: '',
                            key: listmember.length,
                            ma_nhom: '',
                            ma_phong_ban:''
                        }])
                        setStateModalmember(false)
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
    };

    return (
        <Modal
            title="Thêm nhân sự"
            centered
            open={stateModalmember}
            okButtonProps={{
                htmlType: "submit",
            }}
            onCancel={() => setStateModalmember(false)}
            footer={[<p>Vui lòng nhập đầy đủ thông tin</p>]}
        >
            <Form {...layout} form={form} onFinish={onFinish} name="control-hooks">
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name="idmember"
                            label="Mã số nhân viên"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập Mã số nhân viên.",
                                },
                            ]}
                        >
                            <Input placeholder="Nhập mã số nhân viên" />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập họ và tên.",
                                },
                            ]}
                        >
                            <Input placeholder="Nhập họ tên nhân viên" />
                        </Form.Item>
                        <Form.Item
                            name="pass"
                            label="Mật khẩu"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu.",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Nhập mật khẩu"
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Xác nhận
                            </Button>
                            <Button htmlType="button" onClick={() => setStateModalmember(false)}>
                                Hủy
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
