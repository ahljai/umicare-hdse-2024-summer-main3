import { kv } from '@vercel/kv';

async function setUser() {
  const user = {
    name: "John Clinic",
    phone: "852-12345678",
    address: "Rm02, 123Building, 321Road, HK",
    password: "clinic",
    operatingHours: "9am-6pm",
    userType: "clinic"
  };

  await kv.set('user:clinic@example.com', JSON.stringify(user));
}

setUser().catch(console.error);
