"use client";
import Link from "next/link";
import React from "react";

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Untuk mengatur ulang kata sandi Anda, silakan hubungi administrator Anda.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-brand-400 dark:hover:bg-brand-500"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}