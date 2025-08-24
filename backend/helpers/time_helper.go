package helpers

import (
	"fmt"
	"time"
)

func UnixToTimeString(unix int64) string {
	t := time.Unix(unix, 0)
	formatted := t.Format("15:04")

	return formatted
}

func UnixToDate(unix int64) string {
	t := time.Unix(unix, 0).In(time.Local)
	now := time.Now()

	year, month, day := now.Date()
	today := time.Date(year, month, day, 0, 0, 0, 0, now.Location())

	yearT, monthT, dayT := t.Date()
	dateT := time.Date(yearT, monthT, dayT, 0, 0, 0, 0, t.Location())

	diff := int(today.Sub(dateT).Hours() / 24)

	switch {
	case diff == 0:
		return "Hari ini"
	case diff == 1:
		return "Kemarin"
	case diff <= 7:
		return fmt.Sprintf("%d hari lalu", diff)
	case now.Month() == monthT && now.Year() == yearT:
		return "Bulan ini"
	case (now.Month()-1 == monthT && now.Year() == yearT) ||
		(now.Month() == 1 && monthT == 12 && now.Year()-1 == yearT):
		return "Bulan kemarin"
	default:
		return t.Format("02 Jan 2006")
	}
}
