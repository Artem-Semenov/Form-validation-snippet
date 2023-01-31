"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form.addEventListener("submit", formSend);

  async function formSend(e) {
    e.preventDefault();

    let errors = formValidate(form);

    let formData = new FormData(form);
    formData.append("image", formImage.files[0]);

    if (errors === 0) {
      form.classList.add("_sending");

      let response = await fetch("mail.php", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        let result = await response.json();
        alert(result.message);
        previewWrapper.innerHTML = "";
        form.reset();
        form.classList.remove("_sending");
      } else {
        alert("Error with form sending!");
        form.classList.remove("_sending");
      }
    } else {
      alert("fill all the fields correctly");
    }
  }

  function formValidate(form) {
    let errors = 0;
    let formReq = form.querySelectorAll("._req");

    formReq.forEach((el) => {
      formRemoveError(el);

      if (el.classList.contains("_email")) {
        if (emailTest(el)) {
          formAddError(el);
          errors++;
        }
      } else if (
        el.getAttribute("type") === "checkbox" &&
        el.checked === false
      ) {
        formAddError(el);
        errors++;
      } else {
        if (!el.value) {
          formAddError(el);
        }
      }
    });
    return errors;
  }

  function formAddError(input) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
  }
  function formRemoveError(input) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
  }

  function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }
  //photo preview
  const formImage = document.getElementById("formImage");
  const previewWrapper = document.getElementById("file-preview");

  formImage.addEventListener("change", () => {
    uploadFile(formImage.files[0]);
  });

  function uploadFile(file) {
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      alert("Only images allowed");
      formImage.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Only files less than 2Mb allowed");
      return;
    }

    let reader = new FileReader();
    reader.onload = (e) => {
      console.log("111");
      previewWrapper.innerHTML = `<img src ="${e.target.result}">`;
    };
    reader.onerror = () => {
      alert("error!");
    };
    reader.readAsDataURL(file);
  }
});
