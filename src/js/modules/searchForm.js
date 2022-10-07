const searchForm = document.querySelector('.search-header');
const searchButton = document.querySelector('.search-btn');

document.addEventListener('click', e => {
	let clickSearch = e.composedPath().includes(searchButton);
	let withinBoundaries = e.composedPath().includes(searchForm);

	if (clickSearch) {
		searchForm.classList.toggle('_active');
		searchButton.classList.toggle('_active');
	} else if (!withinBoundaries) {
		searchForm.classList.remove('_active');
		searchButton.classList.remove('_active');
	}
})

searchButton.addEventListener('click', e => {
	e.preventDefault();
})

