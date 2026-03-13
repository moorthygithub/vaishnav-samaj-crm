import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Input, message, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { OLD_USERS, PANEL_UPDATE_USERS_MID } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";
import HighlightText from "../common/HighlightText";
import STTable from "../STTable/STTable";

const MIDTable = ({ users, imageUrls, fetchUser }) => {
  const { trigger } = useApiMutation();
  const [editingUserId, setEditingUserId] = useState(null);
  const [midValue, setMidValue] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [oldUsersData, setOldUsersData] = useState([]);
  const [cachedOldUsers, setCachedOldUsers] = useState(null);
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
        user.user_mid = midValue; // Mutate locally to avoid page reload
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

      let oldUsersList = cachedOldUsers;

      if (!oldUsersList) {
        const res = await trigger({
          url: OLD_USERS,
          method: "get",
        });
        oldUsersList = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : null;
        if (oldUsersList) {
          setCachedOldUsers(oldUsersList);
        }
      }

      if (oldUsersList) {
        const currentMobiles = user.mobile
          ? user.mobile.split(/[\/,]+/).map((m) => m.trim().toLowerCase())
          : [];

        const matchedUsers = oldUsersList.filter((oldU) => {
          if (!oldU.mobile) return false;
          const oldMobile = oldU.mobile.trim().toLowerCase();
          return currentMobiles.some((curr) => curr && oldMobile.includes(curr));
        });

        if (matchedUsers.length > 0) {
          setOldUsersData(matchedUsers);
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
      width: 250,
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (_, user) => (
        <HighlightText text={user.name} match={user._match} />
      ),
    },
    {
      title: "Status",
      dataIndex: "user_status",
      key: "user_status",
      width: 100,
      sorter: (a, b) => {
        const aIsM = a.entry_status === "M" ? 1 : 0;
        const bIsM = b.entry_status === "M" ? 1 : 0;
        if (aIsM !== bIsM) {
          return bIsM - aIsM;
        }
        return (a.user_status || "").localeCompare(b.user_status || "");
      },
      render: (_, user) => (
        <HighlightText text={user.entry_status ? user.entry_status : user.entry_status
        } />
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
      <div className={`transition-all duration-300 ${drawerVisible ? "w-full xl:w-3/4" : "w-full"}`}>
        <STTable
          // virtual
          data={users}
          columns={columns}
          pagination={false}
          scroll={{ y: "calc(100vh - 280px)", x: "max-content" }}
          rowClassName={(record) =>
            record.id === activeUserId
              ? "bg-orange-100"
              : record.entry_status === "M"
                ? "bg-green-100"
                : ""
          }
        />
      </div>

      {drawerVisible && (
        <Card
          className="w-full xl:w-1/4 shadow-sm sticky top-4"
          style={{ maxHeight: "65vh", overflowY: "auto" }}
          styles={{ body: { padding: 0 } }}
          title={
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Matched users</span>
              <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                {oldUsersData.length}
              </span>
            </div>
          }
          extra={
            <Button type="text" size="small" onClick={() => setDrawerVisible(false)}>
              ✕
            </Button>
          }
        >
          {oldUsersData.length > 0 ? (
            oldUsersData.map((oldU, idx) => (
              <div key={idx} className="px-4 py-3 border-b border-gray-100 last:border-b-0">

                {/* Name + Flags */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {oldU.full_name}
                  </span>
                  {(oldU.flag || oldU.duplicate_flag) && (
                    <div className="flex items-center gap-1 shrink-0">
                      {oldU.flag && (
                        <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-full px-2 py-0.5">
                          {oldU.flag}
                        </span>
                      )}
                      {oldU.duplicate_flag && (
                        <span className="text-xs bg-red-50 text-red-800 border border-red-200 rounded-full px-2 py-0.5">
                          {oldU.duplicate_flag}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Meta Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-10 shrink-0">Mobile</span>
                    <span className="text-xs text-gray-600">{oldU.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-10 shrink-0">UID</span>
                    <code className="text-xs bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 font-mono text-gray-500 truncate max-w-[110px]">
                      {oldU.uid}
                    </code>
                    <Typography.Text
                      copyable={{ text: oldU.uid }}
                      style={{ fontSize: 11, lineHeight: 1 }}
                    />
                  </div>
                </div>

              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 text-center py-6">No users found</p>
          )}
        </Card>
      )}
    </div>
  );
};

export default MIDTable;
