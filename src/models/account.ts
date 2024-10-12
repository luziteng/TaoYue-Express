// src/models/account.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IAccount extends Document {
  phone: string;
  password: string;
  role: string; // 权限角色
  status:string;// 状态
  wechat?: string; // 微信绑定信息
  images?: Array<any>; // 护照信息
}

const AccountSchema: Schema = new Schema({
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String,required: true, default: 'common' }, // 默认角色为普通用户 admin:超级管理员；common:一般用户；vip:vip用户；special:特殊用户
  status: { type: String,required: true, default: 'start' }, // 状态：启用：start;禁用：forbid;postpone:缴费逾期；
  wechat: { type: String, default: null },
  images: { type: Array, default: null },
});

const Account = mongoose.model<IAccount>('Account', AccountSchema);
export default Account;
