import {
  getCompanyApi
} from "@/api/api";

const actions = {
  // 企业地图公司列表
  getCompany ({commit}, params) {
    return getCompanyApi(params)
  }
}
export default actions
