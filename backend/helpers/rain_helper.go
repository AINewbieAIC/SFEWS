package helpers

import (
	"fmt"
	"sfews-backend/models"
)

func RainToText(status int) string {
	var message string

	switch status {
	case 0:
		message = "Tidak Hujan"
	case 1:
		message = "Gerimis"
	case 2:
		message = "Sedang"
	case 3:
		message = "Deras"
	}

	return message
}

func SetType(alert int) string {
	var tipe string

	switch alert {
	case -2:
		tipe = "nihil"
	case -1:
		tipe = "error"
	case 0:
		tipe = "success"
	case 1:
		tipe = "warning"
	case 2:
		tipe = "danger"
	}

	return tipe

}

func SetMessage(rain models.Rain) string {
	var message string

	switch rain.AlertLevel {
	case -2:
		message = "Data Nihil"
	case -1:
		message = "Terjadi error"
	case 0:
		message = fmt.Sprintf("Kondisi Aman. Water level %.2f cm.", rain.WaterLevel)
	case 1:
		message = fmt.Sprintf("Water level %.2f cm. dengan hujan %s. Harap tetap waspada.", rain.WaterLevel, RainToText(rain.RainStatus))
	case 2:
		message = fmt.Sprintf("Ketinggian air mencapai %.2f dengna hujan %s selama %s. Segera evakuasi!", rain.WaterLevel, RainToText(rain.RainStatus), rain.RainDurationMinutes)
	}

	return message
}
