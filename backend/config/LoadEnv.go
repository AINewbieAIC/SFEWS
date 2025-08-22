package config

import (
	"github.com/joho/godotenv"
)

func LoadEnv() error {
	// dirNow, err := os.Getwd()
	// if err != nil {
	// 	return err
	// }

	// parentFolder := filepath.Dir(dirNow)
	// envPath := filepath.Join(parentFolder, ".env")

	err := godotenv.Load(".env")
	return err
}
