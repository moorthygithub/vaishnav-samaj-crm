import { App, Card, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MEMBER_DATA, UPDATE_USER_STATUS } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";
import MemberTable from "./MemberTable";

const { Search } = Input;

const MemberList = ({ title, userTypeFilter }) => {
  const { message } = App.useApp();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });

  const fetchUser = async () => {
    const res = await trigger({
      url: MEMBER_DATA,
    });
    if (Array.isArray(res.data)) {
      const filtered = res.data.filter(
        (user) => user.category == userTypeFilter
      );
      setUsers(filtered);

      const userImageObj = res.image_url?.find(
        (img) => img.image_for == "User"
      );
      const noImageObj = res.image_url?.find(
        (img) => img.image_for == "No Image"
      );

      setImageUrls({
        userImageBase: userImageObj?.image_url || "",
        noImage: noImageObj?.image_url || "",
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userTypeFilter]);
  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.user_status == "Active" ? "Inactive" : "Active";
      const res = await trigger({
        url: `${UPDATE_USER_STATUS}/${user.id}`,
        method: "put",
        data: { user_status: newStatus },
      });

      if (res?.code === 201) {
        message.success(
          res.message ||
            `User marked as ${newStatus == "active" ? "Active" : "Inactive"}`
        );
        fetchUser();
      } else {
        message.error(res.message || "Failed to update user status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(error.message || "Error updating user status.");
    }
  };
  const handleEdit = (user) => {
    navigate(`/members/edit/${user.id}`);
  };

  const filteredUsers = users
    .map((user) => {
      const flatString = Object.values(user)
        .filter((v) => typeof v === "string" || typeof v === "number")
        .join(" ")
        .toLowerCase();
      const matched = flatString.includes(searchTerm.toLowerCase());
      return matched ? { ...user, _match: searchTerm } : null;
    })
    .filter(Boolean);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold heading">{title}</h2>

        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder={`Search ${title}`}
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
            <span className="text-sm text-gray-700">Matched Data</span>
          </div>
        </div>
      </div>

      <div className="min-h-[27rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <MemberTable
            imageUrls={imageUrls}
            users={filteredUsers}
            onEdit={handleEdit}
            handleToggleStatus={handleToggleStatus}
          />
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
    </Card>
  );
};

export default MemberList;
