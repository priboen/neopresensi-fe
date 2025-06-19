export class AppUser {
  constructor(
    public uuid: string,
    public name: string,
    public username: string,
    public email: string,
    public role: string,
    public photoUrl: string | null
  ) {}

  static fromJson(data: any): AppUser {
    return new AppUser(
      data.uuid,
      data.name,
      data.username,
      data.email,
      data.role,
      data.photo_url
    );
  }
}