# Trackademic

Trackademic es una plataforma para la gestión académica, que permite a estudiantes, profesores y administradores gestionar planes de evaluación, notas, materias y reportes académicos. Combina bases de datos relacionales y documentales para ofrecer un sistema flexible, eficiente y escalable.

---

## Descripción

Trackademic es una aplicación backend construida con FastAPI que facilita la gestión de planes de evaluación, notas y materias en un entorno académico. Usa MongoDB para manejar planes de evaluación y PostgreSQL para la información relacional, integrando ambas bases de datos para ofrecer funcionalidades robustas y escalables.

---

## Tecnologías

El proyecto utiliza las siguientes tecnologías y librerías principales:

- **Python 3.11+**  
- **FastAPI**: Framework web rápido para construir APIs REST  
- **Uvicorn**: Servidor ASGI para ejecutar la app FastAPI  
- **MongoDB**: Base de datos documental para almacenar planes de evaluación y datos semi-estructurados  
- **PostgreSQL**: Base de datos relacional para manejar usuarios, materias, y datos normalizados  
- **SQLAlchemy**: ORM para PostgreSQL  
- **Pydantic**: Validación y definición de modelos de datos  
- **PassLib (bcrypt)**: Hashing seguro para contraseñas  
- **python-dotenv**: Manejo de variables de entorno  
- **HTTPX y Starlette**: Clientes HTTP y soporte ASGI  
- **Otros**: Typing Extensions, Rich para logs, etc.

Para ver la lista completa de dependencias consulta `requirements.txt`.

---

## Características principales

- Registro y autenticación segura de usuarios con hashing de contraseñas  
- Gestión de planes de evaluación: creación, consulta, actualización y eliminación  
- Administración de actividades y comentarios en planes de evaluación  
- Consulta de notas consolidadas y reportes académicos personalizados  
- Integración con bases de datos relacional (PostgreSQL) y documental (MongoDB)  
- Arquitectura modular con routers y servicios para escalabilidad y mantenimiento  
- Documentación automática de API mediante FastAPI  

---

## Requisitos

- Python 3.11 o superior  
- MongoDB 4.4+ corriendo localmente o remotamente  
- PostgreSQL 12+ configurado y accesible  
- Acceso para instalar paquetes con pip  
- Entorno virtual recomendado (venv)

---

## Instalación

1. Clonar repositorio:

```bash
git clone https://github.com/usuario/trackademic.git
cd trackademic/trackademic-backend
```

2. Crear y activar entorno virtual:

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate   # Windows
```

3. Instalar dependencias:

```bash
pip install -r requirements.txt
```
---

## Ejecución

Para iniciar el servidor localmente:

```bash
uvicorn src.main:app --reload
```

Accede a la documentación automática en:

```
http://localhost:8000/docs
```

---

## Estructura del proyecto

```
trackademic-backend/
├── src/
│   ├── main.py                  # Punto de entrada de la aplicación
│   ├── db/                     # Configuraciones de bases de datos (MongoDB, PostgreSQL)
│   ├── models/                 # Modelos Pydantic y ORM
│   ├── routers/                # Rutas API organizadas por funcionalidades (auth, plans, reports, etc.)
│   ├── services/               # Lógica de negocio y acceso a datos
│   ├── sql/                    # Scripts y consultas SQL específicas
│   └── __init__.py
├── test/                       # Pruebas unitarias y de integración
├── .env                       # Variables de entorno (no subir a repositorio)
├── requirements.txt            # Dependencias Python
└── README.md                   # Documentación del backend
```

---

## API Endpoints principales

- **Autenticación:**  
  `POST /auth/register` - Registro  
  `POST /auth/login` - Login  

- **Planes de Evaluación:**  
  `GET /plans/` - Listar planes  
  `GET /plans/{semester}/{subject_code}/{student_id}` - Plan específico  
  `POST /plans/` - Crear plan  
  `POST /plans/{plan_id}/comments` - Agregar comentario  
  `PUT /plans/{semester}/{subject_code}/{student_id}/activities` - Actualizar actividades  

- **Reportes:**  
  `GET /reports/grades-consolidation/{student_id}/{semester}`  
  `GET /reports/comments/{student_id}`  
  `GET /reports/percentages/{semester}`  

- **Universidad:**  
  `GET /university/` - Información de facultades, áreas, programas y materias

  ## Flujo de la Aplicación

1. **Registro y Login:**  
   El usuario se registra (`POST /auth/register`) y luego inicia sesión (`POST /auth/login`), recibiendo un token JWT para autenticarse.

2. **Gestión de Planes:**  
   Consulta planes (`GET /plans/`), crea nuevos (`POST /plans/`), agrega comentarios y actualiza actividades.

3. **Reportes Académicos:**  
   Solicita consolidación de notas y reportes de comentarios y porcentajes de actividades.

4. **Información Universitaria:**  
   Consulta facultades, áreas, programas y materias (`GET /university/`).
