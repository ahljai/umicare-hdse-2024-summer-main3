export async function fetchPatients(doctor: string) {
    try {
      const response = await fetch('../api2/getPatientListByDoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctor }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      throw error;
    }
  }
  
  export async function fetchDoctors(email: string) {
    try {
      const response = await fetch('../api2/getUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return [data.user] || [];
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      throw error;
    }
  }
  
  export const assignDoctor = async (
    userId: string,
    doctor: string,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    try {
      const response = await fetch("../api2/assignDoctorToPat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, doctor }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (error) {
      setError("Failed to assign doctor. Please try again later.");
      console.error("Failed to assign doctor:", error);
      return null;
    }
  };
  
  export const createPatient = async (
    patient: { name: string; status: string; doctorId: string },
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    try {
      const response = await fetch("../api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (error) {
      setError("Failed to create patient. Please try again later.");
      console.error("Failed to create patient:", error);
      return null;
    }
  };
  
  export const deletePatient = async (
    id: string,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    try {
      const response = await fetch(`../api/patients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (error) {
      setError("Failed to delete patient. Please try again later.");
      console.error("Failed to delete patient:", error);
      return null;
    }
  };