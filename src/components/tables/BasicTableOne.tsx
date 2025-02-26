'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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

  // Fungsi untuk memfilter data berdasarkan nama
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Input Pencarian */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
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
                  <Link href={`/edit-anggota/${team.id}`}>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePage;