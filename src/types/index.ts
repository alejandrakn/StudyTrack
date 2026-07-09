export interface User {
  id?: number
  username: string
  email: string
  fullName: string
}

export interface Course {
  id: number
  name: string
  code: string
  credits: number
  grade: number
  status: 'EN_CURSO' | 'APROBADO' | 'DESAPROBADO'
}

export interface CourseRequest {
  name: string
  code: string
  credits: number
  grade: number
  status: 'EN_CURSO' | 'APROBADO' | 'DESAPROBADO'
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface Pageable {
  page: number
  size: number
}