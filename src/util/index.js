export function openWindowWithWorkaroundForChromeClosingBug(
  location, name = '_blank',
) {
  const newWindow = open('about:blank', name);
  newWindow.location.href = location;
  return newWindow;
}
