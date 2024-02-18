import React from "react";
import { Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";
import {
  RightOutlined,
  HomeOutlined,
  LeftOutlined,
  DatabaseOutlined, // Changed for a more direct representation of "Database"
  PlusCircleOutlined, // More visually engaging than PlusOutlined for adding new items
  MinusCircleOutlined, // More visually engaging than MinusOutlined for removing items
} from "@ant-design/icons";

const SideNavigation = () => {
  const { Sider } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [isMenuCollapsed, setIsMenuCollapsed] = React.useState(false);

  return (
    <Sider
      width={230}
      style={{
        background: colorBgContainer,
        borderRight: "1px solid grey",
        padding: 0,
        marginLeft: 0,
      }}
      collapsible
      collapsed={isMenuCollapsed}
      reverseArrow={false}
      trigger={null}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item
          icon={isMenuCollapsed ? <RightOutlined /> : <LeftOutlined />}
          onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
        >
          {isMenuCollapsed ? "Show" : "Hide"}
        </Menu.Item>
        <Menu.Item icon={<HomeOutlined />}>
          <Link to="/home">Home</Link>
        </Menu.Item>
        <Menu.SubMenu key="database" icon={<DatabaseOutlined />} title="Database">
          <Menu.Item key="view-database" icon={<PlusCircleOutlined />}>
            <Link to="/view-database">View Database</Link>
          </Menu.Item>
          <Menu.Item key="add-to-database" icon={<MinusCircleOutlined />}>
            <Link to="/add-to-database">Add to Database</Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Sider>
  );
};

export default SideNavigation;
