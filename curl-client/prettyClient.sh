#!/usr/bin/env bash

RESULT=`pwd`/curlResult

function makeRequests {

    echo -e `date` >> $RESULT

    #Creazione di tre birre POST request /api/beers
    echo "Creazione di 3 birre, di cui l'ultima è ripetuta"
    echo '3 POST /api/beers response:'
    curl http://10.11.1.5/api/beers --data "name=beer1&type=type1&alcoholic_degree=1" | json
    curl http://10.11.1.5/api/beers --data "name=beer2&type=type2&alcoholic_degree=2" | json
    curl http://10.11.1.5/api/beers --data "name=beer2&type=type2&alcoholic_degree=2" | json #creazione fallita, birra già esistente
    echo -e '\n \n'

    #Ricezione di tutte le birre GET request /api/beers
    echo 'Ricezione di tutte le birre'
    echo '1 GET /api/beers response:'
    curl http://10.11.1.5/api/beers | json
    echo -e '\n \n'

    #Salvataggio degli id delle birre per eseguire operazioni di ricezione, modifica e rimozione
    OUT=$(curl http://10.11.1.5/api/beers | json | grep id | awk '{print $2}' | sed 's/[",]//g')
    ar=($OUT)

    #Ricezione di una birra, GET request /api/beers/$id
    echo 'Ricezione di una birra'
    echo '1 GET /api/beers/'`echo ${ar[0]}`' response'
    curl http://10.11.1.5/api/beers/`echo ${ar[0]}` | json
    echo -e '\n \n'

    #Modifica di una birra, PUT request /api/beers/$id
    echo 'Modifica di una birra'
    echo '1 PUT /api/beers/'`echo ${ar[0]}`' response:'
    curl http://10.11.1.5/api/beers/`echo ${ar[0]}` --data "name=mod&type=mod&alcoholic_degree=100&_method=PUT" | json
    echo -e '\n \n'

    #Modifica fallita di una birra, PUT request /api/beers/$id
    echo 'Modifica di una birra'
    echo '1 PUT /api/beers/000 response:'
    curl http://10.11.1.5/api/beers/`echo ${ar[0]}` --data "name=mod&type=mod&alcoholic_degree=100&_method=PUT" | json
    echo -e '\n \n'

    #Rimozione di una birra, DELETE request /api/beers/$id
    echo 'Cancellazione di una birra'
    echo '1 DELETE /api/beers/'`echo ${ar[0]}`' response:'
    curl http://10.11.1.5/api/beers/`echo ${ar[0]}` --data "name=mod&type=mod&alcoholic_degree=100&_method=DELETE" | json
    echo -e '\n \n'

    #Rimozione fallita di una birra, DELETE request /api/beers/$id
    echo 'Cancellazione di una birra non esistente'
    echo '1 DELETE /api/beers/'`echo ${ar[0]}`' response:'
    curl http://10.11.1.5/api/beers/`echo ${ar[0]}` --data "name=mod&type=mod&alcoholic_degree=100&_method=DELETE" | json
    echo -e '\n \n'

    #Pulizia dell'ultima birra rimasta
    curl http://10.11.1.5/api/beers/`echo ${ar[1]}` --data "name=mod&type=mod&alcoholic_degree=100&_method=DELETE" 1> /dev/null 2> /dev/null
}

makeRequests >> $RESULT;
