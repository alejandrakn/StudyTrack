import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getCourseById, updateCourse } = useCourses()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 0,
    grade: 0,
    status: 'EN_CURSO' as 'EN_CURSO' | 'APROBADO' | 'DESAPROBADO',
  })

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return
      try {
        const course = await getCourseById(parseInt(id))
        setFormData({
          name: course.name,
          code: course.code,
          credits: course.credits,
          grade: course.grade,
          status: course.status,
        })
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Curso no encontrado')
        } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          setError('Servidor no disponible')
        } else {
          setError('Error al cargar el curso')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setError('')
    setSaving(true)

    try {
      await updateCourse(parseInt(id), formData)
      navigate('/dashboard')
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Datos inválidos. Verifique la información.')
      } else if (err.response?.status === 404) {
        setError('Curso no encontrado')
      } else if (err.response?.status === 500) {
        setError('Error interno del servidor.')
      } else {
        setError('Error al actualizar el curso')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Cargando curso...</div>
      </div>
    )
  }

  if (error && !formData.name) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Volver al Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Curso</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Curso *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Código *
          </label>
          <input
            id="code"
            name="code"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.code}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div>
          <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
            Créditos
          </label>
          <input
            id="credits"
            name="credits"
            type="number"
            min="0"
            max="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.credits}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
            Nota (0-20)
          </label>
          <input
            id="grade"
            name="grade"
            type="number"
            min="0"
            max="20"
            step="0.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.grade}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="status"
            name="status"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.status}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="EN_CURSO">En Curso</option>
            <option value="APROBADO">Aprobado</option>
            <option value="DESAPROBADO">Desaprobado</option>
          </select>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default CourseDetail