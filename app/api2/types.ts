export interface User {
    phone: string;
    userId: string;
    name: string;
    password: string;
    userType: string;
}

export interface clinic {
  phone: string;
  userId: string;
  name: string;
  password: string;
  userType: string;
  address: string;
  operatingHours: string;
}


export interface doctor {
  phone: string;
  userId: string;
  name: string;
  password: string;
  userType: string;
  clinic: string;
}

export interface patient {
  phone: string;
  userId: string;
  name: string;
  password: string;
  userType: string;
  clinic: string;
  dpctor: string;
}