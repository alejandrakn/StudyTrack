 export const handleApiError = (error: any): string => {
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

   if (data?.error) return data.error

  switch (status) {
    case 400:
      return 'Datos inválidos. Verifique la información ingresada.'
    case 401:
      return 'Sesión expirada. Por favor, inicie sesión nuevamente.'
    case 403:
      return 'No tiene permisos para realizar esta acción.'
    case 404:
      return 'El recurso solicitado no existe.'
    case 409:
      return 'Conflicto: El recurso ya existe.'
    case 500:
      return 'Error interno del servidor. Por favor, intente más tarde.'
    default:
      return data?.message || 'Ocurrió un error inesperado.'
  }
}

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false
  
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    const payload = JSON.parse(atob(parts[1]))
    const exp = payload.exp
    
    if (!exp) return true
    
    const now = Math.floor(Date.now() / 1000)
    return now < exp
  } catch {
    return false
  }
}