// src/models/store.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IStore extends Document {
  storeName: string; // 门店名称
  location: string[]; // 门店地址
  address:string; // 详细地址
  status: 'start' | 'forbid' | 'postpone'; // 状态
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
  adminId: string; // 管理权限账号的 ID\
  role:'admin' | 'common' | 'vip' | 'special' | 'child',
  picture?: string[]; // 门店营业执照
  images?: string[]; // 门店照片
}

const StoreSchema: Schema = new Schema({
  storeName: { type: String, required: true , unique: true},
  location: { type: Array, required: true },
  address: {type: String, required: true},
  status: { type: String, required: true, enum: ['start', 'forbid', 'postpone'] },
  role: { type: String, required: true, enum: ['admin' , 'common' , 'vip' , 'special' , 'child'] },
  createdAt: { type: Date, default: Date.now }, // 默认为当前时间
  updatedAt: { type: Date, default: Date.now }, // 默认为当前时间
  adminId: { type: String, default: '' }, // 必填，管理权限账号的 ID
  picture: { type: [String], default: [] }, // 门店营业执照，数组类型
  images: { type: [String], default: [] }, // 门店照片，数组类型
});

// 在每次更新时，更新更新时间
StoreSchema.pre<IStore>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Store = mongoose.model<IStore>('Store', StoreSchema);
export default Store;
