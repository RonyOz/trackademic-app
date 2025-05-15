-- Script para insertar datos de prueba en la base de datos. Ajustado a la estructura de la base de datos. Nombres acortados para evitar errores de longitud.
-- dependencias circulares entre Employees y Faculties. Primero se insertan las facultades con dean_id = NULL y luego los empleados, luego se actualizan las facultades con los ids de los decanos.

-- Insert Countries (no tiene dependencias)
INSERT INTO COUNTRIES (code, name) VALUES
(1, 'Colombia');

-- Insert Departments (depende de Countries)
INSERT INTO DEPARTMENTS (code, name, country_code) VALUES
(1, 'Valle del Cauca', 1),
(2, 'Cundinamarca', 1),
(5, 'Antioquia', 1),
(8, 'Atlántico', 1),
(11, 'Bogotá D.C.', 1);

-- Insert Cities (depende de Departments)
INSERT INTO CITIES (code, name, dept_code) VALUES
(101, 'Cali', 1),
(102, 'Bogotá', 11),
(103, 'Medellín', 5),
(104, 'Barranquilla', 8),
(105, 'Barranquilla', 8);

-- Insert Campuses (depende de Cities)
INSERT INTO CAMPUSES (code, name, city_code) VALUES
(1, 'Campus Cali', 101),
(2, 'Campus Bogotá', 102),
(3, 'Campus Medellín', 103),
(4, 'Campus Barranquilla', 104);

-- Insert Employee Types (no tiene dependencias)
INSERT INTO EMPLOYEE_TYPES (name) VALUES
('Docente'),
('Administrativo');

-- Insert Contract Types (no tiene dependencias)
INSERT INTO CONTRACT_TYPES (name) VALUES
('Planta'),
('Cátedra');

-- Insert Faculties
INSERT INTO FACULTIES (code, name, location, phone_number, dean_id) VALUES
(1, 'Ciencias Sociales', 'Cali', '555-1234', NULL), -- Nombre acortado
(2, 'Ingeniería', 'Cali', '555-5678', NULL); -- Nombre acortado

-- insert Employees
INSERT INTO EMPLOYEES (id, first_name, last_name, email, contract_type, employee_type, faculty_code, campus_code, birth_place_code) VALUES
('1001', 'Juan', 'Pérez', 'juan.perez@univcali.edu.co', 'Planta', 'Docente', 1, 1, 101),
('1002', 'María', 'Gómez', 'maria.gomez@univcali.edu.co', 'Planta', 'Administrativo', 1, 2, 102), -- DECANO
('1003', 'Carlos', 'López', 'carlos.lopez@univcali.edu.co', 'Cátedra', 'Docente', 2, 1, 103),
('1004', 'Carlos', 'Mejía', 'carlos.mejia@univcali.edu.co', 'Planta', 'Docente', 1, 3, 103),
('1005', 'Sandra', 'Ortiz', 'sandra.ortiz@univcali.edu.co', 'Cátedra', 'Docente', 2, 4, 104),
('1006', 'Julián', 'Reyes', 'julian.reyes@univcali.edu.co', 'Planta', 'Administrativo', 2, 1, 105); --DECANO

-- Actualizar Faculties con dean_id válido
UPDATE FACULTIES SET dean_id = '1001' WHERE code = 1;
UPDATE FACULTIES SET dean_id = '1006' WHERE code = 2;

-- Insert Areas (depende de Faculties y Employees)
INSERT INTO AREAS (code, name, faculty_code, coordinator_id) VALUES
(1, 'Ciencias Sociales', 1, '1001'), --  nombre acortado
(2, 'Ingeniería', 2, '1003');  -- nombre acortado

-- Insert Programs (depende de Areas)
INSERT INTO PROGRAMS (code, name, area_code) VALUES
(1, 'Psicología', 1),
(2, 'Ingeniería de Sistemas', 2);

-- Insert Subjects (depende de Programs)
INSERT INTO SUBJECTS (code, name, program_code) VALUES
('S101', 'Psicología General', 1),
('S102', 'Cálculo I', 2),
('S103', 'Programación', 2),
('S104', 'Estructuras de Datos', 2),
('S105', 'Bases de Datos', 2),
('S106', 'Redes de Computadores', 2),
('S107', 'Sistemas Operativos', 2),
('S108', 'Algoritmos Avanzados', 2);

-- Insert Groups (depende de Subjects y Employees)
INSERT INTO GROUPS (number, semester, subject_code, professor_id) VALUES
(1, '2023-2', 'S101', '1001'),
(2, '2023-2', 'S102', '1003'),
(3, '2023-2', 'S103', '1004');