export class ClassGroup {
  uuid: string;
  name: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    uuid: string,
    name: string,
    createdAt: string,
    updatedAt: string
  ) {
    this.uuid = uuid;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(data: any): ClassGroup {
    return new ClassGroup(data.uuid, data.name, data.createdAt, data.updatedAt);
  }
}

export class ClassGroupsResponse {
  statusCode: number;
  message: string;
  data: ClassGroup[];

  constructor(statusCode: number, message: string, data: ClassGroup[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static fromJson(response: any): ClassGroupsResponse {
    const data = response.data.map((item: any) => ClassGroup.fromJson(item));
    return new ClassGroupsResponse(response.statusCode, response.message, data);
  }
}
