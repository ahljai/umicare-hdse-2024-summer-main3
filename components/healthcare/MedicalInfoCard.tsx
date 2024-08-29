import React from 'react'

type MedicalInfoCardProps = {
  condition: string
  advice: string
}

export const MedicalInfoCard: React.FC<MedicalInfoCardProps> = ({ condition, advice }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
      <h3 className="text-xl font-bold mb-2 text-blue-600">{condition}</h3>
      <p className="text-gray-700">{advice}</p>
    </div>
  )
}
