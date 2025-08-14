package routes

import (
	"sfews-backend/controllers"

	"github.com/gin-gonic/gin"
)

type Routes struct {
	Route            *gin.Engine
	SensorController controllers.SensorController
}

func (r *Routes) MapRoutes() {
	api := r.Route.Group("api")
	r.SensorRoutes(api)
}
