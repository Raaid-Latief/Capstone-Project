let users = [];
let programs = [];


const userContainer = document.getElementById("users");
const prodContainer = document.getElementById("programs");

fetch('https://capstone-raaid.herokuapp.com/users')
  .then((res) => res.json())
  .then((data) => {
    users = data;
    console.log(data);
    showUsers(data);
  });

function showUsers(users) {
  //   prodContainer.innerHTML = "";
  users.forEach((user) => {
    userContainer.innerHTML += `
    <div class="col-md-6 d-flex justify-content-center my-4">
        <div id="users" clas="w-100">
            <div class='text-center'>
                <h2 id="userId" class="text-muted">${user.user_id}</h2>
                <h4 id="userFullName">${user.fullname}</h4>
                <p id="userBillingAddress">Billing Address: ${user.email}</p>
                <p id="userDefaultShippingAddress">Shipping Address: ${user.password}</p>
                <p id="userCountry">Country: ${user.userRole}</p>
                <p id="userPhone">Phone: ${user.phoneNumber}</p>
                <p id="userType">User Type: ${user.joinDate}</p>
            </div>
        </div>
    </div>
    `;
  });
}


fetch('https://capstone-raaid.herokuapp.com/programs')
  .then((res) => res.json())
  .then((data) => {
    items = data;
    console.log(data);
    showItems(data);
  });

function showItems(programs) {
  //   prodContainer.innerHTML = "";
  programs.forEach((program) => {
    prodContainer.innerHTML += `
    <div class="col-md-6 d-flex justify-content-center my-4">
        <div id="Products" clas="w-100">
            <div class='d-flex justify-content-center'>
                <img id="productImage" src="${program.imgURL}" alt=${program.category}/>
            </div>
            <div class='text-center'>
                <h2 id="productName">${program.title}</h2>
                <h4 id="productDescriptions">${program.description}</h4>
                <p id="productPrice">Price: R${program.price}</p>
                <p id="productStock">For: ${program.gender}</p>
           
            </div>
        </div>
    </div>
    `;
  });
}

async function Login(e) {
  e.preventDefault();
  const response = await fetch(
    "https://localhost:6969/users/login",
    {
      method: "POST",
      body: JSON.stringify({
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
      }),
      headers: {
        "content-type": "application/json",
      },
    }
  );
  const data = await response.json();
  console.log(data);
  alert("Logged in successfully");
  return data;
}
