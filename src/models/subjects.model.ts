export class Subjects {
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

  static fromJson(data: any): Subjects {
    return new Subjects(data.uuid, data.name, data.createdAt, data.updatedAt);
  }
}

export class SubjectsResponse {
  statusCode: number;
  message: string;
  data: Subjects[];

  constructor(statusCode: number, message: string, data: Subjects[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static fromJson(response: any): SubjectsResponse {
    const data = response.data.map((item: any) => Subjects.fromJson(item));
    return new SubjectsResponse(response.statusCode, response.message, data);
  }
}
