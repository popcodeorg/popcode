const PROJECT_STORAGE_KEY = 'last-closed-session-project-state';

export function dehydrateProject(project) {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
    dehydratedAt: Date.now(),
    project,
  }));
}

export function rehydrateProject() {
  const dehydrated = localStorage.getItem(PROJECT_STORAGE_KEY);
  localStorage.removeItem(PROJECT_STORAGE_KEY);
  if (dehydrated) {
    const rehydrated = JSON.parse(dehydrated);
    if (Date.now() - rehydrated.dehydratedAt <= 5 * 60 * 1000) {
      return rehydrated.project;
    }
  }
  return null;
}
