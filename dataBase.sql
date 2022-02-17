create TABLE users (
id SERIAL PRIMARY KEY,
name VARCHAR(255),
email VARCHAR(255) unique: true,
dateRegistration VARCHAR(255),
dateLastAuthorization VARCHAR(255),
password VARCHAR(255),
role VARCHAR(255)
);