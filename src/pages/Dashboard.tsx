import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'
import CourseCard from '../components/CourseCard'
import Pagination from '../components/Pagination'

const Dashboard = () => {
  const { courses, loading, error, pagination, fetchCourses, deleteCourse } = useCourses()
  const [page, setPage] = useState(0)

  useEffect(() => {
    fetchCourses(page, 10)
  }, [page])

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este curso?')) {
      try {
        await deleteCourse(id)
        await fetchCourses(page, 10)
      } catch (err) {
        console.error('Error deleting course:', err)
      }
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  if (loading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Cargando cursos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
        <Link
          to="/courses/new"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Nuevo Curso
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {courses.length === 0 && !loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">No tienes cursos registrados</p>
          <Link
            to="/courses/new"
            className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Crear tu primer curso
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}

export default Dashboard