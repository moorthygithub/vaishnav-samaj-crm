import { UploadOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { PROFILE, UPDATE_PROFILE } from "../../api";
import AvatarCell from "../../components/common/AvatarCell";
import CropImageModal from "../../components/common/CropImageModal";
import { useApiMutation } from "../../hooks/useApiMutation";
const ProfileForm = ({ setProfileDialog, openProfile }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState({});
  const { trigger: fetchTrigger, loading } = useApiMutation();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  const [userImageInfo, setUserImageInfo] = useState({
    file: null,
    preview: "",
  });

  const [cropState, setCropState] = useState({
    modalVisible: false,
    imageSrc: null,
    tempFileName: "",
    target: "",
  });

  const fetchMember = async () => {
    try {
      const res = await fetchTrigger({
        url: PROFILE,
      });
      if (!res?.data) return;
      const member = res.data;
      console.log(member, "member");
      setInitialData(member);

      const userImageBase = res.image_url?.find(
        (img) => img.image_for == "User"
      )?.image_url;

      if (member.user_image && userImageBase) {
        setUserImageInfo({
          file: null,
          preview: `${userImageBase}${member.user_image}`,
        });
      }

      form.setFieldsValue({
        ...member,
        user_dob: member.user_dob ? dayjs(member.user_dob) : null,
      });
    } catch (err) {
      console.error("Fetch error:", err);
      message.error(err.response.data.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    fetchMember();
  }, []);
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name?.trim() || "");
      formData.append(
        "user_dob",
        values.user_dob ? values.user_dob.format("YYYY-MM-DD") : ""
      );
      formData.append("gender", values.gender?.trim() || "");
      formData.append("mobile", values.mobile?.trim() || "");
      formData.append("email", values.email?.trim() || "");
      formData.append("address", values.address?.trim() || "");
      formData.append("gnati", values.gnati?.trim() || "");

      formData.append("category", values.category || "");

      if (userImageInfo.file) {
        formData.append("user_image", userImageInfo.file);
      }

      const res = await submitTrigger({
        url: `${UPDATE_PROFILE}?_method=PUT`,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.code == 201) {
        message.success(res.message || "Profile Updated!");
        fetchMember();
        if (openProfile) {
          setProfileDialog(false);
        }
      } else {
        message.error(res.message || "Failed to save profile.");
      }
    } catch (error) {
      message.error(error.response.message || "Something went wrong.");
    }
  };

  const openCropper = (file, target) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropState({
        modalVisible: true,
        imageSrc: reader.result,
        tempFileName: file.name,
        target,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = ({ blob, fileUrl }) => {
    const file = new File([blob], cropState.tempFileName || "image.jpg", {
      type: blob.type,
    });
    if (cropState.target == "user") {
      setUserImageInfo({ file, preview: fileUrl });
    }

    setCropState({
      modalVisible: false,
      imageSrc: null,
      tempFileName: "",
      target: "",
    });
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          initialValues={initialData}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Form.Item
              label={
                <span>
                  Full Name <span className="text-red-500">*</span>
                </span>
              }
              name="name"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input maxLength={20} autoFocus />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select Gender" }]}
            >
              <Select placeholder="Select gender" allowClear>
                {["Male", "Female"].map((gender) => (
                  <Select.Option key={gender} value={gender}>
                    {gender}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <span>
                  DOB <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Select DOB" }]}
              name="user_dob"
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Mobile Number<span className="text-red-500">*</span>
                </span>
              }
              name="mobile"
            >
              <Input
                maxLength={10}
                inputMode="numeric"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) e.preventDefault();
                }}
                disabled
              />
            </Form.Item>

            <Form.Item label="Gnati" name="gnati">
              <Input maxLength={50} />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Email <span className="text-red-500">*</span>
                </span>
              }
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email is required",
                },
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input maxLength={50} />
            </Form.Item>

            <Form.Item name="user_image" label="Image">
              <div className="flex items-center gap-4">
                <AvatarCell imageSrc={userImageInfo.preview} />{" "}
                <div className="flex-1">
                  <Upload
                    showUploadList={false}
                    accept="image/*"
                    beforeUpload={(file) => {
                      openCropper(file, "user");
                      return false;
                    }}
                    className="w-full"
                  >
                    <Button
                      icon={<UploadOutlined />}
                      className="w-full"
                      style={{ display: "block", width: "100%" }}
                    >
                      Upload Image
                    </Button>
                  </Upload>
                </div>
              </div>
            </Form.Item>

            <Form.Item label="Address" name="address" className="col-span-4">
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>

          <Form.Item className="text-center mt-6">
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Update
            </Button>
          </Form.Item>

          <CropImageModal
            open={cropState.modalVisible}
            imageSrc={cropState.imageSrc}
            onCancel={() =>
              setCropState((prev) => ({ ...prev, modalVisible: false }))
            }
            onCropComplete={handleCroppedImage}
            maxCropSize={{ width: 600, height: 600 }}
            title="Crop Profile Image"
            cropstucture={true}
          />
        </Form>
      )}
    </>
  );
};

export default ProfileForm;
