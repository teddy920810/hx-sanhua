// import { login, logout, getInfo } from '@/api/user-rest'
import { login, refreshToken } from '@/api/user-rest'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, setRoles, removeRoles, setUserInfo, removeUserInfo, getUserInfo } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from '@/store'

const state = {
  token: getToken(),
  id: '',
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  refreshToken: getRefreshToken(),
  userinfo: getUserInfo()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo = userinfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ name: username.trim(), password: password }).then(response => {
        console.log(response)
        const { body } = response
        const { accessToken, refreshToken, expireDate } = body
        commit('SET_TOKEN', accessToken)
        commit('SET_REFRESH_TOKEN', refreshToken)
        commit('SET_USERINFO', body)
        commit('SET_ROLES', ['admin'])
        setToken(accessToken, expireDate)
        setRefreshToken(refreshToken)
        setRoles(['admin'])
        setUserInfo(body)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // refresh token
  refreshToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      refreshToken({ id: state.userinfo.id, token: state.refreshToken }).then(response => {
        console.log(response)
        const { body } = response
        const { accessToken, refreshToken, expireDate } = body
        commit('SET_TOKEN', accessToken, expireDate)
        commit('SET_REFRESH_TOKEN', refreshToken)
        setToken(accessToken)
        setRefreshToken(refreshToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      /* getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })*/
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    commit('SET_REFRESH_TOKEN', '')
    commit('SET_USERINFO', '')
    removeToken()
    removeUserInfo()
    removeRoles()
    resetRouter()
    // reset visited views and cached views
    // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    dispatch('tagsView/delAllViews', null, { root: true })
    /* return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_USERINFO', '')
        removeToken()
        removeUserInfo()
        removeRoles()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })*/
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeRoles()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
