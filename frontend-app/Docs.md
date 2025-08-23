## Dokumentasi API

endpoint :

```
/api/rain/ -> untuk latest data rain
/api/rain/all/limit -> dapetin semua data rain, limit ganti ke 1,2,3 atau kalo mau semua data tinggal ganti ke -1
/api/events -> ini endpoint SSE
/api/node/status -> status node
```

SSE :
Format SSE :
event: <nama event> (notification, etc)
data: <json data>

format response api :

```
{
'status': bool, (true/false)
'data': <data>, (kalo ga ada bakal null)
'message': <pesan>
}
```
