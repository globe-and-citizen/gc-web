.PHONY: app

install:
	npm install && npm install layer8_interceptor && cd backend && npm install && npm install layer8_middleware && cd ..

run-backend:
	cd backend && npm run start

run-frontend:
	npm run dev

build_backend_image:
	cd backend && docker build --tag backend_image --file Dockerfile .

run_backend_image:
	docker run -p 3000:3000 -t backend_image

build_frontend_image:
	docker build --tag frontend_image --file Dockerfile .\

run_frontend_image:
	docker run -p 5173:5173 -t frontend_image

push_frontend_image:
	aws lightsail push-container-image --region ca-central-1 --service-name container-service-2 --label gcwebfrontendv1 --image frontend_image:latest

push_backend_image:
	aws lightsail push-container-image --region ca-central-1 --service-name container-service-3 --label gcwebbackendv1 --image backend_image:latest