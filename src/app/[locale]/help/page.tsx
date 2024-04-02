import React from "react";
import { Metadata } from "next";
import Guides from "../../components/Help/Guides";

export const metadata: Metadata = {
  title: "Help",
  description: "Help page",
};

const HelpPage = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Guides />
      </div>
    </div>
  );
};

export default HelpPage;
