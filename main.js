function showFormData() {
  const email = document.querySelector("#emailInput").value;
  const name = document.querySelector("#nameInput").value;
  const password = document.querySelector("#passwordInput").value;
  const accountTypePersonal = document.querySelector("#radioOne").checked;
  const accountTypeCompany = document.querySelector("#radioTwo").checked;
  const genderMale = document.querySelector("#male").checked;
  const genderFemale = document.querySelector("#female").checked;

  // перевіряєм на пусті значення
  if (
    email === "" &&
    name === "" &&
    password === "" &&
    !accountTypePersonal &&
    !accountTypeCompany && // Чи не вибрані обидва варіанти для типу акаунта (тобто жоден варіант не вибраний)
    !genderMale && // так само як і тип аккаунта
    !genderFemale
  ) {
    return;
  }

  // створюєм сам елемент
  const notification = document.createElement("div");
  notification.textContent = "Ваше замовлення було відправлено";
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.left = "20px";
  notification.style.backgroundColor = "#CFD7D8";
  notification.style.color = "white";
  notification.style.padding = "10px";
  notification.style.borderRadius = "5px";
  notification.style.zIndex = "9999";

  // прокидаєм елемент в хтмл
  document.body.appendChild(notification);

  // таймер на зникнення
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// берем форму і вішаєм на неї прослуховувач подій
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Запобігає відправці форми за замовчуванням
  showFormData();
});

// запити

document.addEventListener("DOMContentLoaded", () => {
  fetchMemberships();

  const addMembershipForm = document.getElementById("add-membership-form");
  const addButton = document.getElementById("add-membership-button");
  addButton.addEventListener("click", (event) => {
    event.preventDefault();
    addMembership(addMembershipForm);
  });

  const updateMembershipForm = document.getElementById("edit-membership-form");
  const updateButton = document.getElementById("update-membership-button");
  updateButton.addEventListener("click", (event) => {
    event.preventDefault();
    updateMembership(updateMembershipForm);
  });

  const cancelButton = document.getElementById("cancel-update-button");
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    cancelUpdateMembership(updateMembershipForm);
  });
});

async function fetchMemberships() {
  try {
    const response = await fetch("http://localhost:3000/memberships");
    if (!response.ok) {
      throw new Error("Failed to fetch memberships");
    }
    const memberships = await response.json();
    displayMemberships(memberships);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayMemberships(memberships) {
  const membershipList = document.getElementById("membership-list");
  membershipList.innerHTML = "";
  memberships.forEach((membership) => {
    const listItem = document.createElement("li");
    listItem.classList.add("membership-item");

    const membershipInfo = document.createElement("div");
    membershipInfo.classList.add("membership-info");

    // Create text content for membership
    const membershipText = document.createElement("span");
    membershipText.classList.add("membership-text");
    membershipText.textContent = `${membership.name} - ${membership.price}`;

    // Append text content to membershipInfo div
    membershipInfo.appendChild(membershipText);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("membership-buttons");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("membership-button", "membership-button-edit");
    editButton.addEventListener("click", () =>
      showEditMembershipForm(membership)
    );

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("membership-button", "membership-button-delete");
    deleteButton.addEventListener("click", () =>
      deleteMembership(membership._id)
    );

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    listItem.appendChild(membershipInfo);
    listItem.appendChild(buttonsContainer);

    membershipList.appendChild(listItem);
  });
}

async function addMembership(form) {
  const name = form.querySelector("#membershipName").value;
  const price = form.querySelector("#membershipPrice").value;

  try {
    const response = await fetch("http://localhost:3000/memberships", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price }),
    });

    if (!response.ok) {
      throw new Error("Failed to add membership");
    }

    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}

function showEditMembershipForm(membership) {
  const form = document.getElementById("edit-membership-form");
  form.style.display = "block";
  form.querySelector("#edit-membership-id").value = membership._id;
  form.querySelector("#editMembershipName").value = membership.name;
  form.querySelector("#editMembershipPrice").value = membership.price;
}

async function updateMembership(form) {
  const membershipId = form.querySelector("#edit-membership-id").value;
  const name = form.querySelector("#editMembershipName").value;
  const price = form.querySelector("#editMembershipPrice").value;

  try {
    const response = await fetch(
      `http://localhost:3000/memberships/${membershipId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update membership");
    }

    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}

function cancelUpdateMembership(form) {
  form.style.display = "none";
}

async function deleteMembership(membershipId) {
  try {
    const response = await fetch(
      `http://localhost:3000/memberships/${membershipId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete membership");
    }

    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}
