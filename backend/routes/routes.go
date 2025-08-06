package routes

import "github.com/gin-gonic/gin"

func MapRoutes(route *gin.Engine) {
	api := route.Group("api")
	SensorRoutes(api)
}
