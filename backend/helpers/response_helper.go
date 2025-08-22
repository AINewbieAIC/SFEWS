package helpers

import (
	"encoding/json"

	"github.com/gin-gonic/gin"
)

func ResponseJson(ctx *gin.Context, statusCode int, status bool, data any, message string) {
	ctx.JSON(statusCode, gin.H{
		"status":  status,
		"data":    data,
		"message": message,
	})
}

func ToJSON(v any) string {
	b, _ := json.Marshal(v)
	return string(b)
}
