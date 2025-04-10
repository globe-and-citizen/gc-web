# gc-web

This template should help get you started developing with Vue 3 in Vite.

## Project Setup

1. Add .env file (in the root directory of repository) for the website: 

```sh
VITE_BACKEND_URL=http://localhost:8000
VITE_PROXY_URL=http://localhost:5001
```

2. Add .env file (in the backend folder) for the backend:

```sh
LAYER8_CLIENT_ID=
LAYER8_CLIENT_SECRET=
LAYER8_URL=http://localhost:5001
OAUTH_JWT_SECRET_KEY=secret
OAUTH2_CALLBACK_URL=http://localhost:5173/oauth2/callback
```

**Note:** Make sure you have the layer8 running on localhost:5001 [For this, clone the layer8 Repository here: https://github.com/globe-and-citizen/layer8, switch to development branch and just use `make setup_and_run`, and before running this command,make sure Docker is running]

3. Install Dependencies

```sh
make install
```

4. Run Frontend

```sh
make run-frontend
```


5. Run Backend 

```sh
make build_backend_image
make run_backend_image
```

