const { createClient } = supabase;

// Create a single supabase client for interacting with your database
const _supabase = createClient(
  "enter supabase url",
  "enter URL"
);

$(document).ready(function () {


  $(".signup").fadeOut();
  $(".sign-in").fadeIn();

  $("#sign_up").click(function (e) {
    e.preventDefault();
    $(".signup").fadeIn();
    $(".sign-in").fadeOut();
  });

  $("#signup").click(async function (e) {
    e.preventDefault();

    let sign_up_name = $("#name").val();
    let sign_up_email = $("#email").val();
    let sign_up_pass = $("#pass").val();
    let sign_up_re_pass = $("#re_pass").val();

    if (!sign_up_name || !sign_up_email || !sign_up_pass || !sign_up_re_pass) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All Field Req!",
      });
      return;
    }
    if (sign_up_pass !== sign_up_re_pass) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "pass does'nt match!",
      });
      return;
    }

    try {
      const { data, error } = await _supabase.auth.signUp({
        email: sign_up_email,
        password: sign_up_pass,
        options: {
          emailRedirectTo: "http://127.0.0.1:5500/dashboard.html", // Change this
          data: { full_name: sign_up_name },
        },
      });

      if (error) {
        // console.error("Signup Error:", error.message);
        // alert("Signup Failed: " + error.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Signup Failed: " + error.message,
        });
        return;
      }

      console.log("Signup Success:", data);
      Swal.fire({
        title: "Good job!",
        text: "check your email!",
        icon: "success",
      });

      // Redirect to email confirmation page
      window.location.href = "https://mail.google.com/mail/u/0/#inbox"; // Create this page
    } catch (err) {
      console.error("Catch Error:", err);
      // alert("Unexpected error occurred. Check console.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Unexpected error occurred. Check console.!",
      });
    }
  });

  $("#sign_in").click(function (e) {
    e.preventDefault();
    $(".signup").fadeOut();
    $(".sign-in").fadeIn();
  });

  $("#signin").click(async function (e) {
    e.preventDefault();

    let email = $("#your_name").val();
    let password = $("#your_pass").val();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ALL field  Req!",
      });
      return;
    }

    try {
      const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Sign-in Error:", error.message);
        alert("Login Failed: " + error.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Login Failed: " + error.message,
        });
        if (error.message == "Invalid login credentials") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "worng pass or email!",
          });
        }
        return;
      }

      // console.log("Login Success:", data);
         
      // Fetch user metadata (display name)
      const user = data.user;
      if (user && user.user_metadata.full_name) {
        localStorage.clear();
        let uid = user['id']
        localStorage.setItem("uid",uid);
        localStorage.setItem("userName", user.user_metadata.full_name);
        (async function () {
          const { data, error } = await _supabase
        .from('storage')
        .upsert({ uid: uid, id:"1" })
        .select()
          if(data){
            alert("confirmed")
            console.log(data);
            
          }else{
            console.log(error)
          }
      
        })()
      
         
     alert("Welcome, " + user.user_metadata.full_name);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Welcome, " + user.user_metadata.full_name  ,
          showConfirmButton: false,
          timer: 1500,
        });
      }

      // Redirect to dashboard
      window.location.href ="https://supabase-real-time-and-authentication-or-profile-updationn.vercel.app/dashboard.html";
    } catch (err) {
      console.error("Catch Error:", err);
      // alert("Unexpected error occurred. Check console.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Unexpected error occurred. Check console.",
      });
    }

    $("#your_name").val("");
    $("#your_pass").val("");
  });
  (async function () {
    const { error } = await _supabase.auth.signOut();
  })();

  // Auth State Listener
  const unsubscribe = _supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth Event:", event, session);

    if (event === "SIGNED_IN") {
      // window.location.href = "dashboard.html";
    } else if (event === "SIGNED_OUT") {
      // window.location.href = "http://127.0.0.1:5500/"
    }
  });

  // Call unsubscribe() to remove listener when needed
});

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
  $("#userName").html(localStorage.getItem("userName"));

  try {
    $(".btn-danger").click(async function () {
      let text = "Do you want to logout?";
      if (confirm(text)) {
        const { error } = await _supabase.auth.signOut();
        if (error) {
          alert(error.message);
        } else {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "you have been log Out",
            showConfirmButton: false,
            timer: 1500,
          });
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "You have been logged out.",
            showConfirmButton: false,
            timer: 1500,
          });
          localStorage.clear();
          window.location.href = "https://supabase-real-time-and-authentication-or-profile-updationn.vercel.app/"; // Change to your login page
        }
      } else {
        alert("Logout canceled.");
      }
    });
  } catch (err) {
    console.log(err);
  }

  try {
    $(document).on("click", ".delete", async function () {
      var idd = $(this).data("delete_id");
      var thiss = $(this);
  
      if (!idd) {
        console.error("Error: ID not found!");
        Swal.fire({
          icon: "error",
          title: "❌",
          text: "Invalid ID!",
        });
        return;
      }
  
      console.log("Deleting ID:", idd);
      alert("Deleting: " + idd);
  
      const { error } = await _supabase
        .from("REAL_TIME_CRUD")
        .delete()
        .eq("id", idd);
  
      if (!error) {
        Swal.fire({
          icon: "success",
          title: "✔",
          text: "Deleted Successfully!",
        });
        thiss.closest("tr").remove();
      } else {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "❌",
          text: "Failed to delete!",
        });
      }
    });
  } catch (error) {
    console.log("Catch Error:", error);
  }
  

  try {
    $(document).on("click", ".update", function (e) {
      e.preventDefault();

      // Show/hide buttons
      $("#submit").hide();
      $("#update").show();

      // Get data from the clicked element
      var update_id = $(this).data("update_id");
      var email = $(this).data("email");
      var pass = $(this).data("password");

      // Set the input fields with current values
      $("#exampleInputEmail1").val(email);
      $("#exampleInputPassword1").val(pass);

      // On Update button click
      $("#update").click(async function (e) {
        e.preventDefault();

        // Get updated values from the input fields
        var update_email_val = $("#exampleInputEmail1");
        var update_pass_val = $("#exampleInputPassword1");

        // Update in Supabase
   
        // Check if update was successful
        if (
          $("#exampleInputEmail1").val() == "" ||
          $("#exampleInputPassword1").val() == ""
        ) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "all field req!",
            // footer: '<a href="#">Why do I have this issue?</a>'
          });
        } else {
          const { error, status } = await _supabase
          .from("REAL_TIME_CRUD")
          .update({ email: update_email_val.val(), password: update_pass_val.val() })
          .eq("id", update_id);

          if (status == 204) {
            
            // Hide the update button and show the submit button
            $("#submit").show();
            $("#update").hide();

            // Clear the input fields after update
            $("#exampleInputEmail1").val("");
            $("#exampleInputPassword1").val("");
            Swal.fire({
              title: "Updated!",
              icon: "success",
              draggable: true,
            });
          } else {
            console.error("Error updating record:", error);
          }
        }
      });
    });
  } catch (error) {
    console.log(error);
  }

  async function fetchMessages() {
    const { data, error } = await _supabase.from("REAL_TIME_CRUD").select();
    console.log(data);

    if (error) {
      alert("Some error occurred!");
    } else {
      renderMessages(data);
    }
  }

  //read data
  function renderMessages(data) {
    try {
      $("#td tbody").empty();

      $.each(data, function (key, val) {
        let row = `
        
               <tr>
                 <th scope="row">${val.id}</th>
                 <td>${val.email}</td>
                 <td>${val.password}</td>
                 <td>
                   <button class="btn btn-danger delete" data-delete_id="${val.id}">delete</button>
                   <button class="btn btn-info update" data-update_id="${val.id}" data-email="${val.email}" data-password="${val.password}">update</button>
                 </td>
               </tr>
          `;

        $("#td tbody").append(row);
      });
    } catch (error) {
      console.log(error);
    }
  }

  //insert data

  try {
    $(document).on("click", "#submit", async function (e) {
      e.preventDefault();
      $("#update").hide();
      var email = $("#exampleInputEmail1").val();
      var password = $("#exampleInputPassword1").val();

      // console.log(email,password);

      if (
        $("#exampleInputEmail1").val() == "" ||
        $("#exampleInputPassword1").val() == ""
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "all field req!",
          // footer: '<a href="#">Why do I have this issue?</a>'
        });
      } else {
        const { error } = await _supabase
          .from("REAL_TIME_CRUD")
          .insert({ email, password });

        if (error) {
          alert("Error inserting data!");
        } else {
          Swal.fire({
            title: "Inserted!",
            icon: "success",
            draggable: true,
          });

          $("#exampleInputEmail1").val("");
          $("#exampleInputPassword1").val("");
        }
      }
    });
  } catch (error) {
    console.log(error);
  }

  _supabase
    .channel("REAL_TIME_CRUD")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "REAL_TIME_CRUD" },
      (payload) => {
        console.log("New message received:", payload.new);
        fetchMessages();
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "REAL_TIME_CRUD" },
      (payload) => {
        console.log("New message received:", payload.new);
        fetchMessages();
      }
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "REAL_TIME_CRUD" },
      (payload) => {
        console.log("New message received:", payload.new);
        fetchMessages();
      }
    )

    .subscribe();

  fetchMessages(); // ✅ Page load hone par data fetch karega
});

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // document
  //   .getElementById("imageInput")
  //   .addEventListener("change", function (event) {
  //     const file = event.target.files[0]; // Pehli file ko le raha hai
  //     if (file) {
  //       const reader = new FileReader(); // FileReader object create
  //       console.log(reader);

  //       reader.onload = function (e) {
  //         console.log(reader);
  //         const img = document.getElementById("preview");
  //         img.src = e.target.result; 
  //         console.log(e.target.result);
  //         // Image ka preview set kar raha hai
  //         img.style.display = "block"; // Image ko visible kar raha hai
  //       };
  //       reader.readAsDataURL(file); // File ko read kar raha hai
  //     }
  //   });
});
