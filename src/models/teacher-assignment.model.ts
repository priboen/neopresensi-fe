export class TeacherAssignment {
  uuid: string;
  userId: string;
  classId: string;
  subjectId: string;
  userName: string;
  userPhotoUrl: string | null;
  subjectName: string;
  grade: number;
  groupName: string;
  createdAt?: string;
  updatedAt?: string;

  constructor(
    uuid: string,
    userId: string,
    classId: string,
    subjectId: string,
    userName: string,
    userPhotoUrl: string | null,
    subjectName: string,
    grade: number,
    groupName: string,
    createdAt?: string,
    updatedAt?: string
  ) {
    this.uuid = uuid;
    this.userId = userId;
    this.classId = classId;
    this.subjectId = subjectId;
    this.userName = userName;
    this.userPhotoUrl = userPhotoUrl;
    this.subjectName = subjectName;
    this.grade = grade;
    this.groupName = groupName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(data: any): TeacherAssignment {
    console.log("TeacherAssignment.fromJson", data);
    return new TeacherAssignment(
      data.uuid ?? "",
      data.user_id ?? "",
      data.class_id ?? "",
      data.subject_id ?? "",
      data.user?.name ?? "-",
      data.user?.photo_url ?? null,
      data.subject?.name ?? "-",
      data.classes?.grade ?? 0,
      data.classes?.group?.name ?? "-",
      data.createdAt,
      data.updatedAt
    );
  }
}

export class TeacherAssignmentResponse {
  statusCode: number;
  message: string;
  data: TeacherAssignment[];

  constructor(statusCode: number, message: string, data: TeacherAssignment[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static fromJson(response: any): TeacherAssignmentResponse {
    const data = response.data.map((item: any) =>
      TeacherAssignment.fromJson(item)
    );
    return new TeacherAssignmentResponse(
      response.statusCode,
      response.message,
      data
    );
  }
}
