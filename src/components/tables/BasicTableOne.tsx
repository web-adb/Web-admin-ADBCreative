'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import Badge from '../ui/badge/Badge';
import Image from 'next/image';
import Modal from './Modal';
import Input from './Input';
import Button from '../ui/button/Button';

interface Team {
  id: number;
  userName: string;
  userRole: string;
  userImage: string;
  projectName: string;
  teamImages: string[];
  status: string;
}

export default function BasicTableOne() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk modal dan form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<Partial<Team>>({
    userName: '',
    userRole: '',
    userImage: '',
    projectName: '',
    teamImages: [],
    status: '',
  });

  // Fetch data dari API
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/team');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setTeams(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submit (Create/Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = selectedTeam
        ? `/api/team?id=${selectedTeam.id}`
        : '/api/team';
      const method = selectedTeam ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save team');

      fetchTeams(); // Refresh data
      setIsModalOpen(false); // Tutup modal
      setFormData({}); // Reset form
      setSelectedTeam(null); // Reset selected team
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle edit team
  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setFormData(team);
    setIsModalOpen(true);
  };

  // Handle delete team
  const handleDelete = async () => {
    if (!selectedTeam) return;
    try {
      const response = await fetch(`/api/team?id=${selectedTeam.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete team');

      fetchTeams(); // Refresh data
      setIsDeleteModalOpen(false); // Tutup modal
      setSelectedTeam(null); // Reset selected team
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle open delete confirmation modal
  const openDeleteModal = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Anggota
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Divisi
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Team
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={team.userImage}
                          alt={team.userName}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {team.userName}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {team.userRole}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {team.projectName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {team.teamImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                        >
                          <Image
                            width={24}
                            height={24}
                            src={img}
                            alt={`Team member ${idx + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        team.status === 'Active'
                          ? 'success'
                          : team.status === 'Pending'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {team.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(team)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => openDeleteModal(team)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal untuk Create/Update */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTeam ? 'Edit Team' : 'Add Team'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="User Name"
            name="userName"
            value={formData.userName || ''}
            onChange={handleInputChange}
            required
          />
          <Input
            label="User Role"
            name="userRole"
            value={formData.userRole || ''}
            onChange={handleInputChange}
            required
          />
          <Input
            label="User Image URL"
            name="userImage"
            value={formData.userImage || ''}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Project Name"
            name="projectName"
            value={formData.projectName || ''}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Status"
            name="status"
            value={formData.status || ''}
            onChange={handleInputChange}
            required
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* Modal untuk Delete Confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Team"
      >
        <p>Are you sure you want to delete this team?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>

      {/* Tombol untuk membuka modal tambah data */}
      <div className="p-4">
        <Button onClick={() => setIsModalOpen(true)}>Add Team</Button>
      </div>
    </div>
  );
}