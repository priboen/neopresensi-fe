export class Classes {
  uuid: string;
  gradeGroup: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    uuid: string,
    gradeGroup: string,
    createdAt: string,
    updatedAt: string
  ) {
    this.uuid = uuid;
    this.gradeGroup = gradeGroup;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(data: any): Classes {
    return new Classes(
      data.uuid,
      data.gradeGroup,
      data.createdAt,
      data.updatedAt
    );
  }
}

export class ClassesResponse {
  statusCode: number;
  message: string;
  data: Classes[];

  constructor(statusCode: number, message: string, data: Classes[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static fromJson(response: any): ClassesResponse {
    const data = response.data.map((item: any) => Classes.fromJson(item));
    return new ClassesResponse(response.statusCode, response.message, data);
  }
}
