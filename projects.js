const projects = [
  {area: 'Neural interface research', name: 'Project Flamescion', text: 'P300 and EEG project source with transformer-related experimentation and object-selection work.', repo: 'flamescion-p300'},
  {area: 'Neural interface research', name: 'P300 Collection', text: 'EEG stimulus, collection and processing tooling for the P300 workflow.', repo: 'p300-collection'},
  {area: 'Neural interface research', name: 'Skemma Series and Synnefo Cloud Computer', text: 'Experiment orchestration, training campaigns and cloud coordination utilities.', repo: 'skemma-experiments'},
  {area: 'Robotics', name: 'R-Arm systems', text: 'ESP32 firmware, local Flask control interfaces, joystick control, visual picking and motion-only variants.', repo: 'r-arm-systems'},
  {area: 'Robotics', name: 'DOFBOT Flamescion', text: 'Laptop and VM components for a separate robot-control workflow.', repo: 'dofbot-flamescion'},
  {area: 'Embedded systems', name: 'Geofence Beacon', text: 'Capstone code with firmware for a geofence beacon implementation.', repo: 'geofence-beacon'},
  {area: 'Embedded systems', name: 'Smart Bin and KitaHack work', text: 'Embedded-system project folders, including the Smart Bin repository and KitaHack variants.', repo: 'embedded-projects'},
  {area: 'AI applications', name: 'Personalized AI and IrisVL', text: 'Personal AI and visual-language-model experiments maintained as separate source folders.', repo: 'ai-applications'},
  {area: 'AI applications', name: 'Huey Yun Optimizer', text: 'Optimizer and stress-analyser source folders from the 2026 invention work.', repo: 'huey-yun-optimizer'},
  {area: 'Tools and coursework', name: 'Prompt Optimizer', text: 'A project workspace containing desktop, extension, web and MCP-server packages.', repo: 'prompt-optimizer'},
  {area: 'Tools and coursework', name: 'Arduino and programming collections', text: 'Workshop sketches, Arduino prototypes and early programming assignments preserved as grouped learning repositories.', repo: 'learning-projects'}
];

document.querySelector('#project-grid').innerHTML = projects.map(project => `
  <article class="project">
    <p class="area">${project.area}</p>
    <h3>${project.name}</h3>
    <p>${project.text}</p>
    <span class="repo">github.com/Joshua3178/${project.repo}</span>
  </article>
`).join('');
