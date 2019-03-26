// Call the dataTables jQuery plugin
 $(document).ready(function() {
  //$('#dataTable').DataTable();


  $('#dataTable').DataTable( {
      "paging":false,
      "info":false,
    "footerCallback": function ( row, data, start, end, display ) {
        var api = this.api(), data;

        // Remove the formatting to get integer data for summation
        var intVal = function ( i ) {
            return typeof i === 'string' ?
                i.replace(/[\$,]/g, '')*1 :
                typeof i === 'number' ?
                    i : 0;
        };

        // Total over all pages
        total = api
            .column( 3 )
            .data()
            .reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );

        // Total over this page
        pageTotal = api
            .column( 3, { page: 'current'} )
            .data()
            .reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );

        // Update footer
        $( api.column(3 ).footer() ).html(
            '$'+pageTotal 
        );
    }
} );

$('#dataTable2').DataTable( {
    "paging":false,
    "info":false});
    

    
    $(".calculo").change(function(){
       var aux=  $(this).attr("id");
       var valcampo =  $(this).val();
       var valprecio=$("#precio"+aux).html();
       valprecio =valprecio.replace("$ ", "");
       
       var total_prod = parseInt(valprecio)*parseInt(valcampo);
       $("#valor"+aux).html(total_prod);

       var total=0;
       var table = $("table tbody");
       table.find('tr').each(function (i, el) {
            var $tds = $(this).find('td'),
            
            Quantity = $tds.eq(3).text();
            Quantity = parseInt(Quantity);
            
            if(!isNaN( Quantity )){
                total+=Quantity;
                console.log(Quantity);
            }
            
        // do something with productId, product, Quantity
        });
        /* console.log(total); */
        $("#total" ).html("$ "+total);
        $("#total_compra" ).val(total);
    }); 

 
});

