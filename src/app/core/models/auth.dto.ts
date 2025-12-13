export interface ILogin {

  companyCode: string;
      userName: string;
      password: string;
}
export interface ILoginResponse {
  token: string;
  userId: string;
  email: string;
  userName: string;
  phoneNumber: string;
  countryCode: string;
  expireOn: string;       
  isNewAccount: boolean;
  profilePicturePath: string | null;
  phone: {
    countryCode: string;
    phoneNumber: string;
  };
}
