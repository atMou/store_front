"use client";
import { withAuth } from "@/components/HOC/WithAuth";
import { LandingLayout } from "@/components/layouts";
import { useLogoutMutation } from "@/features/auth";
import { AvatarUploadModal, EditProfileModal } from "@/features/user";
import { useAuth } from "@/hooks";
import { generatePlaceholderImage } from "@/shared/lib/placeholderImage";
import { motion } from "framer-motion";
import {
  Calendar,
  Camera,
  CheckCircle,
  Edit3,
  LogOut,
  Mail,
  Settings,
  Shield,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const UserProfile = () => {
  const { user } = useAuth();
  const [logout] = useLogoutMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  console.log("user => ", user);

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;
  const primaryRole = user.roles?.[0]?.name || "USER";

  const formatRole = (role: string) => {
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <LandingLayout>
      <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-4">
        <AvatarUploadModal
          open={isAvatarModalOpen}
          onOpenChangeAction={setIsAvatarModalOpen}
        />
        <EditProfileModal
          open={isEditModalOpen}
          onOpenChangeAction={setIsEditModalOpen}
        />
        <div className="max-w-4xl mx-auto">
          {/* Main Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white  border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="relative h-32 sm:h-40 bg-gray-50 border-b border-gray-200">
              {/* Avatar */}
              <div className="absolute -bottom-8 sm:-bottom-12 left-4 sm:left-8">
                <div className="relative group">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 border-2 border-white shadow-sm overflow-hidden relative bg-white">
                    <Image
                      src={user.avatar || generatePlaceholderImage(fullName)}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Edit avatar button */}
                  <button
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-white border border-gray-200 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white border border-gray-200  text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white border border-gray-200  text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-12 sm:pt-16 p-4 sm:p-8">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                    {fullName || "User Profile"}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Manage your account information and preferences
                  </p>
                </div>

                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-black text-white px-4 sm:px-6 py-2 sm:py-3  font-medium shadow-sm hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* User Details Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Basic Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white  p-4 sm:p-6 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100  flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Basic Info
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="text-gray-900 font-medium">
                        {fullName || "Not provided"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white  p-4 sm:p-6 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100  flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Contact
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Email Address
                      </p>
                      <p className="text-gray-900 font-medium break-all">
                        {user.email || "Not provided"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        Email verified
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Role & Status Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white  p-4 sm:p-6 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100  flex items-center justify-center">
                      <Shield className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Role & Status
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Account Role</p>
                      <span
                        className={`inline-flex items-center px-3 py-1  text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200`}
                      >
                        {formatRole(primaryRole)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500  animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Account Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white  p-4 sm:p-6 border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-1"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100  flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Account Info
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Member Since</p>
                      <p className="text-gray-900 font-medium">Recently</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                      <p className="text-gray-900 font-medium">Recently</p>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white  p-4 sm:p-6 border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-2"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100  flex items-center justify-center">
                      <Settings className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Quick Actions
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex flex-col items-center space-y-2 p-3  bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-gray-100  flex items-center justify-center">
                        <Edit3 className="w-4 h-4 text-gray-900" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        Edit Profile
                      </span>
                    </button>

                    <button className="flex flex-col items-center space-y-2 p-3  bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                      <div className="w-8 h-8 bg-gray-100  flex items-center justify-center">
                        <Shield className="w-4 h-4 text-gray-900" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        Security
                      </span>
                    </button>

                    <button className="flex flex-col items-center space-y-2 p-3  bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                      <div className="w-8 h-8 bg-gray-100  flex items-center justify-center">
                        <Mail className="w-4 h-4 text-gray-900" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        Notifications
                      </span>
                    </button>
                    <button
                      onClick={() => logout({ email: user.email })}
                      className="flex flex-col items-center space-y-2 p-3  bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-gray-100  flex items-center justify-center">
                        <LogOut className="w-4 h-4 text-gray-900" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        Sign Out
                      </span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default withAuth(UserProfile);
