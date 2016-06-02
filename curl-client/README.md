# Esecuzione degli script client

Questa cartella contiene i due script dei client da eseguire per ricevere delle risposte in formato **JSON** dal server, per eseguire i client lanciare il comando

    $ bash nome-client.sh

Le risposte del server saranno salvate in un file **curlResult** all'interno della cartella da dove si lancia il client, i risultati successivi verranno appesi alla fine del file, ogni lancio di un client è caratterizzato dalla data di esecuzione.

Le richieste eseguite sono le seguenti:
* creazione di tre birre di cui una ripetuta
* ricezione di tutte le birre
* ricezione di una singola birra
* modifica di una birra
* modifica fallita di una birra
* rimozione di una birra
* rimozione fallita di una birra
* *pulizia delle altre birre inserite* (risposta non salvata sul file *curlResult*)

## Tipologie di client

Per eseguire **prettyClient.sh** è necessario aver installato globalmente, sulla macchina da dove si lanciano i client, il modulo node **json**, installabile mediante **npm** con il comando:

    $ npm install -g json

**client.sh** non richiede il precedente modulo, tuttavia, l'output salvato sul file curlResult sarà formattato così come viene restituito dal comando *curl*, mentre nel primo caso il modulo **json** permette di salvare l'output del comando *curl* formattandolo in maniera più leggibile.
