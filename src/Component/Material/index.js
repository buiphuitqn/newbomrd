import {
  Table,
  Typography,
  message,
  Input,
  Space,
  Button,
  Spin,
  Layout,
  Divider
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Context from "../../Data/Context";
import React from "react";
import "./style.css";
import Headerpage from "../Headerpage";
import Footerpage from "../Footerpage";
import MenuSider from "../MenuSider";
import Loadding from "../Loadding";
const { Text } = Typography;
const { Content } = Layout
const Material = () => {
  const { dataSource, loading,setLoading } = React.useContext(Context);
  
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const [dataMaterial, setDataMaterial] = React.useState([]);
  const searchInput = React.useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
          placeholder={`Search ${dataIndex}`}
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
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
    setTimeout(()=>{
      setDataMaterial(dataSource);
      setLoading(false)
    },2000)
    
  }, []);
  console.log(dataSource)
  const columns = [
    {
      title: "Thông tin thiết kế",
      children: [
        {
          title: "Tên hàng hóa",
          dataIndex: "col0",
          key: "col0",
          width: "10%",
          fixed: 'left',
          ...getColumnSearchProps("col0"),
        },
        {
          title: "Mã số",
          dataIndex: "col1",
          key: "col1",
          width: "10%",
          fixed: 'left',
          ...getColumnSearchProps("col1"),
        },
        {
          title: "Vật liệu",
          dataIndex: "col2",
          key: "address",
        },
        {
          title: "Xuất xứ",
          dataIndex: "col3",
          key: "startday",
        },
        {
          title: "Quy cách",
          dataIndex: "col4",
          key: "endday",
        },
        {
          title: "Quy cách đột lỗ",
          dataIndex: "col5",
          key: "endday",
        },
        {
          title: "ĐVT",
          dataIndex: "col6",
          key: "endday",
        },
      ],
    },
    {
      title: "Thông tin sản xuất",
      children: [
        {
          title: "Tên linh kiện/phôi",
          dataIndex: "col7",
          key: "endday",
          width: "10%",
        },
        {
          title: "mã số linh kiện/phôi",
          dataIndex: "col8",
          key: "endday",
          width: "10%",
          ...getColumnSearchProps("col8"),
        },
        {
          title: "ĐVT",
          dataIndex: "col9",
          key: "endday",
        },
        {
          title: "Số lượng phôi",
          dataIndex: "col10",
          key: "endday",
        },
        {
          title: "% Tiêu hao",
          dataIndex: "col11",
          key: "endday",
        },
        {
          title: "% lượng dư phôi",
          dataIndex: "col12",
          key: "endday",
        },
        {
          title: "Quy cách phôi",
          dataIndex: "col13",
          key: "endday",
        },
        {
          title: "Xuất xứ linh kiện",
          dataIndex: "col14",
          key: "endday",
        },
        {
          title: "Chưa có khuôn",
          dataIndex: "col15",
          key: "endday",
        },
        {
          title: "Khuôn tạm",
          dataIndex: "col16",
          key: "endday",
        },
        {
          title: "Khuôn sản xuất",
          dataIndex: "col17",
          key: "endday",
        },
        {
          title: "Trạm",
          dataIndex: "col18",
          key: "endday",
        },
        {
          title: "Chuyền",
          dataIndex: "col19",
          key: "endday",
        },
        {
          title: "Xưởng",
          dataIndex: "col20",
          key: "endday",
        },
      ],
    },
  ];

  return (
    <Layout className="homelayout">
      <MenuSider />
      <Layout className="site-layout">
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
            <Divider style={{ margin: 5 }} />
            <div style={{ padding: 10 }}>
              <Table
                className="tabledata"
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
      {loading&&<Loadding/>}
    </Layout>
  );
};

export default Material;
