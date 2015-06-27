define(function (require) {

    var $ = require('jquery'),
        bt_select = require('bootstrap-select'),
        wecaht = require('wechat_barcode'),
        equalHeight = require('equalHeight'),
        analytics = require('analytics');

    $(document).ready(function() {

        equalHeight('.equal-height');

        // bootstrap select
        $('.selectpicker').selectpicker({
            style: 'btn-default'
        });

        // interest field select of other
        var interest_field = $('#interest_field_ID');
        interest_field.on('change', function() {
            if (interest_field.val() == "other") {
                $('#interest_other_entry').removeClass('hidden');
            }
            else {
                $('#interest_other_entry').addClass('hidden');
            }
        });

        // Team or one select
        var hasTeam = $('#hasTeam_ID');
        hasTeam.on('change', function() {
            if (hasTeam.val() == "team_yes") {
                $('#competitor_team_info').removeClass('hidden');
            }
            else {
                $('#competitor_team_info').addClass('hidden');
            }
        });

        // Leader or member select
        var leader_or_member = $('#team_role_ID');
        leader_or_member.on('change', function() {
            if (leader_or_member.val() == 'leader') {
                $('#team_role_selected').removeClass('hidden');
                $('#i_am_leader').removeClass('hidden');
                $('#i_am_member').removeClass('hidden');
                $('#leader_text_chn').removeClass('hidden');
                $('#leader_text_en').removeClass('hidden');
                $('#member_text_chn').addClass('hidden');
                $('#member_text_en').addClass('hidden');
            }
            else if (leader_or_member.val() == 'member') {
                $('#team_role_selected').removeClass('hidden');
                $('#i_am_leader').addClass('hidden');
                $('#i_am_member').removeClass('hidden');
                $('#leader_text_chn').addClass('hidden');
                $('#leader_text_en').addClass('hidden');
                $('#member_text_chn').removeClass('hidden');
                $('#member_text_en').removeClass('hidden');
            }
            else {
                $('#team_role_selected').addClass('hidden');
                $('#i_am_leader').addClass('hidden');
                $('#i_am_member').addClass('hidden');
                $('#leader_text_chn').addClass('hidden');
                $('#leader_text_en').addClass('hidden');
                $('#member_text_chn').addClass('hidden');
                $('#member_text_en').addClass('hidden');
            }
        });

        // ticket select
        var ticket = $('#ticket_class_ID');
        ticket.on('change', function () {
            if (ticket.val() === 'competitor') {
                $('#additional_info').removeClass('hidden');
                $('#term_comp').removeClass('hidden');
                // $('#term_audi').addClass('hidden');
            }
            else if (ticket.val() === 'audience') {
                $('#additional_info').addClass('hidden');
                // $('#term_audi').removeClass('hidden');
                $('#term_comp').addClass('hidden');
            }
            else {
                $('#additional_info').addClass('hidden');
                // $('#term_audi').addClass('hidden');
                $('#term_comp').addClass('hidden');
            }
        });

        // idea select
        var idea = $('#hasIdea_ID');
        idea.on('change', function () {
            if (idea.val() === 'idea_yes') {
                $('#hasIdea_div').removeClass('hidden');
                $('#interest_div').addClass('hidden');
            }
            else if (idea.val() === 'idea_no') {
                $('#hasIdea_div').addClass('hidden');
                $('#interest_div').removeClass('hidden');
            }
            else {
                $('#hasIdea_div').addClass('hidden');
                $('#interest_div').addClass('hidden');
            }
        });
        

        // // date picker init
        // $('#dob_ID').datepicker({
        //     format: "yyyy-mm-dd",
        //     startDate: "1990-01-01",
        //     endDate: "1999-12-31",
        //     clearBtn: true,
        //     autoclose: true,
        //     defaultViewDate: { year: 1996, month: 01, day: 01 }
        // });

        var info_form;

        // TeamID validation
        var isTeamIDValid = false;
        var team_id = $('#team_id_ID');
        team_id.focusout(function (ev) {
            require(['jquery-validate', 'jval-add'], function (vldt, addition) {

                if (info_form === undefined) {
                    info_form = $('#infoForm').validate({

                        rules: {
                            id_number: {
                                pattern: /[0-9]+[0-9xX]$/i
                            },
                            mobile_phone: {
                                digits: true
                            },
                            email: {
                                email: true
                            },
                            team_id: {
                                pattern: /^[a-z][0-9a-z_]*$/
                            }
                        },

                        messages: {

                            id_number: {
                                minlength: "Invalid ID Number. Must be 18 digits.",
                                digits: "Invalid ID Number. Must be 18 digits.",
                                pattern: "Invalid ID Number. Contains invalid characters."
                            },
                            team_id: {
                                pattern: "Your Team ID doesn't align with the format required."
                            }
                        },

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
                }

                var team_id_val = team_id.val();
                if (team_id_val !== ''){
                    $.ajax({
                        url: '/id_validate',
                        type: 'POST',
                        data: {"team_id": team_id_val}
                    })
                    .done(function(data) {
                        // console.log(data);
                        var team_role = $('#team_role_ID');
                        if (info_form.element("#team_role_ID")) {
                            var team_role_val = team_role.val();
                            if (team_role_val == "leader" && data != "zero") {
                                info_form.showErrors({
                                    "team_id": "Team ID already taken"
                                });
                                isTeamIDValid = false;
                            }
                            else if (team_role_val == "member" && data == "zero") {
                                info_form.showErrors({
                                    "team_id": "This team doesn't exist"
                                });
                                isTeamIDValid = false;
                            }
                            else if (team_role_val == "member" && data == "team_full") {
                                info_form.showErrors({
                                    "team_id": "This team is full"
                                });
                                isTeamIDValid = false;
                            }
                            else {
                                isTeamIDValid = true;
                            }
                        }
                        // console.log(isTeamIDValid);
                    })
                    .fail(function() {
                        console.log("error");
                    });
                }
            }); 
        });

        var requestSent = false;

        $('#submitBtn').on('click', function () {
            require(['jquery-validate', 'jval-add'], function (vldt, addition) {

                // form validation init
                if (info_form === undefined) {
                    info_form = $('#infoForm').validate({

                        rules: {
                            id_number: {
                                pattern: /[0-9]+[0-9xX]$/i
                            },
                            mobile_phone: {
                                digits: true
                            },
                            email: {
                                email: true
                            },
                            team_id: {
                                pattern: /^[a-z][0-9a-z_]*$/
                            }
                        },

                        messages: {

                            id_number: {
                                minlength: "Invalid ID Number. Must be 18 digits.",
                                digits: "Invalid ID Number. Must be 18 digits.",
                                pattern: "Invalid ID Number. Contains invalid characters."
                            },
                            team_id: {
                                pattern: "Your Team ID doesn't align with the format required."
                            }
                        },

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
                }

                var validateRes = $('#infoForm').valid();

                // validateRes = true;

                if (validateRes) {

                    var ticket_class = $('#ticket_class_ID');
                    if (ticket_class.val() === ''){
                        // popup modal for ticket error
                        $('#ticket_error').modal('show');
                        return;                
                    }

                    if (!isTeamIDValid && $('#hasTeam_ID').val() === 'team_yes') {
                        info_form.showErrors({
                            "team_id": "Team ID not valid."
                        });
                        return;
                    }

                    var submitRes = true;
                    if (!requestSent) {
                        requestSent = true;
                        $.ajax({
                            type: 'POST',
                            url: '/submitRegForm',
                            data: new FormData($('#infoForm')[0]),
                            contentType: false,
                            processData: false,
                            cache: false,
                            success: function() {
                                submitRes = submitRes && true;
                            },
                            complete: function() {
                                requestSent = false;
                            }
                        });

                        if (submitRes) {
                            var content = $('#email_addr').text();
                            content += " <strong>" + $('#email_ID').val() + "</strong>";
                            $('#email_addr').html(content);
                            $('#disclaimer').modal('hide');
                            $('#ticket_intro').addClass('hidden');
                            $('#reg_form').addClass('hidden');
                            $('#reg_success').removeClass('hidden');
                        }
                    }

                    // var dateObj = $('#dob_ID').datepicker('getDate');
                    // var age = calculateAge(dateObj);
                    // // var age = 19;

                    // if (age >= 18) {
                    //     $("#leq18").addClass('hidden');
                    //     $('#gt18').removeClass('hidden');
                    //     $('#disclaimer').modal('show');
                    // }
                    // else {
                    //     $('#gt18').addClass('hidden');
                    //     $('#leq18').removeClass('hidden');
                    //     $('#disclaimer').modal('show');
                    // }
                   
                }
            });
        });
    });
});