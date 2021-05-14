import Service from "@/api/axios";

// 企业地图公司列表
export const getCompanyApi = (params) => {
  return Service({
    url: '/standardgwapi/api/company_library/map/company_list',
    params
  })
}
