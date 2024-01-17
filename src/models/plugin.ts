import { Ref, index, modelOptions, plugin, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { DeletedByMethods, DeletedMethods } from "mongoose-delete-ts";

import idValidator from "mongoose-id-validator";
import autoPopulator from "mongoose-autopopulate";
import paginator from "mongoose-paginate-v2";
import deletor from "mongoose-delete-ts";
import { FilterQuery, PaginateOptions, PaginateResult } from "mongoose";
import { User } from "./user";

export type PaginateMethod<T> = (
  query?: FilterQuery<T>,
  options?: PaginateOptions,
  callback?: (err: unknown, result: PaginateResult<T>) => void
) => Promise<PaginateResult<T>>;

export interface BaseDocument extends Base {
  delete: DeletedMethods["restore"];
  restore: DeletedMethods["restore"];
  deleteByUser: DeletedByMethods["deleteByUser"];
  toJSON(): Record<string, unknown>;
  toObject(): Record<string, unknown>;
}

@modelOptions({
  schemaOptions: {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
})
@plugin(idValidator)
@plugin(autoPopulator)
@plugin(paginator)
@plugin(deletor, { deletedAt: true, deletedBy: true })
@index({ "$**": "text" })
export class BaseDocument extends TimeStamps {
  @prop({ type: () => Boolean })
  public deleted?: boolean;

  @prop({ type: () => Date })
  public deletedAt?: Date;

  @prop({ ref: "User" })
  public deletedBy?: Ref<User>;

  @prop({ type: () => String })
  public status?: String;
}

export interface BaseQueryHelpers {
  onlyDeleted(): this;
  withDeleted(): this;
}
