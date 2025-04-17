-- Tipo ENUM para imágenes de perfil
CREATE TYPE profile_imgs AS ENUM ('', 'img1', 'img2');

-- Tabla de ligas
CREATE TABLE leagues (
    min_sudokoins INTEGER NOT NULL,
    tier VARCHAR(50) PRIMARY KEY
);

-- Datos iniciales de ligas
INSERT INTO leagues (min_sudokoins, tier) VALUES 
(0, 'Cola de lagarto'),
(15, 'Lagartija visitante'),
(35, 'Lagarto jubilado'),
(75, 'Lagarto fornido'),
(100, 'Lagarto sumo'),
(250, 'Lagarto presidente'),
(400, 'Godzilla');

-- Tabla de usuarios optimizada
CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    pwd VARCHAR(255) NOT NULL,
    profile_img profile_imgs DEFAULT '',
    league VARCHAR(50) NOT NULL REFERENCES leagues(tier),
    sudokoins INTEGER DEFAULT 0 CHECK (sudokoins >= 0),
    total_wins INTEGER DEFAULT 0 CHECK (total_wins >= 0),
    easy_wins INTEGER DEFAULT 0 CHECK (easy_wins >= 0),
    medium_wins INTEGER DEFAULT 0 CHECK (medium_wins >= 0),
    hard_wins INTEGER DEFAULT 0 CHECK (hard_wins >= 0),
    total_played INTEGER DEFAULT 0 CHECK (total_played >= 0)
);

-- Comentarios para documentación
COMMENT ON TABLE leagues IS 'Sistema de ligas basado en sudokoins acumulados';
COMMENT ON TABLE users IS 'Almacena información de usuarios y su progreso en el juego';
COMMENT ON COLUMN users.league IS 'Liga actual basada en sudokoins (referencia a leagues.tier)';
COMMENT ON COLUMN users.sudokoins IS 'Moneda virtual ganada al completar sudokus';

-- Función simplificada para el trigger (solo actualiza la liga)
CREATE OR REPLACE FUNCTION update_user_league()
RETURNS TRIGGER AS $$
BEGIN
    -- Determinar la nueva liga basada en sudokoins
    NEW.league := (
        SELECT tier FROM leagues 
        WHERE min_sudokoins <= NEW.sudokoins 
        ORDER BY min_sudokoins DESC 
        LIMIT 1
    );
    
    -- Log de cambios de liga
    IF TG_OP = 'UPDATE' AND OLD.league IS DISTINCT FROM NEW.league THEN
        RAISE NOTICE 'Usuario % cambió de liga: "%" (sudokoins: %) -> "%" (sudokoins: %)', 
            NEW.email, OLD.league, OLD.sudokoins, NEW.league, NEW.sudokoins;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers actualizados
CREATE TRIGGER trg_update_league
BEFORE UPDATE OF sudokoins ON users
FOR EACH ROW
WHEN (OLD.sudokoins IS DISTINCT FROM NEW.sudokoins)
EXECUTE FUNCTION update_user_league();

CREATE TRIGGER trg_insert_league
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION update_user_league();