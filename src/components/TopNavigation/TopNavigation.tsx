import React, { useEffect, useState } from "react";
import {
  Layout,
  Button,
  Popover,
  Avatar,
  Popconfirm,
} from "antd";
import { useNavigate } from "react-router-dom";
import { auth, db } from "~/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

import {
  UserOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

interface User {
  username: string;
  email: string;
}

const TopNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showSignoutConfirm, setShowSignoutConfirm] = React.useState(false);
  const toggleSignoutConfirm = () => setShowSignoutConfirm(!showSignoutConfirm);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ref = collection(db, "users");
        const q = query(ref, where("email", "==", auth.currentUser?.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUser(userData as User);
        }
      } catch (error) {
        console.error("Error occurred during user fetch:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error occurred during logout:", error);
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "account") {
      navigate("/account");
    } else if (key === "settings") {
      navigate("/settings");
    } else if (key === "signout") {
      handleLogout();
    } else if (key === "help") {
      navigate("/help");
    }
  };

  const userContent = (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {user ? (
          <Avatar
            size={64}
            src={`https://robohash.org/${user.username}?size=200x200&bgset=bg2`}
            alt={user.username}
          />
        ) : (
          <Avatar size={64} icon={<UserOutlined />} />
        )}
        <div style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
          {user?.username}
        </div>
        <div style={{ marginTop: "0.5rem" }}>{user?.email}</div>
      </div>
      <div style={{ marginTop: "1rem" }}>
        {/* <Button
          type="link"
          icon={<UserOutlined />}
          onClick={() => handleMenuClick({ key: "account" })}
        >
          Account
        </Button>
        <Button
          type="link"
          icon={<EllipsisOutlined />}
          onClick={() => handleMenuClick({ key: "settings" })}
        >
          Settings
        </Button> */}
        <Popconfirm
          title={"Confirm sign out action"}
          onConfirm={() => handleMenuClick({ key: "signout" })}
          onCancel={toggleSignoutConfirm}
          open={showSignoutConfirm}
        >
          <Button
            type="link"
            icon={<UserOutlined />}
            onClick={toggleSignoutConfirm}
          >
            Sign Out
          </Button>
        </Popconfirm>
        <Button
          type="link"
          icon={<QuestionCircleOutlined />}
          onClick={() => handleMenuClick({ key: "help" })}
        >
          Help
        </Button>
      </div>
    </div>
  );

  return (
    <Header
      style={{
        background: "#fff",
        padding: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="logo"
        style={{ height: "100px", width: "60px", paddingLeft: "0.5rem" }}
      >
        <img
          style={{
            height: "100%",
            width: "100%",
            objectFit: "contain",
            cursor: "pointer",
          }}
          src="/logo1.png"
          alt="Prop Ease"
          onClick={() => navigate("/")}
        />
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{ display: "flex", alignItems: "center", paddingRight: "1rem" }}
      >
    
        <Popover placement="bottomRight" content={userContent} trigger="click">
          <Button
            type="primary"
            icon={<UserOutlined />}
            style={{ marginRight: "0.5rem" }}
          />
        </Popover>
      </div>
    </Header>
  );
};

export default TopNavigation;
