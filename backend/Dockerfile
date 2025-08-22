# Gunakan base image golang
FROM golang:1.23-alpine AS builder

# Set environment
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main main.go

FROM alpine:3.19

WORKDIR /app

COPY --from=builder /app/main .

COPY ./config ./config

ENV GIN_MODE=release \
    APP_ENV=production

EXPOSE 8080

CMD ["./main"]