-- Esquema de la base de datos de TaskHub
-- Ejecutar sobre una base de datos vacía (ej: CREATE DATABASE taskhub;)

-- Usuarios: cuentas registradas en la aplicación.
CREATE TABLE usuarios (
  id              SERIAL          PRIMARY KEY,
  email           VARCHAR(255)    NOT NULL UNIQUE,
  password_hash   VARCHAR(255)    NOT NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Listas: agrupaciones de tareas que pertenecen a un usuario (1:N).
CREATE TABLE listas (
  id            SERIAL          PRIMARY KEY,
  nombre        VARCHAR(255)    NOT NULL,
  usuario_id    INTEGER         NOT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);

-- Tareas: ítems dentro de una lista (1:N), con prioridad y fecha límite.
CREATE TABLE tareas (
  id              SERIAL          PRIMARY KEY,
  lista_id        INTEGER         NOT NULL,
  titulo          VARCHAR(255)    NOT NULL,
  descripcion     TEXT,
  prioridad       VARCHAR(10)     NOT NULL DEFAULT 'media'
                  CHECK (prioridad IN ('alta', 'media', 'baja')),
  fecha_limite    TIMESTAMP,
  completada      BOOLEAN         NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_lista
    FOREIGN KEY (lista_id)
    REFERENCES listas(id)
    ON DELETE CASCADE
);
