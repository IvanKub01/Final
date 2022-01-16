$(function () {

    // console.log("DOCUMENT READY")
    $('#SignForm').submit(function(e) {

        document.getElementById('flashesSignUP').innerHTML = '';

        userLogin = document.getElementById('login').value
        userPass = document.getElementById('pass').value
        if (userLogin.length == 0 || userPass.length == 0 ){


            document.getElementById('flashSignUP').innerHTML = "Zadajte svoje ID a heslo."
            e.preventDefault();
            // return 
        }
        if (userLogin.length==0){
            document.getElementById('flashSignUP').innerHTML = "Nesprávny vstup."
            e.preventDefault();
        }
        if (userPass.length==0){
            document.getElementById('flashSignUP').innerHTML = "Nesprávny vstup."
            e.preventDefault();
        }

    });


});
