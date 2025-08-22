package helpers

import "time"

func UnixToTimeString(unix int64) string {
	t := time.Unix(unix, 0)
	formatted := t.Format("15:04")

	return formatted
}

func UnixToDate(unix int64) string {
	t := time.Unix(unix, 0).In(time.Local)
	now := time.Now()

	year, month, date := now.Date()
	today := time.Date(year, month, date, 0, 0, 0, 0, now.Location())

	yearT, monthT, dayT := t.Date()
	dateT := time.Date(yearT, monthT, dayT, 0, 0, 0, 0, t.Location())

	diff := today.Sub(dateT).Hours() / 24

	switch {
	case diff == 0:
		return "Hari ini"
	case diff == 1:
		return "Kemarin"
	case diff <= 7:
		return "Minggu Kemarin"
	case diff <= 30:
		return "Bulan Kemarin"
	default:
		return t.Format("02 Jan 2006")
	}
}
