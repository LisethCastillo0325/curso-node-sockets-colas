// Comando para establecer la conexión
var socket = io();
var searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    alert('El escritorio es necesario');
    window.location = 'index.html';
}else{
    if(! Number(searchParams.get('escritorio'))){
        alert('El escritorio debe ser un numero');
        window.location = 'index.html';
    }
}

var escritorio = searchParams.get('escritorio');
var label = $('small');

$('h1').text('Escritorio ' + escritorio);

$('button').on('click', function() {
    socket.emit('atenderTicket', { escritorio: escritorio }, function(resp) {
        if (resp.ok !== undefined) {
            if(!resp.ok){
                label.text(resp.mensaje);
                alert(resp.mensaje);
                return;
            }
        }
        label.text('Ticket ' + resp.numero);
    });
});