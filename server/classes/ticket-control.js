const fs = require('fs');
const { Ticket } = require('./ticket');

class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.ticketsPendientes = [];
        this.ticketsAtendidos = [];

        let data = require('../data/data.json');

        if (data.hoy === this.hoy) {
            this.ultimo = data.ultimo;
            this.ticketsPendientes = data.tickets;
            this.ticketsAtendidos = data.atendidos;
        } else {
            this.reiniciarConteo();
        }
    }

    siguiente() {
        this.crearTicketPendiente();
        this.grabarArchivo();
        return this.getUltimoTicket();
    }

    crearTicketPendiente(){
        this.ultimo += 1;
        let ticket = new Ticket(this.ultimo, null);
        this.ticketsPendientes.push(ticket);
    }

    getUltimoTicket() {
        return `Ticket ${ this.ultimo }`;
    }

    getUltimosTicketsAtendidos(limite) {
        return this.ticketsAtendidos.slice(0, limite);
    }

    atenderTicket(escritorio) {
        if (this.ticketsPendientes.length === 0) {
            return {
                ok: false,
                mensaje: 'No hay tickets pendientes'
            };
        }

        let atenderTicket = this.ticketsPendientes.slice(0,1)[0];
        atenderTicket.escritorio = escritorio;

        this.ticketsPendientes.shift();
        this.ticketsAtendidos.unshift(atenderTicket);
        this.grabarArchivo();
        return atenderTicket;
    }

    reiniciarConteo() {
        this.ultimo = 0;
        this.ticketsPendientes = [];
        this.ticketsAtendidos = [];
        this.grabarArchivo();
        console.log('Se ha inicializado el sistema');
    }

    grabarArchivo() {
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.ticketsPendientes,
            atendidos: this.ticketsAtendidos
        };
        let jsonDataString = JSON.stringify(jsonData);
        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }

}

module.exports = {
    TicketControl
}