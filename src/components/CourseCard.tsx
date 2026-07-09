import { Link } from 'react-router-dom'
import { Course } from '../types'

interface CourseCardProps {
  course: Course
  onDelete: (id: number) => void
}

const CourseCard = ({ course, onDelete }: CourseCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROBADO':
        return 'bg-green-100 text-green-800'
      case 'EN_CURSO':
        return 'bg-blue-100 text-blue-800'
      case 'DESAPROBADO':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APROBADO':
        return 'Aprobado'
      case 'EN_CURSO':
        return 'En Curso'
      case 'DESAPROBADO':
        return 'Desaprobado'
      default:
        return status
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
          <p className="text-sm text-gray-600">Código: {course.code}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
          {getStatusLabel(course.status)}
        </span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600">Créditos: {course.credits}</p>
          <p className="text-sm text-gray-600">Nota: {course.grade.toFixed(1)}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Link
          to={`/courses/${course.id}`}
          className="flex-1 px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Editar
        </Link>
        <button
          onClick={() => onDelete(course.id)}
          className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export default CourseCard