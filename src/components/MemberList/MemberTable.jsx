import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import AvatarCell from "../common/AvatarCell";
import STTable from "../STTable/STTable";
import HighlightText from "../common/HighlightText";

const MemberTable = ({ users, onEdit, imageUrls, handleToggleStatus }) => {
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
      render: (_, user) => (
        <HighlightText text={user.user_mid} match={user._match} />
      ),
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
    {
      title: "Status",
      dataIndex: "user_status",
      key: "user_status",
      render: (_, user) => {
        const isActive = user.user_status === "Active";

        return (
          <div className="flex justify-center">
            <Popconfirm
              title={`Mark member as ${isActive ? "Inactive" : "Active"}?`}
              onConfirm={() => handleToggleStatus(user)}
              okText="Yes"
              cancelText="No"
            >
              <Tag
                color={isActive ? "green" : "red"}
                icon={isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                className="cursor-pointer"
              >
                {isActive ? "Active" : "Inactive"}
              </Tag>
            </Popconfirm>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      render: (_, user) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(user)}
            />
          </Tooltip>
        </Space>
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

export default MemberTable;
