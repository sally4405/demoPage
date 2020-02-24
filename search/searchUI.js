window.addEventListener('DOMContentLoaded', () => {
    let c = [];

    //document.getElementById('fetchUserDataBtn').addEventListener('click', fetchUserData);
    document.getElementById('searchInput').addEventListener('keydown', onkeydowns);

    function fetchUserData() {
        fetch('./localData.json')
            .then(response => response.json())
            .then(users => {
                let output = '';
                users.forEach(function (user) {
                    if (user.name.startsWith(c.join(""))) {
                        output += `
                        <li>
                            ${user.name}
                        </li>
                    `;
                    }
                });
                document.getElementById("response").innerHTML = output;
            });
    }

    function onkeydowns() {
        if (event.keyCode === 8) {
            c.pop();
        }
        else if (event.keyCode === 32 || (65 <= event.keyCode && event.keyCode <= 65 + 25)
            || (97 <= event.keyCode && event.keyCode <= 97 + 25)) {

            c.push(String.fromCharCode(event.keyCode).toLowerCase());
        }
        console.log('join : ', c.join("")); //문자코드값 : a -> 65
        fetchUserData();
    };


});

