import { Document } from "mongoose";

// Structure of students model
export default interface IStudentDoc extends Document {
  first_name: string;
  last_name: string;
  level: "KG" | "Elementary" | "High School" | "Preparatory";
  grade: string;
  birth_date: Date;
  sex: "Male" | "Female";
  role_num: string;
  blood_group: string;
  parent: string;
  parent_relation: string;
  tenant_id: string;
  prof_img: IProfileImg;
  createdAt: Date;
  updatedAt: Date;
}

// Keys in a profile image
export interface IProfileImg {
  secure_url: string;
  public_id: string;
}

// Structure of data in different incoming requests
declare global {
  namespace StudentRequests {
    interface ICreateStudent {
      first_name: string;
      last_name: string;
      level: "KG" | "Elementary" | "High School" | "Preparatory";
      grade: string;
      birth_date: Date;
      sex: "Male" | "Female";
      role_num: string;
      blood_group: string;
      parent: string;
      parent_phone_num: string;
      parent_relation: string;
      tenant_id: string;
      prof_img: IProfileImg;
    }
    interface IUpdateStudent {
      first_name: string;
      last_name: string;
      level: "KG" | "Elementary" | "High School" | "Preparatory";
      grade: string;
      birth_date: Date;
      sex: "Male" | "Female";
      role_num: string;
      blood_group: string;
      parent: string;
      parent_relation: string;
      tenant_id: string;
      prof_img: IProfileImg;
    }
    interface IDeleteKey {
      delete_key: string;
    }
  }
}
