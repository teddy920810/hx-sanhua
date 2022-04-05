import Cookies from 'js-cookie'

const TokenKey = 'AccessToken'
const RefreshToken = 'RefreshToken'
const Roles = 'Roles'
const UserInfo = 'UserInfo'
const ExpireDate = 'expireDate'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expireDate) {
  const in120Minutes = expireDate || new Date(new Date().getTime() + 120 * 60 * 1000)
  Cookies.set(ExpireDate, in120Minutes.getTime())
  return Cookies.set(TokenKey, token, { expires: in120Minutes })
}

export function removeToken() {
  Cookies.remove(ExpireDate)
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshToken)
}

export function setRefreshToken(token) {
  const in120Minutes = new Date(new Date().getTime() + 120 * 60 * 1000)
  return Cookies.set(RefreshToken, token, { expires: in120Minutes })
}

export function needRefresh() {
  if (Cookies.get(ExpireDate)) {
    const s = (Number.parseInt(Cookies.get(ExpireDate)) - new Date().getTime()) / 1000
    return s < 1800 && getToken()
  }
}

export function setRoles(roles) {
  return Cookies.set(Roles, JSON.stringify(roles))
}

export function removeRoles() {
  return Cookies.remove(Roles)
}

export function setUserInfo(info) {
  return Cookies.set(UserInfo, JSON.stringify(info))
}

export function getUserInfo() {
  return Cookies.get(UserInfo) ? JSON.parse(Cookies.get(UserInfo)) : ''
}

export function removeUserInfo() {
  return Cookies.remove(UserInfo)
}
