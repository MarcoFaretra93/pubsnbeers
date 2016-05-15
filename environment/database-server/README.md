# Database-server 

Questo ambiente di esecuzione è composto da due macchine virtuali: 
un **server** e un **database**. 

## Descrizione delle macchine virtuali 

### server

La macchina virtuale **server** (10.11.1.5) 
è pensata per l'esecuzione del codice Javascript relativo al *lato server*, 
ed ha il seguente software: 

* Ubuntu Trusty (14.04 LTS) a 64 bit 
* Node.js
* Git

Inoltre la macchina **server** ha anche il seguente software di supporto, installati mediante *node package manager* :

* Nodemon.js
* Mocha.js
  
La cartella *config-server* contiene il file .conf per la registrazione del demone Upstart utile all'avvio del server Node, al fine di poter utilizzare l'applicazione vera e propria. Il server Node in questione è raggiungibile all'indirizzo *10.11.1.5*. 

La cartella *scripts-server* contiene gli script per il provisioning esclusivi della macchina **server**.

### database

La macchina virtuale **database** (10.11.1.7) è pensata per l'esecuzione del codice Javascript relativo al *lato database* ed ha il seguente software: 

* Ubuntu Trusty (14.04 LTS) a 64 bit 
* Node.js
* MongoDB

Inoltre la macchina **database** ha il seguente tool di supporto per la gestione di MongoDB:

* Mongo-Express

La cartella *config-database* contiene il file .conf per la registrazione del demone Upstart utile all'avvio del server Node, al fine di poter utilizzare il tool Mongo-Express. Il server Node in questione è raggiungibile all'indirizzo *10.11.1.7:8081* accedendo con le seguenti credenziali:

* username: **admin**
* password: **pass**

La cartella *resources-database* contiene il codice relativo al tool Mongo-Express.

La cartella *scripts-database* contiene gli script per il provisioning esclusivi della macchina **database**.
