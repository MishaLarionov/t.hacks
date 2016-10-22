import requests
r = requests.get("https://api.skywatch.co/data/time/2016-07/location/43.7069564,-79.3916043/source/landsat-8/level/1/cloudcover/5/band/red,green,blue", headers={"x-api-key": "aTX9DghMoqailJsCbs4dt3K2lArzluEX9pRHrWPy"})
for i in r:
    print(i.decode('utf-8'))
