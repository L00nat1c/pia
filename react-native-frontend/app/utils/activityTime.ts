export function formatActivityTimeLabel(dateString?: string) {
  if (!dateString) {
    return "Recent activity";
  }

  const activityDate = new Date(dateString);
  if (Number.isNaN(activityDate.getTime())) {
    return "Recent activity";
  }

  const diffInDays = Math.max(
    0,
    Math.floor((Date.now() - activityDate.getTime()) / (1000 * 60 * 60 * 24)),
  );

  if (diffInDays === 0) {
    return "Today";
  }

  if (diffInDays === 1) {
    return "1 day ago";
  }

  return `${diffInDays} days ago`;
}