const menuToggler = document.querySelector(".menu-toggler");

menuToggler.addEventListener("click", () => {
	const navItems = document.querySelector(".navbar-items");
	navItems.classList.toggle("show")
})