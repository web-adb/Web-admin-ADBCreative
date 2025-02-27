"use client";
import { useState, useEffect } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useUser } from "@clerk/nextjs"; // Import useUser dari Clerk

export default function LastLoginUsersCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastLoggedInUsers, setLastLoggedInUsers] = useState([]); // State untuk menyimpan daftar pengguna
  const { user } = useUser(); // Ambil data pengguna saat ini dari Clerk

  // Simpan data pengguna yang login ke dalam list
  useEffect(() => {
    if (user) {
      const userData = {
        id: user.id,
        fullName: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        lastLogin: new Date().toLocaleString(), // Tambahkan waktu login terakhir
      };

      // Ambil data sebelumnya dari localStorage (jika ada)
      const storedUsers = JSON.parse(localStorage.getItem("lastLoggedInUsers")) || [];

      // Tambahkan pengguna baru ke awal array
      const updatedUsers = [userData, ...storedUsers];

      // Batasi array hingga 5 pengguna terakhir
      const limitedUsers = updatedUsers.slice(0, 5);

      // Simpan ke localStorage dan state
      localStorage.setItem("lastLoggedInUsers", JSON.stringify(limitedUsers));
      setLastLoggedInUsers(limitedUsers);
    }
  }, [user]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Last Logged In Users
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            List of users who recently logged in.
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* List pengguna yang terakhir login */}
      <div className="mt-6 space-y-4">
        {lastLoggedInUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-800">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {user.fullName?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                  {user.fullName}
                </p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {user.email}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  Last login: {user.lastLogin}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}