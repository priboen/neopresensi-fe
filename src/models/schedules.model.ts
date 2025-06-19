export class User {
  name: string;
  photoUrl: string | null;

  constructor(name: string, photoUrl: string | null) {
    this.name = name;
    this.photoUrl = photoUrl;
  }

  static fromJson(data: any): User {
    return new User(data.name ?? "-", data.photo_url ?? null);
  }
}

export class Subject {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static fromJson(data: any): Subject {
    return new Subject(data.name ?? "-");
  }
}

export class Classes {
  gradeGroup: string;

  constructor(gradeGroup: string) {
    this.gradeGroup = gradeGroup;
  }

  static fromJson(data: any): Classes {
    return new Classes(data.gradeGroup ?? "-");
  }
}

export class TeacherAssignment {
  uuid: string;
  userId: string;
  classId: string;
  subjectId: string;
  createdAt?: string;
  updatedAt?: string;
  subject: Subject;
  classes: Classes;
  user: User;

  constructor(
    uuid: string,
    userId: string,
    classId: string,
    subjectId: string,
    subject: Subject,
    classes: Classes,
    user: User,
    createdAt?: string,
    updatedAt?: string
  ) {
    this.uuid = uuid;
    this.userId = userId;
    this.classId = classId;
    this.subjectId = subjectId;
    this.subject = subject;
    this.classes = classes;
    this.user = user;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(data: any): TeacherAssignment {
    return new TeacherAssignment(
      data.uuid ?? "",
      data.user_id ?? "",
      data.class_id ?? "",
      data.subject_id ?? "",
      Subject.fromJson(data.subject),
      Classes.fromJson(data.classes),
      User.fromJson(data.user),
      data.createdAt,
      data.updatedAt
    );
  }
}

export class Schedule {
  uuid: string;
  day: string;
  startTime: string;
  endTime: string;
  teacherId: string;
  createdAt?: string;
  updatedAt?: string;
  teacherAssignment: TeacherAssignment;

  constructor(
    uuid: string,
    day: string,
    startTime: string,
    endTime: string,
    teacherId: string,
    teacherAssignment: TeacherAssignment,
    createdAt?: string,
    updatedAt?: string
  ) {
    this.uuid = uuid;
    this.day = day;
    this.startTime = startTime;
    this.endTime = endTime;
    this.teacherId = teacherId;
    this.teacherAssignment = teacherAssignment;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(data: any): Schedule {
    return new Schedule(
      data.uuid ?? "",
      data.day ?? "",
      data.start_time ?? "",
      data.end_time ?? "",
      data.teacher_id ?? "",
      TeacherAssignment.fromJson(data.teacherAssignment),
      data.createdAt,
      data.updatedAt
    );
  }
}

export class ScheduleResponse {
  statusCode: number;
  message: string;
  data: Schedule[];

  constructor(statusCode: number, message: string, data: Schedule[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static fromJson(response: any): ScheduleResponse {
    const data = response.data.map((item: any) => Schedule.fromJson(item));
    return new ScheduleResponse(response.statusCode, response.message, data);
  }
}
