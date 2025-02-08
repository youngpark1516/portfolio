import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

if (projects.length > 0) {
    renderProjects(projects, projectsContainer, 'h2');
} else {
    projectsContainer.innerHTML = '<p>No projects available.</p>';
}


let selectedIndex = -1;
let query = '';
let filteredProjects = [...projects];

function updateFilteredProjects() {
    filteredProjects = projects.filter(p => {
        let matchesYear = (selectedIndex === -1) || (p.year === projects[selectedIndex].year);
        let matchesSearch = query === '' || Object.values(p).join('\n').toLowerCase().includes(query.toLowerCase());
        return matchesYear && matchesSearch;
    });
    renderProjects(filteredProjects, projectsContainer, 'h2');
}

function renderPieChart(projectsGiven) {
    // re-calculate rolled data
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year,
    );
    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
      return { value: count, label: year }; // TODO
    });
    // re-calculate slice generator, arc data, arc, etc.
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // TODO: clear up paths and legends
    let newSVG = d3.select("#projects-pie-plot");
    newSVG.selectAll("path").remove();
    d3.select(".legend").selectAll("*").remove();
    
    // update paths and legends, refer to steps 1.4 and 2.2
    newArcData.forEach((d, i) => {
        newSVG
            .append("path")
            .attr("d", arcGenerator(d))
            .attr("fill", colors(i))
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;

                newSVG.selectAll("path")
                .attr("class", (_, idx) => (
                    selectedIndex === idx ? "selected" : ""
                ));
                // let filteredProjects = selectedIndex === -1
                // ? projects
                // : projects.filter(p => p.year === d.data.label);

                // renderProjects(filteredProjects, projectsContainer, 'h2');

                legend
                .selectAll('li')
                .attr('class', (_, idx) => (
                    selectedIndex === idx ? "selected" : ""
        
                ));

                updateFilteredProjects(); 
            });
    }); 

    let legend = d3.select(".legend");
    newData.forEach((d, idx) => {
        legend.append("li")
            .attr("style", `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });



}

renderPieChart(projects);
renderProjects(projects, projectsContainer, 'h2');

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    query = event.target.value;
//   let filteredProjects = projects.filter((project) => {
//     let values = Object.values(project).join('\n').toLowerCase();
//     return values.includes(query.toLowerCase());
//   });
//   renderProjects(filteredProjects, projectsContainer, 'h2');
//   renderPieChart(filteredProjects);
    updateFilteredProjects(); 
});



