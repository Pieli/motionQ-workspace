FROM golang:1.24.5-alpine AS dependencies
RUN apk --update add ca-certificates make

WORKDIR /build
COPY backend/ ./backend/
COPY shared/ ./shared/

WORKDIR backend
RUN go mod download

FROM dependencies AS builder
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64
RUN make build

FROM scratch AS production
COPY --from=dependencies /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder ["/build/backend/http-server", "/http-server"]
ENV GO_ENV=production
CMD ["/http-server"]
