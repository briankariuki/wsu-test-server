import { getModelForClass, prop } from "@typegoose/typegoose";
import {
  DeletedByStaticMethods,
  DeletedStaticMethods,
} from "mongoose-delete-ts";
import { BaseDocument, BaseQueryHelpers, PaginateMethod } from "./plugin";

export enum UserStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export class User extends BaseDocument {
  @prop({ type: () => String, trim: true })
  public firstName!: string;

  @prop({ type: () => String, trim: true })
  public lastName!: string;

  @prop({
    type: () => String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  })
  public email!: string;

  public static paginate: PaginateMethod<User>;

  public static restoreOne: DeletedStaticMethods<User>["restoreOne"];

  public static restoreMany: DeletedStaticMethods<User>["restoreMany"];

  public static deleteOneByUser: DeletedByStaticMethods<User>["deleteOneByUser"];

  public static deleteManyByUser: DeletedByStaticMethods<User>["deleteManyByUser"];
}

export const UserModel = getModelForClass<typeof User, BaseQueryHelpers>(User);
