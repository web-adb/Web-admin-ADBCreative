"use client";
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";

export default function UserMetaCard() {
  const {
    isOpen: isProfileModalOpen,
    openModal: openProfileModal,
    closeModal: closeProfileModal,
  } = useModal();

  const {
    isOpen: isPasswordModalOpen,
    openModal: openPasswordModal,
    closeModal: closePasswordModal,
  } = useModal();

  const { user } = useUser();
  const { user: clerkUser } = useClerk();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [username, setUsername] = useState(user?.username || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // State untuk show/hide current password
  const [showNewPassword, setShowNewPassword] = useState(false); // State untuk show/hide new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk show/hide confirm password
  const [statusMessage, setStatusMessage] = useState(""); // State untuk pesan status

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman
    if (!clerkUser) {
      setStatusMessage("User is not available");
      return;
    }

    try {
      await clerkUser.update({ username });
      if (profileImage) {
        await clerkUser.setProfileImage({ file: profileImage });
      }
      setStatusMessage("Profile updated successfully");
    } catch (error) {
      setStatusMessage("Error updating profile: " + (error as Error).message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman
    if (!clerkUser) {
      setStatusMessage("User is not available");
      return;
    }

    // Validasi password baru
    if (newPassword.length < 8) {
      setStatusMessage("Password must be at least 8 characters long");
      return;
    }

    // Validasi konfirmasi password
    if (newPassword !== confirmNewPassword) {
      setStatusMessage("New password and confirm password do not match");
      return;
    }

    try {
      await clerkUser.updatePassword({
        newPassword,
        currentPassword, // Opsional, tergantung kebijakan aplikasi
      });
      setStatusMessage("Password updated successfully");
    } catch (error) {
      setStatusMessage("Failed to update password: " + (error as Error).message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={user?.imageUrl || ""}
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?.username || "Loading..."}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.primaryEmailAddress?.emailAddress || "user@example.com"}
                </p>
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <button
                onClick={openProfileModal}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                Edit Profile
              </button>
              <button
                onClick={openPasswordModal}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal untuk Edit Profile */}
      <Modal isOpen={isProfileModalOpen} onClose={closeProfileModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Profile
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your profile information.
            </p>
          </div>
          <form onSubmit={handleSaveProfile} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Username</Label>
                    <Input
                      type="text"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Profile Image</Label>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeProfileModal}>
                Close
              </Button>
              <Button size="sm">
                Save Changes
              </Button>
            </div>
            {statusMessage && (
              <div className="mt-4 text-center text-sm text-green-600 dark:text-green-400">
                {statusMessage}
              </div>
            )}
          </form>
        </div>
      </Modal>

      {/* Modal untuk Change Password */}
      <Modal isOpen={isPasswordModalOpen} onClose={closePasswordModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Change Password
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your password.
            </p>
          </div>
          <form onSubmit={handleChangePassword} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Password Information
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-2 top-2 text-sm text-gray-500"
                      >
                        {showCurrentPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>New Password</Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 top-2 text-sm text-gray-500"
                      >
                        {showNewPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-2 text-sm text-gray-500"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closePasswordModal}>
                Close
              </Button>
              <Button size="sm">
                Change Password
              </Button>
            </div>
            {statusMessage && (
              <div className="mt-4 text-center text-sm text-green-600 dark:text-green-400">
                {statusMessage}
              </div>
            )}
          </form>
        </div>
      </Modal>
    </>
  );
}