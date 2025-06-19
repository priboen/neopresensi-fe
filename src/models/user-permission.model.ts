export class UserPermission {
  constructor(
    public uuid: string,
    public userUuid: string,
    public userName: string,
    public photoUrl: string | null,
    public startDate: string,
    public endDate: string,
    public reason: string,
    public status: string,
    public fileUrl: string,
    public createdAt?: string,
    public updatedAt?: string
  ) {}

  static fromJson(data: any): UserPermission {
    return new UserPermission(
      data.uuid,
      data.user_uuid,
      data.user?.name ?? "-",
      data.user?.photo_url ?? null,
      data.start_date,
      data.end_date,
      data.reason,
      data.status,
      data.file_url,
      data.createdAt,
      data.updatedAt
    );
  }
}
