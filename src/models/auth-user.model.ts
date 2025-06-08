export class AuthUser {
  constructor(
    public uuid: string,
    public name: string,
    public username: string,
    public email: string,
    public role: string,
    public face_embedding: string | null,
    public photo_url: string | null,
    public createdAt: string,
    public updatedAt: string
  ) {}

  get isAdmin() {
    return this.role.toLowerCase() === "admin";
  }

  get initials() {
    return this.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  static fromJson(data: any): AuthUser {
    return new AuthUser(
      data.uuid,
      data.name,
      data.username,
      data.email,
      data.role,
      data.face_embedding,
      data.photo_url,
      data.createdAt,
      data.updatedAt
    );
  }
}
