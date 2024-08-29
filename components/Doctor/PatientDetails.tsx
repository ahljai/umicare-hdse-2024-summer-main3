"use client";

import React from "react";
import ChatMessages from "@/components/Doctor/ChatMessages";

interface PatientDetailsProps {
  patient: any;
  summary: string;
  chatMessages: any[];
}

const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient,
  summary,
  chatMessages,
}) => {
  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Summary for {patient.name}
        </h3>
        <p className="mt-4 text-gray-800">
          <strong>Summary:</strong> {summary}
        </p>
      </div>

      <ChatMessages messages={chatMessages} />
    </>
  );
};

export default PatientDetails;