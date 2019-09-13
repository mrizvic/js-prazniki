# prazniki.js

## Kaj

Zadeva nam v JSON obliki vrne datumske lastnosti v danem trenutku ali za določen datum.

## Zahteve
nodejs, npm

Ura na strežniku mora biti sinhronizirana z NTP.
Velika noč, velikonočni ponedeljek, binkoštna nedelja se preračunajo glede na podano letnico. Zadeva ne jemlje datumov pred 1.1.2013 saj je bil s tem dnem ukinjen datum 2. januar kot dela prosti dan.
Popravek 2017: 2. januar je spet aktualen.

## Kako

Strežnik požememo z nodejs ter po želji dodamo ENVIRONMENT spremenljivki
```
$ APP_HOST=127.0.0.2 APP_PORT=8080 nodejs prazniki.js
[2018-02-12 21:09:57.524] [INFO]  PID: 29306
[2018-02-12 21:09:57.528] [INFO]  Application name: /home/mrizvic/echelon-web/api.dmz6.net/nodecode/datum/GITHUB/prazniki.js
[2018-02-12 21:09:57.619] [LOG]   Listening at http://127.0.0.2:8080
<<CTRL+C>>
^C[2018-02-12 21:09:59.745] [LOG]   We-should-cleanup signal catched.. shutting down
[2018-02-12 21:09:59.746] [LOG]   closing application socket
[2018-02-12 21:09:59.748] [LOG]   Statistics
[2018-02-12 21:09:59.750] [INFO]  API requests: 0
[2018-02-12 21:09:59.750] [INFO]  GET requests: 0
[2018-02-12 21:09:59.750] [INFO]  PUT/POST requests: 0
[2018-02-12 21:09:59.751] [INFO]  DELETE requests: 0
```

Primeri klicanja webservice:
```
http://127.0.0.1:8007/info/now - vrne lastnosti za trenutni datum
http://127.0.0.1:8007/info/2016/11/28 - vrne lastnosti z dne 28.11.2016
```

Rezultat dobimo v JSON obliki. Razlaga parametrov v rezultatu je na spodnjem primeru:
```
$ curl -s https://127.0.0.1:8007/info/2015/4/5 | jq .
{
  "datum": "5.4.2015",
  "holiday": true,
  "businessday": false,
  "weekend": true,
  "weekday": 7,
  "leapyear": false,
  "holiday_name": "Velika noč"
}
```

datum, string - datum za katerega smo povpraševali
holiday, true/false - če je na ta dan praznik
businessday, true/false - vrne false, če je to dela prosti dan
weekend, true/false - vrne true kadar je sobota ali nedelja
weekday, 1 do 7 - ena je ponedeljek, dve je torek, ... sedem je nedelja
leapyear, true/false - vrne true, če je prestopno leto
holiday_name, string - pove ime praznika, parameter je nastavljen samo takrat, kadar je holiday=true

Za lažje delo na platformah kjer nimamo JSON parserja je na voljo tudi neposreden dostop do vseh parametrov, ki so znotraj JSON odgovora. Nekaj primerov je spodaj:
```
$ curl http://127.0.0.1:8007/holiday/2016/12/25
true

$ curl http://127.0.0.1:8007/weekday/2016/12/25
7

$ curl http://127.0.0.1:8007/businessday/2016/12/25
false
```
Oziroma če nam datum ni znan lahko uporabimo `now`:
```
$ curl http://127.0.0.1:8007/holiday/now
false

$ curl http://127.0.0.1:8007/weekday/now
2

$ curl http://127.0.0.1:8007/businessday/now
true
```
V okviru klicev s parametrom  `now` je možno pridobiti tudi informacijo v kakšnem tarifnem obdobju se trenutno nahajamo glede zaračunavanja porabe električne energije. Kot rezultat dobimo string MT ali VT, odvisno od časa ob katerem je strežnik sprejel takšen klic.
```
$ curl http://127.0.0.1:8007/tariff/now
MT
```
Poizvedovanje o tarifnem obdobju v primeru datumskega klica (npr: /datum/tariff/2016/1/1) ne bo uspelo.

Če nas zanima točen čas so na voljo tudi spodnji klici. Uporabno v primer kadar želimo nastaviti uro nekega sistema in nimamo možnosti poizvedbe preko NTP.
```
$ curl http://127.0.0.1:8007/getTime/local
29.11.2016 09:45:45 GMT+0100 (CET)

$ curl -s http://127.0.0.1:8007/getTime/utc
Tue, 29 Nov 2016 09:22:17 GMT

$ curl -s http://127.0.0.1:8007/getTime/epoch
1480409148.365
```

Slednji klic vrne število sekund ter milisekund (ločeno s piko) od 1.1.1970 00:00:00.

## Kava
Ce vam tole dobro sluzi se priporocam za kaksno kavo :) https://ko-fi.com/markor

