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
  const { dataSource, loading,setLoading,collapsed } = React.useContext(Context);
  
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
      title:'Thông tin linh kiện',
      children:[{
        title: "Mã số",
        dataIndex: "col1",
        key: "col1",
        width: "120px",
        fixed: 'left',
        ...getColumnSearchProps("col1"),
      },
      {
        title: "Tên linh kiện",
        key: "col0",
        width: "10%",
        fixed: 'left',
        ...getColumnSearchProps("col0"),
        children:[{
          title: "Tên tiêng việt",
          dataIndex: "col0",
          key: "col0",
          width: "5%",
          fixed: 'left',
          ...getColumnSearchProps("col0"),
        },{
          title: "Tên tiêng anh",
          key: "col0",
          width: "5%",
          fixed: 'left',
        }
      ]
      }]
    }
    ,{
      title: "Thông tin kỹ thuật linh kiện",
      children: [
        {
          title: "Vật liệu",
          dataIndex: "col2",
          key: "address",
        },
        {
          title: "Xuất xứ",
          dataIndex: "col3",
          key: "startday",
        },{
          title: "Nơi gia công",
          key: "endday",
        },
        {
          title: "Thông tin kỹ thuật",
          key: "endday",
          children:[{
            title:'Bản vẽ',
            key:'layout'
          },{
            title:'Thông số kỹ thuật',
            key:'info'
          }]
        },
        {
          title: "ĐVT",
          dataIndex: "col6",
          key: "endday",
        },
      ],
    },
    {
      title: "Thông tin phôi",
      children: [
        {
          title: "mã số phôi",
          dataIndex: "col8",
          key: "endday",
          ...getColumnSearchProps("col8"),
        },
        {
          title: "Tên phôi",
          dataIndex: "col7",
          key: "endday",
        },{
          title: "Thông số kỹ thuật",
          key: "endday",
        },{
          title: "Xuất xứ phôi",
          dataIndex: "col14",
          key: "endday",
        },{
          title: "Mã bản vẽ",
          key: "endday",
        },
        {
          title: "ĐVT",
          dataIndex: "col9",
          key: "endday",
        },{
          title: "Khối lượng",
          key: "endday",
        },{
          title: "Ghi chú",
          key: "endday",
        },
        {
          title: "Số lượng phôi",
          dataIndex: "col10",
          key: "endday",
        },{
          title:'Thông tin khuôn',
          children:[{
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
          }]
        }
      ],
    },
  ];

  return (
    <Layout className="homelayout">
      <MenuSider />
      <Layout className="site-layout" style={{marginLeft:collapsed?80:200}}>
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
