import { Input, message, Button, Tooltip, Descriptions, Card } from "antd";
import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import AvatarCell from "../common/AvatarCell";
import HighlightText from "../common/HighlightText";
import STTable from "../STTable/STTable";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useApiMutation } from "../../hooks/useApiMutation";
import { PANEL_UPDATE_USERS_MID, OLD_USERS } from "../../api";

const MIDTable = ({ users, imageUrls, fetchUser }) => {
  const { trigger } = useApiMutation();
  const [editingUserId, setEditingUserId] = useState(null);
  const [midValue, setMidValue] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [oldUserData, setOldUserData] = useState(null);
  const [checkingOldId, setCheckingOldId] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingUserId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingUserId]);

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setMidValue(user.user_mid || "");
  };

  const handleBlur = async (user) => {
    if (!midValue.trim()) {
      setEditingUserId(null);
      setMidValue("");
      return;
    }

    try {
      const res = await trigger({
        url: `${PANEL_UPDATE_USERS_MID}/${user.id}`,
        method: "put",
        data: { user_mid: midValue },
      });

      if (res?.code === 201) {
        message.success(res.message || "MID updated successfully");
        fetchUser();
      } else {
        message.error(res.message || "Failed to update MID");
      }
    } catch (error) {
      console.error(error);
      message.error(error?.message || "Error updating MID");
    }
    setEditingUserId(null);
    setMidValue("");
  };

  const handleCheckOldUser = async (user) => {
    try {
      setCheckingOldId(user.id);
      const res = await trigger({
        url: OLD_USERS,
        method: "get",
      });

      const oldUsersList = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : null;
      if (oldUsersList) {
        const currentMobiles = user.mobile
          ? user.mobile.split(/[\/,]+/).map((m) => m.trim().toLowerCase())
          : [];

        const matchedUser = oldUsersList.find((oldU) => {
          if (!oldU.mobile) return false;
          const oldMobile = oldU.mobile.trim().toLowerCase();
          return currentMobiles.some((curr) => curr && oldMobile.includes(curr));
        });

        if (matchedUser) {
          setOldUserData(matchedUser);
          setDrawerVisible(true);
          setActiveUserId(user.id);
        } else {
          message.warning("No matching old user found for this mobile number.");
        }
      } else {
        message.warning("Failed to fetch old users list.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching old users data.");
    } finally {
      setCheckingOldId(null);
    }
  };

  const handleKeyDown = (e, user) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
    if (e.key === "Escape") {
      setEditingUserId(null);
      setMidValue("");
    }
  };

  const columns = [


    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (_, user) => (
        <HighlightText text={user.name} match={user._match} />
      ),
    },
    {
      title: "Status",
      dataIndex: "user_status",
      key: "user_status",
      sorter: (a, b) => {
        const aIsM = a.entry_status === "M" ? 1 : 0;
        const bIsM = b.entry_status === "M" ? 1 : 0;
        if (aIsM !== bIsM) {
          return bIsM - aIsM;
        }
        return (a.user_status || "").localeCompare(b.user_status || "");
      },
      render: (_, user) => (
        <HighlightText text={user.user_status} match={user._match} />
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (_, user) => (
        <HighlightText text={user.gender} match={user._match} />
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      sorter: (a, b) => (a.mobile || "").localeCompare(b.mobile || ""),
      render: (_, user) => (
        <HighlightText text={user.mobile} match={user._match} />
      ),
    },
    {
      title: "DOB",
      dataIndex: "user_dob",
      key: "user_dob",
      render: (_, user) => (
        <HighlightText
          text={dayjs(user.user_dob).format("DD MMM YYYY")}
          match={user._match}
        />
      ),
    },
    {
      title: "MID",
      dataIndex: "user_mid",
      key: "user_mid",
      render: (_, user) => {
        if (editingUserId === user.id) {
          return (
            <Input
              ref={inputRef}
              size="small"
              placeholder="Enter MID"
              value={midValue}
              onChange={(e) => setMidValue(e.target.value)}
              onBlur={() => handleBlur(user)}
              onKeyDown={(e) => handleKeyDown(e, user)}
              style={{ width: 120 }}
            />
          );
        }

        return user.user_mid ? (
          <HighlightText text={user.user_mid} match={user._match} />
        ) : (
          <EditOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => startEditing(user)}
          />
        );
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, user) => (
        <Tooltip title="Check Old User">
          <Button
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
            size="small"
            onClick={() => handleCheckOldUser(user)}
            loading={checkingOldId === user.id}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full items-start">
      <div className={`transition-all duration-300 ${drawerVisible ? "w-full xl:w-2/3" : "w-full"}`}>
        <STTable
          virtual
          data={users}
          columns={columns}
          pagination={false}
          scroll={{ y: "calc(100vh - 280px)", x: "max-content" }}
          rowClassName={(record) =>
            record.entry_status === "M" ? "bg-green-100" : ""
          }
        />
      </div>

      {drawerVisible && (
        <Card
          className="w-full xl:w-1/3 shadow-md sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto"
          title="Matched Old User Details"
          extra={
            <Button type="text" onClick={() => setDrawerVisible(false)}>
              ✕
            </Button>
          }
        >
          {oldUserData ? (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Full Name">{oldUserData.full_name}</Descriptions.Item>
              <Descriptions.Item label="Mobile">{oldUserData.mobile}</Descriptions.Item>
              <Descriptions.Item label="Address">{oldUserData.address}</Descriptions.Item>
              <Descriptions.Item label="UID">{oldUserData.uid}</Descriptions.Item>
              <Descriptions.Item label="Flag">{oldUserData.flag}</Descriptions.Item>
              <Descriptions.Item label="Duplicate Flag">{oldUserData.duplicate_flag}</Descriptions.Item>
            </Descriptions>
          ) : (
            <p>No user data available.</p>
          )}
        </Card>
      )}
    </div>
  );
};

export default MIDTable;
