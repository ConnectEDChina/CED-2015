var quill;
var form;

$(document).ready(function() {
    
    // Quill Setup
    quill = new Quill('#editor', {
        modules: {
          'toolbar': { container: '#toolbar' },
          'image-tooltip': true,
          'link-tooltip': true
        },
        theme: 'snow'
    });

    // jQuery Validate
    $("#email_form").validate({
        highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });

    $('#receiver_ID').on('change', function(){
        if ($('#receiver_ID').val() === 'other') {
            $('#email_receiver_ID').removeClass('hidden');
        }
        else {
            $('#email_receiver_ID').addClass('hidden');
        }
    });

    var requestSent = false;

    // From submit
    $('#send_email').on('click', function() {
        $('#email_content_ID').html(quill.getHTML());

        var from_option = $('#receiver_ID').val();
        var toField = $('#email_to_ID');
        var bccField = $('#email_bcc_ID');
        var pseudo_toField = $('#email_receiver_ID');
        switch (from_option) {
            case 'p_vol':
                toField.val('no-reply@connected-china.org');
                bccField.val('p_volunteers@connected-china.org');
                break;
            case 'p_comp':
                toField.val('no-reply@connected-china.org');
                bccField.val('p_competitors@connected-china.org');
                break;
            case 'other':
                toField.val(pseudo_toField.val());
                break;
            default:
                toField.val('');
        }

        if (!requestSent) {
            if ($('#email_form').valid()){
                requestSent = true;
                $.ajax({
                    url: '/emailOut',
                    type: 'POST',
                    data: $('#email_form').serialize()
                })
                .done(function() {
                    $('#right_modal').modal('toggle');
                })
                .fail(function(data) {
                    $('#wrong_modal').modal("toggle");
                    $('[name=email_pwd]').val("");
                })
                .always(function() {
                    requestSent = false;
                });
            }
        }        
    });

    $('#right_modal').on('hidden.bs.modal', function () {
        location.reload();
    });

    $("[name=email_pwd]").focus(function(){
        this.type = "text";
    }).blur(function(){
        this.type = "password";
    });
});