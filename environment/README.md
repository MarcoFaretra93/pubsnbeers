# Preparazione dell'ambiente virtuale

Per eseguire l'applicazione è necessario eseguire il boot delle due macchine virtuali, per fare ciò posizionarsi nella directory [database-server](database-server/) ed eseguire il comando

    $ vagrant up
**Solo** la prima volta che si esegue il comando si avranno i seguenti effetti: 
* lancio degli script di provisioning per le due macchine
* installazione dei componenti aggiuntivi delle due macchine, per es. Node.js o MongoDB
* installazione dei *moduli node* descritti nel file *package.json*
* registrazione e avvio dei nuovi demoni Upstart delle due macchine 
* redirezione delle richieste sulla porta 80 della macchina **server** sulla porta 8000

Di seguito gli effetti che si ottengono sia dopo la prima che dopo le successive volte che si lancia il comando:

* redirezione delle richieste sulla porta 80 della macchina **server** sulla porta 8000

Una volta completato il boot delle macchine sarà possibile raggiungere la macchina **server** all'indirizzo [10.1.11.5](10.1.11.5), inoltre sarà possibile gestire il contenuto del database all'indirizzo [10.1.11.7:8081](10.1.11.7:8081) mediante Mongo-Express accedendo con le seguenti credenziali:

* username: **admin**
* password: **pass**
