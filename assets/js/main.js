// navbar menu toggler
const menuToggler = document.querySelector(".menu-toggler");

menuToggler.addEventListener("click", () => {
	const navItems = document.querySelector(".navbar-items");
	navItems.classList.toggle("show")
})

// popup toggler
const popupTrigger = document.querySelector("[data-trigger-popup]")
const closePopupBtn = document.querySelector("#close-popup")
const popup = document.querySelector(".bg-popup")

popupTrigger.addEventListener("click", () => {
	popup.classList.toggle("show")
})

closePopupBtn.addEventListener("click", () => {
	popup.classList.remove("show")
})