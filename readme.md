# Globe & Citizen website

## Description
This website is presenting the business adventur of Globe & Citizen.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Structure
```bash
├───backend
├───frontend
```

### Backend
The backend is a NodeJS application using ExpressJS as a framework. And serving asset using ipx.

### Frontend
The frontend is a VueJS application. And using TailwindCSS as a CSS framework.

## RUN localy

With docker
### Backend
```sh
docker build -t gc-web-backend ./backend
docker run -p 3000:3000 gc-web-backend
```

### Frontend
```sh
docker build -t gc-web-frontend ./frontend
docker run -p 8080:8080 gc-web-frontend
```

## Contributing
To contribute to this project, please see the [contributing guidelines](CONTRIBUTING.md).

## License
[Specify the project's license]
