import {
  Table,
  Typography,
  message,
  Input,
  Space,
  Button,
  notification,
  Layout,
  Divider
} from "antd";
import { SearchOutlined,SaveOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Context from "../../Data/Context";
import React from "react";
import "./style.css";
import Headerpage from "../Headerpage";
import Footerpage from "../Footerpage";
import MenuSider from "../MenuSider";
import Loadding from "../Loadding";
import axios from "axios";
const { Text } = Typography;
const { Content } = Layout
const Material = () => {
  const { dataSource, loading, setLoading, collapsed,ulrAPI } = React.useContext(Context);

  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const [dataMaterial, setDataMaterial] = React.useState([]);
  const searchInput = React.useRef(null);
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
  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDataMaterial(dataSource);
      setLoading(false)
    }, 2000)

  }, []);
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
        width: "10%",
        fixed: 'left',
        children: [{
          title: "Tên tiếng việt",
          dataIndex: "ten_vn",
          key: "col0",
          width: "5%",
          fixed: 'left',
          ...getColumnSearchProps("ten_vn"),
        }, {
          title: "Tên tiếng anh",
          dataIndex: "ten_en",
          key: "ten_en",
          width: "5%",
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
        },
        {
          title: "Xuất xứ",
          dataIndex: "xuat_xu",
          key: "startday",
        }, {
          title: "Nơi gia công",
          dataIndex: 'noi_gia_cong',
          key: "endday",
        },
        {
          title: "Thông tin kỹ thuật",
          key: "endday",
          children: [{
            title: 'Bản vẽ',
            dataIndex: 'ma_ban_ve',
            key: 'layout'
          }, {
            title: 'Thông số kỹ thuật',
            dataIndex: 'thong_so_ky_thuat',
            key: 'info'
          }]
        },
        {
          title: "ĐVT",
          dataIndex: "dvt",
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
          ...getColumnSearchProps("ma_phoi"),
        },
        {
          title: "Tên phôi",
          dataIndex: "ten_phoi",
          key: "endday",
        }, {
          title: "Thông số kỹ thuật",
          dataIndex: 'thong_so_phoi',
          key: "endday",
        }, {
          title: "Xuất xứ phôi",
          dataIndex: "thong_so_phoi",
          key: "endday",
        }, {
          title: "Mã bản vẽ",
          key: "ban_ve_vat_tu",
        },
        {
          title: "ĐVT",
          dataIndex: "dvt_phoi",
          key: "endday",
        }, {
          title: "Khối lượng",
          dataIndex: 'khoi_luong',
          key: "khoi_luong",
        }, {
          title: "Ghi chú",
          dataIndex: 'ghi_chu',
          key: "ghi_chu",
        },
        {
          title: 'Thông tin khuôn',
          children: [{
            title: "Chưa có",
            dataIndex: "chua_khuon",
            key: "endday",
          },
          {
            title: "Khuôn tạm",
            dataIndex: "khuon_tam",
            key: "endday",
          },
          {
            title: "Đã có",
            dataIndex: "da_co_khuon",
            key: "endday",
          },
          {
            title: "Không cần",
            dataIndex: "khong_khuon",
            key: "endday",
          }]
        }
      ],
    },
  ];

  const handleExportexcel = () => {
    setLoading(true)
    var url = `${ulrAPI}/api/exportExcel2`;
    axios
      .post(url, {
        data: dataMaterial,
      },
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        setLoading(false)
        let url = window.URL.createObjectURL(new Blob([res.data]));
        let a = document.createElement("a");
        a.href = url;
        a.download = `Result.xlsx`;
        a.click();
      })
      .catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
        });
      });
  }

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
              height: "65vh",
              fontFamily: "Tahoma",
              width: "100%",
            }}
          >
            <p style={{ padding: 10 }}>Quản lý vật tư</p>
            <Divider orientation="right">
              <Button
                type="primary"
                onClick={handleExportexcel}
                style={{
                  marginBottom: 16,
                  display: 'flex'
                }}>
                <div>
                  <SaveOutlined
                    style={{ display: "inline-flex", marginRight: "5px" }}
                  />
                </div>
                Tải xuống
              </Button>
            </Divider>
            <div style={{ padding: 10 }}>
              <Table
                className="tabledatamaterial"
                columns={columns}
                dataSource={dataMaterial}
                scroll={{
                  x: 2000,
                  y: 500,
                }}
                bordered
                pagination={{
                  defaultPageSize: 100,
                }}
              />
            </div>
          </div>
        </Content>
        <Footerpage />
      </Layout>
      {loading && <Loadding />}
    </Layout>
  );
};

export default Material;
