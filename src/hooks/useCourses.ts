import { useState, useCallback } from 'react'
import apiClient from '../api/client'
import { Course, CourseRequest, PaginatedResponse } from '../types'

 const handleApiError = (error: any): string => {
  if (!error) return 'Ocurrió un error desconocido.'
  
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Servidor no disponible. Verifique su conexión a internet.'
  }
  
  if (!error.response) {
    return 'Error de conexión. No se pudo contactar con el servidor.'
  }

  const status = error.response.status
  const data = error.response.data

  if (typeof data === 'string') return data
  if (data?.message) return data.message

  switch (status) {
    case 400:
      return 'Datos inválidos. Verifique la información ingresada.'
    case 401:
      return 'Sesión expirada. Por favor, inicie sesión nuevamente.'
    case 404:
      return 'El recurso solicitado no existe.'
    case 409:
      return 'El recurso ya existe.'
    case 500:
      return 'Error interno del servidor.'
    default:
      return data?.message || 'Ocurrió un error inesperado.'
  }
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  })

  const fetchCourses = useCallback(async (page: number = 0, size: number = 10) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<PaginatedResponse<Course>>('/courses', {
        params: { page, size },
      })
      const data = response.data
      setCourses(data.content || [])
      setPagination({
        currentPage: data.number || 0,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
        pageSize: data.size || size,
      })
    } catch (err: any) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const createCourse = async (courseData: CourseRequest): Promise<Course> => {
    setError(null)
    try {
      const response = await apiClient.post<Course>('/courses', courseData)
      return response.data
    } catch (err: any) {
      const errorMsg = handleApiError(err)
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  const updateCourse = async (id: number, courseData: CourseRequest): Promise<Course> => {
    setError(null)
    try {
      const response = await apiClient.put<Course>(`/courses/${id}`, courseData)
      return response.data
    } catch (err: any) {
      const errorMsg = handleApiError(err)
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  const deleteCourse = async (id: number): Promise<void> => {
    setError(null)
    try {
      await apiClient.delete(`/courses/${id}`)
    } catch (err: any) {
      const errorMsg = handleApiError(err)
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  const getCourseById = async (id: number): Promise<Course> => {
    setError(null)
    try {
      const response = await apiClient.get<Course>(`/courses/${id}`)
      return response.data
    } catch (err: any) {
      const errorMsg = handleApiError(err)
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  return {
    courses,
    loading,
    error,
    pagination,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
  }
}