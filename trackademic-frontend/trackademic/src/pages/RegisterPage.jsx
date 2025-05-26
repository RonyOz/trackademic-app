import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerRequest } from '../services/api'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await registerRequest(formData)
      setSuccess('Registro exitoso. Puedes iniciar sesión.')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError('Error al registrar. ¿Ya estás registrada?')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="card w-96 bg-base-100 shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
        {error && <div className="text-error mb-2">{error}</div>}
        {success && <div className="text-success mb-2">{success}</div>}
        <input
          type="text"
          name="id"
          placeholder="Número de documento"
          className="input input-bordered w-full mb-2"
          value={formData.id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="full_name"
          placeholder="Nombre completo"
          className="input input-bordered w-full mb-2"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="input input-bordered w-full mb-2"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="input input-bordered w-full mb-4"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-secondary w-full">Crear cuenta</button>
      </form>
    </div>
  )
}

export default RegisterPage
