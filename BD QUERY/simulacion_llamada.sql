CREATE DATABASE IF NOT EXISTS simulacion_llamada;
USE simulacion_llamada;
CREATE TABLE llamadas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numeroTelef_marcado VARCHAR(20) NOT NULL,
  interlocutor1 VARCHAR(50) NOT NULL,
  interlocutor2 VARCHAR(50) NOT NULL,
  hora TIME NOT NULL,
  fecha DATE NOT NULL
) ;