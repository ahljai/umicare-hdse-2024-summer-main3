import { kv } from '@vercel/kv';

async function viewDoctors() {
  try {
    // Fetch data from KV store
    const doctorsData = await kv.get('doctors');
    
    if (doctorsData) {
      // Parse and display data
      const doctors = typeof doctorsData === 'string' ? JSON.parse(doctorsData) : doctorsData;
      console.log('Doctors Data:', doctors);
    } else {
      console.log('No data found for key "doctors".');
    }
  } catch (error) {
    console.error('Error retrieving KV data:', error);
  }
}

// Execute the function
viewDoctors();
