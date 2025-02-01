console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$("nav a");
// const currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );
// currentLink?.classList.add("current");

let pages = [
    { url: '', title: 'Home' },
    { url: 'CV/', title: 'CV' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/youngpark1516', title: 'GitHub' },
];
  
let nav = document.createElement('nav');
document.body.prepend(nav);
const ARE_WE_HOME = document.documentElement.classList.contains('home');
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
    );

    if (a.host !== location.host) {
        a.target = "_blank";
    }
    
    a.toggleAttribute('target', a.host !== location.host);
    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
);

const select = document.querySelector('.color-scheme select');

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    select.value = colorScheme;
}

const savedScheme = localStorage.colorScheme || 'light dark';
setColorScheme(savedScheme);

select.addEventListener('input', (event) => {
    const newScheme = event.target.value;
    setColorScheme(newScheme);
    localStorage.colorScheme = newScheme;
});

  
export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching JSON data:', error);
        return [];
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!containerElement) {
        console.error('Invalid container element.');
        return;
    }

    const titleElement = document.querySelector('.projects-title');
    if (titleElement) {
        titleElement.textContent = `Projects (${projects.length})`;
    }
    containerElement.innerHTML = ''; 

    projects.forEach(project => {
        const article = document.createElement('article');
        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <h4>${project.year}</h4>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
        `;
        containerElement.appendChild(article);
    });
}
export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}
