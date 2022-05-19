function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/product");
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var trHTML = '';
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                trHTML += '<tr>';
                trHTML += '<td>' + object['product_id'] + '</td>';
                trHTML += '<td>' + object['product_name'] + '</td>';
                trHTML += '<td>' + object['size_name'] + '</td>';
                trHTML += '<td>' + object['category_name'] + '</td>';
                trHTML += '<td>' + object['price'] + '</td>';
                trHTML += '<td>' + object['count'] + '</td>';
                trHTML += '<td>' + object['gender_name'] + '</td>';
                //trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox(' + object['id'] + ')">Edit</button>';
                //trHTML += '<button type="button" class="btn btn-outline-danger" onclick="userDelete(' + object['id'] + ')">Del</button></td>';
                trHTML += "</tr>";
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    };
}

loadTable();