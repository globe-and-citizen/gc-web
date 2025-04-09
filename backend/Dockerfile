FROM rust AS builder

RUN apt-get update && apt-get install -y cmake
RUN git clone https://github.com/globe-and-citizen/layer8-middleware-rs.git
RUN cargo install --path layer8-middleware-rs/cli


# TODO: @osoro We need to get this back to `alpine:3` because of the size of the image is ~500mb and we can get to ~100mb with alpine
FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

COPY --from=builder /usr/local/cargo/bin/cli /usr/local/bin/reverse_proxy
COPY . ./app
WORKDIR /app
RUN rm -rf package-lock.json node_modules
RUN npm install -g npm && npm i -D ts-node typescript

# npm install is also do ne here in case we want to make upgrade without rebuilding the image
RUN echo '#!/bin/bash\n\
reverse_proxy start --service-port 3000 --port 8000 -d &\n\
npm install && npm run start' > docker-run.sh && chmod +x docker-run.sh

EXPOSE 8000

CMD ["/app/docker-run.sh"]
