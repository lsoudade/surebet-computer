$(document).ready(function () {
    
    var clearForm = function() {
        $('input').val('');
        $('td.result .is-surebet').hide();
        $('tr.row-results').hide();
    }
    
    $('.btn-add').click(function(e){
        e.preventDefault();
       
        var row          = $('.row-to-process-default').clone();
        var iteration    = parseInt($('tbody').data('iteration'));
        var newIteration = iteration + 1;
               
        $(row).removeClass('row-to-process-default');
        $(row).find('span.number').replaceWith(newIteration);
        $(row).find('.cote').attr('name', 'cote[' + iteration + ']');
        $(row).find('.cote').val('');
        $(row).find('.amount').attr('name', 'amount[' + iteration + ']');
        $(row).find('.revenue').attr('name', 'revenue[' + iteration + ']');
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
            $('td.result .is-surebet').hide();
            
            $.ajax({
                type: 'POST',
                url: $(this).attr('action'),
                data: $(this).serialize(),
                dataType: "json",
                success: function(data) {
                    var classn = data.isSurebet ? 1 : 0;
                    $('td.result .is-surebet-' + classn).show();
                    $('tr.row-results').show();
                    
                    /*$('td.result_sum_inverse').text(data.sumInverse);*/
                    $('td.result_percent_amount span').text(data.percentAmount);
                    $('td.result_global_amount span').text(data.globalAmount);
                    
                    if ( classn === 1 ) {
                        // Update amounts to bet
                        var i = 0;
                        $.each(data.amounts, function() {
                            $('input[name="amount['+ i +']"]').val(parseFloat(this).toFixed(2));
                            i++;
                        });

                        // Update revenues
                        var i = 0;
                        $.each(data.revenues, function() {
                            $('input[name="revenue['+ i +']"]').val(parseFloat(this).toFixed(2));
                            i++;
                        });
                    } else {
                        // Update amounts to bet
                        var i = 0;
                        $.each(data.amounts, function() {
                            $('input[name="amount['+ i +']"]').val('');
                            i++;
                        });

                        // Update revenues
                        var i = 0;
                        $.each(data.revenues, function() {
                            $('input[name="revenue['+ i +']"]').val('');
                            i++;
                        });
                    }
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
        $('tr.row-results').hide();
        $('td.result .is-surebet').hide();
    });
    
    $('table').on('blur', '.cote', function(e){
        if ( $(this).val().length !== 0 ) {
            $(this).removeClass('input-error');
        }
    });
    
    $('table').on('keydown', '.cote', function(e){
        $(this).removeClass('input-error');
        $('tr.row-results').hide();
        $('td.result .is-surebet').hide();
    });
});