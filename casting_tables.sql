CREATE TABLE actors (
    id INT PRIMARY KEY,
    ident_code VARCHAR(50) UNIQUE,
    act_name VARCHAR(100) NOT NULL,
    act_surname VARCHAR(100) NOT NULL,
    birth_year INT,
    nationality VARCHAR(100),
    gender VARCHAR(50),
    height_cm INT,  
    weight_kg INT, 
    suite_size VARCHAR(20),
    shirt_size VARCHAR(20),
    boot_size VARCHAR(10),
    breast_size VARCHAR(20),
    waist_size VARCHAR(20),
    hips_size VARCHAR(20),
    head_circ VARCHAR(20), 
    eyes_color VARCHAR(50),
    hair_color VARCHAR(50),
    skin_color VARCHAR(50),
    home_address TEXT,
    home_phone VARCHAR(50),
    temp_address VARCHAR(50),
    empl_address TEXT,
    empl_phone VARCHAR(50),
    email VARCHAR(255),
    www VARCHAR(255), 
    agency VARCHAR(255),
    family VARCHAR(50),
    status_code VARCHAR(10),  
    self_register BOOLEAN DEFAULT FALSE,
    date_insert TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modif TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    date_cast TIMESTAMP,
    date_update TIMESTAMP,
    date_death TIMESTAMP 
);

CREATE TABLE actor_attributes (
    actor_id INT REFERENCES actors(id) ON DELETE CASCADE,
    actor BOOLEAN DEFAULT FALSE,
    amateur BOOLEAN DEFAULT FALSE,
    gdpr BOOLEAN VALUE FALSE,
    model BOOLEAN DEFAULT FALSE,
    stunt BOOLEAN DEFAULT FALSE,
    artist BOOLEAN DEFAULT FALSE,
    musician BOOLEAN DEFAULT FALSE,
    singer BOOLEAN DEFAULT FALSE,
    dancer BOOLEAN DEFAULT FALSE,
    episode BOOLEAN DEFAULT FALSE,
    foreigner BOOLEAN DEFAULT FALSE,
    abroad BOOLEAN DEFAULT FALSE,
    extras BOOLEAN DEFAULT FALSE,
    kompars BOOLEAN DEFAULT FALSE,
    reliable BOOLEAN DEFAULT FALSE,
    problem BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (actor_id)
);

CREATE TABLE actor_notes (
    id SERIAL PRIMARY KEY,
    actor_id INT REFERENCES actors(id) ON DELETE CASCADE,
    note TEXT,
);

CREATE TABLE experience (
    actor_id INT REFERENCES actors(id) ON DELETE CASCADE,
    experience TEXT, 
    education TEXT
);

CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    lang_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE nationality (
    id SERIAL PRIMARY KEY,
    nationality_name VARCHAR(100) UNIQUE NOT NULL 
)

CREATE TABLE actor_languages (
    actor_id INT REFERENCES actors(id) ON DELETE CASCADE,
    language_id INT REFERENCES languages(id) ON DELETE CASCADE,
    lang_perfect VARCHAR(50),
    lang_nat VARCHAR(50),
    lang_active VARCHAR(50),
    lang_pasive VARCHAR(50),
    lang_note TEXT,
    PRIMARY KEY (actor_id, language_id)
);

CREATE TABLE driving_licenses (
    actor_id INT REFERENCES actors(id) ON DELETE CASCADE,
    drive_licence VARCHAR(50), 
);

CREATE TABLE actor_skills (
    actor_id INT REFERENCES actors(id) ON DELETE CASCADE,
    skill TEXT
);

CREATE TABLE actor_marks (
    actor_id INT REFERENCES actors(id) ON DELETE CASCADE,          
    mark TEXT
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    actor_id INT REFERENCES actors(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    image_count VARCHAR(20),
    video_count VARCHAR(20)
);



