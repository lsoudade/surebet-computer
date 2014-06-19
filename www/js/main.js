$(document).ready(function () {
    $('.btn-add').click(function(e){
        e.preventDefault();
       
        var row          = $('.row-to-process-default').clone();
        var newIteration = parseInt($('tbody').data('iteration'))+1;
               
        $(row).removeClass('row-to-process-default');
        $(row).find('span.number').replaceWith(newIteration);
        $(row).insertBefore('.row-buttons');
       
        $('tbody').data('iteration', newIteration);
       
        $(row).find('input').focus();
    });
   
    $('.form-surebet').submit(function(e){
        e.preventDefault();
        
        var errors = 0;
               
        var max_amount = $(this).find('.maximum_amount');
        if ( $(max_amount).val().length === 0 ) {
            $(max_amount).addClass('input-error');
            errors++;
        }
           
        $('.row-to-process').each(function() {
            var cote = $(this).find('.cote');
            if ( $(cote).val().length === 0 ) {
                $(cote).addClass('input-error');
                errors++;
            }
        });
       
        if ( errors === 0 ) {
            $.ajax({
                type: 'POST',
                url: $(this).attr('action'),
                data: $(this).serialize(),
                dataType: "json",
                success: function(data) {
                    var classn = data.isSurebet ? 1 : 0;
                    $('td.result .is-surebet-' + classn).show();
                }
            });
        } else {
            return false;
        }
    });
   
   
    $('.maximum_amount').blur(function(e){
        if ( $(this).val().length !== 0 ) {
            $(this).removeClass('input-error');
        }
    });
    
    $('.maximum_amount').keydown(function(e){
        $(this).removeClass('input-error');
    });
    
    $('.cote').blur(function(e){
        if ( $(this).val().length !== 0 ) {
            $(this).removeClass('input-error');
        }
    });
    
    $('.cote').keydown(function(e){
        $(this).removeClass('input-error');
    });
});