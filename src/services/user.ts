import mongoose, { FilterQuery, PaginateResult, Types } from "mongoose";
import { UserModel, User } from "../models/user";
import lodash from "lodash";

export default class UserService {
  /**
   * Creates a user
   * @param {Partial<User>} data
   * @returns {User} user
   */
  async create(data: Partial<User>): Promise<User> {
    const { email } = data;

    const user = await UserModel.findOneAndUpdate(
      { email },
      { $set: lodash.omitBy(data, lodash.isNil) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return user;
  }

  /**
   * Updates a user
   * @param {string | Types.ObjectId} userId
   * @param {Partial<User>} data
   * @returns {User}
   */
  async update(
    userId: string | Types.ObjectId,
    data: Partial<User>
  ): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: lodash.omitBy(data, lodash.isNil) },
      { new: true, runValidators: true }
    );

    if (!user) throw new Error("User not found");

    return user;
  }

  /**
   * Finds a user by the given userId
   * @param {string | Types.ObjectId} userId
   * @returns {User}
   */

  async findById(userId: string | Types.ObjectId): Promise<User> {
    let user: User | null;

    if (mongoose.isObjectIdOrHexString(userId))
      user = await UserModel.findById(userId);
    else
      user = await UserModel.findOne({
        $or: [
          { uid: userId },
          { username: userId.toString().toLowerCase() },
          { email: userId.toString().toLowerCase() },
          { phoneNumber: userId },
        ],
      });

    if (!user) throw new Error("User not found");

    return user;
  }

  /**
   * Finds a user document that matches the given query
   * @param query
   * @returns
   */

  async findOne(query: FilterQuery<User>): Promise<User> {
    const user = await UserModel.findOne(lodash.omitBy(query, lodash.isNil));

    if (!user) throw new Error("User not found");

    return user;
  }

  /**
   * Deletes a user document by Id
   * @param data
   * @returns
   */

  async delete(data: { userId: string | Types.ObjectId }): Promise<User> {
    const { userId } = data;

    const user = await this.findById(userId);
    await user.delete();

    return user;
  }

  /**
   * Retrieves paginated user documents
   * @param query
   * @param pageOptions
   * @returns
   */

  async page(
    query: FilterQuery<User>,
    pageOptions: Record<string, unknown>
  ): Promise<PaginateResult<User>> {
    return await UserModel.paginate(query, pageOptions);
  }
}
