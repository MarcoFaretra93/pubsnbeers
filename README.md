# Pubs'N'Beers

Benvenuti al repository di [Pubs'n'beers](http://10.11.1.5), applicazione sviluppata da:

* Faretra Marco
* Marini Gabriele
* Martinelli Antonio
* Romeo Claudia

Questo repository contiene il codice relativo sia all'ambiente di esecuzione dell'applicazione sia relativo all'applicazione stessa:

* l'ambiente di esecuzione distribuito è composto
  da alcune macchine virtuali create con
  [VirtualBox](https://www.virtualbox.org/)
  e [Vagrant](https://www.vagrantup.com/),
  e accedute tramite una shell.

## Software da installare sul proprio PC

### Per lo sviluppo del software
* [Git](https://git-scm.com/)

### Per la gestione dell'ambiente di esecuzione  
* [VirtualBox](https://www.virtualbox.org/)
* [Vagrant](https://www.vagrantup.com/)
* [Git](https://git-scm.com/)
* Un browser web come [Chrome](https://www.google.com/chrome/)
* Una shell come [Git](https://git-scm.com/)

## Organizzazione del repository

Questo repository è organizzato in diverse sezioni (cartelle):
* [project](project/) contiene il codice dell' *applicazione distribuita*;
* [environment](environment/) contiene il codice per la gestione dell' *ambiente distribuito*.
* [curl-client](curl-client/) contiene gli script dei client per eseguire richieste mediante *curl*

## Accesso al repository

Per effettuare il download del repository, usare il seguente comando Git
dalla cartella locale in cui si vuole scaricare il repository:

    $ git clone https://github.com/MarcoFaretra93/pubsnbeers

Per aggiornare il contenuto della propria copia locale del repository,
usare il seguente comando Git dalla cartella locale in cui è stato scaricato il repository:

    $ git pull
