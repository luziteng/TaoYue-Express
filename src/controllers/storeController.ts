// src/controllers/storeController.ts
import Store from '../models/store';
import { STATUS_CODES } from '../constants/statusCodes';
import { successResponse, errorResponse } from '../utils/response';
// import { getAddressFromCodes } from '../utils/parseAddress';

export const addStore = async (req: any, res: any) => {
  const { storeName, location, status, adminId, picture, images, role, address } = req.body;

  // 校验 location 格式
  if (!location || !Array.isArray(location) || location.length !== 3) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: '地址格式错误' });
  }

  // 校验必填字段
  if (!storeName || typeof storeName !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请输入门店名称' });
  }
  if (!address || typeof address !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请输入详细地址' });
  }
  if (!status || !['start', 'forbid', 'postpone'].includes(status)) {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请选择有效的状态' });
  }
  if (!role || typeof role !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请选择门店权限' });
  }

  try {
    // 构建新门店数据
    const newStoreData = {
      storeName,
      location,  // 存储原始 key 数组，避免转换为具体名称
      address,
      status,
      role,
      adminId: adminId || '',
      picture: picture || [],
      images: images || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newStore = new Store(newStoreData);
    await newStore.save();

    // 返回成功响应
    res.status(STATUS_CODES.CREATED).send(successResponse(newStore, '门店创建成功'));
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(
      errorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to create store', error.message)
    );
  }
};


// 查询所有门店
export const getStores = async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const size = parseInt(req.query.size as string, 10) || 10; // 每页条数
    const filter = req.query.filter as string; // 筛选条件

    const query: any = {};
    if (filter) {
      query.$or = [
        { storeName: { $regex: filter, $options: 'i' } },
        { location: { $regex: filter, $options: 'i' } },
      ]; // 根据门店名称或地址进行筛选
    }

    const skip = (page - 1) * size;
    const stores = await Store.find(query).skip(skip).limit(size);
    const total = await Store.countDocuments(query);

    res.status(STATUS_CODES.OK).send(successResponse({
      data: stores,
      total,
      page,
      size,
    }, '门店查询成功'));
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(errorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to fetch stores', error.message));
  }
};

// 根据ID查询门店
export const getStoreById = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const store = await Store.findById(id);
    if (!store) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: '门店未找到' });
    }
    res.status(STATUS_CODES.OK).send(successResponse(store, '门店查询成功'));
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(errorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to fetch store', error.message));
  }
};

// 更新门店
export const updateStore = async (req: any, res: any) => {
  const { id } = req.params;
  const { storeName, location, status, picture, images,address,role } = req.body;
  if (!location || !Array.isArray(location) || location.length !== 3) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: '地址格式错误' });
  }
  // 校验必填字段
  if (!storeName || typeof storeName !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请输入门店名称' });
  }
  if (!address || typeof address !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请输入详细地址' });
  }
  if (!status || !['start', 'forbid', 'postpone'].includes(status)) {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请选择有效的状态' });
  }
  if (!role || typeof role !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请选择门店权限' });
  }
  try {
    const updatedStore = await Store.findByIdAndUpdate(
      id,
      { storeName, location, status, picture, images, updatedAt: new Date(),role,address },
      { new: true, runValidators: true }
    );

    if (!updatedStore) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: '门店未找到' });
    }

    res.status(STATUS_CODES.OK).send(successResponse(updatedStore, '门店更新成功'));
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(errorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to update store', error.message));
  }
};

// 删除门店
export const deleteStore = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const deletedStore = await Store.findByIdAndDelete(id);
    if (!deletedStore) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: '门店未找到' });
    }
    res.status(STATUS_CODES.OK).send(successResponse(deletedStore, '门店删除成功'));
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(errorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to delete store', error.message));
  }
};
