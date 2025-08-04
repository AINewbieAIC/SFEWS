package main

import (
	"os"
	"path/filepath"
	"sfews-backend/config"
	"testing"
)

func TestGetFile(t *testing.T) {
	dirNow, err := os.Getwd()
	if err != nil {
		t.Fatalf("failed to get wd() : %v", err)
	}

	parentFolder := filepath.Dir(dirNow)
	t.Log(parentFolder)
}

func TestGetEnv(t *testing.T) {
	if err := config.LoadEnv(); err != nil {
		t.Fatalf("failed to get env : %v", err)
	}

	t.Log(os.Getenv("MQTT_PORT"))
}
