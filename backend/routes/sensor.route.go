package routes

import (
	"sfews-backend/controllers"
	"sfews-backend/repositories"
	"sfews-backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SensorRoutes(db *gorm.DB, r *gin.RouterGroup) {
	sensorRepos := repositories.NewSensorRepo(db)
	sensorServices := services.NewSensorService(*sensorRepos)
	sensorControllers := controllers.NewSensorController(*sensorServices)

	r.GET("/rain", sensorControllers.GetRain)
}
