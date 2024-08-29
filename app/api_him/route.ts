import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';
const newId = uuidv4();
console.log(newId);
interface User {
  email: string;
  password: string;
  userType: string;
  name: string;
  clinic: string;
  key: string;
}

interface Patient{
  email: string;
  phone: string;
  password: string;
  userType: string;
  name: string;
  clinic: string;
  key: string;
}


// To control different action
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ...params } = body;

  switch (action) {
    case 'handleAccount':
      return handleAccount(params);
    case 'handleAddData':
      return handleAddData(params);
    case 'handleSetCliSelf':
      return handleSetCliSelf(params);
    case 'handleGetPatient':
      return handleDocGetPatient(params);
    case 'handleProfile':
      return handleProfile(params);
    case 'handleGetSettings':
      return handleGetSettings(params);
    case 'handleSetSettings':
      return handleSetSettings(params);
    case 'handleLogin':
      return handleLogin(params);
    case 'handleChatToAi':
      return handleChatToAi(params);
    case 'handleGetRecord':
      return handleGetRecord(params);
    case 'handleCliGetPatient':
      return handleCliGetPatient(params);
    case 'handlegGetBooking':
      return handlegGetBooking(params);
    case 'handleGetCliSelf':
      return handleGetCliSelf(params);
    case 'handleGenLicense':
      return handleGenLicense(params);
    case 'handleRegister':
      return handleRegister(params);
    case 'handleGetData':
      return handleGetData(params);
    default:
      return NextResponse.json({ message: 'Unknown action' }, { status: 400 });
  }
}

// Function to get data from Vercel KV using email as the key
async function handleGetData(params: { email: string }) {
  const { email } = params;
  try {
    const value = await kv.get(`user:${email}`);
    if (value && Object.keys(value).length > 0) {
      return NextResponse.json({ data: value });
    } else {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ message: 'Error fetching data', error: err.message }, { status: 500 });
  }
}

// Function to add data to Vercel KV
async function handleAddData(params: any) {
  const { key, value } = params;

  try {
    await kv.set(key, JSON.stringify(value));
    return NextResponse.json({ message: 'Data added successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error adding data' }, { status: 500 });
  }
}


async function handleAccount(params: any) {
  return NextResponse.json({ message: 'Handled account', params });
}

async function handleProfile(params: any) {
  return NextResponse.json({ message: 'Handled profile', params });
}



/*implement database ok , 
1. if fail will return reason, 
2. if success will return account type*/
async function handleLogin(params: { email: string; password: string }) {
  const { email, password } = params;

  try {
    const user = await kv.get<User>(`user:${email}`);
    
    if (!user) {
      return NextResponse.json({ message: 'fail', reason: 'no such email' }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json({ message: 'fail', reason: 'wrong password' }, { status: 401 });
    }

    return NextResponse.json({ message: 'success', type: user.userType });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ message: 'Error fetching data', error: err.message }, { status: 500 });
  }
}

//test ok (Sam & Elizabeth)
async function handleChatToAi(params: { toMessage: string }) {
  const getMessage: string = 'text with AI success';
  return NextResponse.json({ message: getMessage });
}

//test ok (Sam)
async function handleGetSettings(params: { email: string }) {
  const settingRecord = [
    {
      mode: 'Dark',
      frontSize: '10',
      front: 'arial'
    }
  ];
  return NextResponse.json(settingRecord);
}


//test ok (Sam)
async function handleSetSettings(params: { mode: string; frontSize: number; front: string }) {
  // waiting to add dataBase Connect
  return NextResponse.json({ message: 'save successful' });
}


//test ok (Sam)
async function handleGenLicense(params: { email: string }) {
  const sameEmail = "same@123.com";

  if (params.email === sameEmail) {
    return NextResponse.json({ message: 'email used' });
  }
  // waiting to add dataBase Connect
  return NextResponse.json({ message: 'generate successful' });
}

//test ok (Sam)
async function handleRegister(params: { email: string; name: string; yearOld: number }) {
  const getMessage: string = 'register success,';
  return NextResponse.json({ message: getMessage });
}


//test ok (Eddie)
async function handleGetRecord(params: { email: string }) {
  const jsonRecord = {
    email: params.email,
    questionRecord: [
      { id: 1, question: 'What symptoms are you experiencing?', answer: 'Fever and cough' },
      { id: 2, question: 'How long have you had these symptoms?', answer: '3 days' },
      { id: 3, question: 'Have you taken any medication?', answer: 'Yes, paracetamol' }
    ],
    feedBackRecord: [
      { id: 1, feedback: 'The doctor was very attentive and helpful.', rating: 5 },
      { id: 2, feedback: 'The waiting time was a bit long.', rating: 3 },
      { id: 3, feedback: 'Overall, a good experience.', rating: 4 }
    ]
  };

  return NextResponse.json(jsonRecord);
}

//test ok (Eddie)
async function handleDocGetPatient(params: { doctor: string }) {
  const patientRecord = [
    {
      name: 'John Doe',
      email: 'johndoe@example.com',
      age: 30
    },
    {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      age: 25
    },
    {
      name: 'Alice Johnson',
      email: 'alicejohnson@example.com',
      age: 28
    }
  ];

  return NextResponse.json(patientRecord);
}

//test ok (Onyx)
async function handleCliGetPatient(params: { clinicEmail: string }) {
  const { clinicEmail } = params;
  try {
    // 掃描所有符合 "user:*" 模式的鍵
    const keys = [];
    for await (const key of kv.scanIterator({ match: 'user:*' })) {
      keys.push(key);
    }

    // 根據 clinicEmail 篩選數據
    const results = [];
    for (const key of keys) {
      const value = await kv.get(key) as { userType: string, clinic: string, name: string };
      if (value && value.userType === 'patient' && value.clinic === clinicEmail) {
        results.push({ email: key.split(':')[1], name: value.name });
      }
    }

    if (results.length > 0) {
      return NextResponse.json({ data: results });
    } else {
      return NextResponse.json({ message: '未找到數據' }, { status: 404 });
    }
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ message: '獲取數據時出錯', error: err.message }, { status: 500 });
  }
}


//test ok (Onyx)
async function handleGetCliSelf(params: { clinic: string }) {
  
  const clinicRecord = [
    {
      name: 'HI.LTD',
      email: 'johndoe@example.com',
      locate: 'KT'
    }
  ];

  return NextResponse.json(clinicRecord);
}

//test ok (Onyx)
async function handleSetCliSelf(params: { name: string; email: string; locate: string }) {
  // waiting to add dataBase Connect
  return NextResponse.json({ message: 'save successful' });
}

//test ok (Onyx)
async function handlegGetBooking(params: { clinic: string }) {
  
  const bookingRecord = [
    {
      name: 'John',
      time: '16-08-2024 16:00',
      locate: 'KT'
    },
    {
      name: 'Peter',
      time: '16-08-2024 18:00',
      locate: 'KT'
    }
  ];

  return NextResponse.json(bookingRecord);
}
