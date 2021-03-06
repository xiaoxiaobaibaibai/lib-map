import state from './state'

const mutations = {
  setKeyword(state, value) {
    this.state.keyword = value
  },
  setCompanyConfig(state, value) {
    this.state.companyConfig = value
  },
  setCompanyMap(state, value) {
    this.state.companyMap = value
  }
}

export default mutations
