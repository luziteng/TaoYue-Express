// 定义 JSON 数据的类型结构
interface RegionData {
  [key: string]: string | RegionData;
}

// 导入 JSON 数据并指定类型
import rawData from '../assets/chinaRegions.json';
const regionsData: RegionData = rawData;

// 根据省、市、区代码获取完整地址
export function getAddressFromCodes(codes: string[]): string {
  const [provinceCode, cityCode, districtCode] = codes;

  const province = (regionsData["86"] as RegionData)?.[provinceCode] as string;
  const city = (regionsData[provinceCode] as RegionData)?.[cityCode] as string;
  const district = (regionsData[cityCode] as RegionData)?.[districtCode] as string;

  return `${province || ""}${city || ""}${district || ""}`;
}
