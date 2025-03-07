'use client'
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Team {
  id: number;
  profileImage: string;
  name: string;
  major: string;
  teamDivision: string;
  status: string;
}

const TablePage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMajor, setFilterMajor] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDivision, setFilterDivision] = useState<string>('');
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/team');
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk menghapus data
  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/team?id=${id}`, {
        method: 'DELETE',
      });
      // Refresh data setelah menghapus
      setTeams(teams.filter((team) => team.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  // Fungsi untuk membuka modal edit
  const openEditModal = (team: Team) => {
    setSelectedTeam(team);
    setEditModalOpen(true);
  };

  // Fungsi untuk menutup modal edit
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedTeam(null);
  };

  // Fungsi untuk menyimpan perubahan edit
  const handleEdit = async () => {
    if (!selectedTeam) return;

    try {
      const response = await fetch(`/api/team?id=${selectedTeam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedTeam),
      });

      if (!response.ok) {
        throw new Error('Gagal mengupdate data');
      }

      const updatedTeam = await response.json();

      // Update data di state
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === updatedTeam.id ? updatedTeam : team
        )
      );

      closeEditModal();
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  // Fungsi untuk memfilter data berdasarkan nama, jurusan, status, dan tim/devisi
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterMajor ? team.major === filterMajor : true) &&
    (filterStatus ? team.status === filterStatus : true) &&
    (filterDivision ? team.teamDivision === filterDivision : true)
  );

  return (
    <div className="p-6">
      {/* Widget Berjajar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Anggota</h2>
          <p className="text-3xl">{teams.length}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Aktif</h2>
          <p className="text-3xl">
            {teams.filter((team) => team.status === 'Aktif').length}
          </p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Tidak Aktif</h2>
          <p className="text-3xl">
            {teams.filter((team) => team.status === 'Tidak Aktif').length}
          </p>
        </div>
      </div>

      {/* Input Pencarian dan Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={filterMajor}
            onChange={(e) => setFilterMajor(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Semua Jurusan</option>
            {[...new Set(teams.map((team) => team.major))].map((major, index) => (
              <option key={index} value={major}>
                {major}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Semua Status</option>
            {[...new Set(teams.map((team) => team.status))].map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Semua Tim/Devisi</option>
            {[...new Set(teams.map((team) => team.teamDivision))].map((division, index) => (
              <option key={index} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b">Gambar Profile</th>
              <th className="py-3 px-4 border-b">Nama</th>
              <th className="py-3 px-4 border-b">Jurusan</th>
              <th className="py-3 px-4 border-b">Tim / Devisi</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">
                  <img
                    src={team.profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="py-3 px-4 border-b">{team.name}</td>
                <td className="py-3 px-4 border-b">{team.major}</td>
                <td className="py-3 px-4 border-b">{team.teamDivision}</td>
                <td className="py-3 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      team.status === 'Aktif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {team.status}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => openEditModal(team)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Edit */}
      {editModalOpen && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Anggota</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <input
                  type="text"
                  value={selectedTeam.name}
                  onChange={(e) => setSelectedTeam({ ...selectedTeam, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Jurusan</label>
                <input
                  type="text"
                  value={selectedTeam.major}
                  onChange={(e) => setSelectedTeam({ ...selectedTeam, major: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tim / Devisi</label>
                <input
                  type="text"
                  value={selectedTeam.teamDivision}
                  onChange={(e) => setSelectedTeam({ ...selectedTeam, teamDivision: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedTeam.status}
                  onChange={(e) => setSelectedTeam({ ...selectedTeam, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePage;