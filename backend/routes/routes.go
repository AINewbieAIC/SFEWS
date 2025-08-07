package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func MapRoutes(db *gorm.DB, route *gin.Engine) {
	api := route.Group("api")
	SensorRoutes(db, api)
}
