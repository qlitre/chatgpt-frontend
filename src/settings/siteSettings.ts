let _baseUrl = 'http://localhost:8000/api'
if (process.env.NODE_ENV === 'Production') {
    _baseUrl = process.env.API_BASE
}
export const AUTH_BASE_URL = _baseUrl + '/auth/'
export const CHAT_BASE_URL = _baseUrl + '/chat/'