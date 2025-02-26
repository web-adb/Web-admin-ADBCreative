'use client'; // Pastikan ini ada di bagian atas file

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddTeamPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    profileImage: '',
    name: '',
    major: '',
    teamDivision: '',
    status: 'Aktif',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/'); // Redirect ke halaman utama setelah berhasil
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Tambah Anggota Baru
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Gambar Profile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Profile (URL)
              </label>
              <input
                type="text"
                value={formData.profileImage}
                onChange={(e) =>
                  setFormData({ ...formData, profileImage: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Masukkan URL gambar profile"
                required
              />
            </div>

            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Masukkan nama"
                required
              />
            </div>

            {/* Jurusan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jurusan
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) =>
                  setFormData({ ...formData, major: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Masukkan jurusan"
                required
              />
            </div>

            {/* Tim / Devisi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tim / Devisi
              </label>
              <input
                type="text"
                value={formData.teamDivision}
                onChange={(e) =>
                  setFormData({ ...formData, teamDivision: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Masukkan tim / devisi"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>

            {/* Tombol Simpan */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTeamPage;