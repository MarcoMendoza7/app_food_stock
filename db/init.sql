-- 1. Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- 2. Crear tabla de alimentos
CREATE TABLE IF NOT EXISTS alimentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    categoria VARCHAR(50) NOT NULL,
    caducidad DATE NOT NULL
);

-- 3. Crear tabla de movimientos
CREATE TABLE IF NOT EXISTS movimientos (
    id SERIAL PRIMARY KEY,
    producto VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- 'ENTRADA' o 'SALIDA'
    cantidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Insertar las credenciales (Tu Admin original + Tu nuevo Voluntario)
INSERT INTO usuarios (username, password, role) VALUES
('admin_comedor', 'admin123', 'Administrador'),
('voluntario_comedor', 'voluntario123', 'Voluntario')
ON CONFLICT (username) DO NOTHING;

-- 5. Opcional: Datos semilla para que el Dashboard no aparezca en 0
INSERT INTO alimentos (nombre, cantidad, categoria, caducidad) VALUES
('Arroz Precocido 1kg', 40, 'Legumbres y Cereales', '2026-12-15'),
('Leche Entera 1L', 120, 'Lácteos', '2026-06-20')
ON CONFLICT DO NOTHING;