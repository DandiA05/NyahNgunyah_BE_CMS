export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}
export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  gender: Gender; // Pastikan `Gender` diimpor dari enum yang dibuat
  password: string;
}
