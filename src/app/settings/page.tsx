"use client";

import ChangePassword from "@/components/setting/change-password";
import PrivacyAndPolicy from "@/components/setting/privacy-and-policy";
import ProfileInformation from "@/components/setting/profile-information";
import SettingsLayout from "@/components/setting/settings-layout";
import AboutUs from "@/components/setting/terms-and-conditions";
import TrustAndSafety from "@/components/setting/trust-and-safety";
import { Suspense, useState } from "react";


function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileInformation />;
      case "password":
        return <ChangePassword />;
      case "trust":
        return <TrustAndSafety />;
      case "privacy":
        return <PrivacyAndPolicy />;
      case "terms":
        return <AboutUs />;
      default:
        return <ProfileInformation />;
    }
  };

  return (
    <div className="py-4 px-4 md:px-6 lg:px-8">
      <div className="min-h-screen bg-gray-50 rounded-lg ">
        <div className="max-w- mx-auto p-6">
          <div className="flex items-center gap-2 mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          </div>

          <SettingsLayout
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          >
            {renderContent()}
          </SettingsLayout>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  return <Suspense fallback={<div>Loading...</div>}><SettingsPage /></Suspense>
}