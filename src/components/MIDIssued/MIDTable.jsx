import { Input, message } from "antd";
import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import AvatarCell from "../common/AvatarCell";
import HighlightText from "../common/HighlightText";
import STTable from "../STTable/STTable";
import { EditOutlined } from "@ant-design/icons";
import { useApiMutation } from "../../hooks/useApiMutation";
import { PANEL_UPDATE_USERS_MID } from "../../api";

const MIDTable = ({ users, imageUrls, fetchUser }) => {
  const { trigger } = useApiMutation();
  const [editingUserId, setEditingUserId] = useState(null);
  const [midValue, setMidValue] = useState("");
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
      title: "",
      key: "member_images",
      render: (_, user) => {
        const memberImageSrc = user.user_image
          ? `${imageUrls.userImageBase}${user.user_image}`
          : imageUrls.noImage;
        const spouseImageSrc = user.spouse_image
          ? `${imageUrls.userImageBase}${user.spouse_image}`
          : imageUrls.noImage;

        return (
          <div className="flex justify-center gap-2">
            <AvatarCell imageSrc={memberImageSrc} />
            {user.user_member_type === "Couple Membership" && (
              <AvatarCell imageSrc={spouseImageSrc} />
            )}
          </div>
        );
      },
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, user) => (
        <HighlightText text={user.name} match={user._match} />
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
  ];

  return (
    <STTable
      data={users}
      columns={columns}
      rowClassName={(record) =>
        record.entry_status === "M" ? "bg-green-100" : ""
      }
    />
  );
};

export default MIDTable;

