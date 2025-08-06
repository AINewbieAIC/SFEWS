package routes

import (
	"sfews-backend/controllers"
	"sfews-backend/databases"
	"sfews-backend/repositories"
	"sfews-backend/services"

	"github.com/gin-gonic/gin"
)

func SensorRoutes(r *gin.RouterGroup) {
	sensorRepos := repositories.NewSensorRepo(databases.DB)
	sensorServices := services.NewSensorService(*sensorRepos)
	sensorControllers := controllers.NewSensorController(*sensorServices)

}
